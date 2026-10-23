import React from 'react';

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 font-sans">
      {children}
    </div>
  );
}
