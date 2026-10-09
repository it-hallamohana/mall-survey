# Pekanbaru Xchange Mall — Visitor Survey System

Sistem survey pengunjung berbasis web untuk **Pekanbaru Xchange Mall (PXchange)**. Aplikasi ini terdiri dari dua bagian utama:

1. **Survey Publik** — Pengunjung mall dapat mengisi survey melalui link atau QR code dari perangkat mobile mereka.
2. **Admin Dashboard** — Administrator dapat login, melihat statistik survey, menganalisis feedback pengunjung, memfilter data, dan mengexport hasil survey.

## Tech Stack

- **Frontend:** React + Vite
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Charts:** Recharts
- **Backend & Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Deployment:** Railway

## Prasyarat

- Node.js v18 atau lebih baru
- npm v9 atau lebih baru
- Akun Supabase (gratis)
- Akun Railway (untuk deployment)

## Setup Lokal

### 1. Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/Mall-Survey.git
cd Mall-Survey
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Konfigurasi Environment

Salin file `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

Isi dengan kredensial Supabase Anda:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

> **PENTING:** Jangan pernah menaruh `service_role` key di kode frontend atau environment variables yang diawali `VITE_`.

### 4. Setup Database Supabase

Buka **Supabase Dashboard** → **SQL Editor** dan jalankan SQL dari file:

```
supabase/migrations/001_initial_schema.sql
```

SQL ini akan membuat:
- Tabel `survey_responses` dengan semua 26 kolom jawaban
- Tabel `admin_users` untuk otorisasi administrator
- Row Level Security (RLS) policies
- Indexes untuk performa query
- Helper function `is_admin()`

### 5. Buat Admin User Pertama

1. Buka **Supabase Dashboard** → **Authentication** → **Users**
2. Klik **Add User** → **Create New User**
3. Masukkan email dan password admin
4. Salin **User UID** yang dihasilkan
5. Buka **SQL Editor** dan jalankan:

```sql
INSERT INTO admin_users (id) VALUES ('paste-user-uid-disini');
```

### 6. Jalankan Development Server

```bash
npm run dev
```

Buka http://localhost:5173 di browser.

## Struktur Proyek

```
src/
├── components/
│   ├── admin/
│   │   ├── charts/
│   │   │   ├── BehaviorCharts.jsx
│   │   │   ├── DemographicsCharts.jsx
│   │   │   ├── EntertainmentCharts.jsx
│   │   │   ├── ExperienceCharts.jsx
│   │   │   ├── FnbCharts.jsx
│   │   │   └── PromoCharts.jsx
│   │   ├── ResponseDetail.jsx
│   │   ├── ResponseTable.jsx
│   │   └── SummaryCards.jsx
│   ├── common/
│   │   └── ProtectedRoute.jsx
│   └── survey/
│       ├── CheckboxGroup.jsx
│       ├── ProgressBar.jsx
│       ├── RadioGroup.jsx
│       └── TextInput.jsx
├── hooks/
│   └── useAuth.jsx
├── layouts/
│   └── AdminLayout.jsx
├── lib/
│   └── supabase.js
├── pages/
│   ├── admin/
│   │   ├── AdminDashboard.jsx
│   │   └── AdminLogin.jsx
│   └── survey/
│       ├── SurveyForm.jsx
│       ├── SurveyLanding.jsx
│       └── SurveySuccess.jsx
├── services/
│   ├── dashboardService.js
│   └── surveyService.js
├── utils/
│   ├── csvExport.js
│   └── surveyQuestions.js
├── App.jsx
├── index.css
└── main.jsx
public/
└── assets/
    └── pxchange-logo.png
supabase/
└── migrations/
    └── 001_initial_schema.sql
```

## Rute Aplikasi

| Rute | Deskripsi |
|------|-----------|
| `/` | Landing page survey |
| `/survey/form` | Form survey multi-step |
| `/survey/success` | Halaman sukses setelah submit |
| `/admin/login` | Login admin |
| `/admin/dashboard` | Dashboard admin (protected) |

## Keamanan

### Row Level Security (RLS)

- **Anonymous users:** Hanya bisa INSERT survey (tidak bisa membaca, update, atau delete)
- **Admin users:** Bisa membaca semua data survey
- **Tabel admin_users:** Hanya bisa dibaca oleh admin, tidak bisa dimodifikasi via API

### Autentikasi

- Login admin menggunakan Supabase Auth (email + password)
- Setelah login, sistem memverifikasi bahwa user terdaftar di tabel `admin_users`
- Akun yang tidak ada di `admin_users` akan ditolak aksesnya
- Tidak ada registrasi publik — admin dibuat secara manual

### Data Privasi

- Nomor telepon di-mask di tabel dashboard (hanya 4 digit terakhir)
- Nomor lengkap hanya ditampilkan di detail view (admin only)
- Data tidak dibagikan ke pihak ketiga
- Consent promo WA/SMS disimpan secara eksplisit dan terpisah

## Deployment ke Railway

### 1. Push ke GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/Mall-Survey.git
git push -u origin main
```

### 2. Setup Railway

1. Buka [railway.app](https://railway.app) dan login
2. Klik **New Project** → **Deploy from GitHub repo**
3. Pilih repository `Mall-Survey`
4. Railway akan otomatis mendeteksi Node.js project

### 3. Konfigurasi Environment Variables

Di Railway dashboard, tambahkan environment variables:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Konfigurasi Build & Start

Railway seharusnya otomatis mendeteksi dari `railway.json`:
- **Build Command:** `npm run build`
- **Start Command:** `npx serve dist -s -l $PORT`

Flag `-s` pada `serve` memastikan SPA routing bekerja (semua rute diarahkan ke `index.html`).

### 5. Deploy

Railway akan otomatis deploy setiap kali ada push ke branch `main`.

## Survey Questions

Aplikasi ini mengimplementasikan 26 pertanyaan yang dibagi menjadi 6 seksi:

- **A. Profil Pengunjung** (Q1-6): Nama, usia, gender, domisili, HP, consent promo
- **B. Kebiasaan Kunjungan** (Q7-9): Frekuensi, tujuan, pendamping
- **C. Kuliner & Tenant F&B** (Q10-13): Variasi makanan, tenant diinginkan, faktor pilihan
- **D. Hiburan, Event & Aktivitas** (Q14-18): Area hiburan, event, waktu ideal
- **E. Promo & Media Informasi** (Q19-23): Promosi, durasi, pengeluaran, sumber info
- **F. Evaluasi Pengalaman** (Q24-26): Kepuasan, saran, niat berkunjung ulang

## Scripts

```bash
npm run dev      # Development server (port 5173)
npm run build    # Production build
npm run preview  # Preview production build
npm run start    # Serve production build (Railway)
```

## License

Private — Pekanbaru Xchange Mall Internal Use Only
