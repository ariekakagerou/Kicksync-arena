/* ============================================================
   YouthTrigger Arena — Static Data (All 3 Roles)
   File: js/data.js
   ============================================================ */

/* ===== ROLE PROFILES ===== */
const ROLES = {
  visitor: {
    id: 'visitor',
    label: 'Pengunjung',
    name: 'Tamu / Pengunjung',
    description: 'Jelajahi akademi kami',
    icon: '👁️',
    color: 'text-sky-400',
    btnCls: 'border-sky-400/40 hover:bg-sky-400/15',
    selectedCls: 'bg-sky-400/20 border-sky-400 shadow-sky',
  },
  player: {
    id: 'player',
    label: 'Siswa',
    name: 'Farhan Ramadhan',
    fullName: 'Farhan Ramadhan Putra',
    description: 'U-16 Attacking Midfielder',
    icon: '⚽',
    initials: 'FR',
    number: '10',
    squadAge: 'U-16',
    team: 'U-16 Squad · Attacking Midfielder',
    badge: '⚽ SISWA · #10',
    badgeCls: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    roleColor: 'text-emerald-400',
    avatarBg: 'bg-sky-500',
    avatarText: 'text-white',
    color: 'text-emerald-400',
    btnCls: 'border-emerald-400/40 hover:bg-emerald-400/15',
    selectedCls: 'bg-emerald-400/20 border-emerald-400 shadow-emerald',
    fitness: 94,
    fitnessLabel: 'Very Good',
    attendance: 94,
    goals: 7,
    assists: 5,
    matchesPlayed: 12,
    status: 'Online · Latihan Aktif',
    inputPlaceholder: 'Kirim pesan ke skuad atau tanya Coach...',
  },
  coach: {
    id: 'coach',
    label: 'Pelatih',
    name: 'Coach Hendra',
    fullName: 'Hendra Saputra, S.Or.',
    description: 'Head Coach · YouthTrigger Academy',
    icon: '👨‍💼',
    initials: 'CH',
    number: '1',
    team: 'YouthTrigger Academy · Head Coach',
    badge: '👑 HEAD COACH',
    badgeCls: 'bg-amber-400/20 text-amber-300 border border-amber-400/20',
    roleColor: 'text-amber-400',
    avatarBg: 'bg-amber-400',
    avatarText: 'text-zinc-900',
    color: 'text-amber-400',
    btnCls: 'border-amber-400/40 hover:bg-amber-400/15',
    selectedCls: 'bg-amber-400/20 border-amber-400 shadow-amber',
    fitness: 100,
    fitnessLabel: 'Excellent',
    attendance: 100,
    status: 'Online · Di Lapangan',
    inputPlaceholder: 'Kirim instruksi, formasi, atau pengumuman ke tim...',
  },
  admin: {
    id: 'admin',
    label: 'Admin',
    name: 'Bambang Sudirman (Super Admin)',
    fullName: 'Bambang Sudirman, M.Pd.',
    description: 'Head of Academy Operations & Digital System',
    icon: '⚡',
    initials: 'BS',
    number: 'SA',
    team: 'YouthTrigger HQ · Operations & IT',
    badge: '⚡ SUPER ADMIN',
    badgeCls: 'bg-violet-500/20 text-violet-300 border border-violet-500/30',
    roleColor: 'text-violet-400',
    avatarBg: 'bg-violet-500',
    avatarText: 'text-white',
    color: 'text-violet-400',
    btnCls: 'border-violet-400/40 hover:bg-violet-400/15',
    selectedCls: 'bg-violet-400/20 border-violet-400 shadow-violet',
    status: 'Online · Master Console',
    inputPlaceholder: 'Ketik perintah sistem, broadcast, atau cari data...',
  }
};

/* ===== ACADEMY STATS ===== */
const ACADEMY_STATS = [
  { icon: '👥', value: '58',  label: 'Total Siswa Aktif' },
  { icon: '🏆', value: '12',  label: 'Trofi Diraih' },
  { icon: '⚽', value: '73%', label: 'Win Rate Musim Ini' },
  { icon: '📅', value: '15',  label: 'Pertandingan Dimainkan' },
];

