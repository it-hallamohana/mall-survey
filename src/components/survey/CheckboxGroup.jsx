import React from 'react';

export default function CheckboxGroup({ name, options, value = [], onChange, error }) {
  const toggleOption = (option) => {
    const newValue = value.includes(option)
      ? value.filter((item) => item !== option)
      : [...value, option];
    onChange(newValue);
  };

  return (
    <div className="flex flex-col gap-3">
      {options.map((option) => (
        <label
          key={option}
          className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
            value.includes(option)
              ? 'border-pxchange-teal bg-pxchange-teal/5'
              : error
              ? 'border-red-500 bg-white'
              : 'border-gray-200 bg-white hover:border-pxchange-teal/50'
          }`}
        >
          <div className="relative flex items-center justify-center w-6 h-6 mr-3 shrink-0">
            <input
              type="checkbox"
              name={name}
              value={option}
              checked={value.includes(option)}
              onChange={() => toggleOption(option)}
              className="appearance-none w-6 h-6 border-2 border-gray-300 rounded md:rounded-md checked:border-pxchange-teal checked:bg-pxchange-teal focus:outline-none"
            />
            {value.includes(option) && (
              <svg className="absolute w-4 h-4 text-white pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <span className="text-charcoal font-medium select-none">{option}</span>
        </label>
      ))}
    </div>
  );
}
