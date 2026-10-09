import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function SurveyLanding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7F7F8] flex flex-col items-center p-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-pxchange-teal opacity-10 rounded-br-full -z-10" />
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-pxchange-coral opacity-10 rounded-tl-full -z-10" />
      <div className="absolute top-1/4 right-8 w-6 h-6 bg-pxchange-orange -z-10" />
      <div className="absolute bottom-1/4 left-8 w-8 h-8 bg-pxchange-purple -z-10" />

      <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center mt-12 mb-12">
        <img 
          src="/assets/pxchange-logo.png" 
          alt="Pekanbaru Xchange Mall" 
          className="max-w-[200px] mb-8"
        />
        
        <h1 className="text-2xl md:text-3xl font-bold text-charcoal text-center mb-4 leading-tight">
          Survey Pengunjung Pekanbaru Xchange Mall
        </h1>
        
        <p className="text-gray-600 text-center mb-8 leading-relaxed">
          Bantu kami meningkatkan pengalaman berkunjung Anda di Pekanbaru Xchange Mall. Survey ini hanya membutuhkan waktu sekitar 5 menit.
        </p>
        
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg mb-8 w-full">
          <p className="text-xs text-gray-500 text-center leading-relaxed">
            Data yang Anda berikan akan digunakan untuk meningkatkan layanan dan fasilitas mall. Informasi pribadi Anda akan dijaga kerahasiaannya dan tidak akan dibagikan kepada pihak ketiga tanpa persetujuan Anda.
          </p>
        </div>
        
        <button
          onClick={() => navigate('/survey/form')}
          className="w-full bg-pxchange-teal hover:bg-[#009CBD] text-white font-semibold py-4 px-8 rounded-lg shadow-md transition-colors text-lg"
        >
          Mulai Survey
        </button>
      </div>
    </div>
  );
}
