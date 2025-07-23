import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function VolunteersSelector({ selected = [], onChange }) {
  const { token } = useAuth();
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(setAllUsers)
      .catch(console.error);
  }, [token]);

  function toggle(id) {
    if (selected.includes(id)) {
      onChange(selected.filter(x => x !== id));
    } else {
      onChange([...selected, id]);
    }
  }

  return (
    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-auto border p-2 rounded">
      {allUsers.map(u => (
        <label key={u._id} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selected.includes(u._id)}
            onChange={() => toggle(u._id)}
          />
          <span>{u.fullName}</span>
        </label>
      ))}
    </div>
  );
}
