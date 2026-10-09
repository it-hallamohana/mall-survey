import React from 'react';

export default function TextInput({ name, label, value = '', onChange, type = 'text', placeholder = '', error }) {
  const baseClasses = `w-full p-4 rounded-lg border-2 text-charcoal outline-none transition-colors ${
    error
      ? 'border-red-500 focus:border-red-500'
      : 'border-gray-200 focus:border-pxchange-teal'
  } bg-white`;

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-semibold text-charcoal mb-2">{label}</label>}
      {type === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${baseClasses} min-h-[120px] resize-y`}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={baseClasses}
        />
      )}
    </div>
  );
}