/* ===== FEATURED PLAYERS (Visitor view) ===== */
const FEATURED_PLAYERS = [
  { name: 'Farhan Ramadhan', pos: 'Attacking Midfielder', squad: 'U-16', number: '10', initials: 'FR', bg: 'bg-sky-500', goals: 7, assists: 5, rating: 8.4 },
  { name: 'Azzam Zaky',      pos: 'Right Winger',         squad: 'U-16', number: '7',  initials: 'AZ', bg: 'bg-purple-500', goals: 9, assists: 3, rating: 8.1 },
  { name: 'Dani Pratama',    pos: 'Centre Back',          squad: 'U-18', number: '5',  initials: 'DP', bg: 'bg-blue-500',   goals: 1, assists: 2, rating: 7.9 },
];

/* ===== PUBLIC MATCH FIXTURES ===== */
const PUBLIC_FIXTURES = [
  {
    home: 'YouthTrigger Academy', homeShort: 'KSA', homeIcon: '⚽',
    away: 'Garuda Muda FC',   awayShort: 'GMF', awayIcon: '🦅',
    date: 'Sabtu, 15 Nov 2026', time: '16:00 WIB', venue: 'Stadion Patriot, Bekasi',
    type: 'Friendly Match', status: 'upcoming', squad: 'U-16',
  },
  {
    home: 'Putra Nusantara', homeShort: 'PN', homeIcon: '🌴',
    away: 'YouthTrigger Academy', awayShort: 'KSA', awayIcon: '⚽',
    date: 'Rabu, 19 Nov 2026', time: '15:30 WIB', venue: 'Lapangan Merdeka',
    type: 'Liga Junior Jabar', status: 'upcoming', squad: 'U-14',
  },
  {
    home: 'YouthTrigger Academy', homeShort: 'KSA', homeIcon: '⚽',
    away: 'Bintang Muda',    awayShort: 'BM', awayIcon: '⭐',
    date: 'Sabtu, 22 Nov 2026', time: '10:00 WIB', venue: 'Stadion Patriot, Bekasi',
    type: 'Friendly Match', status: 'upcoming', squad: 'U-18',
  },
];

/* ===== ACADEMY NEWS (Visitor) ===== */
const ACADEMY_NEWS = [
  { tag: 'Prestasi', icon: '🏆', title: 'U-16 Raih Juara 2 Liga Junior Jawa Barat 2026', desc: 'Tim U-16 YouthTrigger Academy berhasil meraih posisi runner-up setelah berjuang keras melawan 24 tim dari seluruh Jawa Barat.', date: '10 Nov 2026' },
  { tag: 'Rekrutmen', icon: '📢', title: 'Pendaftaran Siswa Baru Gelombang 2 Dibuka', desc: 'YouthTrigger Academy membuka kesempatan bagi talenta muda usia 10-18 tahun. Seleksi diadakan setiap Sabtu pukul 08:00 WIB.', date: '8 Nov 2026' },
  { tag: 'Fasilitas', icon: '🏟️', title: 'Lapangan Utama Resmi Berstandar FIFA', desc: 'Kami dengan bangga mengumumkan lapangan utama YouthTrigger Center kini telah memenuhi standar FIFA Quality Pro.', date: '1 Nov 2026' },
];

