// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext';
// import { CalendarDaysIcon } from '@heroicons/react/24/outline';

// import ImagePickerGrid    from '../../components/ImagePickerGrid';
// import LocationPicker     from '../../components/LocationPicker';
// import SeveritySelector   from '../../components/SeveritySelector';
// import WasteTypeSelector  from '../../components/WasteTypeSelector';
// import StatusSelector     from '../../components/StatusSelector';
// import VolunteersSelector from '../../components/VolunteersSelector';
// import RewardsDisplay     from '../../components/RewardsDisplay';

// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
// const kGreen  = '#3CAC44';

// export default function CleanupForm() {
//   const { token }    = useAuth();
//   const { id }       = useParams();
//   const navigate     = useNavigate();

//   // form state
//   const [title, setTitle]             = useState('');
//   const [description, setDescription] = useState('');
//   const [locationText, setLocationText] = useState('');
//   const [wasteType, setWasteType]     = useState('plastic');
//   const [severity, setSeverity]       = useState('moderate');
//   const [scheduledAt, setScheduledAt] = useState(''); // yyyy-MM-ddTHH:mm
//   const [pickedLoc, setPickedLoc]     = useState(null);
//   const [images, setImages]           = useState([]); // URLs or File objects

//   // admin-only fields
//   const [status, setStatus]           = useState('pending');
//   const [volunteers, setVolunteers]   = useState([]); // array of user IDs
//   const [creatorId, setCreatorId]     = useState(null);

//   const [loading, setLoading]         = useState(true);
//   const [submitting, setSubmitting]   = useState(false);

//   // load existing cleanup on mount (if editing)
//   useEffect(() => {
//     if (!token) return;
//     if (!id) {
//       setLoading(false);
//       return;
//     }

//     fetch(`${API_URL}/admin/cleanups/${id}`, {
//       headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
//     })
//       .then(r => r.json())
//       .then(c => {
//         // core fields
//         setTitle(c.title || '');
//         setDescription(c.description || '');
//         setLocationText(c.location || '');
//         setWasteType(c.wasteType || 'plastic');
//         setSeverity(c.severity || 'moderate');

//         // schedule
//         if (c.scheduledDate) {
//           const dt = new Date(c.scheduledDate);
//           const pad = n => n.toString().padStart(2, '0');
//           setScheduledAt(
//             `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}` +
//             `T${pad(dt.getHours())}:${pad(dt.getMinutes())}`
//           );
//         }

//         // location
//         if (c.latitude != null && c.longitude != null) {
//           setPickedLoc({ lat: c.latitude, lng: c.longitude });
//         }

//         // photos
//         if (Array.isArray(c.photos) && c.photos.length) {
//           const host = API_URL.replace(/\/api$/, '');
//           setImages(
//             c.photos.map(p =>
//               p.startsWith('http')
//                 ? p
//                 : `${host}/${p.replace(/^\/?/, '')}`
//             )
//           );
//         }

//         // **admin fields**
//         setStatus(c.status || 'pending');
//       setVolunteers(
//   Array.isArray(c.volunteers)
//     ? c.volunteers.map(v => typeof v === 'string' ? v : v._id)
//     : []
// );

//         setCreatorId(c.createdBy?._id || null);
//       })
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, [id, token]);

//   function handleLocationPick({ lat, lng, address }) {
//     setPickedLoc({ lat, lng });
//     if (address) setLocationText(address);
//   }

//   async function handleSubmit(e) {
//     e.preventDefault();
//     if (!title.trim())     return alert('Title is required');
//     if (!pickedLoc)        return alert('Please select a location');
//     if (!images.length && !id) return alert('Please add at least one photo');

//     setSubmitting(true);
//     const fd = new FormData();
//     fd.append('title', title);
//     fd.append('description', description);
//     fd.append('location', locationText);
//     fd.append('wasteType', wasteType);
//     fd.append('severity', severity);
//     if (scheduledAt) {
//       fd.append('scheduledDate', new Date(scheduledAt).toISOString());
//     }
//     fd.append('latitude', pickedLoc.lat);
//     fd.append('longitude', pickedLoc.lng);

