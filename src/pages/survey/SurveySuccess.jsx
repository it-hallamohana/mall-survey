import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

export default function SurveySuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7F7F8] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
        <img 
          src="/assets/pxchange-logo.png" 
          alt="Pekanbaru Xchange Mall" 
          className="max-w-[150px] mb-8"
        />
        
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-charcoal mb-4">
          Terima Kasih!
        </h1>
        
        <p className="text-gray-700 font-medium mb-2">
          Terima kasih telah berpartisipasi dalam Survey Pengunjung Pekanbaru Xchange Mall.
        </p>
        
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          Masukan Anda sangat berarti untuk meningkatkan pengalaman berkunjung di Pekanbaru Xchange Mall.
        </p>
        
        <button
          onClick={() => navigate('/')}
          className="w-full bg-pxchange-teal hover:bg-[#009CBD] text-white font-semibold py-4 px-8 rounded-lg shadow-md transition-colors"
        >
          Kembali ke Halaman Utama
        </button>
      </div>
    </div>
  );
}