/* ===== SQUAD ROSTER (Coach view) ===== */
const SQUAD_ROSTER = [
  { name: 'Farhan Ramadhan', number: 10, pos: 'Attacking Mid', squad: 'U-16', initials: 'FR', bg: 'bg-sky-500', text: 'text-white',    fitness: 94, attendance: 94, status: 'active' },
  { name: 'Azzam Zaky',      number: 7,  pos: 'Right Winger',  squad: 'U-16', initials: 'AZ', bg: 'bg-purple-500', text: 'text-white', fitness: 88, attendance: 91, status: 'active' },
  { name: 'Raffi Dinata',    number: 3,  pos: 'Left Back',     squad: 'U-16', initials: 'RD', bg: 'bg-lime-500',   text: 'text-zinc-900', fitness: 92, attendance: 96, status: 'active' },
  { name: 'Bagas Kurniawan', number: 9,  pos: 'Striker',       squad: 'U-16', initials: 'BK', bg: 'bg-red-500',    text: 'text-white', fitness: 70, attendance: 78, status: 'injured' },
  { name: 'Dimas Aditya',    number: 11, pos: 'Left Winger',   squad: 'U-16', initials: 'DA', bg: 'bg-orange-500', text: 'text-white', fitness: 85, attendance: 85, status: 'active' },
  { name: 'Rizki Pratama',   number: 1,  pos: 'Goalkeeper',    squad: 'U-16', initials: 'RP', bg: 'bg-zinc-500',   text: 'text-white', fitness: 97, attendance: 100, status: 'active' },
];

/* ===== TRAINING SESSIONS (Coach view) ===== */
const TRAINING_SESSIONS = [
  { title: 'High Pressing & Transition Drills', time: '06:30 WIB', duration: '2 jam', location: 'Lapangan Utama', squad: 'U-16', present: 18, total: 22, status: 'active' },
  { title: 'Finishing & Shooting Practice',     time: '09:00 WIB', duration: '1.5 jam', location: 'Lapangan B', squad: 'U-14', present: 16, total: 18, status: 'upcoming' },
  { title: 'Tactical Video Analysis',           time: '15:00 WIB', duration: '1 jam', location: 'Ruang Meeting', squad: 'U-16', present: 0,  total: 22, status: 'scheduled' },
];

/* ===== CHAT MESSAGES ===== */
const CHAT_MESSAGES = [
  {
    name: 'Coach Hendra', initials: 'CH', avatarBg: 'bg-amber-400', avatarText: 'text-zinc-900',
    badgeText: '👑 HEAD COACH', badgeCls: 'bg-amber-400/20 text-amber-300 border border-amber-400/20',
    time: '08:15 AM',
    text: 'Selamat pagi tim! 🌅 Hari ini sesi latihan fokus pada <span class="text-emerald-400 font-semibold">High Pressing &amp; Transition Drill</span>. Kalian harus hadir pukul 06:30. Siapkan mental untuk matchday Sabtu! 💪',
    reactions: [], attachment: null, isAnnouncement: true,
  },
  {
    name: 'Coach Hendra', initials: 'CH', avatarBg: 'bg-amber-400', avatarText: 'text-zinc-900',
    badgeText: '👑 HEAD COACH', badgeCls: 'bg-amber-400/20 text-amber-300 border border-amber-400/20',
    time: '08:17 AM',
    text: 'Ini formasi kita untuk Sabtu. Studi baik-baik ya 👇',
    reactions: [], attachment: 'tactical-board',
  },
  {
    name: 'Farhan Ramadhan', initials: 'FR', avatarBg: 'bg-sky-500', avatarText: 'text-white',
    badgeText: '⚽ SISWA · #10', badgeCls: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    time: '08:22 AM',
    text: 'Siap Coach! Posisi #10 di tengah, saya pastikan pressing tinggi dan maintain possession dengan baik 🔥',
    reactions: [{ emoji: '👍', count: 5 }, { emoji: '🔥', count: 3 }], attachment: null,
  },
  {
    name: 'Azzam Zaky', initials: 'AZ', avatarBg: 'bg-purple-500', avatarText: 'text-white',
    badgeText: '⚽ SISWA · #7', badgeCls: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    time: '08:30 AM',
    text: 'Coach, untuk transisi defensif apakah kita pakai <span class="bg-zinc-800 text-emerald-400 rounded px-1 font-mono text-xs">gegenpressing</span> saat kehilangan bola di area tengah?',
    reactions: [], attachment: null,
  },
  {
    name: 'Coach Hendra', initials: 'CH', avatarBg: 'bg-amber-400', avatarText: 'text-zinc-900',
    badgeText: '👑 HEAD COACH', badgeCls: 'bg-amber-400/20 text-amber-300 border border-amber-400/20',
    time: '08:35 AM',
    text: 'Betul! Langsung press dalam 5 detik pertama setelah kehilangan bola di half final 3rd. Kalau di area sendiri, tahan dan set ulang defensive block dulu 🎯',
    reactions: [], attachment: null,
    quoteFrom: 'Azzam Zaky', quoteText: 'untuk transisi defensif apakah kita pakai gegenpressing...',
  },
  {
    name: 'Raffi Dinata', initials: 'RD', avatarBg: 'bg-lime-500', avatarText: 'text-zinc-900',
    badgeText: '⚽ SISWA · #3', badgeCls: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    time: '08:42 AM',
    text: 'Copy Coach! Kita semua ready. Lawan Garuda Muda pasti kita taklukkan! 💪⚽ <span class="text-emerald-400">#YouthTriggerArena</span>',
    reactions: [{ emoji: '💪', count: 8 }], attachment: null, delivered: true,
  },
];

