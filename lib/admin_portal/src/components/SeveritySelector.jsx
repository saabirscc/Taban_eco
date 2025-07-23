// src/components/SeveritySelector.jsx
import React from 'react';

const kGreen = '#3CAC44';

const levels = [
  { value: 'low',      label: 'Low',      emoji: '🟢' },
  { value: 'moderate', label: 'Moderate', emoji: '🟡' },
  { value: 'high',     label: 'High',     emoji: '🔴' },
];

export default function SeveritySelector({ current, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {levels.map(({ value, label, emoji }) => {
        const selected = current === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            className={`
              flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition
              ${selected
                ? 'bg-[#3CAC44] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
            `}
          >
            <span style={{ color: selected ? '#fff' : kGreen }}>{emoji}</span>
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
