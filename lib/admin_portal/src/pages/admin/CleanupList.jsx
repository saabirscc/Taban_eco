// lib/admin/src/pages/admin/CleanupList.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth }       from '../../contexts/AuthContext';
import {
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';

const API_URL      = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const BORDER_GREEN = '#2FAC40';

// colour helpers (unchanged)
const statusColor = s => {
  s = s.toLowerCase();
  if (s === 'completed')                return 'text-blue-600 bg-blue-100';
  if (s === 'scheduled')                return 'text-purple-600 bg-purple-100';
  if (s === 'rejected' || s === 'cancelled')
                                        return 'text-red-600 bg-red-100';
  return 'text-green-700 bg-green-100'; // pending / approved
};
const severityBg = sev => {
  sev = sev.toLowerCase();
  if (sev === 'moderate') return 'text-white bg-orange-200';
  if (sev === 'high')     return 'text-white bg-red-400';
  return 'text-green-800 bg-green-200'; // low
};

export default function CleanupList() {
  const { token }             = useAuth();
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate              = useNavigate();

  // fetch all cleanups
  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/admin/cleanups`, {
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    })
      .then(r => {
        if (r.status === 401) throw new Error('Unauthorised');
        return r.json();
      })
      .then(setItems)
      .catch(err => console.error('[Cleanups fetch]', err))
      .finally(() => setLoading(false));
  }, [token]);

  // update status helper
  async function updateStatus(id, action) {
    const res = await fetch(
      `${API_URL}/admin/cleanups/${id}/${action}`,
      { method: 'PUT', headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) throw new Error('Could not update status');
    const updated = await res.json();
    setItems(items.map(c => c._id === updated._id ? updated : c));

    // when we approve, immediately navigate into the edit/schedule form
    if (action === 'approve') {
      navigate(`/admin/cleanup/${id}`);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <svg className="animate-spin h-8 w-8 text-green-600" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" fill="none"/>
          <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
        </svg>
      </div>
    );
  }

  if (!items.length) {
    return <p className="text-center text-gray-500 mt-8">No cleanup requests yet</p>;
  }

  // strip off whatever host the backend stamped in the URL,
  // and prepend your real API host (no /api suffix)
  const fixUrl = url =>
    url.replace(
      /^https?:\/\/[^/]+/,
      (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/\/api$/, '')
    );

  return (
    <div className="p-6 space-y-4">
      {items.map(c => {
        const status = c.status[0].toUpperCase() + c.status.slice(1);
        const sev    = c.severity[0].toUpperCase() + c.severity.slice(1);
        const photoUrl = c.photos?.[0] ? fixUrl(c.photos[0]) : null;

        return (
          <div
            key={c._id}
            onClick={() => navigate(`/admin/cleanup/${c._id}`)}
            className="flex border-l-4 rounded-lg shadow hover:shadow-md transition cursor-pointer overflow-hidden"
            style={{ borderColor: BORDER_GREEN }}
          >
            {photoUrl ? (
              <img src={photoUrl} alt={c.title} className="w-24 h-24 object-cover" />
            ) : (
              <div className="w-24 h-24 bg-gray-100 flex items-center justify-center text-gray-400">
                📷
              </div>
            )}

            <div className="flex-1 p-4 bg-white space-y-1">
              <p className="text-xs text-gray-500">Cleanup request</p>
              <h2 className="text-lg font-bold text-gray-800 truncate">{c.title}</h2>

              <div className="flex items-center text-xs text-gray-600 space-x-3">
                <span className="flex items-center space-x-1">
                  <CalendarDaysIcon className="h-4 w-4" />
                  <span>
                    {c.scheduledDate
                      ? new Date(c.scheduledDate).toLocaleDateString()
                      : '—'}
                  </span>
                </span>
                <span className="flex items-center space-x-1">
                  <ClockIcon className="h-4 w-4" />
                  <span>
                    {c.scheduledDate
                      ? new Date(c.scheduledDate).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : '—'}
                  </span>
                </span>
              </div>

              <div className="flex items-center space-x-2 mt-2">
                <span className={`px-2 py-0.5 rounded-full ${statusColor(status)}`}>
                  {status}
                </span>
                <span className={`px-2 py-0.5 rounded-full ${severityBg(sev)}`}>
                  {sev}
                </span>
              </div>

              <div className="flex items-center text-xs text-gray-600 space-x-1 mt-2">
                <MapPinIcon className="h-4 w-4 text-gray-600" />
                <span>{c.location}</span>
              </div>

              {c.status === 'pending' && (
                <div className="flex space-x-2 mt-3">
                  <button
                    onClick={e => { e.stopPropagation(); updateStatus(c._id, 'approve'); }}
                    className="px-3 py-1 rounded text-white bg-green-600 hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); updateStatus(c._id, 'reject'); }}
                    className="px-3 py-1 rounded text-white bg-red-600 hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