//     // admin extras
//     fd.append('status', status);
//     fd.append('volunteers', JSON.stringify(volunteers));

//     // photos
//     images.forEach(item => {
//       if (item instanceof File) {
//         fd.append('photos', item);
//       }
//     });

//     try {
//       const url    = id
//         ? `${API_URL}/admin/cleanups/${id}`
//         : `${API_URL}/cleanup`;
//       const method = id ? 'PUT' : 'POST';
//       const res    = await fetch(url, {
//         method,
//         headers: { Authorization: `Bearer ${token}` },
//         body: fd,
//       });
//       if (!res.ok) throw new Error(await res.text());
//       alert(id ? 'Updated!' : 'Submitted!');
//       navigate(-1);
//     } catch (err) {
//       console.error(err);
//       alert('Failed: ' + err.message);
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-full">
//         <svg className="animate-spin h-8 w-8" style={{ color: kGreen }} viewBox="0 0 24 24">
//           <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" fill="none"/>
//           <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
//         </svg>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 max-w-3xl mx-auto">
//       <button
//         onClick={() => navigate(-1)}
//         className="inline-flex items-center text-sm font-medium mb-4"
//         style={{ color: kGreen }}
//       >
//         &larr; Back
//       </button>

//       <div className="bg-white border border-green-200 rounded-lg shadow-lg p-8 space-y-8">
//         <h2 className="text-2xl font-semibold" style={{ color: kGreen }}>
//           {id ? 'Edit Cleanup Request' : 'New Cleanup Request'}
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Title */}
//           <div>
//             <label className="block mb-1 text-sm font-medium text-gray-700">Title</label>
//             <input
//               type="text" value={title}
//               onChange={e => setTitle(e.target.value)}
//               placeholder="Enter title..." required
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
//             />
//           </div>

//           {/* Description */}
//           <div>
//             <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
//             <textarea
//               value={description}
//               onChange={e => setDescription(e.target.value)}
//               placeholder="Describe the waste..."
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 h-32 resize-none focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
//             />
//           </div>

//           {/* Location Picker */}
//           <div>
//             <label className="block mb-1 text-sm font-medium text-gray-700">Select Location</label>
//             <div className="rounded-lg overflow-hidden border border-gray-200">
//               <LocationPicker initial={pickedLoc} onPicked={handleLocationPick}/>
//             </div>
//             {pickedLoc && (
//               <p className="mt-2 text-xs text-gray-600">
//                 Lat: {pickedLoc.lat.toFixed(5)}, Lng: {pickedLoc.lng.toFixed(5)}
//               </p>
//             )}
//             <input
//               type="text" value={locationText}
//               onChange={e => setLocationText(e.target.value)}
//               placeholder="Address details…"
//               className="mt-3 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
//             />
//           </div>

//           {/* Waste & Severity */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block mb-1 text-sm font-medium text-gray-700">Waste Type</label>
//               <WasteTypeSelector current={wasteType} onChange={setWasteType}/>
//             </div>
//             <div>
//               <label className="block mb-1 text-sm font-medium text-gray-700">Severity Level</label>
//               <SeveritySelector current={severity} onChange={setSeverity}/>
//             </div>
//           </div>

//           {/* Schedule */}
//           <div>
//             <label className="block mb-1 text-sm font-medium text-gray-700">Schedule Cleanup (optional)</label>
//             <div className="relative">
//               <input
//                 type="datetime-local" value={scheduledAt}
//                 onChange={e => setScheduledAt(e.target.value)}
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
//               />
//               <CalendarDaysIcon className="h-5 w-5 absolute right-3 top-1/2 -translate-y-1/2 text-green-500"/>
//             </div>
//           </div>

//           {/* Admin-only: Status */}
//           {id && (
//             <div>
//               <label className="block mb-1 text-sm font-medium text-gray-700">Status</label>
//               <StatusSelector current={status} onChange={setStatus}/>
//             </div>
//           )}

