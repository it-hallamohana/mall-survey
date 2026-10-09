export const exportToCSV = (data, filename = `pxchange-survey-responses-${new Date().toISOString().split('T')[0]}.csv`) => {
  if (!data || !data.length) {
    return;
  }
  
  const headers = [
    'ID', 'Tanggal', 'Nama Pengunjung', 'Kelompok Usia', 'Gender', 'Kota', 
    'No Telepon', 'Persetujuan Promo', 'Frekuensi Kunjungan', 'Tujuan Kunjungan',
    'Tujuan Lainnya', 'Pendamping', 'Variasi Makanan', 'Tenant F&B Diinginkan',
    'Faktor Bersantap', 'Tenant Request', 'Area Hiburan', 'Pentingnya Hiburan Keluarga',
    'Acara Diinginkan', 'Minat Kunjungan Acara', 'Waktu Kunjungan', 'Promosi Diinginkan',
    'Durasi Kunjungan', 'Perkiraan Pengeluaran', 'Sumber Info Promo', 'Media Efektif',
    'Tingkat Kepuasan', 'Saran', 'Niat Kunjungan Ulang'
  ];
  
  const formatCell = (value) => {
    if (value === null || value === undefined) return '';
    if (Array.isArray(value)) return `"${value.join('; ')}"`;
    if (typeof value === 'string') {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };
  
  const rows = data.map(row => [
    row.id,
    new Date(row.created_at).toLocaleString('id-ID'),
    formatCell(row.visitor_name),
    formatCell(row.age_group),
    formatCell(row.gender),
    formatCell(row.city),
    formatCell(row.phone_number),
    row.promo_consent ? 'Ya' : 'Tidak',
    formatCell(row.visit_frequency),
    formatCell(row.visit_purpose),
    formatCell(row.visit_purpose_other),
    formatCell(row.companions),
    formatCell(row.food_variety),
    formatCell(row.desired_fnb_tenants),
    formatCell(row.dining_factors),
    formatCell(row.requested_tenants),
    formatCell(row.entertainment_areas),
    formatCell(row.family_entertainment_importance),
    formatCell(row.desired_events),
    formatCell(row.event_visit_interest),
    formatCell(row.preferred_visit_time),
    formatCell(row.preferred_promotions),
    formatCell(row.visit_duration),
    formatCell(row.estimated_spending),
    formatCell(row.promotion_information_sources),
    formatCell(row.effective_media_channels),
    formatCell(row.satisfaction_level),
    formatCell(row.visitor_suggestions),
    formatCell(row.revisit_intention)
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(e => e.join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
