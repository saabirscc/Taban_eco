// src/components/WasteTypeSelector.jsx
import React from 'react';
import {
  BeakerIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  TrashIcon,
} from '@heroicons/react/24/solid';

const kGreen = '#3CAC44';

const types = [
  { value: 'plastic',   label: 'Plastic',   Icon: BeakerIcon },
  { value: 'organic',   label: 'Organic',   Icon: SparklesIcon },
  { value: 'hazardous', label: 'Hazardous', Icon: ExclamationTriangleIcon },
  { value: 'general',   label: 'General',   Icon: TrashIcon },
];

export default function WasteTypeSelector({ current, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {types.map(({ value, label, Icon }) => {
        const selected = current === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition
              ${selected
                ? 'bg-[#3CAC44] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
            `}
          >
            <Icon className="h-5 w-5" style={{ color: selected ? '#fff' : kGreen }} />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