//           {/* Admin-only: Volunteers */}
//           {id && (
//             <div>
//               <label className="block mb-1 text-sm font-medium text-gray-700">Volunteers</label>
//               <VolunteersSelector selected={volunteers} onChange={setVolunteers}/>
//             </div>
//           )}

//           {/* Read-only: Creator’s Badges */}
//           {id && creatorId && (
//             <div>
//               <label className="block mb-1 text-sm font-medium text-gray-700">Creator’s Badges</label>
//               <RewardsDisplay userId={creatorId}/>
//             </div>
//           )}

//           {/* Images */}
//           <div>
//             <label className="block mb-1 text-sm font-medium text-gray-700">Upload Photos</label>
//             <ImagePickerGrid initial={images} onChanged={setImages}/>
//           </div>

//           {/* Submit */}
//           <div>
//             <button
//               type="submit" disabled={submitting}
//               className="w-full bg-green-500 text-white py-3 rounded-lg text-lg font-medium hover:bg-green-600 disabled:opacity-60 transition"
//             >
//               {submitting ? '…Submitting' : id ? 'UPDATE REQUEST' : 'SUBMIT REQUEST'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }










import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';

import ImagePickerGrid from '../../components/ImagePickerGrid';
import LocationPicker from '../../components/LocationPicker';
import SeveritySelector from '../../components/SeveritySelector';
import WasteTypeSelector from '../../components/WasteTypeSelector';
import StatusSelector from '../../components/StatusSelector';
import VolunteersSelector from '../../components/VolunteersSelector';
import RewardsDisplay from '../../components/RewardsDisplay';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const kGreen = '#3CAC44';

