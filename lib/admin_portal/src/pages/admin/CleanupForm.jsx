// src/pages/cleanups/CleanupForm.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';

import ImagePickerGrid    from '../../components/ImagePickerGrid';
import LocationPicker     from '../../components/LocationPicker';
import SeveritySelector   from '../../components/SeveritySelector';
import WasteTypeSelector  from '../../components/WasteTypeSelector';
import StatusSelector     from '../../components/StatusSelector';
import VolunteersSelector from '../../components/VolunteersSelector';
import RewardsDisplay     from '../../components/RewardsDisplay';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const kGreen  = '#3CAC44';

/* ───────────────── helpers ───────────────── */
const host = API_URL.replace(/\/api$/, '');
const abs  = (p = '') =>
  /^https?:\/\//i.test(p) ? p : `${host}/${p.replace(/^\/+/, '')}`;

/* ───────────────── component ───────────────── */
export default function CleanupForm() {
  const { token } = useAuth();
  const { id }    = useParams();
  const navigate  = useNavigate();

  /* form fields */
  const [title, setTitle]               = useState('');
  const [description, setDescription]   = useState('');
  const [locationText, setLocationText] = useState('');
  const [wasteType, setWasteType]       = useState('plastic');
  const [severity, setSeverity]         = useState('moderate');
  const [scheduledAt, setScheduledAt]   = useState('');
  const [pickedLoc, setPickedLoc]       = useState(null);
  const [images, setImages]             = useState([]);

  /* admin-only */
  const [status, setStatus]             = useState('pending');
  const [volunteers, setVolunteers]     = useState([]);
  const [creatorId, setCreatorId]       = useState(null);

  /* before / after preview & upload */
  const [beforeImages, setBefore]       = useState([]);
  const [afterImages,  setAfter]        = useState([]);

  const [loading, setLoading]           = useState(true);
  const [submitting, setSubmitting]     = useState(false);

  /* ─── load existing cleanup (edit mode) ─── */
  useEffect(() => {
    if (!token) return;
    if (!id) { setLoading(false); return; }

    fetch(`${API_URL}/admin/cleanups/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(c => {
        setTitle       (c.title        ?? '');
        setDescription (c.description  ?? '');
        setLocationText(c.location     ?? '');
        setWasteType   (c.wasteType    ?? 'plastic');
        setSeverity    (c.severity     ?? 'moderate');

        if (c.scheduledDate) {
          const dt  = new Date(c.scheduledDate);
          const pad = n => n.toString().padStart(2,'0');
          setScheduledAt(
            `${dt.getFullYear()}-${pad(dt.getMonth()+1)}-${pad(dt.getDate())}` +
            `T${pad(dt.getHours())}:${pad(dt.getMinutes())}`
          );
        }

        if (c.latitude!=null && c.longitude!=null) {
          setPickedLoc({ lat:c.latitude, lng:c.longitude });
        }

        if (Array.isArray(c.photos)) {
          setImages(c.photos.map(abs));
        }

        setStatus     (c.status     ?? 'pending');
        setVolunteers (
          Array.isArray(c.volunteers)
            ? c.volunteers.map(v => typeof v==='string'? v : v._id)
            : []
        );
        setCreatorId(c.createdBy?._id ?? null);

        // preview arrays:
        setBefore((c.beforeImages  || []).map(abs));
        setAfter ((c.afterImages   || []).map(abs));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, token]);

  /* ─── location pick handler ─── */
  const handleLocationPick = ({lat,lng,address}) => {
    setPickedLoc({lat,lng});
    if(address) setLocationText(address);
  };

  /* ─── submit ─── */
  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim())          return alert('Title is required');
    if (!pickedLoc)             return alert('Select a location');
    if (!images.length && !id)  return alert('Add at least one photo');

    setSubmitting(true);
    try {
      // 1️⃣ Update core fields + photos
      const fd = new FormData();
      fd.append('title',       title);
      fd.append('description', description);
      fd.append('location',    locationText);
      fd.append('wasteType',   wasteType);
      fd.append('severity',    severity);
      if(scheduledAt) fd.append('scheduledDate', new Date(scheduledAt).toISOString());
      fd.append('latitude',  pickedLoc.lat);
      fd.append('longitude', pickedLoc.lng);
      fd.append('status',    status);
      fd.append('volunteers', JSON.stringify(volunteers));
      images.forEach(i => i instanceof File && fd.append('photos', i));

      const method = id ? 'PUT' : 'POST';
      const url    = id
        ? `${API_URL}/admin/cleanups/${id}`
        : `${API_URL}/cleanup`;
      let res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      });
      if (!res.ok) throw new Error(await res.text());

      // 2️⃣ If admin has replaced before/after images, send them
      if (id && (beforeImages.some(f => f instanceof File) ||
                 afterImages.some(f => f instanceof File))) {
        const fd2 = new FormData();
        beforeImages.forEach(f => f instanceof File && fd2.append('beforeImages', f));
        afterImages.forEach( f => f instanceof File && fd2.append('afterImages',  f));
        res = await fetch(`${API_URL}/admin/cleanups/${id}/before-after-images`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
          body: fd2
        });
        if (!res.ok) throw new Error('Before/after upload failed: ' + await res.text());
      }

      alert(id ? 'Updated!' : 'Submitted!');
      navigate(-1);

    } catch (err) {
      console.error(err);
      alert('Failed: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  }

  /* ─── loader ─── */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <svg className="animate-spin h-8 w-8" style={{color:kGreen}} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor"
                  strokeWidth="4" className="opacity-25" fill="none"/>
          <path fill="currentColor" className="opacity-75"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
        </svg>
      </div>
    );
  }

  /* ─── form ─── */
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button onClick={()=>navigate(-1)}
              className="inline-flex items-center text-sm font-medium mb-4"
              style={{color:kGreen}}>
        &larr; Back
      </button>

      <div className="bg-white border border-green-200 rounded-lg shadow-lg p-8 space-y-8">
        <h2 className="text-2xl font-semibold" style={{color:kGreen}}>
          {id ? 'Edit Cleanup Request' : 'New Cleanup Request'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Title</label>
            <input value={title} onChange={e=>setTitle(e.target.value)}
                   placeholder="Enter title..." required
                   className="w-full border-gray-300 rounded-lg px-3 py-2
                              focus:border-green-500 focus:ring-green-500"/>
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
            <textarea value={description} onChange={e=>setDescription(e.target.value)}
                      placeholder="Describe the waste..." rows={4}
                      className="w-full border-gray-300 rounded-lg px-3 py-2 resize-none
                                 focus:border-green-500 focus:ring-green-500"/>
          </div>

          {/* Location */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Select Location</label>
            <div className="border-gray-200 rounded-lg overflow-hidden">
              <LocationPicker initial={pickedLoc} onPicked={handleLocationPick}/>
            </div>
            {pickedLoc && (
              <p className="mt-2 text-xs text-gray-600">
                Lat: {pickedLoc.lat.toFixed(5)}, Lng: {pickedLoc.lng.toFixed(5)}
              </p>
            )}
            <input value={locationText} onChange={e=>setLocationText(e.target.value)}
                   placeholder="Address details…" 
                   className="mt-3 w-full border-gray-300 rounded-lg px-3 py-2
                              focus:border-green-500 focus:ring-green-500"/>
          </div>

          {/* Waste & Severity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Waste Type</label>
              <WasteTypeSelector current={wasteType} onChange={setWasteType}/>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Severity Level</label>
              <SeveritySelector current={severity} onChange={setSeverity}/>
            </div>
          </div>

          {/* Schedule */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Schedule Cleanup (optional)
            </label>
            <div className="relative">
              <input type="datetime-local" value={scheduledAt}
                     onChange={e=>setScheduledAt(e.target.value)}
                     className="w-full border-gray-300 rounded-lg px-3 py-2 pr-10
                                focus:border-green-500 focus:ring-green-500"/>
              <CalendarDaysIcon className="h-5 w-5 absolute right-3 top-1/2 -translate-y-1/2 text-green-500"/>
            </div>
          </div>

          {/* Admin-only */}
          {id && (
            <>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Status</label>
                <StatusSelector current={status} onChange={setStatus}/>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Volunteers</label>
                <VolunteersSelector selected={volunteers} onChange={setVolunteers}/>
              </div>
              {creatorId && (
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Creator’s Badges
                  </label>
                  <RewardsDisplay userId={creatorId}/>
                </div>
              )}
            </>
          )}

          {/* General Photos */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Upload Photos</label>
            <ImagePickerGrid initial={images} onChanged={setImages}/>
          </div>

          {/* Before / After Upload & Preview */}
          {id && (
            <>
              <fieldset className="mt-6">
                <legend className="block mb-1 text-sm font-medium text-gray-700">
                  Replace Before Photos
                </legend>
                <ImagePickerGrid initial={beforeImages} onChanged={setBefore}/>
              </fieldset>

              <fieldset className="mt-6">
                <legend className="block mb-1 text-sm font-medium text-gray-700">
                  Upload After Photos
                </legend>
                <ImagePickerGrid initial={afterImages} onChanged={setAfter}/>
              </fieldset>

              {/* <div className="mt-8">
                {beforeImages.length>0 && (
                  <div>
                    <h3 className="font-semibold text-orange-600 mb-2">🟠 Before cleanup</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {beforeImages.map((img,i)=>(
                        <img key={i} src={typeof img==='string'?img:URL.createObjectURL(img)}
                             alt={`before-${i}`} className="h-24 object-cover rounded shadow border"/>
                      ))}
                    </div>
                  </div>
                )}
                {afterImages.length>0 && (
                  <div className="mt-4">
                    <h3 className="font-semibold text-green-600 mb-2">🟢 After cleanup</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {afterImages.map((img,i)=>(
                        <img key={i} src={typeof img==='string'?img:URL.createObjectURL(img)}
                             alt={`after-${i}`} className="h-24 object-cover rounded shadow border"/>
                      ))}
                    </div>
                  </div>
                )}
              </div> */}
            </>
          )}

          {/* Submit */}
          <button type="submit" disabled={submitting}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg
                             text-lg font-medium disabled:opacity-60">
            {submitting ? '…Submitting' : (id ? 'UPDATE REQUEST' : 'SUBMIT REQUEST')}
          </button>
        </form>
      </div>
    </div>
  );
}
