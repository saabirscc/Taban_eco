// // src/pages/admin/CleanupDetail.jsx
// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate }     from 'react-router-dom';
// import { useAuth }                     from '../../contexts/AuthContext';
// import { CalendarDaysIcon }            from '@heroicons/react/24/outline';

// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
// const kGreen  = '#3CAC44';

// export default function CleanupDetail() {
//   const { id }       = useParams();
//   const { token }    = useAuth();
//   const navigate     = useNavigate();
//   const [cleanup, setCleanup]     = useState(null);
//   const [date, setDate]           = useState('');
//   const [loading, setLoading]     = useState(true);
//   const [scheduling, setScheduling] = useState(false);

//   // 1) load the cleanup
//   useEffect(() => {
//     if (!token) return;
//     fetch(`${API_URL}/admin/cleanups/${id}`, {
//       headers: { Authorization: `Bearer ${token}` }
//     })
//       .then(r => {
//         if (!r.ok) throw new Error('Failed to load');
//         return r.json();
//       })
//       .then(c => {
//         setCleanup(c);
//         // convert ISO → yyyy-MM-ddTHH:mm
//         if (c.scheduledDate) {
//           const dt = new Date(c.scheduledDate);
//           const pad = n => n.toString().padStart(2, '0');
//           setDate(`${dt.getFullYear()}-${pad(dt.getMonth()+1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`);
//         }
//       })
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, [id, token]);

//   // 2) schedule handler
//   async function handleSchedule() {
//     if (!date) return alert('Pick a date/time');
//     setScheduling(true);
//     try {
//       const res = await fetch(`${API_URL}/admin/cleanups/${id}/schedule`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify({ scheduledDate: new Date(date).toISOString() })
//       });
//       if (!res.ok) throw new Error(await res.text());
//       const updated = await res.json();
//       setCleanup(updated);
//       alert('Scheduled!');
//     } catch (err) {
//       console.error(err);
//       alert('Failed: ' + err.message);
//     } finally {
//       setScheduling(false);
//     }
//   }

//   if (loading) return <div className="p-6">Loading…</div>;
//   if (!cleanup) return <div className="p-6 text-red-600">Not found</div>;

//   return (
//     <div className="p-6 space-y-6 max-w-3xl mx-auto">
//       <button
//         onClick={() => navigate(-1)}
//         className="text-sm font-medium"
//         style={{ color: kGreen }}
//       >&larr; Back</button>

//       <h1 className="text-2xl font-bold">{cleanup.title}</h1>
//       <p className="text-gray-700">{cleanup.description}</p>
//       <p>Status: <strong className="capitalize">{cleanup.status}</strong></p>

//       <div className="space-y-2">
//         <label className="block mb-1 font-medium">Schedule Cleanup</label>
//         <div className="flex items-center gap-2">
//           <input
//             type="datetime-local"
//             value={date}
//             onChange={e => setDate(e.target.value)}
//             className="border rounded px-3 py-2 flex-1"
//           />
//           <CalendarDaysIcon className="w-6 h-6 text-green-500" />
//         </div>
//         <button
//           onClick={handleSchedule}
//           disabled={scheduling}
//           className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-60"
//         >
//           {scheduling ? 'Scheduling…' : 'Schedule'}
//         </button>
//       </div>
//     </div>
//   );
// }





//sabirin updated the code
// src/pages/admin/CleanupDetail.jsx
// src/pages/admin/CleanupDetail.jsx




import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const kGreen = '#3CAC44';