export default function CleanupForm() {
  const { token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [locationText, setLocationText] = useState('');
  const [wasteType, setWasteType] = useState('plastic');
  const [severity, setSeverity] = useState('moderate');
  const [scheduledAt, setScheduledAt] = useState('');
  const [pickedLoc, setPickedLoc] = useState(null);
  const [images, setImages] = useState([]);

  const [status, setStatus] = useState('pending');
  const [volunteers, setVolunteers] = useState([]);
  const [creatorId, setCreatorId] = useState(null);

  const [beforeImages, setBeforeImages] = useState([]);
  const [afterImages, setAfterImages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const getImageUrl = (img) =>
    img.startsWith('http') ? img : `${API_URL.replace('/api', '')}/${img.replace(/^\/+/, '')}`;

  useEffect(() => {
    if (!token) return;
    if (!id) {
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/admin/cleanups/${id}`, {
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(c => {
        setTitle(c.title || '');
        setDescription(c.description || '');
        setLocationText(c.location || '');
        setWasteType(c.wasteType || 'plastic');
        setSeverity(c.severity || 'moderate');

        if (c.scheduledDate) {
          const dt = new Date(c.scheduledDate);
          const pad = n => n.toString().padStart(2, '0');
          setScheduledAt(`${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`);
        }

        if (c.latitude != null && c.longitude != null) {
          setPickedLoc({ lat: c.latitude, lng: c.longitude });
        }

        if (Array.isArray(c.photos) && c.photos.length) {
          const host = API_URL.replace(/\/api$/, '');
          setImages(
            c.photos.map(p =>
              p.startsWith('http') ? p : `${host}/${p.replace(/^\/?/, '')}`
            )
          );
        }

        setStatus(c.status || 'pending');
        setVolunteers(Array.isArray(c.volunteers)
          ? c.volunteers.map(v => typeof v === 'string' ? v : v._id)
          : []);
        setCreatorId(c.createdBy?._id || null);

        // Load before & after (admin view only)
        setBeforeImages(c.beforeImages || []);
        setAfterImages(c.afterImages || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, token]);

  function handleLocationPick({ lat, lng, address }) {
    setPickedLoc({ lat, lng });
    if (address) setLocationText(address);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return alert('Title is required');
    if (!pickedLoc) return alert('Please select a location');
    if (!images.length && !id) return alert('Please add at least one photo');

    setSubmitting(true);
    const fd = new FormData();
    fd.append('title', title);
    fd.append('description', description);
    fd.append('location', locationText);
    fd.append('wasteType', wasteType);
    fd.append('severity', severity);
    if (scheduledAt) {
      fd.append('scheduledDate', new Date(scheduledAt).toISOString());
    }
    fd.append('latitude', pickedLoc.lat);
    fd.append('longitude', pickedLoc.lng);
    fd.append('status', status);
    fd.append('volunteers', JSON.stringify(volunteers));

    images.forEach(item => {
      if (item instanceof File) {
        fd.append('photos', item);
      }
    });

    try {
      const url = id ? `${API_URL}/admin/cleanups/${id}` : `${API_URL}/cleanup`;
      const method = id ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      });
      if (!res.ok) throw new Error(await res.text());
      alert(id ? 'Updated!' : 'Submitted!');
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert('Failed: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <svg className="animate-spin h-8 w-8" style={{ color: kGreen }} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" fill="none" />
          <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center text-sm font-medium mb-4"
        style={{ color: kGreen }}
      >
        &larr; Back
      </button>

      <div className="bg-white border border-green-200 rounded-lg shadow-lg p-8 space-y-8">
        <h2 className="text-2xl font-semibold" style={{ color: kGreen }}>
          {id ? 'Edit Cleanup Request' : 'New Cleanup Request'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Title</label>
            <input
              type="text" value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter title..." required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe the waste..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 h-32 resize-none focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Select Location</label>
            <div className="rounded-lg overflow-hidden border border-gray-200">
              <LocationPicker initial={pickedLoc} onPicked={handleLocationPick} />
            </div>
            {pickedLoc && (
              <p className="mt-2 text-xs text-gray-600">
                Lat: {pickedLoc.lat.toFixed(5)}, Lng: {pickedLoc.lng.toFixed(5)}
              </p>
            )}
            <input
              type="text" value={locationText}
              onChange={e => setLocationText(e.target.value)}
              placeholder="Address details…"
              className="mt-3 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
          </div>

          {/* Waste & Severity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Waste Type</label>
              <WasteTypeSelector current={wasteType} onChange={setWasteType} />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Severity Level</label>
              <SeveritySelector current={severity} onChange={setSeverity} />
            </div>
          </div>

          {/* Schedule */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Schedule Cleanup (optional)</label>
            <div className="relative">
              <input
                type="datetime-local" value={scheduledAt}
                onChange={e => setScheduledAt(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
              <CalendarDaysIcon className="h-5 w-5 absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
            </div>
          </div>

          {id && (
            <>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Status</label>
                <StatusSelector current={status} onChange={setStatus} />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Volunteers</label>
                <VolunteersSelector selected={volunteers} onChange={setVolunteers} />
              </div>
              {creatorId && (
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Creator’s Badges</label>
                  <RewardsDisplay userId={creatorId} />
                </div>
              )}
            </>
          )}

          {/* General Photos */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Upload Photos</label>
            <ImagePickerGrid initial={images} onChanged={setImages} />
          </div>

          {/* Before/After Preview (Admin View Only) */}
          {id && (
            <>
              {beforeImages.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-orange-600 mt-8 mb-2">🟠 This is BEFORE cleanup</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {beforeImages.map((img, i) => (
                      <img key={i} src={getImageUrl(img)} alt={`Before ${i}`} className="rounded h-24 object-cover shadow border" />
                    ))}
                  </div>
                </div>
              )}

              {afterImages.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-green-600 mt-8 mb-2">🟢 This is AFTER cleanup</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {afterImages.map((img, i) => (
                      <img key={i} src={getImageUrl(img)} alt={`After ${i}`} className="rounded h-24 object-cover shadow border" />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Submit */}
          <div>
            <button
              type="submit" disabled={submitting}
              className="w-full bg-green-500 text-white py-3 rounded-lg text-lg font-medium hover:bg-green-600 disabled:opacity-60 transition"
            >
              {submitting ? '…Submitting' : id ? 'UPDATE REQUEST' : 'SUBMIT REQUEST'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

