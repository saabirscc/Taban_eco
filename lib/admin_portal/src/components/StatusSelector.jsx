import React from 'react';

const statuses = [
  { value: 'pending',   label: 'Pending'   },
  { value: 'approved',  label: 'Approved'  },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'completed', label: 'Completed' },
  { value: 'rejected',  label: 'Rejected'  },
];

export default function StatusSelector({ current, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {statuses.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          className={`
            px-4 py-2 rounded-lg font-medium transition
            ${current === value
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
