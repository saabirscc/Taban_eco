import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function RewardsDisplay({ userId }) {
  const { token } = useAuth();
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    if (!userId) return;
    fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/reward/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(setBadges)
      .catch(console.error);
  }, [userId, token]);

  if (!badges.length) return <p className="text-sm text-gray-500">No badges yet</p>;

  return (
    <div className="flex flex-wrap gap-3">
      {badges.map(b => (
        <div key={b._id} className="flex flex-col items-center text-xs">
          <img src={b.icon} alt={b.badgeName} className="h-8 w-8" />
          <span>{b.badgeName}</span>
        </div>
      ))}
    </div>
  );
}
