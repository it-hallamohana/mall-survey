import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { fetchResponseDetail } from '../../services/dashboardService';

const Section = ({ title, children }) => (
  <div className="mb-6">
    <h4 className="mb-3 border-b border-gray-border pb-2 text-lg font-semibold text-charcoal flex items-center">
      <div className="mr-2 h-3 w-3 bg-pxchange-teal rounded-sm"></div>
      {title}
    </h4>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {children}
    </div>
  </div>
);

const Field = ({ label, value, colSpan = 1 }) => {
  const displayValue = Array.isArray(value) ? value.join(', ') : (value || '-');
  return (
    <div className={`col-span-1 ${colSpan === 2 ? 'sm:col-span-2' : ''}`}>
      <span className="block text-sm font-medium text-charcoal-light">{label}</span>
      <span className="block text-base text-charcoal mt-1 bg-gray-50 p-2 rounded border border-gray-100">{displayValue}</span>
    </div>
  );
};

export default function ResponseDetail({ responseId, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!responseId) return;
    
    const loadData = async () => {
      try {
        setLoading(true);
        const result = await fetchResponseDetail(responseId);
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [responseId]);

  if (!responseId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-lg bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-border p-4 bg-gray-50">
          <h3 className="text-xl font-bold text-charcoal">Detail Responden</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-200 hover:text-charcoal transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-pxchange-teal"></div>
            </div>
          ) : error ? (
            <div className="rounded border border-red-200 bg-red-50 p-4 text-red-600">
              Gagal memuat data: {error}
            </div>
          ) : data ? (
            <>
              <Section title="Demografi & Informasi Pribadi">
                <Field label="Tanggal Survey" value={new Date(data.created_at).toLocaleString('id-ID')} />
                <Field label="Nama Pengunjung" value={data.visitor_name} />
                <Field label="Nomor Telepon" value={data.phone_number} />
                <Field label="Kelompok Usia" value={data.age_group} />
                <Field label="Gender" value={data.gender} />
                <Field label="Kota Tempat Tinggal" value={data.city} />
                <Field label="Bersedia Menerima Promo" value={data.promo_consent ? 'Ya' : 'Tidak'} />
              </Section>

              <Section title="Perilaku Kunjungan">
                <Field label="Frekuensi Kunjungan" value={data.visit_frequency} />
                <Field label="Tujuan Utama Kunjungan" value={data.visit_purpose === 'Lainnya' ? `Lainnya: ${data.visit_purpose_other}` : data.visit_purpose} />
                <Field label="Datang Bersama" value={data.companions} />
                <Field label="Rata-rata Durasi" value={data.visit_duration} />
                <Field label="Perkiraan Pengeluaran" value={data.estimated_spending} />
                <Field label="Waktu Kunjungan Favorit" value={data.preferred_visit_time} />
              </Section>

              <Section title="Food & Beverage">
                <Field label="Opini Variasi Makanan" value={data.food_variety} />
                <Field label="Faktor Pemilihan Tempat Makan" value={data.dining_factors} colSpan={2} />
                <Field label="Tenant F&B yang Diinginkan" value={data.desired_fnb_tenants} colSpan={2} />
                <Field label="Request Tenant Khusus" value={data.requested_tenants} colSpan={2} />
              </Section>

              <Section title="Hiburan & Gaya Hidup">
                <Field label="Area Hiburan yang Menarik" value={data.entertainment_areas} colSpan={2} />
                <Field label="Pentingnya Hiburan Keluarga" value={data.family_entertainment_importance} />
                <Field label="Minat Hadir Acara Spesial" value={data.event_visit_interest} />
                <Field label="Jenis Acara yang Diinginkan" value={data.desired_events} colSpan={2} />
              </Section>

              <Section title="Promosi & Komunikasi">
                <Field label="Jenis Promosi Menarik" value={data.preferred_promotions} colSpan={2} />
                <Field label="Sumber Info Promo" value={data.promotion_information_sources} colSpan={2} />
                <Field label="Media Komunikasi Paling Efektif" value={data.effective_media_channels} colSpan={2} />
              </Section>

              <Section title="Pengalaman & Kepuasan">
                <Field label="Tingkat Kepuasan Keseluruhan" value={data.satisfaction_level} />
                <Field label="Niat Berkunjung Kembali" value={data.revisit_intention} />
                <Field label="Saran / Masukan" value={data.visitor_suggestions} colSpan={2} />
              </Section>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