export default function CleanupDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [cleanup, setCleanup] = useState(null);
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [scheduling, setScheduling] = useState(false);

  const [beforeFiles, setBeforeFiles] = useState([]);
  const [afterFiles, setAfterFiles] = useState([]);

  const beforeInputRef = useRef();
  const afterInputRef = useRef();

  // Fetch cleanup on mount
  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/admin/cleanups/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => {
        if (!r.ok) throw new Error('Failed to load');
        return r.json();
      })
      .then(c => {
        setCleanup(c);
        if (c.scheduledDate) {
          const dt = new Date(c.scheduledDate);
          const pad = n => n.toString().padStart(2, '0');
          setDate(`${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, token]);

  async function handleSchedule() {
    if (!date) return alert('Pick a date/time');
    setScheduling(true);
    try {
      const res = await fetch(`${API_URL}/admin/cleanups/${id}/schedule`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ scheduledDate: new Date(date).toISOString() })
      });
      if (!res.ok) throw new Error(await res.text());
      const updated = await res.json();
      setCleanup(updated);
      toast.success('Scheduled!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to schedule');
    } finally {
      setScheduling(false);
    }
  }

  async function handleUploadImages() {
    if (beforeFiles.length === 0 && afterFiles.length === 0) {
      return toast.error('Please select before or after images to upload');
    }

    const fd = new FormData();
    beforeFiles.forEach(file => fd.append('beforeImages', file));
    afterFiles.forEach(file => fd.append('afterImages', file));

    try {
      const res = await fetch(`${API_URL}/admin/cleanups/${id}/before-after-images`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      });
      if (!res.ok) throw new Error(await res.text());
      const updated = await res.json();
      setCleanup(updated);
      toast.success('Images uploaded!');
      setBeforeFiles([]);
      setAfterFiles([]);
    } catch (err) {
      console.error(err);
      toast.error('Upload failed');
    }
  }

  const getImageUrl = (path) =>
    path?.startsWith('http')
      ? path
      : `${API_URL.replace('/api', '')}/${path?.replace(/^\/+/, '')}`;

  if (loading) return <div className="p-6">Loading…</div>;
  if (!cleanup) return <div className="p-6 text-red-600">Not found</div>;

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="text-sm font-medium"
        style={{ color: kGreen }}
      >&larr; Back</button>

      <h1 className="text-2xl font-bold">{cleanup.title}</h1>
      <p className="text-gray-700">{cleanup.description}</p>
      <p>Status: <strong className="capitalize">{cleanup.status}</strong></p>

      {/* 📅 Scheduling */}
      <div className="space-y-2">
        <label className="block mb-1 font-medium">Schedule Cleanup</label>
        <div className="flex items-center gap-2">
          <input
            type="datetime-local"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="border rounded px-3 py-2 flex-1"
          />
          <CalendarDaysIcon className="w-6 h-6 text-green-500" />
        </div>
        <button
          onClick={handleSchedule}
          disabled={scheduling}
          className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-60"
        >
          {scheduling ? 'Scheduling…' : 'Schedule'}
        </button>
      </div>

      {/* 🟠 BEFORE Section */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-800">🟠 This is BEFORE cleanup</h3>
        {cleanup.beforeImages?.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mt-2">
            {cleanup.beforeImages.map((img, i) => (
              <img
                key={i}
                src={getImageUrl(img)}
                alt={`Before ${i + 1}`}
                className="rounded shadow border border-gray-300 object-cover h-24"
              />
            ))}
          </div>
        )}
        <label className="block mt-3 text-sm font-medium text-gray-700">Upload new before-cleanup images:</label>
        <input
          type="file"
          multiple
          ref={beforeInputRef}
          onChange={e => setBeforeFiles(Array.from(e.target.files))}
          className="block mt-1"
        />
      </div>

      {/* 🟢 AFTER Section */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-800">🟢 This is AFTER cleanup</h3>
        {cleanup.afterImages?.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mt-2">
            {cleanup.afterImages.map((img, i) => (
              <img
                key={i}
                src={getImageUrl(img)}
                alt={`After ${i + 1}`}
                className="rounded shadow border border-gray-300 object-cover h-24"
              />
            ))}
          </div>
        )}
        <label className="block mt-3 text-sm font-medium text-gray-700">Upload new after-cleanup images:</label>
        <input
          type="file"
          multiple
          ref={afterInputRef}
          onChange={e => setAfterFiles(Array.from(e.target.files))}
          className="block mt-1"
        />
      </div>

      <button
        onClick={handleUploadImages}
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Upload Before & After Images
      </button>
    </div>
  );
}