/* ===== AUTO REPLIES ===== */
const AUTO_REPLIES = [
  { name: 'Coach Hendra', initials: 'CH', avatarBg: 'bg-amber-400', avatarText: 'text-zinc-900',
    badgeText: '👑 HEAD COACH', badgeCls: 'bg-amber-400/20 text-amber-300 border border-amber-400/20',
    messages: ['Bagus! Terus semangat dan fokus menjelang matchday! 🏆','Mantap! Itulah semangat yang kita butuhkan. ⚡','Siap. Kita review video analysis nanti sore. 🎥'] },
  { name: 'Azzam Zaky', initials: 'AZ', avatarBg: 'bg-purple-500', avatarText: 'text-white',
    badgeText: '⚽ SISWA · #7', badgeCls: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    messages: ['Setuju! Kita harus solid sebagai tim 💪','Formation 4-3-3 cocok banget buat pressing agresif! 🔥','Gas terus! Siap maksimalkan setiap kesempatan!'] },
  { name: 'Raffi Dinata', initials: 'RD', avatarBg: 'bg-lime-500', avatarText: 'text-zinc-900',
    badgeText: '⚽ SISWA · #3', badgeCls: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    messages: ['Siap! Formation sudah dipelajari. Ayo kemenangan! 🔥','LB siap backup serangan dan solid di pertahanan! 💚','Kita latihan full power biar Sabtu tampil prima!'] },
];

/* ============================================================
   KSA_STORE — Shared Ecosystem Store (Single Source of Truth)
   Integrates Public Registrations, Admin Operations, Coaches, & Players
   ============================================================ */
