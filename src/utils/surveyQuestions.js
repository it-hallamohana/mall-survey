export const surveyQuestions = [
  {
    sectionId: 'A',
    title: 'Profil Pengunjung',
    questions: [
      { id: 1, field: 'visitor_name', label: 'Nama Anda', type: 'text', required: true },
      { id: 2, field: 'age_group', label: 'Usia Anda saat ini', type: 'radio', options: ['< 17 Tahun', '17–24 Tahun', '25–34 Tahun', '35–54 Tahun', '> 55 Tahun'], required: true },
      { id: 3, field: 'gender', label: 'Informasi Gender', type: 'radio', options: ['Laki-laki', 'Perempuan'], required: true },
      { id: 4, field: 'city', label: 'Domisili Anda saat ini (Nama Kota)', type: 'text', required: true },
      { id: 5, field: 'phone_number', label: 'No Handphone (HP)', type: 'tel', required: true },
      { id: 6, field: 'promo_consent', label: 'Apakah Anda tertarik menerima informasi promo mall melalui WA / SMS?', type: 'radio', options: ['Tertarik', 'Tidak Tertarik'], required: true }
    ]
  },
  {
    sectionId: 'B',
    title: 'Kebiasaan Kunjungan',
    questions: [
      { id: 7, field: 'visit_frequency', label: 'Seberapa sering Anda mengunjungi Pekanbaru Xchange Mall?', type: 'radio', options: ['Pertama kali', '1–2 kali per bulan', '1 kali per minggu', '> 2 kali per minggu'], required: true },
      { 
        id: 8, 
        field: 'visit_purpose', 
        label: 'Tujuan utama Anda berkunjung hari ini?', 
        type: 'radio', 
        options: ['Makan/Kuliner', 'Hiburan/Entertainment', 'Nongkrong/Santai', 'Belanja/Shopping', 'Lainnya'], 
        required: true,
        conditionalField: {
          parentValue: 'Lainnya',
          field: 'visit_purpose_other',
          label: 'Sebutkan tujuan lainnya',
          type: 'text',
          required: true
        }
      },
      { id: 9, field: 'companions', label: 'Kunjungan Anda, datang bersama', type: 'radio', options: ['Sendiri', 'Pasangan', 'Teman', 'Keluarga'], required: true }
    ]
  },
  {
    sectionId: 'C',
    title: 'Kuliner & Tenant F&B',
    questions: [
      { id: 10, field: 'food_variety', label: 'Menurut Anda, pilihan makanan di Pekanbaru Xchange Mall:', type: 'radio', options: ['Sangat lengkap', 'Cukup lengkap', 'Kurang beragam'], required: true },
      { id: 11, field: 'desired_fnb_tenants', label: 'Jenis tenant F&B yang paling Anda inginkan?', type: 'checkbox', options: ['Cafe & Coffee Shop', 'Street food / Casual dining', 'Family Restaurant', 'Dessert & Snack', 'Merek Lokal'], required: true },
      { id: 12, field: 'dining_factors', label: 'Faktor apa yang membuat Anda memilih kuliner / makan di Pekanbaru Xchange Mall?', type: 'checkbox', options: ['Harga terjangkau', 'Banyak pilihan', 'Nyaman & bersih', 'Dekat rumah', 'Promo menarik'], required: true },
      { id: 13, field: 'requested_tenants', label: 'Tenant yang Anda harapkan ada di Pekanbaru Xchange Mall', type: 'text', required: true }
    ]
  },
  {
    sectionId: 'D',
    title: 'Hiburan, Event & Aktivitas',
    questions: [
      { id: 14, field: 'entertainment_areas', label: 'Area hiburan apa yang paling sering Anda gunakan?', type: 'checkbox', options: ['Playground anak', 'Games / arcade', 'Bioskop', 'Event / aktivitas', 'Belum ada'], required: true },
      { id: 15, field: 'family_entertainment_importance', label: 'Seberapa penting area hiburan keluarga & anak bagi Anda?', type: 'radio', options: ['Sangat penting', 'Penting', 'Biasa saja', 'Tidak penting'], required: true },
      { id: 16, field: 'desired_events', label: 'Event seperti apa yang membuat Anda ingin datang lebih sering?', type: 'checkbox', options: ['Exhibition/Pameran', 'Bazaar', 'Kompetisi & Games', 'Music & Event'], required: true },
      { id: 17, field: 'event_visit_interest', label: 'Apakah Anda tertarik datang khusus karena event di Pekanbaru Xchange Mall?', type: 'radio', options: ['Sangat tertarik', 'Tertarik', 'Kurang tertarik'], required: true },
      { id: 18, field: 'preferred_visit_time', label: 'Waktu yang paling ideal menurut Anda ada berkunjung ke Pekanbaru Xchange Mall', type: 'radio', options: ['Weekdays siang', 'Weekdays sore/malam', 'Weekend siang', 'Weekend sore/malam'], required: true }
    ]
  },
  {
    sectionId: 'E',
    title: 'Promo & Media Informasi',
    questions: [
      { id: 19, field: 'preferred_promotions', label: 'Promo apa yang paling mendorong Anda untuk datang ke Pekanbaru Xchange Mall?', type: 'checkbox', options: ['Diskon tenant', 'Door Prize', 'Free Parking', 'Merchandise'], required: true },
      { id: 20, field: 'visit_duration', label: 'Rata-rata lama kunjungan Anda di Pekanbaru Xchange Mall', type: 'radio', options: ['< 1 jam', '1–2 jam', '2–3 jam', '> 3 jam'], required: true },
      { id: 21, field: 'estimated_spending', label: 'Perkiraan pengeluaran per-kunjungan:', type: 'radio', options: ['< Rp100.000', 'Rp100.000–Rp500.000', '> Rp500.000'], required: true },
      { id: 22, field: 'promotion_information_sources', label: 'Dari mana Anda mengetahui info promo & event Pekanbaru Xchange Mall?', type: 'checkbox', options: ['Social Media', 'Spanduk/Banner', 'Koran, Majalah, Radio/TV', 'Teman/keluarga'], required: true },
      { id: 23, field: 'effective_media_channels', label: 'Media apa yang paling efektif menurut Anda?', type: 'checkbox', options: ['Social Media', 'Spanduk/Banner', 'Koran, Majalah, Radio/TV', 'LED/Signage Mall'], required: true }
    ]
  },
  {
    sectionId: 'F',
    title: 'Evaluasi Pengalaman Pengunjung',
    questions: [
      { id: 24, field: 'satisfaction_level', label: 'Secara keseluruhan, bagaimana pengalaman Anda di Pekanbaru Xchange Mall?', type: 'radio', options: ['Sangat Puas', 'Puas', 'Cukup', 'Kurang Puas'], required: true },
      { id: 25, field: 'visitor_suggestions', label: 'Saran agar Pekanbaru Xchange Mall lebih menarik untuk Eat & Play', type: 'textarea', required: true },
      { id: 26, field: 'revisit_intention', label: 'Apakah Anda bersedia kembali berkunjung dalam 1 bulan ke depan?', type: 'radio', options: ['Ya', 'Mungkin', 'Tidak'], required: true }
    ]
  }
];
