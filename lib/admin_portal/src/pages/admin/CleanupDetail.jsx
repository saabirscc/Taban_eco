// src/pages/admin/CleanupDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate }     from 'react-router-dom';
import { useAuth }                     from '../../contexts/AuthContext';
import { CalendarDaysIcon }            from '@heroicons/react/24/outline';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const kGreen  = '#3CAC44';

export default function CleanupDetail() {
  const { id }       = useParams();
  const { token }    = useAuth();
  const navigate     = useNavigate();
  const [cleanup, setCleanup]     = useState(null);
  const [date, setDate]           = useState('');
  const [loading, setLoading]     = useState(true);
  const [scheduling, setScheduling] = useState(false);

  // 1) load the cleanup
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
        // convert ISO → yyyy-MM-ddTHH:mm
        if (c.scheduledDate) {
          const dt = new Date(c.scheduledDate);
          const pad = n => n.toString().padStart(2, '0');
          setDate(`${dt.getFullYear()}-${pad(dt.getMonth()+1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, token]);

  // 2) schedule handler
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
      alert('Scheduled!');
    } catch (err) {
      console.error(err);
      alert('Failed: ' + err.message);
    } finally {
      setScheduling(false);
    }
  }

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
    </div>
  );
}
