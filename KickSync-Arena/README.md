# YouthTrigger Arena ⚽
> Soccer Academy Management & Real-Time Locker Room Community Platform
> Terintegrasi dengan Backend API **Youth Tiger Soccer School (Node.js & Express)**

YouthTrigger Arena menghadirkan platform interaktif modern berbasis web yang dirancang khusus untuk mengelola akademi sepak bola modern dengan 3 sudut pandang (role) terpadu: **Pengunjung (Publik)**, **Siswa (Atlet Farhan Ramadhan #10)**, dan **Pelatih (Head Coach Hendra)**, serta terhubung langsung ke REST API Backend.

---

## 🚀 Cara Menjalankan Frontend & Backend

### 1. Menjalankan Backend API (Port 3000)
Tersedia skrip 1-klik untuk menjalankan backend server:
```bash
# Opsi 1: Klik dua kali file start-backend.bat
start-backend.bat

# Opsi 2: Jalankan via terminal
cd "../Youth-Tiger-Soccer-School-back-end-"
npm start
```

Backend akan otomatis berjalan di:
- **API URL**: `http://localhost:3000/api`
- **Health Check**: `http://localhost:3000/api/health`
- **Interactive Swagger Docs**: `http://localhost:3000/api-docs`
- **Smart Hybrid Database**: Terhubung ke MySQL jika aktif di port 3306, atau otomatis berpindah ke *In-Memory Resilient Store* jika MySQL belum dijalankan sehingga backend **tidak pernah crash**.

### 2. Menjalankan Frontend
Cukup buka file `index.html` langsung di browser Anda (Chrome, Edge, Firefox, Brave):
```
file:///C:/Users/LENOVO/YouthTrigger%20Arena/KickSync-Arena/index.html
```
Atau klik ganda `index.html`.

---

## 🔗 Arsitektur Integrasi Frontend & Backend

Frontend terhubung ke backend melalui modul `js/api.js`:

| Fitur Frontend | Endpoint Backend | Metode HTTP | Deskripsi |
|---|---|:---:|---|
| **Health Check** | `/api/health` | `GET` | Memantau status server & database secara real-time. |
| **Pendaftaran Siswa Baru** | `/api/student` | `POST` | Menyimpan data pendaftaran calon atlet baru dan mengembalikan `id_student` resmi (cth: `YRA...`). |
| **Daftar Skuad Siswa** | `/api/student` | `GET` | Mengambil data seluruh atlet yang terdaftar di database. |
| **Login Siswa** | `/api/student/login` | `POST` | Autentikasi siswa dengan email dan tanggal lahir. |
| **Daftar Pelatih** | `/api/coach` | `GET` | Mengambil data profil tim pelatih. |
| **Login Pelatih** | `/api/coach/login` | `POST` | Autentikasi pelatih dengan email dan nomor HP. |
| **Jadwal & Drill Latihan** | `/api/schedule` | `GET` & `POST` | Mengambil dan membuat jadwal drill latihan & pertandingan. |
| **Pengumuman & Berita** | `/api/information` | `GET` & `POST` | Mengambil dan menyiarkan pengumuman resmi ke seluruh tim. |
| **Asesmen Performa** | `/api/assessment` | `GET` | Mengambil radar nilai teknik, fisik, dan taktik atlet. |

> 💡 **Resilience / Fallback Otomatis**: Jika backend belum dihidupkan, frontend tetap dapat berjalan 100% mulus menggunakan data lokal interaktif dengan status indikator `API: Standby`. Saat backend dinyalakan, status otomatis berubah menjadi `🟢 API: Online` tanpa perlu me-reload halaman!

---

## 🌟 3 Tampilan Terpadu (Multi-Role Experience)

### 1. 👁️ Tampilan Pengunjung (Public Landing & Scouting)
- **Tampilan Beranda Berstandar Mockup**: Hero banner dengan pemain akademi YouthTrigger berjalan ke lapangan stadion modern, aksen neon hijau cybernetic, dan 4 kartu navigasi di bagian bawah.
- **Formulir Pendaftaran Siswa Baru (Terkoneksi API)**: Input nama, kelompok umur (U-10, U-14, U-16, U-18), posisi bermain, dan nomor WhatsApp wali yang langsung tersimpan ke backend.
- **Papan Kartu Scouting Talenta**: Atribut radar performa (Pace, Passing, Finishing, Agility, Stamina).
- **Kalender Pertandingan & Agenda**: Jadwal laga resmi dan agenda kegiatan seleksi.

### 2. ⚽ Tampilan Siswa (Farhan Ramadhan — U-16 Midfielder)
- **💬 Locker Room Real-Time Chat**: Chat interaktif dengan badge peran, lampiran papan taktik 4-3-3, indikator mengetik, dan balasan otomatis simulasi.
- **📊 Tab Statistik & Telemetri**: Gol, assist, rasio starter, dan log laga terakhir.
- **📅 Tab Jadwal & Absensi (RSVP)**: Konfirmasi kehadiran latihan dengan tombol interaktif **"Hadir"** atau **"Izin"**.
- **🏅 Tab Prestasi & Lencana (Milestone)**: Koleksi lencana *On Fire Striker*, *Master Playmaker*, dan *Lightning Sprinter*.
- **Match Countdown**: Live countdown timer kickoff match vs Garuda Muda FC.

### 3. 👨‍💼 Tampilan Pelatih (Head Coach Hendra)
- **👥 Tab Manajemen Skuad & Roster**: Tabel pemain tersinkronisasi dengan database backend, filter status medis (Fit/Cedera), dan modal tambah pemain baru yang mem-POST ke API `/api/student`.
- **📅 Tab Sesi Latihan & Absensi**: Silabus drill latihan harian dengan progress bar kehadiran dan modal catat absensi atlet.
- **📋 Tab Papan Formasi & Lineup 4-3-3**: Lapangan hijau taktik interaktif: klik pada setiap posisi pemain untuk melihat instruksi khusus, serta tombol **"Share Lineup ke Locker Room"**.
- **📊 Tab Analitik Tim**: Statistik win rate 73%, sebaran menit gol tercipta, dan catatan evaluasi pelatih.
- **📢 Mode Pengumuman Resmi**: Broadcast instan instruksi pelatih yang tersimpan di backend `/api/information` dan muncul di chat tim.

---

## 📁 Struktur File Lengkap

```
YouthTrigger Arena/
│
├── YouthTrigger Arena/                           ← FRONTEND APPLICATION
│   ├── index.html                            ← Root entry point
│   ├── README.md                             ← Dokumentasi integrasi
│   ├── start-backend.bat                     ← Pintasan 1-klik jalankan backend
│   │
│   ├── assets/
│   │   └── hero-bg.jpg                       ← Foto latar belakang stadion & akademi
│   │
│   ├── css/
│   │   └── style.css                         ← Tema Modern Athletic Tech, Glassmorphism, Neon
│   │
│   └── js/
│       ├── api.js                            ← Client terpadu REST API (Port 3000)
│       ├── data.js                           ← Data awal & fallback
│       ├── state.js                          ← Global reactive state & modal system
│       ├── app.js                            ← View router
│       │
│       ├── components/
│       │   ├── header.js                     ← Navbar mockup & Backend status pill
│       │   ├── chat.js                       ← Engine chat ruang ganti
│       │   ├── sidebar.js                    ← Sidebar navigasi
│       │   ├── rightPanel.js                 ← Telemetri & widget
│       │   └── mobileNav.js                  ← Tab bar mobile
│       │
│       └── views/
│           ├── visitor.js                    ← Tampilan Pengunjung (Mockup exact)
│           ├── player.js                     ← Dashboard Siswa (4 Tab)
│           └── coach.js                      ← Dashboard Pelatih (4 Tab)
│
└── Youth-Tiger-Soccer-School-back-end-/      ← BACKEND REST API
    ├── server.js                             ← Express server, CORS & health endpoint
    ├── start-backend.bat                     ← Skrip jalankan server
    ├── swagger.js                            ← Dokumentasi interaktif Swagger
    ├── config/
    │   └── db.js                             ← Smart Hybrid DB (MySQL + In-Memory Fallback)
    ├── student/                              ← Modul Siswa (Routes, Controllers, Services)
    ├── coach/                                ← Modul Pelatih
    ├── schedule/                             ← Modul Jadwal & Latihan
    ├── information/                          ← Modul Pengumuman & Berita
    └── assessment/                           ← Modul Asesmen Nilai Atlet
```

---

*Dikembangkan untuk YouthTrigger Arena & Youth Tiger Soccer School Platform*