const KSA_STORE = (() => {
  const _registrations = [
    {
      id: 'KSA-REG-2026-0812',
      name: 'Rian Hidayat',
      nickname: 'Rian',
      gender: 'L',
      dob: '2014-04-12',
      ageGroup: 'U-12',
      program: 'Elite Development Academy',
      position: 'Gelandang Bertahan (CDM)',
      preferredFoot: 'Kanan',
      height: 146, weight: 38,
      guardianName: 'Bambang Hidayat',
      guardianPhone: '081234567890',
      guardianRelation: 'Ayah Kandung',
      guardianJob: 'Wiraswasta',
      address: 'Jl. Melati Raya No. 14, Bekasi Barat',
      healthNotes: 'Tidak ada riwayat asma atau cedera berat.',
      bloodType: 'O',
      regDate: '2026-11-10',
      status: 'Waiting for Selection', // Pending, Under Review, Waiting for Selection, Approved, Rejected
      selectionScore: { passing: 82, dribbling: 78, speed: 85, stamina: 80, attitude: 90 },
      selectionNotes: 'Visi bermain sangat baik, postur ideal untuk U-12.',
      documents: { akta: true, kk: true, sehat: true }
    },
    {
      id: 'KSA-REG-2026-0813',
      name: 'Kenzo Alvaro',
      nickname: 'Kenzo',
      gender: 'L',
      dob: '2016-08-20',
      ageGroup: 'U-10',
      program: 'Grassroots Foundation',
      position: 'Penyerang Sayap (LW)',
      preferredFoot: 'Kiri',
      height: 134, weight: 30,
      guardianName: 'Dewi Lestari',
      guardianPhone: '081398765432',
      guardianRelation: 'Ibu Kandung',
      guardianJob: 'Dokter',
      address: 'Cluster Harmoni Blok C No. 5, Jakasampurna',
      healthNotes: 'Alergi dingin ringan, obat darurat selalu siap.',
      bloodType: 'A',
      regDate: '2026-11-12',
      status: 'Under Review',
      selectionScore: null,
      selectionNotes: 'Menunggu berkas verifikasi dari puskesmas.',
      documents: { akta: true, kk: true, sehat: false }
    },
    {
      id: 'KSA-REG-2026-0814',
      name: 'Fikri Haikal',
      nickname: 'Fikri',
      gender: 'L',
      dob: '2012-02-15',
      ageGroup: 'U-14',
      program: 'Tactical Pathway',
      position: 'Bek Tengah (CB)',
      preferredFoot: 'Kanan',
      height: 162, weight: 52,
      guardianName: 'Ahmad Syukri',
      guardianPhone: '085712345678',
      guardianRelation: 'Ayah Kandung',
      guardianJob: 'PNS',
      address: 'Komplek PU No. 8, Cikarang',
      healthNotes: 'Kondisi fisik prima, pernah cedera engkel 2024 sudah sembuh total.',
      bloodType: 'B',
      regDate: '2026-11-13',
      status: 'Approved',
      selectionScore: { passing: 79, dribbling: 75, speed: 82, stamina: 88, attitude: 86 },
      selectionNotes: 'Duel udara sangat tangguh, kepemimpinan defensif menonjol.',
      documents: { akta: true, kk: true, sehat: true }
    },
    {
      id: 'KSA-REG-2026-0815',
      name: 'Taufik Rahman',
      nickname: 'Taufik',
      gender: 'L',
      dob: '2010-09-05',
      ageGroup: 'U-16',
      program: 'Elite Development Academy',
      position: 'Penyerang Tengah (CF)',
      preferredFoot: 'Kanan',
      height: 172, weight: 64,
      guardianName: 'Suryanto',
      guardianPhone: '082133445566',
      guardianRelation: 'Ayah Kandung',
      guardianJob: 'Karyawan Swasta',
      address: 'Jl. Ahmad Yani No. 88, Bekasi Selatan',
      healthNotes: 'Bebas cedera, riwayat medis bersih.',
      bloodType: 'AB',
      regDate: '2026-11-14',
      status: 'Pending',
      selectionScore: null,
      selectionNotes: 'Baru mendaftar melalui website utama.',
      documents: { akta: true, kk: true, sehat: true }
    },
    {
      id: 'KSA-REG-2026-0816',
      name: 'Alif Kurniawan',
      nickname: 'Alif',
      gender: 'L',
      dob: '2018-05-10',
      ageGroup: 'U-8',
      program: 'Grassroots Fun Football',
      position: 'Gelandang Serang (CAM)',
      preferredFoot: 'Kanan',
      height: 122, weight: 24,
      guardianName: 'Ratna Sari',
      guardianPhone: '081912340099',
      guardianRelation: 'Ibu Kandung',
      guardianJob: 'Ibu Rumah Tangga',
      address: 'Perum Galaxy Prima No. 2, Bekasi Timur',
      healthNotes: 'Sehat dan sangat aktif.',
      bloodType: 'O',
      regDate: '2026-11-15',
      status: 'Pending',
      selectionScore: null,
      selectionNotes: 'Pendaftaran gelombang 2 terbaru.',
      documents: { akta: true, kk: true, sehat: true }
    }
  ];

  const _auditLogs = [
    {
      id: 'LOG-1092',
      timestamp: '2026-11-15 08:30:14',
      user: 'Bambang Sudirman (Super Admin)',
      role: 'Super Admin',
      module: 'Pendaftaran & Seleksi',
      action: 'APPROVE',
      detail: 'Menyetujui pendaftaran KSA-REG-2026-0814 (Fikri Haikal) ke skuad U-14.'
    },
    {
      id: 'LOG-1091',
      timestamp: '2026-11-15 07:15:00',
      user: 'Coach Hendra Saputra',
      role: 'Coach',
      module: 'Absensi Siswa',
      action: 'UPDATE',
      detail: 'Input absensi 18 siswa sesi latihan High Pressing U-16.'
    },
    {
      id: 'LOG-1090',
      timestamp: '2026-11-14 16:45:22',
      user: 'Bambang Sudirman (Super Admin)',
      role: 'Super Admin',
      module: 'Jadwal Latihan',
      action: 'CREATE',
      detail: 'Menambahkan jadwal pertandingan persahabatan vs Bintang Muda U-18.'
    },
    {
      id: 'LOG-1089',
      timestamp: '2026-11-14 11:20:05',
      user: 'Coach Hendra Saputra',
      role: 'Coach',
      module: 'Evaluasi Siswa',
      action: 'UPDATE',
      detail: 'Memperbarui nilai radar skill siswa #10 Farhan Ramadhan (Overall: 80.3).'
    },
    {
      id: 'LOG-1088',
      timestamp: '2026-11-14 09:00:12',
      user: 'Sistem Otomatis',
      role: 'System',
      module: 'Pendaftaran Siswa',
      action: 'REGISTER',
      detail: 'Form pendaftaran baru online diterima: KSA-REG-2026-0815 (Taufik Rahman).'
    }
  ];

  const _coaches = [
    {
      id: 'COACH-01',
      name: 'Hendra Saputra, S.Or.',
      role: 'Head Coach & Technical Director',
      license: 'AFC A Coaching License',
      specialty: 'High Pressing & Offensive Transition',
      assignedSquads: ['U-16', 'U-18'],
      experience: '12 Tahun (Eks Pemain Liga 1 & Pelatih Akademi Pro)',
      phone: '081122334455',
      email: 'hendra.saputra@youthtrigger.id',
      status: 'Aktif',
      avatarBg: 'bg-amber-400',
      initials: 'CH'
    },
    {
      id: 'COACH-02',
      name: 'Budi Santoso, M.Pd.',
      role: 'Senior Youth Coach',
      license: 'AFC B Coaching License',
      specialty: 'Ball Mastery, Agility & Small Sided Games',
      assignedSquads: ['U-12', 'U-14'],
      experience: '9 Tahun (Spesialis Pembinaan Usia Dini Grassroots)',
      phone: '081233445566',
      email: 'budi.santoso@youthtrigger.id',
      status: 'Aktif',
      avatarBg: 'bg-emerald-500',
      initials: 'BS'
    },
    {
      id: 'COACH-03',
      name: 'Anita Wijaya, S.Pd.',
      role: 'Goalkeeping Specialist Coach',
      license: 'PSSI C & AFC Goalkeeping Level 1',
      specialty: 'GK Positioning, Reflexes & Footwork',
      assignedSquads: ['Semua Kelompok Usia (U-10 s/d U-18)'],
      experience: '7 Tahun (Eks Kiper Timnas Putri Indonesia)',
      phone: '081344556677',
      email: 'anita.wijaya@youthtrigger.id',
      status: 'Aktif',
      avatarBg: 'bg-sky-500',
      initials: 'AW'
    },
    {
      id: 'COACH-04',
      name: 'Rio Pratama, CPT.',
      role: 'Strength & Conditioning Coach',
      license: 'CSCS & AFC Physical Fitness Level 1',
      specialty: 'Endurance, Speed Mechanics & Injury Prevention',
      assignedSquads: ['U-14', 'U-16', 'U-18'],
      experience: '8 Tahun (Kinesiology & Performance Specialist)',
      phone: '081455667788',
      email: 'rio.pratama@youthtrigger.id',
      status: 'Aktif',
      avatarBg: 'bg-rose-500',
      initials: 'RP'
    },
    {
      id: 'COACH-05',
      name: 'Doni Setiawan, S.Pd.',
      role: 'Grassroots Coach (U-8 & U-10)',
      license: 'PSSI D License & Grassroots Certificate',
      specialty: 'Fun-Based Football, Motor Coordination & Sportsmanship',
      assignedSquads: ['U-8', 'U-10'],
      experience: '6 Tahun (Edukasi Olahraga Anak Usia Dini)',
      phone: '081566778899',
      email: 'doni.setiawan@youthtrigger.id',
      status: 'Aktif',
      avatarBg: 'bg-purple-500',
      initials: 'DS'
    },
    {
      id: 'COACH-06',
      name: 'Fachri Husaini Pratama',
      role: 'Tactical & Match Analyst',
      license: 'AFC C License & Performance Video Analyst',
      specialty: 'Opposition Analysis, Set-Piece Design & Telemetry',
      assignedSquads: ['U-16', 'U-18'],
      experience: '5 Tahun (Video Analyst Kompetisi Remaja Nasional)',
      phone: '081677889900',
      email: 'fachri.h@youthtrigger.id',
      status: 'Aktif',
      avatarBg: 'bg-indigo-500',
      initials: 'FH'
    }
  ];

  return {
    get registrations() { return _registrations; },
    get auditLogs()      { return _auditLogs; },
    get coaches()        { return _coaches; },

    addRegistration(data) {
      const regId = `KSA-REG-2026-${Math.floor(Math.random() * 8999 + 1000)}`;
      const newEntry = {
        id: regId,
        name: data.name || 'Calon Siswa',
        nickname: data.nickname || data.name?.split(' ')[0] || 'Siswa',
        gender: data.gender || 'L',
        dob: data.dob || '2014-06-01',
        ageGroup: data.ageGroup || 'U-12',
        program: data.program || 'Elite Development Academy',
        position: data.position || 'Gelandang (Midfielder)',
        preferredFoot: data.preferredFoot || 'Kanan',
        height: data.height || 145,
        weight: data.weight || 38,
        guardianName: data.guardianName || 'Orang Tua / Wali',
        guardianPhone: data.guardianPhone || data.phone || '08xxxxxxxxxx',
        guardianRelation: data.guardianRelation || 'Orang Tua',
        guardianJob: data.guardianJob || 'Wiraswasta',
        address: data.address || 'Bekasi / Jabodetabek',
        healthNotes: data.healthNotes || 'Kondisi fisik normal, siap berolahraga.',
        bloodType: data.bloodType || 'O',
        regDate: new Date().toISOString().slice(0, 10),
        status: 'Pending',
        selectionScore: null,
        selectionNotes: 'Pendaftaran mandiri melalui Public Portal.',
        documents: { akta: true, kk: true, sehat: true }
      };
      _registrations.unshift(newEntry);

      this.addAuditLog(
        'Sistem Online (Publik)',
        'Public',
        'Pendaftaran Siswa',
        'REGISTER',
        `Pendaftaran online baru ${newEntry.name} (${newEntry.id}) untuk kelompok ${newEntry.ageGroup}.`
      );

      return newEntry;
    },

    updateRegistrationStatus(id, newStatus, notes = '') {
      const item = _registrations.find(r => r.id === id);
      if (item) {
        item.status = newStatus;
        if (notes) item.selectionNotes = notes;
        this.addAuditLog(
          'Bambang Sudirman (Super Admin)',
          'Super Admin',
          'Pendaftaran & Seleksi',
          'UPDATE_STATUS',
          `Mengubah status pendaftaran ${item.name} (${item.id}) menjadi: ${newStatus}.`
        );
        return true;
      }
      return false;
    },

    addAuditLog(user, role, module, action, detail) {
      const logId = `LOG-${Math.floor(Math.random() * 8999 + 1000)}`;
      const now = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      const timestamp = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      _auditLogs.unshift({
        id: logId,
        timestamp,
        user,
        role,
        module,
        action,
        detail
      });
      if (_auditLogs.length > 100) _auditLogs.pop();
    }
  };
})();
