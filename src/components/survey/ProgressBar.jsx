import React from 'react';

export default function ProgressBar({ sections, currentSectionIndex }) {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider">
          {sections[currentSectionIndex].title}
        </h3>
        <span className="text-sm font-medium text-gray-500">
          Bagian {currentSectionIndex + 1} dari {sections.length}
        </span>
      </div>
      <div className="flex gap-2">
        {sections.map((_, index) => {
          let bgColor = 'bg-gray-200';
          if (index < currentSectionIndex) {
            bgColor = 'bg-pxchange-teal'; // Completed
          } else if (index === currentSectionIndex) {
            bgColor = 'bg-pxchange-coral'; // Current
          }
          return (
            <div
              key={index}
              className={`h-2 flex-1 rounded-sm transition-colors duration-300 ${bgColor}`}
            />
          );
        })}
      </div>
    </div>
  );
}
