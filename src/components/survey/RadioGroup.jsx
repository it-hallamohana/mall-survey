import React from 'react';

export default function RadioGroup({ name, options, value, onChange, error }) {
  return (
    <div className="flex flex-col gap-3">
      {options.map((option) => (
        <label
          key={option}
          className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
            value === option
              ? 'border-pxchange-teal bg-pxchange-teal/5'
              : error
              ? 'border-red-500 bg-white'
              : 'border-gray-200 bg-white hover:border-pxchange-teal/50'
          }`}
        >
          <div className="relative flex items-center justify-center w-6 h-6 mr-3 shrink-0">
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
              className="peer appearance-none w-6 h-6 border-2 border-gray-300 rounded-full checked:border-pxchange-teal focus:outline-none"
            />
            {value === option && (
              <div className="absolute w-3 h-3 bg-pxchange-teal rounded-full" />
            )}
          </div>
          <span className="text-charcoal font-medium select-none">{option}</span>
        </label>
      ))}
    </div>
  );
}
