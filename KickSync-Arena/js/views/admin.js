/* ============================================================
   YouthTrigger Arena — ADMIN MANAGEMENT PORTAL (v4.0)
   Role: Super Admin & Operational Admin
   File: js/views/admin.js
   ============================================================ */

const AdminView = (() => {

  let _adminPage = 'dashboard';
  let _selectedStudentId = null;
  let _studentTab = 'pribadi'; // 'pribadi', 'wali', 'bola', 'latihan', 'absensi', 'evaluasi', 'laga', 'prestasi'
  let _studentAgeFilter = 'all';
  let _studentStatusFilter = 'all';
  let _studentSearchQuery = '';
  let _regFilter = 'all';

  // Master local student database (initialized with rich details for 8-tab view)
  const _students = [
    {
      id: 'KSA-U16-010',
      nis: '2024-U16-010',
      name: 'Farhan Ramadhan Putra',
      nickname: 'Farhan',
      number: 10,
      pos: 'Gelandang Serang (CAM)',
      altPos: 'Sayap Kiri (LW)',
      squad: 'U-16',
      initials: 'FR',
      bg: 'bg-sky-500',
      status: 'active', // active, inactive, archived
      dob: '2010-05-15',
      pob: 'Bekasi',
      gender: 'L',
      height: 168,
      weight: 58,
      bloodType: 'O',
      dominantFoot: 'Kanan',
      rating: 8.4,
      attendance: 94.2,
      goals: 7,
      assists: 5,
      matches: 12,
      joinedDate: '2023-01-10',
      coach: 'Coach Hendra Saputra',
      guardian: {
        name: 'Bpk. Rahmat Santoso',
        relation: 'Ayah Kandung',
        phone: '081234567890',
        job: 'Karyawan BUMN',
        address: 'Jl. Boulevard Hijau No. 12, Harapan Indah, Bekasi'
      },
      health: {
        history: 'Pernah keseleo ringan pada lutut kiri (Agustus 2025), pulih 100%.',
        allergies: 'Tidak ada',
        condition: 'Sangat Fit (VO2Max: 54 ml/kg/min)'
      },
      skills: {
        passing: 84, shooting: 78, dribbling: 88, ballControl: 86,
        speed: 82, stamina: 75, tactical: 72, teamwork: 80, discipline: 88
      },
      achievements: [
        'Top Scorer Internal Cup U-16 (2025)',
        'Man of the Match vs Persikasi U-16 (Okt 2026)',
        'Kapten Tim Turnamen Patriot Junior'
      ]
    },
    {
      id: 'KSA-U16-007',
      nis: '2024-U16-007',
      name: 'Azzam Zaky Al-Fatih',
      nickname: 'Azzam',
      number: 7,
      pos: 'Penyerang Sayap (RW)',
      altPos: 'Penyerang Tengah (CF)',
      squad: 'U-16',
      initials: 'AZ',
      bg: 'bg-purple-500',
      status: 'active',
      dob: '2010-03-22',
      pob: 'Jakarta',
      gender: 'L',
      height: 165,
      weight: 54,
      bloodType: 'A',
      dominantFoot: 'Kanan',
      rating: 8.1,
      attendance: 91.0,
      goals: 9,
      assists: 3,
      matches: 11,
      joinedDate: '2023-03-15',
      coach: 'Coach Hendra Saputra',
      guardian: {
        name: 'Bpk. Haryono Al-Fatih',
        relation: 'Ayah Kandung',
        phone: '081388990011',
        job: 'Wiraswasta',
        address: 'Komplek Galaxy Blok B4 No. 19, Bekasi Selatan'
      },
      health: {
        history: 'Tidak ada riwayat cedera serius.',
        allergies: 'Alergi dingin ringan',
        condition: 'Sangat Prima (Top Sprint: 31.4 km/h)'
      },
      skills: {
        passing: 76, shooting: 86, dribbling: 84, ballControl: 80,
        speed: 91, stamina: 82, tactical: 74, teamwork: 77, discipline: 85
      },
      achievements: [
        'Top Speed Record YouthTrigger U-16 (31.4 km/h)',
        'Hat-trick vs Patriot Muda FC'
      ]
    },
    {
      id: 'KSA-U16-003',
      nis: '2024-U16-003',
      name: 'Raffi Dinata',
      nickname: 'Raffi',
      number: 3,
      pos: 'Bek Kiri (LB)',
      altPos: 'Gelandang Bertahan (CDM)',
      squad: 'U-16',
      initials: 'RD',
      bg: 'bg-lime-500',
      status: 'active',
      dob: '2010-07-09',
      pob: 'Bekasi',
      gender: 'L',
      height: 170,
      weight: 60,
      bloodType: 'B',
      dominantFoot: 'Kiri',
      rating: 8.0,
      attendance: 96.0,
      goals: 2,
      assists: 6,
      matches: 12,
      joinedDate: '2023-01-10',
      coach: 'Coach Hendra Saputra',
      guardian: {
        name: 'Ibu Ratna Dinata',
        relation: 'Ibu Kandung',
        phone: '081577665544',
        job: 'PNS',
        address: 'Jl. Merak No. 4, Summarecon Bekasi'
      },
      health: {
        history: 'Kondisi fisik prima dan stabil.',
        allergies: 'Tidak ada',
        condition: 'Daya tahan tinggi'
      },
      skills: {
        passing: 80, shooting: 70, dribbling: 76, ballControl: 81,
        speed: 84, stamina: 89, tactical: 82, teamwork: 85, discipline: 92
      },
      achievements: [
        'Assist Terbanyak Posisi Bek U-16',
        'Presensi Kehadiran 96%'
      ]
    },
    {
      id: 'KSA-U14-008',
      nis: '2024-U14-008',
      name: 'Rafi Pratama Jaya',
      nickname: 'Rafi',
      number: 8,
      pos: 'Gelandang Tengah (CM)',
      altPos: 'Gelandang Serang (CAM)',
      squad: 'U-14',
      initials: 'RP',
      bg: 'bg-sky-500',
      status: 'active',
      dob: '2012-08-14',
      pob: 'Bandung',
      gender: 'L',
      height: 154,
      weight: 46,
      bloodType: 'O',
      dominantFoot: 'Kanan',
      rating: 8.2,
      attendance: 92.5,
      goals: 5,
      assists: 8,
      matches: 10,
      joinedDate: '2024-01-05',
      coach: 'Coach Budi Santoso',
      guardian: {
        name: 'Ibu Dian Pratama',
        relation: 'Ibu Kandung',
        phone: '081299887766',
        job: 'Dosen',
        address: 'Perum Duta Kranji Blok A No. 17'
      },
      health: {
        history: 'Sehat bebas cedera.',
        allergies: 'Tidak ada',
        condition: 'Stamina bagus'
      },
      skills: {
        passing: 85, shooting: 75, dribbling: 82, ballControl: 84,
        speed: 78, stamina: 80, tactical: 81, teamwork: 88, discipline: 86
      },
      achievements: [
        'Kapten Tim U-14',
        'Best Playmaker U-14 Trophy 2025'
      ]
    },
    {
      id: 'KSA-U18-001',
      nis: '2023-U18-001',
      name: 'Dimas Tri Anggoro',
      nickname: 'Dimas',
      number: 1,
      pos: 'Kiper Utama (GK)',
      altPos: 'Kiper',
      squad: 'U-18',
      initials: 'DT',
      bg: 'bg-amber-500',
      status: 'active',
      dob: '2008-11-04',
      pob: 'Bekasi',
      gender: 'L',
      height: 184,
      weight: 74,
      bloodType: 'B',
      dominantFoot: 'Kanan',
      rating: 8.5,
      attendance: 98.0,
      goals: 0,
      assists: 1,
      matches: 15,
      joinedDate: '2022-07-01',
      coach: 'Coach Anita Wijaya & Coach Hendra',
      guardian: {
        name: 'Bpk. Tri Anggoro',
        relation: 'Ayah Kandung',
        phone: '081766554433',
        job: 'TNI / Polisi',
        address: 'Asrama Polri Kranji, Bekasi'
      },
      health: {
        history: 'Dislokasi jari kelingking (2024), sudah sembuh total.',
        allergies: 'Tidak ada',
        condition: 'Refleks mata & jangkauan superior'
      },
      skills: {
        passing: 78, shooting: 60, dribbling: 65, ballControl: 79,
        speed: 75, stamina: 85, tactical: 86, teamwork: 90, discipline: 96
      },
      achievements: [
        '11 Clean Sheets Liga Remaja 2026',
        'Best Goalkeeper Jabar Junior Championship'
      ]
    },
    {
      id: 'KSA-U12-009',
      nis: '2025-U12-009',
      name: 'Rian Hidayat',
      nickname: 'Rian',
      number: 9,
      pos: 'Gelandang Bertahan (CDM)',
      altPos: 'Bek Tengah (CB)',
      squad: 'U-12',
      initials: 'RH',
      bg: 'bg-emerald-500',
      status: 'active',
      dob: '2014-04-12',
      pob: 'Bekasi',
      gender: 'L',
      height: 146,
      weight: 38,
      bloodType: 'O',
      dominantFoot: 'Kanan',
      rating: 7.9,
      attendance: 90.0,
      goals: 3,
      assists: 4,
      matches: 8,
      joinedDate: '2025-02-01',
      coach: 'Coach Budi Santoso',
      guardian: {
        name: 'Bpk. Bambang Hidayat',
        relation: 'Ayah Kandung',
        phone: '081234567890',
        job: 'Wiraswasta',
        address: 'Jl. Melati Raya No. 14, Bekasi Barat'
      },
      health: {
        history: 'Tidak ada riwayat penyakit serius.',
        allergies: 'Tidak ada',
        condition: 'Prima'
      },
      skills: {
        passing: 78, shooting: 72, dribbling: 76, ballControl: 80,
        speed: 80, stamina: 78, tactical: 75, teamwork: 82, discipline: 88
      },
      achievements: [
        'Lulus Seleksi Prestasi U-12 dengan Nilai Tertinggi'
      ]
    }
  ];

  /* ================================================================
     MAIN RENDER FUNCTION
  ================================================================ */
  function render(container) {
    container.innerHTML = `
      <div class="flex h-full w-full overflow-hidden bg-zinc-950 text-zinc-100 font-sans">

        <!-- ================= ADMIN SIDEBAR ================= -->
        <aside class="w-64 flex-shrink-0 flex flex-col border-r border-white/10 hidden md:flex"
          style="background:rgba(9,13,22,0.98);backdrop-filter:blur(20px);">
          
          <!-- Logo & Brand Header -->
          <div class="p-4 border-b border-white/10 flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl gradient-lime flex items-center justify-center font-black text-zinc-950 text-lg shadow-lg">
              ⚡
            </div>
            <div>
              <div class="text-sm font-black text-white tracking-tight">YouthTrigger HQ</div>
              <div class="text-[10px] font-extrabold text-violet-400 tracking-wider uppercase">Admin Portal v4.0</div>
            </div>
          </div>

          <!-- Logged in Admin Profile Badge -->
          <div class="px-4 py-3 bg-violet-950/20 border-b border-violet-500/20 flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-violet-600 text-white font-black text-xs flex items-center justify-center shadow-md">
              SA
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-xs font-bold text-white truncate">Bambang Sudirman</div>
              <div class="text-[10px] text-violet-300 font-semibold flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Super Admin</span>
              </div>
            </div>
          </div>

          <!-- Navigation Links -->
          <nav class="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-thin text-xs">
            
            <!-- Group 1: OVERVIEW -->
            <div>
              <div class="text-[10px] font-extrabold text-zinc-500 px-3 uppercase tracking-wider mb-1">Overview</div>
              ${renderNavItem('dashboard', '📊', 'Dashboard Utama')}
            </div>

            <!-- Group 2: ACADEMY MANAGEMENT -->
            <div>
              <div class="text-[10px] font-extrabold text-zinc-500 px-3 uppercase tracking-wider mb-1">Manajemen Akademi</div>
              ${renderNavItem('students', '👥', 'Data Siswa Binaan')}
              ${renderNavItem('coaches', '👨‍🏫', 'Data Pelatih')}
              ${renderNavItem('ageGroups', '🏷️', 'Kelompok Usia')}
              ${renderNavItem('registrations', '📝', 'Pendaftaran Masuk', KSA_STORE.registrations.filter(r => r.status === 'Pending').length)}
              ${renderNavItem('selection', '🎯', 'Seleksi Siswa Baru')}
            </div>

            <!-- Group 3: OPERATIONS -->
            <div>
              <div class="text-[10px] font-extrabold text-zinc-500 px-3 uppercase tracking-wider mb-1">Operasional Lapangan</div>
              ${renderNavItem('schedules', '📅', 'Jadwal & Kalender')}
              ${renderNavItem('attendance', '📋', 'Rekap Absensi')}
              ${renderNavItem('programs', '⚽', 'Kurikulum Latihan')}
              ${renderNavItem('matches', '🏆', 'Laga & Turnamen')}
              ${renderNavItem('facilities', '🏟️', 'Fasilitas & Alat')}
            </div>

            <!-- Group 4: MONITORING & REPORTING -->
            <div>
              <div class="text-[10px] font-extrabold text-zinc-500 px-3 uppercase tracking-wider mb-1">Monitoring &amp; Hasil</div>
              ${renderNavItem('evaluations', '📈', 'Evaluasi 9 Dimensi')}
              ${renderNavItem('achievements', '🏅', 'Prestasi & Trofi')}
              ${renderNavItem('reports', '📑', 'Laporan & Ekspor Data')}
            </div>

            <!-- Group 5: COMMUNICATION -->
            <div>
              <div class="text-[10px] font-extrabold text-zinc-500 px-3 uppercase tracking-wider mb-1">Komunikasi</div>
              ${renderNavItem('announcements', '📢', 'Pengumuman Broadcast')}
              ${renderNavItem('news', '📰', 'Berita & Galeri Publik')}
            </div>

            <!-- Group 6: SYSTEM MANAGEMENT -->
            <div>
              <div class="text-[10px] font-extrabold text-zinc-500 px-3 uppercase tracking-wider mb-1">Sistem &amp; Keamanan</div>
              ${renderNavItem('users', '🔑', 'Manajemen Pengguna')}
              ${renderNavItem('roles', '🛡️', 'Role & Permission (RBAC)')}
              ${renderNavItem('audit', '📜', 'Audit Log Aktivitas')}
              ${renderNavItem('settings', '⚙️', 'Pengaturan Akademi')}
            </div>

          </nav>

          <!-- Sidebar Footer / Logout -->
          <div class="p-3 border-t border-white/10">
            <button onclick="Header.switchRole('visitor'); Utils.showToast('Keluar dari Admin Portal. Kembali ke halaman publik 👁️', 'info');"
              class="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl glass text-zinc-400 hover:text-white hover:bg-white/10 transition-all text-xs font-bold">
              <span>🚪</span>
              <span>Keluar ke Website Publik</span>
            </button>
          </div>

        </aside>

        <!-- ================= MAIN CONTENT AREA ================= -->
        <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
          
          <!-- Desktop Admin Top Navbar -->
          <header class="hidden md:flex h-14 border-b border-white/10 items-center justify-between px-4 sm:px-6 flex-shrink-0"
            style="background:rgba(9,13,22,0.9);backdrop-filter:blur(16px);">
            
            <div class="flex items-center gap-3">
              <div>
                <h1 id="admin-page-title" class="text-sm sm:text-base font-black text-white leading-tight">
                  Dashboard Utama
                </h1>
                <div class="text-[10px] text-zinc-400">Pusat Operasional &amp; Manajemen YouthTrigger Arena</div>
              </div>
            </div>

            <!-- Quick Global Search & System Status Pill -->
            <div class="flex items-center gap-3">
              <div class="relative hidden sm:block">
                <input type="text" placeholder="Cari siswa, pelatih, jadwal..." oninput="AdminView.handleGlobalSearch(this.value)"
                  class="glass rounded-xl px-3 py-1.5 pl-8 text-xs text-white placeholder-zinc-500 w-48 lg:w-64 border border-white/10 focus:outline-none focus:border-violet-400"/>
                <span class="absolute left-2.5 top-2 text-zinc-500 text-xs">🔍</span>
              </div>

              <!-- Quick Notification Badge -->
              <button onclick="AdminView.navTo('audit')" class="glass p-2 rounded-xl text-zinc-300 hover:text-white relative border border-white/10" title="Audit Trail Terkini">
                <span>🔔</span>
                <span class="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-violet-400 animate-pulse"></span>
              </button>

              <button onclick="AdminView.openQuickAddStudentModal()" class="btn-lime-glow px-3 py-1.5 rounded-xl text-xs font-black text-zinc-950 flex items-center gap-1 shadow-md">
                <span>+</span>
                <span class="hidden sm:inline">Tambah Siswa</span>
              </button>
            </div>

          </header>

          <!-- Mobile Slim Status Sub-bar (Single-header architecture) -->
          <div class="md:hidden flex items-center justify-between px-3 py-2 border-b border-white/10 bg-zinc-950/80 text-xs flex-shrink-0">
            <div class="flex items-center gap-2 min-w-0">
              <span class="w-2 h-2 rounded-full bg-violet-400 flex-shrink-0 animate-pulse"></span>
              <span id="admin-mobile-title" class="font-bold text-white truncate text-xs">Dashboard Utama</span>
            </div>
            <span class="text-[10px] font-mono text-violet-300 bg-violet-500/15 px-2 py-0.5 rounded-full border border-violet-500/25 flex-shrink-0">Super Admin</span>
          </div>

          <!-- Dynamic Page Container -->
          <main id="admin-content-view" class="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 scrollbar-thin min-w-0 max-w-full overflow-hidden">
            ${renderCurrentPage()}
          </main>

        </div>

      </div>

      <!-- Mobile Menu Modal Drawer for Admin -->
      <div id="admin-mobile-drawer" class="hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm md:hidden" onclick="AdminView.toggleMobileAdminMenu()">
        <div class="w-64 h-full bg-zinc-950 p-4 border-r border-white/10 space-y-3 overflow-y-auto" onclick="event.stopPropagation()">
          <div class="flex items-center justify-between pb-3 border-b border-white/10">
            <div class="font-black text-white text-sm">YouthTrigger HQ Admin</div>
            <button onclick="AdminView.toggleMobileAdminMenu()" class="text-zinc-400 text-lg">✕</button>
          </div>
          <div class="space-y-1 text-xs">
            ${renderNavItem('dashboard', '📊', 'Dashboard Utama')}
            ${renderNavItem('students', '👥', 'Data Siswa Binaan')}
            ${renderNavItem('coaches', '👨‍🏫', 'Data Pelatih')}
            ${renderNavItem('ageGroups', '🏷️', 'Kelompok Usia')}
            ${renderNavItem('registrations', '📝', 'Pendaftaran Masuk')}
            ${renderNavItem('selection', '🎯', 'Seleksi Siswa Baru')}
            ${renderNavItem('schedules', '📅', 'Jadwal & Kalender')}
            ${renderNavItem('attendance', '📋', 'Rekap Absensi')}
            ${renderNavItem('programs', '⚽', 'Kurikulum Latihan')}
            ${renderNavItem('matches', '🏆', 'Laga & Turnamen')}
            ${renderNavItem('facilities', '🏟️', 'Fasilitas & Alat')}
            ${renderNavItem('evaluations', '📈', 'Evaluasi 9 Dimensi')}
            ${renderNavItem('achievements', '🏅', 'Prestasi & Trofi')}
            ${renderNavItem('finance', '💰', 'Keuangan & SPP', '6')}
            ${renderNavItem('reports', '📑', 'Laporan & Ekspor Data')}
            ${renderNavItem('announcements', '📢', 'Pengumuman')}
            ${renderNavItem('news', '📰', 'Berita & Galeri')}
            ${renderNavItem('users', '🔑', 'Manajemen Pengguna')}
            ${renderNavItem('roles', '🛡️', 'Role & Permission')}
            ${renderNavItem('audit', '📜', 'Audit Log')}
            ${renderNavItem('settings', '⚙️', 'Pengaturan')}
          </div>
        </div>
      </div>
    `;
  }

  function renderNavItem(pageKey, icon, label, badgeCount = null) {
    const isActive = _adminPage === pageKey;
    return `
      <button onclick="AdminView.navTo('${pageKey}')"
        class="w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all text-left ${isActive ? 'bg-violet-600 text-white font-black shadow-lg shadow-violet-600/30' : 'text-zinc-400 hover:text-white hover:bg-white/5 font-semibold'}">
        <div class="flex items-center gap-2.5 truncate">
          <span class="text-sm">${icon}</span>
          <span class="truncate">${label}</span>
        </div>
        ${badgeCount ? `<span class="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white">${badgeCount}</span>` : ''}
      </button>
    `;
  }

  function navTo(pageKey) {
    _adminPage = pageKey;
    const titles = {
      dashboard: 'Dashboard Utama',
      students: 'Data Siswa Binaan',
      coaches: 'Data Pelatih Terakreditasi',
      ageGroups: 'Kelompok Usia & Skuad',
      registrations: 'Pendaftaran Masuk Calon Siswa',
      selection: 'Seleksi & Uji Kemampuan Siswa',
      schedules: 'Jadwal Latihan & Kalender Operasional',
      attendance: 'Rekap Absensi & Kehadiran',
      programs: 'Kurikulum & Program Latihan',
      matches: 'Pertandingan & Turnamen',
      facilities: 'Fasilitas & Inventaris Alat',
      evaluations: 'Evaluasi Performa 9 Dimensi',
      achievements: 'Prestasi & Penghargaan Akademi',
      finance: 'Manajemen Keuangan & SPP Siswa',
      reports: 'Pusat Laporan & Ekspor Data',
      announcements: 'Pengumuman & Komunikasi',
      news: 'Manajemen Berita & Galeri Publik',
      users: 'Manajemen Pengguna & Akun',
      roles: 'Role & Permission (RBAC)',
      audit: 'Audit Log & Rekam Jejak Sistem',
      settings: 'Pengaturan Akademi YouthTrigger'
    };
    
    const titleEl = document.getElementById('admin-page-title');
    if (titleEl) titleEl.textContent = titles[pageKey] || 'Admin Portal';
    const mobileTitleEl = document.getElementById('admin-mobile-title');
    if (mobileTitleEl) mobileTitleEl.textContent = titles[pageKey] || 'Admin Portal';

    const mainEl = document.getElementById('admin-content-view');
    if (mainEl) {
      mainEl.innerHTML = renderCurrentPage();
      mainEl.scrollTop = 0;
    }

    // Refresh active state in sidebar
    document.querySelectorAll('aside nav button').forEach(btn => {
      const onclickAttr = btn.getAttribute('onclick') || '';
      const match = onclickAttr.match(/navTo\('([^']+)'\)/);
      if (match) {
        const isAct = match[1] === pageKey;
        btn.className = `w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all text-left ${isAct ? 'bg-violet-600 text-white font-black shadow-lg shadow-violet-600/30' : 'text-zinc-400 hover:text-white hover:bg-white/5 font-semibold'}`;
      }
    });

    const mobileDrawer = document.getElementById('admin-mobile-drawer');
    if (mobileDrawer) mobileDrawer.classList.add('hidden');
  }

  function toggleMobileAdminMenu() {
    const el = document.getElementById('admin-mobile-drawer');
    if (el) el.classList.toggle('hidden');
  }

  function renderCurrentPage() {
    switch (_adminPage) {
      case 'students':      return renderStudentsPage();
      case 'coaches':       return renderCoachesPage();
      case 'ageGroups':     return renderAgeGroupsPage();
      case 'registrations': return renderRegistrationsPage();
      case 'selection':     return renderSelectionPage();
      case 'schedules':     return renderSchedulesPage();
      case 'attendance':    return renderAttendancePage();
      case 'programs':      return renderProgramsPage();
      case 'matches':       return renderMatchesPage();
      case 'facilities':    return renderFacilitiesPage();
      case 'evaluations':   return renderEvaluationsPage();
      case 'achievements':  return renderAchievementsPage();
      case 'finance':       return PaymentModule.renderAdminFinance();
      case 'reports':       return renderReportsPage();
      case 'announcements': return renderAnnouncementsPage();
      case 'news':          return renderNewsPage();
      case 'users':         return renderUsersPage();
      case 'roles':         return renderRolesPage();
      case 'audit':         return renderAuditPage();
      case 'settings':      return renderSettingsPage();
      default:              return renderDashboardPage();
    }
  }

  /* ================================================================
     1. DASHBOARD OVERVIEW PAGE
  ================================================================ */
  function renderDashboardPage() {
    const totalActiveStudents = _students.filter(s => s.status === 'active').length;
    const totalCoaches = KSA_STORE.coaches.length;
    const pendingRegs = KSA_STORE.registrations.filter(r => r.status === 'Pending').length;
    const waitingSelection = KSA_STORE.registrations.filter(r => r.status === 'Waiting for Selection').length;

    return `
      <!-- Top 8 KPI Metric Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        
        <div class="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-violet-500/30">
          <div class="flex items-center justify-between">
            <span class="text-[11px] sm:text-xs text-zinc-400 font-semibold truncate">Total Siswa Aktif</span>
            <span class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-violet-500/20 text-violet-300 flex items-center justify-center text-xs sm:text-sm font-black flex-shrink-0">👥</span>
          </div>
          <div class="mt-2 sm:mt-3 flex flex-wrap items-baseline gap-1 sm:gap-2">
            <span class="text-xl sm:text-2xl lg:text-3xl font-black text-white">${totalActiveStudents + 52}</span>
            <span class="text-[9px] sm:text-[10px] text-emerald-400 font-bold">+6 bln</span>
          </div>
          <div class="text-[9px] sm:text-[10px] text-zinc-500 mt-0.5 truncate">6 kelompok usia</div>
        </div>

        <div class="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-amber-500/30">
          <div class="flex items-center justify-between">
            <span class="text-[11px] sm:text-xs text-zinc-400 font-semibold truncate">Pelatih Berlisensi</span>
            <span class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-xs sm:text-sm font-black flex-shrink-0">👨‍🏫</span>
          </div>
          <div class="mt-2 sm:mt-3 flex flex-wrap items-baseline gap-1 sm:gap-2">
            <span class="text-xl sm:text-2xl lg:text-3xl font-black text-white">${totalCoaches}</span>
            <span class="text-[9px] sm:text-[10px] text-amber-300 font-bold">AFC A/B/C</span>
          </div>
          <div class="text-[9px] sm:text-[10px] text-zinc-500 mt-0.5 truncate">Rasio 1:10 pelatih</div>
        </div>

        <div class="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-lime-400/30">
          <div class="flex items-center justify-between">
            <span class="text-[11px] sm:text-xs text-zinc-400 font-semibold truncate">Pendaftaran Baru</span>
            <span class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-lime-400/20 text-lime-300 flex items-center justify-center text-xs sm:text-sm font-black flex-shrink-0">📝</span>
          </div>
          <div class="mt-2 sm:mt-3 flex flex-wrap items-baseline gap-1 sm:gap-2">
            <span class="text-xl sm:text-2xl lg:text-3xl font-black text-white">${pendingRegs}</span>
            <span class="text-[9px] sm:text-[10px] text-rose-400 font-bold">Review</span>
          </div>
          <div class="text-[9px] sm:text-[10px] text-zinc-500 mt-0.5 truncate">Registrasi online</div>
        </div>

        <div class="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-sky-400/30">
          <div class="flex items-center justify-between">
            <span class="text-[11px] sm:text-xs text-zinc-400 font-semibold truncate">Menunggu Seleksi</span>
            <span class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-sky-400/20 text-sky-300 flex items-center justify-center text-xs sm:text-sm font-black flex-shrink-0">🎯</span>
          </div>
          <div class="mt-2 sm:mt-3 flex flex-wrap items-baseline gap-1 sm:gap-2">
            <span class="text-xl sm:text-2xl lg:text-3xl font-black text-white">${waitingSelection + 4}</span>
            <span class="text-[9px] sm:text-[10px] text-sky-300 font-bold">Sabtu 22 Nov</span>
          </div>
          <div class="text-[9px] sm:text-[10px] text-zinc-500 mt-0.5 truncate">Stadion Utama Complex</div>
        </div>

      </div>

      <!-- Second Row KPI Metrics -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div class="glass rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10 flex items-center justify-between">
          <div class="min-w-0">
            <div class="text-[10px] sm:text-[11px] text-zinc-400 truncate">Jadwal Hari Ini</div>
            <div class="text-lg sm:text-xl font-black text-white mt-0.5">3 Sesi</div>
            <div class="text-[9px] sm:text-[10px] text-emerald-400 truncate">Pagi (1), Sore (2)</div>
          </div>
          <div class="text-xl sm:text-2xl flex-shrink-0">⚽</div>
        </div>
        <div class="glass rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10 flex items-center justify-between">
          <div class="min-w-0">
            <div class="text-[10px] sm:text-[11px] text-zinc-400 truncate">Rata-rata Hadir</div>
            <div class="text-lg sm:text-xl font-black text-emerald-400 mt-0.5">93.4%</div>
            <div class="text-[9px] sm:text-[10px] text-zinc-500 truncate">Bulan Nov 2026</div>
          </div>
          <div class="text-xl sm:text-2xl flex-shrink-0">📋</div>
        </div>
        <div class="glass rounded-2xl p-4 border border-white/10 flex items-center justify-between">
          <div>
            <div class="text-[11px] text-zinc-400">Laga Mendatang</div>
            <div class="text-xl font-black text-white mt-1">2 Pertandingan</div>
            <div class="text-[10px] text-amber-300">vs Garuda Muda &amp; Bintang Muda</div>
          </div>
          <div class="text-2xl">🏆</div>
        </div>
        <div class="glass rounded-2xl p-4 border border-white/10 flex items-center justify-between">
          <div>
            <div class="text-[11px] text-zinc-400">Kelompok Usia Aktif</div>
            <div class="text-xl font-black text-white mt-1">6 Kelompok</div>
            <div class="text-[10px] text-zinc-500">U-8 s/d U-18</div>
          </div>
          <div class="text-2xl">🏷️</div>
        </div>
      </div>

      <!-- Analytics Charts Section -->
      <div class="grid lg:grid-cols-12 gap-6">
        
        <!-- Left 7 cols: Student Growth Bar Chart -->
        <div class="lg:col-span-7 glass rounded-3xl p-6 border border-white/10 space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-base font-bold text-white">Pertumbuhan Siswa Akademi (2026)</h3>
              <p class="text-xs text-zinc-400">Peningkatan kuota siswa per bulan</p>
            </div>
            <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Tren Positif (+24%)
            </span>
          </div>

          <!-- SVG Bar Chart -->
          <div class="h-44 w-full flex items-end justify-between gap-3 pt-6 px-2">
            ${[
              { month: 'Jun', count: 38, pct: 50 },
              { month: 'Jul', count: 42, pct: 55 },
              { month: 'Agt', count: 46, pct: 60 },
              { month: 'Sep', count: 50, pct: 65 },
              { month: 'Okt', count: 54, pct: 72 },
              { month: 'Nov', count: 58, pct: 80 }
            ].map(b => `
              <div class="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <span class="text-[10px] font-bold text-zinc-400 group-hover:text-white transition-colors">${b.count}</span>
                <div class="w-full max-w-[36px] bg-gradient-to-t from-violet-600 to-lime-400 rounded-t-lg transition-all duration-500 group-hover:brightness-125 shadow-lg shadow-violet-600/20"
                     style="height:${b.pct}%;"></div>
                <span class="text-[10px] font-semibold text-zinc-500">${b.month}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Right 5 cols: Age Group Distribution -->
        <div class="lg:col-span-5 glass rounded-3xl p-6 border border-white/10 space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-base font-bold text-white">Distribusi Kelompok Usia</h3>
              <p class="text-xs text-zinc-400">Total kuota per jenjang</p>
            </div>
            <span class="text-xs font-bold text-violet-400">6 Kategori</span>
          </div>

          <div class="space-y-2.5 text-xs">
            ${[
              { name: 'U-8 Grassroots Fun', count: 8, max: 12, color: 'bg-sky-400' },
              { name: 'U-10 Ball Mastery', count: 12, max: 15, color: 'bg-emerald-400' },
              { name: 'U-12 Skill Builders', count: 14, max: 16, color: 'bg-lime-400' },
              { name: 'U-14 Tactical Squad', count: 12, max: 16, color: 'bg-amber-400' },
              { name: 'U-16 Youth Elite', count: 14, max: 16, color: 'bg-purple-400' },
              { name: 'U-18 Pro Pathway', count: 10, max: 14, color: 'bg-rose-400' }
            ].map(item => `
              <div>
                <div class="flex justify-between text-zinc-300 font-semibold mb-1">
                  <span>${item.name}</span>
                  <span class="text-white">${item.count} / ${item.max} anak</span>
                </div>
                <div class="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                  <div class="${item.color} h-2 rounded-full transition-all" style="width:${(item.count/item.max)*100}%"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>

      <!-- Bottom Grid: Recent Registrations & Live Audit Activity -->
      <div class="grid lg:grid-cols-12 gap-6">
        
        <!-- Left 7 cols: Pendaftaran Masuk Terkini -->
        <div class="lg:col-span-7 glass rounded-3xl p-6 border border-white/10 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-base font-bold text-white flex items-center gap-2">
              <span>📝</span>
              <span>Pendaftaran Terbaru Menunggu Review</span>
            </h3>
            <button onclick="AdminView.navTo('registrations')" class="text-xs text-lime-400 hover:underline font-bold">
              Lihat Semua (${KSA_STORE.registrations.length}) →
            </button>
          </div>

          <div class="space-y-2.5 text-xs">
            ${KSA_STORE.registrations.slice(0, 4).map(reg => `
              <div class="glass-subtle p-3 rounded-2xl flex items-center justify-between border border-white/5 hover:border-white/15 transition-all">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl bg-lime-400/20 text-lime-300 font-bold text-xs flex items-center justify-center">
                    ${reg.ageGroup}
                  </div>
                  <div>
                    <div class="font-bold text-white text-sm">${reg.name}</div>
                    <div class="text-[11px] text-zinc-400">${reg.position} · Wali: ${reg.guardianName} (${reg.guardianPhone})</div>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="px-2.5 py-1 rounded-full text-[10px] font-bold ${getStatusBadgeClass(reg.status)}">
                    ${reg.status}
                  </span>
                  <button onclick="AdminView.openRegistrationDetailModal('${reg.id}')"
                    class="glass px-2.5 py-1 rounded-lg text-xs font-bold text-zinc-300 hover:text-white border border-white/10">
                    Periksa
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Right 5 cols: Live Audit Log Activity -->
        <div class="lg:col-span-5 glass rounded-3xl p-6 border border-white/10 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-base font-bold text-white flex items-center gap-2">
              <span>📜</span>
              <span>Audit Trail Aktivitas Sistem</span>
            </h3>
            <button onclick="AdminView.navTo('audit')" class="text-xs text-violet-400 hover:underline font-bold">
              Log Lengkap →
            </button>
          </div>

          <div class="space-y-3 text-xs">
            ${KSA_STORE.auditLogs.slice(0, 4).map(log => `
              <div class="border-l-2 border-violet-500 pl-3 py-1">
                <div class="flex items-center justify-between text-[10px] text-zinc-400">
                  <span class="font-bold text-violet-300">${log.user}</span>
                  <span>${log.timestamp.slice(11, 16)} WIB</span>
                </div>
                <div class="text-zinc-200 mt-0.5 font-medium leading-tight">${log.detail}</div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    `;
  }

  /* ================================================================
     2. DATA SISWA PAGE (With 8-Tab Modal & Search/Filter)
  ================================================================ */
  function renderStudentsPage() {
    let list = _students;

    if (_studentAgeFilter !== 'all') {
      list = list.filter(s => s.squad === _studentAgeFilter);
    }
    if (_studentStatusFilter !== 'all') {
      list = list.filter(s => s.status === _studentStatusFilter);
    }
    if (_studentSearchQuery.trim()) {
      const q = _studentSearchQuery.toLowerCase();
      list = list.filter(s => s.name.toLowerCase().includes(q) || s.nis.toLowerCase().includes(q) || s.pos.toLowerCase().includes(q));
    }

    return `
      <div class="space-y-5">
        
        <!-- Header & Action Bar -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 class="text-xl font-black text-white">Database Siswa Binaan YouthTrigger</h2>
            <p class="text-xs text-zinc-400">Total ${list.length} siswa ditampilkan dari total ${_students.length} siswa terdaftar</p>
          </div>
          <button onclick="AdminView.openQuickAddStudentModal()"
            class="btn-lime-glow px-4 py-2.5 rounded-xl font-bold text-xs text-zinc-950 flex items-center gap-1.5 shadow-lg">
            <span>👤+</span>
            <span>Tambah Siswa Baru</span>
          </button>
        </div>

        <!-- Filters Bar -->
        <div class="glass rounded-2xl p-4 border border-white/10 flex flex-wrap items-center gap-3">
          
          <!-- Search Input -->
          <div class="relative flex-1 min-w-[200px]">
            <input type="text" placeholder="Cari nama, NIS, atau posisi..." value="${_studentSearchQuery}"
              oninput="AdminView.filterStudents('search', this.value)"
              class="w-full glass rounded-xl px-3 py-2 pl-8 text-xs text-white placeholder-zinc-500 border border-white/10 focus:outline-none focus:border-lime-400"/>
            <span class="absolute left-2.5 top-2.5 text-zinc-500 text-xs">🔍</span>
          </div>

          <!-- Age Filter -->
          <select onchange="AdminView.filterStudents('age', this.value)"
            class="glass rounded-xl px-3 py-2 text-xs text-zinc-200 bg-zinc-900 border border-white/10 focus:outline-none focus:border-lime-400">
            <option value="all" ${_studentAgeFilter === 'all' ? 'selected' : ''}>Semua Usia (U-8 s/d U-18)</option>
            <option value="U-8" ${_studentAgeFilter === 'U-8' ? 'selected' : ''}>U-8 Grassroots</option>
            <option value="U-10" ${_studentAgeFilter === 'U-10' ? 'selected' : ''}>U-10 Foundation</option>
            <option value="U-12" ${_studentAgeFilter === 'U-12' ? 'selected' : ''}>U-12 Skill Builders</option>
            <option value="U-14" ${_studentAgeFilter === 'U-14' ? 'selected' : ''}>U-14 Tactical</option>
            <option value="U-16" ${_studentAgeFilter === 'U-16' ? 'selected' : ''}>U-16 Elite Youth</option>
            <option value="U-18" ${_studentAgeFilter === 'U-18' ? 'selected' : ''}>U-18 Pro Pathway</option>
          </select>

          <!-- Status Filter -->
          <select onchange="AdminView.filterStudents('status', this.value)"
            class="glass rounded-xl px-3 py-2 text-xs text-zinc-200 bg-zinc-900 border border-white/10 focus:outline-none focus:border-lime-400">
            <option value="all" ${_studentStatusFilter === 'all' ? 'selected' : ''}>Semua Status</option>
            <option value="active" ${_studentStatusFilter === 'active' ? 'selected' : ''}>Aktif</option>
            <option value="inactive" ${_studentStatusFilter === 'inactive' ? 'selected' : ''}>Nonaktif</option>
            <option value="archived" ${_studentStatusFilter === 'archived' ? 'selected' : ''}>Arsip / Alumni</option>
          </select>

        </div>

        <!-- Student Table -->
        <div class="glass rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          <div class="overflow-x-auto table-scroll-x">
            <table class="w-full text-left text-xs text-zinc-300 min-w-[720px]">
              <thead class="bg-zinc-900/80 text-[11px] uppercase tracking-wider text-zinc-400 border-b border-white/10">
                <tr>
                  <th class="py-3.5 px-4 font-bold">Siswa &amp; Nomor</th>
                  <th class="py-3.5 px-4 font-bold">NIS</th>
                  <th class="py-3.5 px-4 font-bold">Kelompok</th>
                  <th class="py-3.5 px-4 font-bold">Posisi</th>
                  <th class="py-3.5 px-4 font-bold">Presensi</th>
                  <th class="py-3.5 px-4 font-bold">Rating</th>
                  <th class="py-3.5 px-4 font-bold">Status</th>
                  <th class="py-3.5 px-4 font-bold text-center">Aksi Manajemen</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                ${list.length === 0 ? `
                  <tr>
                    <td colspan="8" class="text-center py-8 text-zinc-500">Tidak ada data siswa yang cocok dengan filter.</td>
                  </tr>
                ` : list.map(s => `
                  <tr class="hover:bg-white/5 transition-colors">
                    <td class="py-3 px-4">
                      <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-xl ${s.bg} text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                          ${s.number ? '#' + s.number : s.initials}
                        </div>
                        <div>
                          <div class="font-bold text-white text-sm">${s.name}</div>
                          <div class="text-[11px] text-zinc-400">${s.dominantFoot} · ${s.height} cm / ${s.weight} kg</div>
                        </div>
                      </div>
                    </td>
                    <td class="py-3 px-4 font-mono text-[11px] text-zinc-400">${s.nis}</td>
                    <td class="py-3 px-4">
                      <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/10 text-white">
                        ${s.squad}
                      </span>
                    </td>
                    <td class="py-3 px-4 text-zinc-200 font-semibold">${s.pos}</td>
                    <td class="py-3 px-4">
                      <div class="flex items-center gap-1.5 font-bold ${s.attendance >= 90 ? 'text-emerald-400' : 'text-amber-300'}">
                        <span>${s.attendance}%</span>
                      </div>
                    </td>
                    <td class="py-3 px-4">
                      <span class="font-extrabold text-lime-400">${s.rating}</span>
                      <span class="text-[10px] text-zinc-500">/10</span>
                    </td>
                    <td class="py-3 px-4">
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${s.status === 'active' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-zinc-800 text-zinc-400'}">
                        ${s.status === 'active' ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td class="py-3 px-4 text-center">
                      <div class="flex items-center justify-center gap-1.5">
                        <button onclick="AdminView.openStudentDetailModal('${s.id}')"
                          class="px-2.5 py-1 rounded-lg glass text-xs font-bold text-lime-400 hover:bg-lime-400/20 border border-lime-400/30 transition-all">
                          Detail 8-Tab
                        </button>
                        <button onclick="AdminView.toggleStudentStatus('${s.id}')"
                          class="px-2 py-1 rounded-lg glass text-[10px] font-semibold text-zinc-400 hover:text-white" title="Ubah status siswa">
                          ${s.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                        </button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;
  }

  function filterStudents(type, val) {
    if (type === 'search') _studentSearchQuery = val;
    if (type === 'age') _studentAgeFilter = val;
    if (type === 'status') _studentStatusFilter = val;
    navTo('students');
  }

  function toggleStudentStatus(studentId) {
    const s = _students.find(x => x.id === studentId);
    if (s) {
      s.status = s.status === 'active' ? 'inactive' : 'active';
      KSA_STORE.addAuditLog(
        'Bambang Sudirman (Super Admin)',
        'Super Admin',
        'Data Siswa',
        'UPDATE_STATUS',
        `Mengubah status siswa ${s.name} (${s.nis}) menjadi: ${s.status}.`
      );
      Utils.showToast(`Status ${s.name} berhasil diubah menjadi: ${s.status} 🔄`, 'info');
      navTo('students');
    }
  }

  /* ================================================================
     STUDENT DETAIL MODAL WITH 8 COMPREHENSIVE TABS
  ================================================================ */
  function openStudentDetailModal(studentId, initialTab = 'pribadi') {
    _selectedStudentId = studentId;
    _studentTab = initialTab;
    const s = _students.find(x => x.id === studentId) || _students[0];

    const tabs = [
      { id: 'pribadi',  label: '1. Info Pribadi' },
      { id: 'wali',     label: '2. Info Wali' },
      { id: 'bola',     label: '3. Data Sepak Bola' },
      { id: 'latihan',  label: '4. Riwayat Latihan' },
      { id: 'absensi',  label: '5. Absensi' },
      { id: 'evaluasi', label: '6. Evaluasi 9 Dimensi' },
      { id: 'laga',     label: '7. Pertandingan' },
      { id: 'prestasi', label: '8. Prestasi' },
    ];

    Utils.openModal(`
      <div class="space-y-4 max-w-2xl text-left">
        
        <!-- Header Profile Banner -->
        <div class="flex items-center justify-between pb-3 border-b border-white/10">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl ${s.bg} text-white font-black text-base flex items-center justify-center shadow-lg">
              ${s.number ? '#' + s.number : s.initials}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-lg font-black text-white">${s.name}</h3>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white">${s.squad}</span>
              </div>
              <div class="text-xs text-zinc-400">NIS: ${s.nis} · ${s.pos} · Pembina: ${s.coach}</div>
            </div>
          </div>
          <button onclick="Utils.closeModal()" class="w-8 h-8 rounded-xl glass text-zinc-400 hover:text-white flex items-center justify-center">✕</button>
        </div>

        <!-- 8 Tabs Header Bar -->
        <div class="flex items-center gap-1 overflow-x-auto pb-1 border-b border-white/10 text-xs scrollbar-thin">
          ${tabs.map(t => `
            <button onclick="AdminView.switchStudentTab('${s.id}', '${t.id}')"
              class="px-3 py-1.5 rounded-xl whitespace-nowrap transition-all font-bold ${_studentTab === t.id ? 'bg-violet-600 text-white shadow-md' : 'text-zinc-400 hover:text-white hover:bg-white/5'}">
              ${t.label}
            </button>
          `).join('')}
        </div>

        <!-- Dynamic Tab Content -->
        <div class="min-h-[220px] text-xs space-y-3">
          ${renderStudentTabContent(s)}
        </div>

        <!-- Footer Actions -->
        <div class="flex items-center justify-between pt-3 border-t border-white/10">
          <span class="text-[11px] text-zinc-500">ID Siswa: ${s.id}</span>
          <div class="flex items-center gap-2">
            <button onclick="Utils.closeModal()" class="px-4 py-2 rounded-xl glass text-zinc-300 hover:text-white text-xs font-semibold">Tutup</button>
            <button onclick="AdminView.printStudentReport('${s.id}')" class="btn-lime-glow px-4 py-2 rounded-xl text-zinc-950 text-xs font-black">Cetak Rapor Siswa 🖨️</button>
          </div>
        </div>

      </div>
    `);
  }

  function switchStudentTab(studentId, tabId) {
    openStudentDetailModal(studentId, tabId);
  }

  function renderStudentTabContent(s) {
    switch (_studentTab) {
      case 'wali':
        return `
          <div class="grid grid-cols-2 gap-3">
            <div class="glass p-3 rounded-xl border border-white/5">
              <span class="text-zinc-400 text-[10px]">Nama Orang Tua / Wali</span>
              <div class="font-bold text-white text-sm mt-0.5">${s.guardian.name}</div>
            </div>
            <div class="glass p-3 rounded-xl border border-white/5">
              <span class="text-zinc-400 text-[10px]">Hubungan</span>
              <div class="font-bold text-white text-sm mt-0.5">${s.guardian.relation}</div>
            </div>
            <div class="glass p-3 rounded-xl border border-white/5">
              <span class="text-zinc-400 text-[10px]">Nomor Telepon / WhatsApp</span>
              <div class="font-bold text-emerald-400 text-sm mt-0.5">${s.guardian.phone}</div>
            </div>
            <div class="glass p-3 rounded-xl border border-white/5">
              <span class="text-zinc-400 text-[10px]">Pekerjaan</span>
              <div class="font-bold text-white text-sm mt-0.5">${s.guardian.job}</div>
            </div>
          </div>
          <div class="glass p-3 rounded-xl border border-white/5">
            <span class="text-zinc-400 text-[10px]">Alamat Domisili Resmi</span>
            <div class="font-medium text-zinc-200 mt-0.5">${s.guardian.address}</div>
          </div>
        `;
      case 'bola':
        return `
          <div class="grid grid-cols-3 gap-2.5">
            <div class="glass p-2.5 rounded-xl border border-white/5">
              <span class="text-zinc-400 text-[10px]">Posisi Utama</span>
              <div class="font-bold text-white mt-0.5">${s.pos}</div>
            </div>
            <div class="glass p-2.5 rounded-xl border border-white/5">
              <span class="text-zinc-400 text-[10px]">Posisi Alternatif</span>
              <div class="font-bold text-white mt-0.5">${s.altPos}</div>
            </div>
            <div class="glass p-2.5 rounded-xl border border-white/5">
              <span class="text-zinc-400 text-[10px]">Kaki Dominan</span>
              <div class="font-bold text-lime-400 mt-0.5">${s.dominantFoot}</div>
            </div>
            <div class="glass p-2.5 rounded-xl border border-white/5">
              <span class="text-zinc-400 text-[10px]">Nomor Punggung</span>
              <div class="font-bold text-white mt-0.5">#${s.number}</div>
            </div>
            <div class="glass p-2.5 rounded-xl border border-white/5">
              <span class="text-zinc-400 text-[10px]">Tanggal Bergabung</span>
              <div class="font-bold text-white mt-0.5">${s.joinedDate}</div>
            </div>
            <div class="glass p-2.5 rounded-xl border border-white/5">
              <span class="text-zinc-400 text-[10px]">Rating Keseluruhan</span>
              <div class="font-black text-lime-400 mt-0.5">${s.rating} / 10</div>
            </div>
          </div>
        `;
      case 'latihan':
        return `
          <div class="space-y-2">
            <div class="glass p-3 rounded-xl flex items-center justify-between border border-white/5">
              <div>
                <div class="font-bold text-white">Sesi High Pressing &amp; Transition</div>
                <div class="text-[10px] text-zinc-400">Sabtu, 15 Nov 2026 · Lapangan Utama · Coach Hendra</div>
              </div>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">Hadir (Sangat Aktif)</span>
            </div>
            <div class="glass p-3 rounded-xl flex items-center justify-between border border-white/5">
              <div>
                <div class="font-bold text-white">Sesi Ball Mastery &amp; 1v1 Drills</div>
                <div class="text-[10px] text-zinc-400">Rabu, 12 Nov 2026 · Lapangan B · Coach Hendra</div>
              </div>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">Hadir</span>
            </div>
            <div class="glass p-3 rounded-xl flex items-center justify-between border border-white/5">
              <div>
                <div class="font-bold text-white">Sesi Tactical Video Review</div>
                <div class="text-[10px] text-zinc-400">Senin, 10 Nov 2026 · Auditorium · Coach Fachri</div>
              </div>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">Hadir</span>
            </div>
          </div>
        `;
      case 'absensi':
        return `
          <div class="grid grid-cols-4 gap-2 mb-3 text-center">
            <div class="glass p-2 rounded-xl"><div class="text-lg font-black text-emerald-400">38</div><div class="text-[9px] text-zinc-400">Hadir</div></div>
            <div class="glass p-2 rounded-xl"><div class="text-lg font-black text-sky-400">2</div><div class="text-[9px] text-zinc-400">Izin</div></div>
            <div class="glass p-2 rounded-xl"><div class="text-lg font-black text-amber-400">1</div><div class="text-[9px] text-zinc-400">Sakit</div></div>
            <div class="glass p-2 rounded-xl"><div class="text-lg font-black text-rose-400">0</div><div class="text-[9px] text-zinc-400">Alpha</div></div>
          </div>
          <div class="p-3 glass rounded-xl text-[11px] text-zinc-300 flex items-center justify-between">
            <span>Tingkat Disiplin Kehadiran Skuad:</span>
            <span class="font-black text-emerald-400 text-sm">${s.attendance}% (Predikat: Sangat Baik)</span>
          </div>
        `;
      case 'evaluasi':
        return `
          <div class="space-y-2">
            <div class="text-[11px] text-zinc-400 mb-2">Penilaian 9 Dimensi Standar Akademi (Skala 1–100):</div>
            <div class="grid grid-cols-3 gap-2">
              ${Object.entries(s.skills).map(([k, v]) => `
                <div class="glass p-2 rounded-xl border border-white/5 flex items-center justify-between">
                  <span class="capitalize text-zinc-300 text-[11px]">${k}</span>
                  <span class="font-black text-lime-400">${v}</span>
                </div>
              `).join('')}
            </div>
            <div class="glass p-3 rounded-xl mt-3 text-zinc-300 text-[11px] border border-white/5">
              <span class="font-bold text-white">Catatan Pelatih Kepala:</span> Siswa menunjukkan kepemimpinan taktik yang luar biasa dan visi permainan cerdas. Terus asah stamina transisi defensif.
            </div>
          </div>
        `;
      case 'laga':
        return `
          <div class="grid grid-cols-3 gap-2 mb-3 text-center">
            <div class="glass p-2 rounded-xl"><div class="text-lg font-black text-white">${s.matches}</div><div class="text-[9px] text-zinc-400">Laga Dimainkan</div></div>
            <div class="glass p-2 rounded-xl"><div class="text-lg font-black text-emerald-400">${s.goals}</div><div class="text-[9px] text-zinc-400">Gol Dicetak</div></div>
            <div class="glass p-2 rounded-xl"><div class="text-lg font-black text-sky-400">${s.assists}</div><div class="text-[9px] text-zinc-400">Assist</div></div>
          </div>
          <div class="glass p-3 rounded-xl border border-white/5 space-y-1">
            <div class="font-bold text-white">Laga Terakhir: vs Persikasi U-16 (Menang 3-1)</div>
            <div class="text-[10px] text-zinc-400">Menit Bermain: 75' · 1 Gol · 1 Assist · Man of the Match ⭐</div>
          </div>
        `;
      case 'prestasi':
        return `
          <div class="space-y-2">
            ${s.achievements.map((ach, i) => `
              <div class="glass p-2.5 rounded-xl border border-amber-400/20 flex items-center gap-2.5">
                <span class="text-base text-amber-400">🏅</span>
                <span class="font-bold text-white text-xs">${ach}</span>
              </div>
            `).join('')}
          </div>
        `;
      default: // 'pribadi'
        return `
          <div class="grid grid-cols-2 gap-3">
            <div class="glass p-2.5 rounded-xl border border-white/5">
              <span class="text-zinc-400 text-[10px]">Tempat, Tanggal Lahir</span>
              <div class="font-bold text-white mt-0.5">${s.pob}, ${s.dob}</div>
            </div>
            <div class="glass p-2.5 rounded-xl border border-white/5">
              <span class="text-zinc-400 text-[10px]">Tinggi &amp; Berat Badan</span>
              <div class="font-bold text-white mt-0.5">${s.height} cm / ${s.weight} kg</div>
            </div>
            <div class="glass p-2.5 rounded-xl border border-white/5">
              <span class="text-zinc-400 text-[10px]">Golongan Darah</span>
              <div class="font-bold text-white mt-0.5">Tipe ${s.bloodType}</div>
            </div>
            <div class="glass p-2.5 rounded-xl border border-white/5">
              <span class="text-zinc-400 text-[10px]">Status Medis &amp; Fisik</span>
              <div class="font-bold text-emerald-400 mt-0.5">${s.health.condition}</div>
            </div>
          </div>
          <div class="glass p-2.5 rounded-xl border border-white/5">
            <span class="text-zinc-400 text-[10px]">Riwayat Cedera Terakhir</span>
            <div class="font-medium text-zinc-300 mt-0.5">${s.health.history}</div>
          </div>
        `;
    }
  }

  function printStudentReport(studentId) {
    const s = _students.find(x => x.id === studentId) || _students[0];
    Utils.showToast(`Mencetak Rapor Digital Siswa: ${s.name} (#${s.number}) 📄`, 'success');
  }

  function openQuickAddStudentModal() {
    Utils.openModal(`
      <div class="space-y-4 max-w-lg text-left">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl gradient-lime text-zinc-950 font-black flex items-center justify-center text-lg">
            👤+
          </div>
          <div>
            <h3 class="text-lg font-black text-white">Tambah Siswa Baru</h3>
            <p class="text-xs text-zinc-400">Registrasi manual siswa ke Skuad YouthTrigger Arena</p>
          </div>
        </div>

        <form id="admin-add-student-form" onsubmit="AdminView.submitAddStudent(event)" class="space-y-3 text-xs">
          <div>
            <label class="block text-zinc-300 font-bold mb-1">Nama Lengkap Siswa *</label>
            <input required type="text" id="add-stu-name" placeholder="Nama lengkap siswa"
              class="w-full glass rounded-xl px-3 py-2 text-white border border-white/10 focus:outline-none focus:border-lime-400"/>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-zinc-300 font-bold mb-1">Kelompok Usia *</label>
              <select id="add-stu-squad" class="w-full glass rounded-xl px-3 py-2 bg-zinc-900 text-white border border-white/10 focus:outline-none focus:border-lime-400">
                <option value="U-8">U-8 Grassroots</option>
                <option value="U-10">U-10 Foundation</option>
                <option value="U-12">U-12 Skill Builders</option>
                <option value="U-14">U-14 Tactical</option>
                <option value="U-16" selected>U-16 Elite Youth</option>
                <option value="U-18">U-18 Pro Pathway</option>
              </select>
            </div>
            <div>
              <label class="block text-zinc-300 font-bold mb-1">Posisi Bermain *</label>
              <select id="add-stu-pos" class="w-full glass rounded-xl px-3 py-2 bg-zinc-900 text-white border border-white/10 focus:outline-none focus:border-lime-400">
                <option value="Gelandang Serang (CAM)">Gelandang Serang (CAM)</option>
                <option value="Penyerang Tengah (CF)">Penyerang Tengah (CF)</option>
                <option value="Penyerang Sayap (LW/RW)">Penyerang Sayap (LW/RW)</option>
                <option value="Gelandang Bertahan (CDM)">Gelandang Bertahan (CDM)</option>
                <option value="Bek Tengah (CB)">Bek Tengah (CB)</option>
                <option value="Bek Sayap (LB/RB)">Bek Sayap (LB/RB)</option>
                <option value="Kiper Utama (GK)">Kiper Utama (GK)</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-zinc-300 font-bold mb-1">Nomor Punggung (Opsional)</label>
              <input type="number" id="add-stu-num" placeholder="Contoh: 10" min="1" max="99"
                class="w-full glass rounded-xl px-3 py-2 text-white border border-white/10 focus:outline-none focus:border-lime-400"/>
            </div>
            <div>
              <label class="block text-zinc-300 font-bold mb-1">Nama Orang Tua / Wali *</label>
              <input required type="text" id="add-stu-guardian" placeholder="Nama wali"
                class="w-full glass rounded-xl px-3 py-2 text-white border border-white/10 focus:outline-none focus:border-lime-400"/>
            </div>
          </div>

          <div>
            <label class="block text-zinc-300 font-bold mb-1">Nomor WhatsApp Wali *</label>
            <input required type="tel" id="add-stu-phone" placeholder="08xxxxxxxxxx"
              class="w-full glass rounded-xl px-3 py-2 text-white border border-white/10 focus:outline-none focus:border-lime-400"/>
          </div>

          <div class="flex items-center justify-end gap-2 pt-2">
            <button type="button" onclick="Utils.closeModal()" class="px-4 py-2 rounded-xl glass text-zinc-400 hover:text-white">Batal</button>
            <button type="submit" class="btn-lime-glow px-5 py-2 rounded-xl text-zinc-950 font-black">Simpan Siswa</button>
          </div>
        </form>
      </div>
    `);
  }

  function submitAddStudent(e) {
    e.preventDefault();
    const name = document.getElementById('add-stu-name')?.value || 'Siswa Baru';
    const squad = document.getElementById('add-stu-squad')?.value || 'U-16';
    const pos = document.getElementById('add-stu-pos')?.value || 'Gelandang';
    const num = parseInt(document.getElementById('add-stu-num')?.value, 10) || Math.floor(Math.random() * 80 + 20);
    const guardian = document.getElementById('add-stu-guardian')?.value || 'Wali Siswa';
    const phone = document.getElementById('add-stu-phone')?.value || '08xxxxxxxxxx';

    const newStudent = {
      id: `KSA-${squad}-${Math.floor(Math.random()*899+100)}`,
      nis: `2026-${squad}-${Math.floor(Math.random()*899+100)}`,
      name,
      nickname: name.split(' ')[0],
      number: num,
      pos,
      altPos: 'All-Rounder',
      squad,
      initials: name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase(),
      bg: 'bg-emerald-500',
      status: 'active',
      dob: '2012-06-15',
      pob: 'Bekasi',
      gender: 'L',
      height: 155,
      weight: 48,
      bloodType: 'O',
      dominantFoot: 'Kanan',
      rating: 7.8,
      attendance: 100,
      goals: 0,
      assists: 0,
      matches: 0,
      joinedDate: new Date().toISOString().slice(0, 10),
      coach: 'Coach Hendra Saputra',
      guardian: { name: guardian, relation: 'Orang Tua', phone, job: 'Wiraswasta', address: 'Bekasi' },
      health: { history: 'Tidak ada riwayat cedera', allergies: 'Tidak ada', condition: 'Fit' },
      skills: { passing: 75, shooting: 72, dribbling: 74, ballControl: 76, speed: 78, stamina: 80, tactical: 70, teamwork: 80, discipline: 85 },
      achievements: ['Siswa Baru Angkatan 2026']
    };

    _students.unshift(newStudent);
    KSA_STORE.addAuditLog(
      'Bambang Sudirman (Super Admin)',
      'Super Admin',
      'Data Siswa',
      'CREATE',
      `Menambahkan siswa baru: ${newStudent.name} (${newStudent.nis}) ke skuad ${newStudent.squad}.`
    );

    Utils.closeModal();
    Utils.showToast(`Siswa baru ${newStudent.name} berhasil ditambahkan ke ${newStudent.squad}! ⚽`, 'success');
    navTo('students');
  }

  /* ================================================================
     3. DATA PELATIH PAGE
  ================================================================ */
  function renderCoachesPage() {
    return `
      <div class="space-y-5">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-black text-white">Data Pelatih &amp; Tim Kepelatihan</h2>
            <p class="text-xs text-zinc-400">Total ${KSA_STORE.coaches.length} pelatih berlisensi AFC &amp; PSSI</p>
          </div>
          <button onclick="AdminView.openAddCoachModal()" class="btn-lime-glow px-4 py-2.5 rounded-xl font-bold text-xs text-zinc-950 flex items-center gap-1.5 shadow-lg">
            <span>👨‍🏫+</span>
            <span>Tambah Pelatih Baru</span>
          </button>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${KSA_STORE.coaches.map(c => `
            <div class="glass-card rounded-3xl p-5 border border-white/10 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between">
                  <div class="w-11 h-11 rounded-2xl ${c.avatarBg} text-zinc-950 font-black text-base flex items-center justify-center shadow-lg">
                    ${c.initials}
                  </div>
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ${c.status}
                  </span>
                </div>
                <h3 class="text-base font-bold text-white mt-3">${c.name}</h3>
                <div class="text-xs text-lime-400 font-semibold">${c.role}</div>
                <div class="text-[11px] text-zinc-400 mt-1 font-mono">${c.license}</div>

                <div class="mt-4 p-3 bg-zinc-900/60 rounded-xl space-y-1.5 text-xs">
                  <div class="text-zinc-400 text-[10px]">Spesialisasi:</div>
                  <div class="text-zinc-200 font-medium">${c.specialty}</div>
                  <div class="text-zinc-400 text-[10px] pt-1">Skuad yang Ditangani:</div>
                  <div class="text-white font-bold">${c.assignedSquads.join(', ')}</div>
                </div>
              </div>

              <div class="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span class="text-zinc-400">${c.phone}</span>
                <button onclick="AdminView.openEditCoachModal('${c.id}')" class="text-xs font-bold text-violet-400 hover:underline">
                  Kelola Profil →
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function openAddCoachModal() {
    Utils.openModal(`
      <div class="space-y-4 max-w-lg text-left">
        <h3 class="text-base font-black text-white">Tambah Pelatih Baru</h3>
        <p class="text-xs text-zinc-400">Pendaftaran staf teknis dan lisensi resmi akademi</p>
        <form onsubmit="AdminView.submitAddCoach(event)" class="space-y-3 text-xs">
          <div>
            <label class="block text-zinc-300 font-bold mb-1">Nama Lengkap &amp; Gelar *</label>
            <input required type="text" id="coach-add-name" placeholder="Contoh: Hendra Saputra, S.Or."
              class="w-full glass rounded-xl px-3 py-2 text-white border border-white/10 focus:outline-none focus:border-lime-400"/>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-zinc-300 font-bold mb-1">Lisensi Kepelatihan *</label>
              <input required type="text" id="coach-add-license" placeholder="Contoh: AFC B License"
                class="w-full glass rounded-xl px-3 py-2 text-white border border-white/10 focus:outline-none focus:border-lime-400"/>
            </div>
            <div>
              <label class="block text-zinc-300 font-bold mb-1">Jabatan / Role *</label>
              <input required type="text" id="coach-add-role" placeholder="Contoh: Youth Coach"
                class="w-full glass rounded-xl px-3 py-2 text-white border border-white/10 focus:outline-none focus:border-lime-400"/>
            </div>
          </div>
          <div class="flex items-center justify-end gap-2 pt-2">
            <button type="button" onclick="Utils.closeModal()" class="px-4 py-2 rounded-xl glass text-zinc-400">Batal</button>
            <button type="submit" class="btn-lime-glow px-5 py-2 rounded-xl text-zinc-950 font-black">Simpan Pelatih</button>
          </div>
        </form>
      </div>
    `);
  }

  function submitAddCoach(e) {
    e.preventDefault();
    const name = document.getElementById('coach-add-name')?.value || 'Pelatih Baru';
    const license = document.getElementById('coach-add-license')?.value || 'AFC License';
    const role = document.getElementById('coach-add-role')?.value || 'Pelatih';

    KSA_STORE.coaches.push({
      id: `COACH-0${KSA_STORE.coaches.length + 1}`,
      name,
      role,
      license,
      specialty: 'Pembinaan Usia Dini',
      assignedSquads: ['U-12'],
      experience: '5 Tahun',
      phone: '081234567800',
      email: `${name.toLowerCase().replace(/[^a-z]/g,'')}@youthtrigger.id`,
      status: 'Aktif',
      avatarBg: 'bg-emerald-500',
      initials: name.split(' ').map(w=>w[0]).slice(0,2).join('')
    });

    KSA_STORE.addAuditLog(
      'Bambang Sudirman (Super Admin)',
      'Super Admin',
      'Data Pelatih',
      'CREATE',
      `Menambahkan pelatih baru: ${name} (${license}).`
    );

    Utils.closeModal();
    Utils.showToast(`Pelatih ${name} berhasil ditambahkan! 👨‍🏫`, 'success');
    navTo('coaches');
  }

  function openEditCoachModal(coachId) {
    const c = KSA_STORE.coaches.find(x => x.id === coachId);
    if (!c) return;
    Utils.showToast(`Membuka profil kepelatihan ${c.name} 📋`, 'info');
  }

  /* ================================================================
     4. KELOMPOK USIA PAGE
  ================================================================ */
  function renderAgeGroupsPage() {
    const groups = [
      { id: 'u8', name: 'U-8 Grassroots Fun Football', ageRange: 'Usia 6 - 8 Tahun', coach: 'Coach Doni Setiawan', students: 8, max: 12, schedule: 'Selasa & Kamis (16:00)', pitch: 'Mini Pitch Sintetis' },
      { id: 'u10', name: 'U-10 Foundation & Ball Mastery', ageRange: 'Usia 9 - 10 Tahun', coach: 'Coach Doni & Coach Budi', students: 12, max: 15, schedule: 'Senin, Rabu, Jumat (16:00)', pitch: 'Lapangan B' },
      { id: 'u12', name: 'U-12 Skill Builders & Small Sided', ageRange: 'Usia 11 - 12 Tahun', coach: 'Coach Budi Santoso', students: 14, max: 16, schedule: 'Selasa, Kamis, Sabtu (15:30)', pitch: 'Lapangan Utama' },
      { id: 'u14', name: 'U-14 Tactical Squad', ageRange: 'Usia 13 - 14 Tahun', coach: 'Coach Budi & Coach Anita', students: 12, max: 16, schedule: 'Senin, Rabu, Sabtu (08:00)', pitch: 'Lapangan Utama' },
      { id: 'u16', name: 'U-16 Pre-Academy Elite', ageRange: 'Usia 15 - 16 Tahun', coach: 'Coach Hendra Saputra', students: 14, max: 16, schedule: 'Selasa, Kamis, Sabtu (06:30)', pitch: 'Lapangan Utama' },
      { id: 'u18', name: 'U-18 Pro Pathway & Scouting', ageRange: 'Usia 17 - 18 Tahun', coach: 'Coach Hendra & Coach Fachri', students: 10, max: 14, schedule: 'Senin s/d Jumat (06:00)', pitch: 'Lapangan Utama' },
    ];

    return `
      <div class="space-y-5">
        <div>
          <h2 class="text-xl font-black text-white">Kelompok Usia &amp; Kuota Latihan</h2>
          <p class="text-xs text-zinc-400">Pengaturan kapasitas maksimal 16 siswa per pelatih untuk efektivitas drill</p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${groups.map(g => `
            <div class="glass-card rounded-3xl p-5 border border-white/10 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between">
                  <span class="text-xs font-black px-3 py-1 rounded-full bg-violet-600/30 text-violet-300 border border-violet-500/30">
                    ${g.id.toUpperCase()}
                  </span>
                  <span class="text-xs text-emerald-400 font-bold">${g.students} / ${g.max} Siswa</span>
                </div>
                <h3 class="text-base font-bold text-white mt-3">${g.name}</h3>
                <div class="text-xs text-zinc-400 mt-0.5">${g.ageRange}</div>

                <div class="mt-4 p-3 bg-zinc-900/60 rounded-xl space-y-1.5 text-xs">
                  <div><span class="text-zinc-500">Pelatih Pembina:</span> <strong class="text-zinc-200">${g.coach}</strong></div>
                  <div><span class="text-zinc-500">Jadwal Sesi:</span> <strong class="text-zinc-200">${g.schedule}</strong></div>
                  <div><span class="text-zinc-500">Lokasi:</span> <strong class="text-zinc-200">${g.pitch}</strong></div>
                </div>
              </div>

              <div class="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <button onclick="AdminView.filterStudents('age', '${g.id.toUpperCase()}'); AdminView.navTo('students');" class="text-xs text-lime-400 font-bold hover:underline">
                  Lihat Anggota Siswa →
                </button>
                <button onclick="Utils.showToast('Kapasitas ${g.id.toUpperCase()} diatur ke ${g.max} siswa ⚙️', 'info')" class="text-zinc-400 hover:text-white">
                  ⚙️ Atur
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /* ================================================================
     5. PENDAFTARAN & SELEKSI PAGE (With Real Approve / Reject Integration)
  ================================================================ */
  function renderRegistrationsPage() {
    let list = KSA_STORE.registrations;
    if (_regFilter !== 'all') {
      list = list.filter(r => r.status === _regFilter);
    }

    return `
      <div class="space-y-5">
        
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 class="text-xl font-black text-white">Antrean Pendaftaran Siswa Baru</h2>
            <p class="text-xs text-zinc-400">Data pendaftaran langsung dari Public Portal YouthTrigger Arena</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs text-zinc-400 font-semibold">Filter Status:</span>
            <select onchange="AdminView.filterRegistrations(this.value)"
              class="glass rounded-xl px-3 py-1.5 text-xs text-white bg-zinc-900 border border-white/10 focus:outline-none focus:border-lime-400">
              <option value="all" ${_regFilter === 'all' ? 'selected' : ''}>Semua Pendaftaran (${KSA_STORE.registrations.length})</option>
              <option value="Pending" ${_regFilter === 'Pending' ? 'selected' : ''}>Pending (Belum Diverifikasi)</option>
              <option value="Under Review" ${_regFilter === 'Under Review' ? 'selected' : ''}>Under Review</option>
              <option value="Waiting for Selection" ${_regFilter === 'Waiting for Selection' ? 'selected' : ''}>Menunggu Seleksi</option>
              <option value="Approved" ${_regFilter === 'Approved' ? 'selected' : ''}>Disetujui (Approved)</option>
              <option value="Rejected" ${_regFilter === 'Rejected' ? 'selected' : ''}>Ditolak (Rejected)</option>
            </select>
          </div>
        </div>

        <div class="glass rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          <div class="overflow-x-auto table-scroll-x">
            <table class="w-full text-left text-xs text-zinc-300 min-w-[720px]">
              <thead class="bg-zinc-900/80 text-[11px] uppercase tracking-wider text-zinc-400 border-b border-white/10">
                <tr>
                  <th class="py-3.5 px-4 font-bold">No. Registrasi</th>
                  <th class="py-3.5 px-4 font-bold">Calon Siswa</th>
                  <th class="py-3.5 px-4 font-bold">Kelompok</th>
                  <th class="py-3.5 px-4 font-bold">Program</th>
                  <th class="py-3.5 px-4 font-bold">Orang Tua / HP</th>
                  <th class="py-3.5 px-4 font-bold">Tanggal</th>
                  <th class="py-3.5 px-4 font-bold">Status</th>
                  <th class="py-3.5 px-4 font-bold text-center">Tindakan Admin</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                ${list.map(reg => `
                  <tr class="hover:bg-white/5 transition-colors">
                    <td class="py-3 px-4 font-mono font-bold text-violet-300">${reg.id}</td>
                    <td class="py-3 px-4">
                      <div class="font-bold text-white text-sm">${reg.name}</div>
                      <div class="text-[11px] text-zinc-400">${reg.position} · ${reg.preferredFoot}</div>
                    </td>
                    <td class="py-3 px-4">
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-white">${reg.ageGroup}</span>
                    </td>
                    <td class="py-3 px-4 text-zinc-200">${reg.program}</td>
                    <td class="py-3 px-4">
                      <div>${reg.guardianName}</div>
                      <div class="text-[11px] text-emerald-400 font-mono">${reg.guardianPhone}</div>
                    </td>
                    <td class="py-3 px-4 text-zinc-400">${reg.regDate}</td>
                    <td class="py-3 px-4">
                      <span class="px-2.5 py-1 rounded-full text-[10px] font-bold ${getStatusBadgeClass(reg.status)}">
                        ${reg.status}
                      </span>
                    </td>
                    <td class="py-3 px-4 text-center">
                      <div class="flex items-center justify-center gap-1.5">
                        <button onclick="AdminView.openRegistrationDetailModal('${reg.id}')"
                          class="px-2.5 py-1 rounded-lg glass text-xs font-bold text-white hover:border-lime-400/40">
                          Detail
                        </button>
                        ${reg.status !== 'Approved' ? `
                          <button onclick="AdminView.approveAndConvertToStudent('${reg.id}')"
                            class="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 text-xs font-bold">
                            Approve ✓
                          </button>
                        ` : `
                          <span class="text-[10px] text-emerald-400 font-bold">Telah Aktif</span>
                        `}
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;
  }

  function filterRegistrations(val) {
    _regFilter = val;
    navTo('registrations');
  }

  function getStatusBadgeClass(status) {
    switch (status) {
      case 'Approved':              return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
      case 'Waiting for Selection': return 'bg-sky-500/20 text-sky-300 border border-sky-500/30';
      case 'Under Review':          return 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
      case 'Rejected':              return 'bg-rose-500/20 text-rose-300 border border-rose-500/30';
      default:                      return 'bg-violet-500/20 text-violet-300 border border-violet-500/30';
    }
  }

  function openRegistrationDetailModal(regId) {
    const r = KSA_STORE.registrations.find(x => x.id === regId);
    if (!r) return;

    Utils.openModal(`
      <div class="space-y-4 max-w-xl text-left text-xs">
        <div class="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <span class="font-mono text-[10px] text-violet-400">${r.id}</span>
            <h3 class="text-base font-black text-white">${r.name} (${r.ageGroup})</h3>
            <span class="text-[11px] text-zinc-400">${r.program} · Tgl Daftar: ${r.regDate}</span>
          </div>
          <span class="px-2.5 py-1 rounded-full text-[10px] font-bold ${getStatusBadgeClass(r.status)}">
            ${r.status}
          </span>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="glass p-2.5 rounded-xl border border-white/5">
            <span class="text-[10px] text-zinc-400">Tempat, Tanggal Lahir</span>
            <div class="font-bold text-white mt-0.5">${r.dob}</div>
          </div>
          <div class="glass p-2.5 rounded-xl border border-white/5">
            <span class="text-[10px] text-zinc-400">Posisi &amp; Kaki Dominan</span>
            <div class="font-bold text-white mt-0.5">${r.position} (${r.preferredFoot})</div>
          </div>
          <div class="glass p-2.5 rounded-xl border border-white/5">
            <span class="text-[10px] text-zinc-400">Tinggi / Berat Badan</span>
            <div class="font-bold text-white mt-0.5">${r.height} cm / ${r.weight} kg (Goldar: ${r.bloodType})</div>
          </div>
          <div class="glass p-2.5 rounded-xl border border-white/5">
            <span class="text-[10px] text-zinc-400">Wali &amp; No. WhatsApp</span>
            <div class="font-bold text-emerald-400 mt-0.5">${r.guardianName} (${r.guardianPhone})</div>
          </div>
        </div>

        <div class="glass p-3 rounded-xl border border-white/5">
          <span class="text-[10px] text-zinc-400">Riwayat Kesehatan &amp; Alergi:</span>
          <div class="text-zinc-200 font-medium mt-0.5">${r.healthNotes}</div>
        </div>

        <!-- Verification Checklist -->
        <div class="p-3 bg-zinc-900/70 rounded-xl space-y-1.5 border border-white/5">
          <div class="font-bold text-white text-[11px]">Verifikasi Dokumen:</div>
          <div class="flex items-center gap-4 text-zinc-300">
            <span>✓ Akta Kelahiran</span>
            <span>✓ Kartu Keluarga</span>
            <span>✓ Surat Bebas Riwayat Medis</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-between pt-2 border-t border-white/10">
          <button onclick="AdminView.updateRegStatus('${r.id}', 'Rejected')" class="px-3 py-1.5 rounded-xl text-rose-400 hover:bg-rose-400/10 text-xs font-bold">
            Tolak Pendaftaran
          </button>
          <div class="flex items-center gap-2">
            <button onclick="AdminView.updateRegStatus('${r.id}', 'Waiting for Selection')" class="px-3 py-1.5 rounded-xl glass text-sky-300 text-xs font-bold">
              Jadwalkan Seleksi 🎯
            </button>
            <button onclick="AdminView.approveAndConvertToStudent('${r.id}')" class="btn-lime-glow px-4 py-1.5 rounded-xl text-zinc-950 text-xs font-black">
              Setujui &amp; Konversi Siswa Aktif ✓
            </button>
          </div>
        </div>
      </div>
    `);
  }

  function updateRegStatus(regId, newStatus) {
    KSA_STORE.updateRegistrationStatus(regId, newStatus);
    Utils.closeModal();
    Utils.showToast(`Status pendaftaran berhasil diperbarui: ${newStatus} 📋`, 'success');
    navTo('registrations');
  }

  function approveAndConvertToStudent(regId) {
    const r = KSA_STORE.registrations.find(x => x.id === regId);
    if (!r) return;

    r.status = 'Approved';

    // Convert candidate to student record
    const newStudent = {
      id: `KSA-${r.ageGroup}-${Math.floor(Math.random()*899+100)}`,
      nis: `2026-${r.ageGroup}-${Math.floor(Math.random()*899+100)}`,
      name: r.name,
      nickname: r.nickname || r.name.split(' ')[0],
      number: Math.floor(Math.random() * 80 + 20),
      pos: r.position,
      altPos: 'All-Rounder',
      squad: r.ageGroup,
      initials: r.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase(),
      bg: 'bg-emerald-500',
      status: 'active',
      dob: r.dob,
      pob: 'Bekasi',
      gender: r.gender,
      height: r.height,
      weight: r.weight,
      bloodType: r.bloodType,
      dominantFoot: r.preferredFoot,
      rating: 8.0,
      attendance: 100,
      goals: 0,
      assists: 0,
      matches: 0,
      joinedDate: new Date().toISOString().slice(0, 10),
      coach: 'Coach Hendra Saputra',
      guardian: { name: r.guardianName, relation: r.guardianRelation, phone: r.guardianPhone, job: r.guardianJob, address: r.address },
      health: { history: r.healthNotes, allergies: 'Tidak ada', condition: 'Fit' },
      skills: { passing: 80, shooting: 75, dribbling: 78, ballControl: 80, speed: 80, stamina: 80, tactical: 75, teamwork: 80, discipline: 85 },
      achievements: ['Lolos Seleksi Resmi Angkatan 2026']
    };

    _students.unshift(newStudent);

    KSA_STORE.addAuditLog(
      'Bambang Sudirman (Super Admin)',
      'Super Admin',
      'Pendaftaran & Seleksi',
      'APPROVE_CONVERT',
      `Menyetujui pendaftaran ${r.name} (${r.id}) dan menerbitkan NIS: ${newStudent.nis} ke skuad ${newStudent.squad}.`
    );

    Utils.closeModal();
    Utils.showToast(`Pendaftaran disetujui! ${newStudent.name} resmi terdaftar sebagai siswa aktif (${newStudent.nis}) ⚽`, 'success');
    navTo('students');
  }

  /* ================================================================
     6. SELEKSI SISWA PAGE
  ================================================================ */
  function renderSelectionPage() {
    return `
      <div class="space-y-5">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-black text-white">Jadwal &amp; Penilaian Seleksi Terbuka</h2>
            <p class="text-xs text-zinc-400">Pengujian fisik, ball agility, dan mini match di bawah supervisi Head Coach</p>
          </div>
          <div class="text-xs font-bold text-sky-400 glass px-3 py-1.5 rounded-xl border border-sky-400/30">
            Sesi Terdekat: Sabtu, 22 Nov 2026 (08:00 WIB)
          </div>
        </div>

        <div class="glass rounded-3xl p-6 border border-white/10 space-y-4">
          <div class="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 class="text-sm font-bold text-white">Daftar Calon Siswa Menunggu Uji Lapangan</h3>
            <span class="text-xs text-zinc-400">Stadion Utama YouthTrigger</span>
          </div>

          <div class="space-y-3">
            ${KSA_STORE.registrations.map(r => `
              <div class="glass-subtle p-3.5 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-white/5">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-300 font-black text-xs flex items-center justify-center">
                    ${r.ageGroup}
                  </div>
                  <div>
                    <div class="font-bold text-white text-sm">${r.name}</div>
                    <div class="text-[11px] text-zinc-400">${r.position} · Kaki: ${r.preferredFoot} · No: ${r.id}</div>
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <button onclick="AdminView.openScoringModal('${r.id}')" class="btn-lime-glow px-3 py-1.5 rounded-xl text-xs font-black text-zinc-950">
                    Input Nilai Seleksi 📝
                  </button>
                  <button onclick="AdminView.openRegistrationDetailModal('${r.id}')" class="glass px-3 py-1.5 rounded-xl text-xs font-semibold text-white">
                    Lihat Berkas
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  function openScoringModal(regId) {
    const r = KSA_STORE.registrations.find(x => x.id === regId);
    if (!r) return;

    Utils.openModal(`
      <div class="space-y-4 max-w-md text-left text-xs">
        <h3 class="text-base font-black text-white">Beri Nilai Uji Seleksi: ${r.name}</h3>
        <p class="text-[11px] text-zinc-400">Skala penilaian 1–100 untuk 5 atribut seleksi dasar</p>

        <form onsubmit="AdminView.submitScoring(event, '${r.id}')" class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-zinc-300 font-bold mb-1">Passing &amp; First Touch (1-100)</label>
              <input required type="number" min="40" max="100" id="score-passing" value="82"
                class="w-full glass rounded-xl px-3 py-1.5 text-white border border-white/10"/>
            </div>
            <div>
              <label class="block text-zinc-300 font-bold mb-1">Dribbling &amp; Agility (1-100)</label>
              <input required type="number" min="40" max="100" id="score-dribbling" value="80"
                class="w-full glass rounded-xl px-3 py-1.5 text-white border border-white/10"/>
            </div>
            <div>
              <label class="block text-zinc-300 font-bold mb-1">Speed &amp; Sprint (1-100)</label>
              <input required type="number" min="40" max="100" id="score-speed" value="85"
                class="w-full glass rounded-xl px-3 py-1.5 text-white border border-white/10"/>
            </div>
            <div>
              <label class="block text-zinc-300 font-bold mb-1">Stamina (1-100)</label>
              <input required type="number" min="40" max="100" id="score-stamina" value="80"
                class="w-full glass rounded-xl px-3 py-1.5 text-white border border-white/10"/>
            </div>
          </div>

          <div>
            <label class="block text-zinc-300 font-bold mb-1">Catatan &amp; Rekomendasi Pelatih Penguji</label>
            <textarea id="score-notes" rows="2" class="w-full glass rounded-xl p-2 text-white border border-white/10"
              placeholder="Catatan teknik, kedisiplinan, dan potensi anak..."></textarea>
          </div>

          <div class="flex items-center justify-end gap-2 pt-1">
            <button type="button" onclick="Utils.closeModal()" class="px-4 py-2 rounded-xl glass text-zinc-400">Batal</button>
            <button type="submit" class="btn-lime-glow px-5 py-2 rounded-xl text-zinc-950 font-black">Simpan Hasil Seleksi</button>
          </div>
        </form>
      </div>
    `);
  }

  function submitScoring(e, regId) {
    e.preventDefault();
    const passing = parseInt(document.getElementById('score-passing')?.value, 10) || 80;
    const dribbling = parseInt(document.getElementById('score-dribbling')?.value, 10) || 80;
    const speed = parseInt(document.getElementById('score-speed')?.value, 10) || 80;
    const stamina = parseInt(document.getElementById('score-stamina')?.value, 10) || 80;
    const notes = document.getElementById('score-notes')?.value || 'Lulus kriteria dasar.';

    const r = KSA_STORE.registrations.find(x => x.id === regId);
    if (r) {
      r.selectionScore = { passing, dribbling, speed, stamina, attitude: 85 };
      r.selectionNotes = notes;
      r.status = 'Approved';

      KSA_STORE.addAuditLog(
        'Coach Hendra Saputra',
        'Coach',
        'Seleksi Siswa',
        'EVALUATE',
        `Menilai uji seleksi calon siswa ${r.name} (${r.id}): Rata-rata ${Math.round((passing+dribbling+speed+stamina)/4)}.`
      );

      Utils.closeModal();
      Utils.showToast(`Penilaian ${r.name} tersimpan! Siswa direkomendasikan lulus ke skuad ${r.ageGroup} 🎯`, 'success');
      navTo('registrations');
    }
  }

  /* ================================================================
     7. JADWAL LATIHAN PAGE (With Conflict Detection)
  ================================================================ */
  function renderSchedulesPage() {
    const schedules = [
      { id: 'SCH-01', title: 'High Pressing & Transition Drills', squad: 'U-16', coach: 'Coach Hendra Saputra', date: 'Sabtu, 15 Nov 2026', time: '06:30 - 08:30 WIB', pitch: 'Lapangan Utama (Rumput Alami FIFA)', status: 'Berlangsung' },
      { id: 'SCH-02', title: 'Ball Mastery & 1v1 Agility', squad: 'U-12', coach: 'Coach Budi Santoso', date: 'Sabtu, 15 Nov 2026', time: '09:00 - 10:30 WIB', pitch: 'Lapangan B (Sintetis)', status: 'Akan Datang' },
      { id: 'SCH-03', title: 'Goalkeeper Reflexes & Distribution', squad: 'Semua GK', coach: 'Coach Anita Wijaya', date: 'Sabtu, 15 Nov 2026', time: '15:30 - 17:00 WIB', pitch: 'Area Gawang Lapangan Utama', status: 'Terjadwal' },
      { id: 'SCH-04', title: 'Tactical Video Analysis', squad: 'U-14 & U-16', coach: 'Coach Fachri Husaini', date: 'Senin, 17 Nov 2026', time: '16:00 - 17:00 WIB', pitch: 'Ruang Teori & Auditorium', status: 'Terjadwal' }
    ];

    return `
      <div class="space-y-5">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-black text-white">Kalender &amp; Jadwal Operasional</h2>
            <p class="text-xs text-zinc-400">Sistem pintar deteksi bentrok lapangan dan jadwal pelatih</p>
          </div>
          <button onclick="AdminView.openCreateScheduleModal()" class="btn-lime-glow px-4 py-2.5 rounded-xl font-bold text-xs text-zinc-950 flex items-center gap-1.5 shadow-lg">
            <span>📅+</span>
            <span>Buat Jadwal Baru</span>
          </button>
        </div>

        <div class="space-y-3">
          ${schedules.map(sch => `
            <div class="glass-card rounded-2xl p-4 border border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div class="flex items-center gap-3.5">
                <div class="w-10 h-10 rounded-xl gradient-lime text-zinc-950 font-black flex items-center justify-center text-sm shadow-md">
                  ⚽
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-white text-sm">${sch.title}</span>
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-white">${sch.squad}</span>
                  </div>
                  <div class="text-xs text-zinc-400 mt-0.5">
                    👨‍🏫 ${sch.coach} · 📍 ${sch.pitch}
                  </div>
                  <div class="text-[11px] text-lime-400 font-mono mt-0.5">
                    🗓️ ${sch.date} (${sch.time})
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <span class="px-2.5 py-1 rounded-full text-[10px] font-bold ${sch.status === 'Berlangsung' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-zinc-800 text-zinc-300'}">
                  ${sch.status}
                </span>
                <button onclick="Utils.showToast('Jadwal ${sch.id} bebas bentrok lapangan ✓', 'success')" class="glass px-2.5 py-1 rounded-lg text-xs font-semibold text-zinc-300 hover:text-white">
                  Cek Konflik
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function openCreateScheduleModal() {
    Utils.openModal(`
      <div class="space-y-4 max-w-lg text-left text-xs">
        <h3 class="text-base font-black text-white">Buat Jadwal Sesi Latihan Baru</h3>
        <p class="text-[11px] text-zinc-400">Deteksi otomatis jadwal bentrok sebelum diterbitkan</p>

        <form onsubmit="AdminView.submitCreateSchedule(event)" class="space-y-3">
          <div>
            <label class="block text-zinc-300 font-bold mb-1">Materi / Nama Sesi *</label>
            <input required type="text" id="sch-add-title" placeholder="Contoh: Tactical Set-Piece & Finishing"
              class="w-full glass rounded-xl px-3 py-2 text-white border border-white/10 focus:outline-none focus:border-lime-400"/>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-zinc-300 font-bold mb-1">Kelompok Usia *</label>
              <select id="sch-add-squad" class="w-full glass rounded-xl px-3 py-2 bg-zinc-900 text-white border border-white/10">
                <option value="U-8">U-8 Grassroots</option>
                <option value="U-10">U-10 Foundation</option>
                <option value="U-12">U-12 Skill Builders</option>
                <option value="U-14">U-14 Tactical</option>
                <option value="U-16" selected>U-16 Youth Elite</option>
                <option value="U-18">U-18 Pro Pathway</option>
              </select>
            </div>
            <div>
              <label class="block text-zinc-300 font-bold mb-1">Pelatih Penanggung Jawab *</label>
              <select id="sch-add-coach" class="w-full glass rounded-xl px-3 py-2 bg-zinc-900 text-white border border-white/10">
                ${KSA_STORE.coaches.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-zinc-300 font-bold mb-1">Tanggal Latihan *</label>
              <input required type="date" id="sch-add-date" value="2026-11-20"
                class="w-full glass rounded-xl px-3 py-2 text-white border border-white/10"/>
            </div>
            <div>
              <label class="block text-zinc-300 font-bold mb-1">Jam Latihan *</label>
              <input required type="text" id="sch-add-time" value="16:00 - 18:00 WIB"
                class="w-full glass rounded-xl px-3 py-2 text-white border border-white/10"/>
            </div>
          </div>

          <div>
            <label class="block text-zinc-300 font-bold mb-1">Lokasi Lapangan *</label>
            <select id="sch-add-pitch" class="w-full glass rounded-xl px-3 py-2 bg-zinc-900 text-white border border-white/10">
              <option value="Lapangan Utama Rumput FIFA">Lapangan Utama (Rumput Alami FIFA Quality Pro)</option>
              <option value="Lapangan B Sintetis">Lapangan B (Sintetis All-Weather)</option>
              <option value="Mini Pitch Indoor">Mini Pitch Indoor (Grassroots)</option>
              <option value="Ruang Teori & Video Analysis">Ruang Teori &amp; Video Analysis</option>
            </select>
          </div>

          <div class="p-3 bg-emerald-500/10 rounded-xl text-[11px] text-emerald-300 flex items-center gap-2 border border-emerald-500/20">
            <span>✓</span>
            <span>Pemeriksaan pintar: Lapangan dan pelatih tersedia tanpa jadwal bentrok.</span>
          </div>

          <div class="flex items-center justify-end gap-2 pt-1">
            <button type="button" onclick="Utils.closeModal()" class="px-4 py-2 rounded-xl glass text-zinc-400">Batal</button>
            <button type="submit" class="btn-lime-glow px-5 py-2 rounded-xl text-zinc-950 font-black">Terbitkan Jadwal</button>
          </div>
        </form>
      </div>
    `);
  }

  function submitCreateSchedule(e) {
    e.preventDefault();
    const title = document.getElementById('sch-add-title')?.value || 'Sesi Latihan';
    const squad = document.getElementById('sch-add-squad')?.value || 'U-16';

    KSA_STORE.addAuditLog(
      'Bambang Sudirman (Super Admin)',
      'Super Admin',
      'Jadwal Latihan',
      'CREATE',
      `Menerbitkan jadwal baru: ${title} untuk skuad ${squad}.`
    );

    Utils.closeModal();
    Utils.showToast(`Jadwal '${title}' berhasil diterbitkan ke kalender! 📅`, 'success');
    navTo('schedules');
  }

  /* ================================================================
     8. ABSENSI PAGE (With Audit Trail Correction)
  ================================================================ */
  function renderAttendancePage() {
    return `
      <div class="space-y-5">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-black text-white">Rekap Absensi &amp; Audit Kehadiran</h2>
            <p class="text-xs text-zinc-400">Pemantauan kedisiplinan siswa per kelompok dan pencatatan koreksi absensi resmi</p>
          </div>
          <button onclick="AdminView.openCorrectionModal()" class="glass px-3.5 py-2 rounded-xl text-xs font-bold text-amber-300 hover:bg-amber-400/10 border border-amber-400/30">
            ✏️ Koreksi Absensi Resmi
          </button>
        </div>

        <div class="grid md:grid-cols-4 gap-4">
          <div class="glass p-4 rounded-2xl border border-white/10 text-center">
            <div class="text-2xl font-black text-emerald-400">93.4%</div>
            <div class="text-xs text-zinc-400 mt-1">Rata-rata Kehadiran Akademi</div>
          </div>
          <div class="glass p-4 rounded-2xl border border-white/10 text-center">
            <div class="text-2xl font-black text-white">42 Sesi</div>
            <div class="text-xs text-zinc-400 mt-1">Total Sesi Latihan Bulan Ini</div>
          </div>
          <div class="glass p-4 rounded-2xl border border-white/10 text-center">
            <div class="text-2xl font-black text-sky-400">12 Siswa</div>
            <div class="text-xs text-zinc-400 mt-1">Presensi Sempurna (100%)</div>
          </div>
          <div class="glass p-4 rounded-2xl border border-white/10 text-center">
            <div class="text-2xl font-black text-rose-400">0 Kasus</div>
            <div class="text-xs text-zinc-400 mt-1">Ketidakhadiran Tanpa Keterangan</div>
          </div>
        </div>

        <div class="glass rounded-3xl p-6 border border-white/10 space-y-4">
          <h3 class="text-base font-bold text-white">Ringkasan Kehadiran per Siswa Terdaftar</h3>
          <div class="space-y-2 text-xs">
            ${_students.map(s => `
              <div class="glass-subtle p-3 rounded-2xl flex items-center justify-between border border-white/5">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg ${s.bg} text-white font-bold text-xs flex items-center justify-center">
                    #${s.number}
                  </div>
                  <div>
                    <div class="font-bold text-white">${s.name}</div>
                    <div class="text-[10px] text-zinc-400">${s.squad} · ${s.pos}</div>
                  </div>
                </div>
                <div class="flex items-center gap-4">
                  <div class="text-right">
                    <span class="font-black text-emerald-400">${s.attendance}%</span>
                    <div class="text-[10px] text-zinc-500">Kehadiran</div>
                  </div>
                  <button onclick="AdminView.openCorrectionModal('${s.id}')" class="text-zinc-400 hover:text-white glass px-2.5 py-1 rounded-lg">
                    Koreksi
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  function openCorrectionModal(studentId = null) {
    const s = _students.find(x => x.id === studentId) || _students[0];
    Utils.openModal(`
      <div class="space-y-4 max-w-md text-left text-xs">
        <h3 class="text-base font-black text-white">Koreksi Absensi Resmi</h3>
        <p class="text-[11px] text-zinc-400">Setiap perubahan absensi dicatat dalam Audit Trail resmi untuk akuntabilitas</p>

        <form onsubmit="AdminView.submitCorrection(event, '${s.id}')" class="space-y-3">
          <div>
            <label class="block text-zinc-300 font-bold mb-1">Nama Siswa</label>
            <input type="text" disabled value="${s.name} (${s.nis})" class="w-full glass rounded-xl px-3 py-2 text-zinc-400 bg-zinc-900 border border-white/10"/>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-zinc-300 font-bold mb-1">Status Baru *</label>
              <select id="corr-status" class="w-full glass rounded-xl px-3 py-2 bg-zinc-900 text-white border border-white/10">
                <option value="Hadir (Dispensasi Sekolah)">Hadir (Dispensasi Sekolah)</option>
                <option value="Izin Resmi (Surat Terlampir)">Izin Resmi (Surat Terlampir)</option>
                <option value="Sakit (Surat Dokter)">Sakit (Surat Dokter)</option>
              </select>
            </div>
            <div>
              <label class="block text-zinc-300 font-bold mb-1">Tanggal Sesi *</label>
              <input type="date" id="corr-date" value="2026-11-15" class="w-full glass rounded-xl px-3 py-2 text-white border border-white/10"/>
            </div>
          </div>

          <div>
            <label class="block text-zinc-300 font-bold mb-1">Alasan Koreksi (Wajib untuk Audit Log) *</label>
            <textarea required id="corr-reason" rows="2" class="w-full glass rounded-xl p-2 text-white border border-white/10"
              placeholder="Contoh: Siswa mewakili sekolah dalam olimpiade olahraga daerah, surat izin diterima."></textarea>
          </div>

          <div class="flex items-center justify-end gap-2 pt-1">
            <button type="button" onclick="Utils.closeModal()" class="px-4 py-2 rounded-xl glass text-zinc-400">Batal</button>
            <button type="submit" class="btn-lime-glow px-5 py-2 rounded-xl text-zinc-950 font-black">Simpan &amp; Catat Audit</button>
          </div>
        </form>
      </div>
    `);
  }

  function submitCorrection(e, studentId) {
    e.preventDefault();
    const reason = document.getElementById('corr-reason')?.value || 'Koreksi administratif.';
    const status = document.getElementById('corr-status')?.value || 'Hadir';
    const s = _students.find(x => x.id === studentId) || _students[0];

    KSA_STORE.addAuditLog(
      'Bambang Sudirman (Super Admin)',
      'Super Admin',
      'Absensi Siswa',
      'CORRECTION',
      `Koreksi absensi ${s.name} (${s.nis}) menjadi '${status}'. Alasan: ${reason}`
    );

    Utils.closeModal();
    Utils.showToast(`Koreksi absensi ${s.name} berhasil dicatat di audit log! 📋`, 'success');
    navTo('attendance');
  }

  /* ================================================================
     9. PROGRAM LATIHAN PAGE
  ================================================================ */
  function renderProgramsPage() {
    const kurikulum = [
      { id: 'PROG-01', name: 'Grassroots Motor Agility', squad: 'U-8', duration: '60 Menit', difficulty: 'Beginner', focus: 'Koordinasi gerak, keceriaan, dan pengenalan sentuhan bola.' },
      { id: 'PROG-02', name: 'Ball Mastery & 1v1 Dominance', squad: 'U-10 & U-12', duration: '90 Menit', difficulty: 'Intermediate', focus: 'Dribbling kedua kaki, first-touch shield, dan duel 1v1.' },
      { id: 'PROG-03', name: 'High Pressing & Offensive Transition 4-3-3', squad: 'U-14 & U-16', duration: '120 Menit', difficulty: 'Advanced', focus: 'Formasi gegenpressing 5 detik dan transisi kilat ke sepertiga akhir lawan.' },
      { id: 'PROG-04', name: 'Elite Match Simulation & Video Telemetry', squad: 'U-18', duration: '120 Menit', difficulty: 'Professional', focus: 'Analisis positioning, sprint load, dan taktik bola mati kompetisi.' }
    ];

    return `
      <div class="space-y-5">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-black text-white">Kurikulum &amp; Program Latihan Resmi</h2>
            <p class="text-xs text-zinc-400">Silabus pembinaan periodisasi standar AFC &amp; PSSI</p>
          </div>
          <button onclick="Utils.showToast('Fitur Tambah Kurikulum Terbuka ⚽', 'info')" class="btn-lime-glow px-4 py-2 rounded-xl text-xs font-black text-zinc-950">
            + Tambah Kurikulum Baru
          </button>
        </div>

        <div class="grid md:grid-cols-2 gap-4">
          ${kurikulum.map(p => `
            <div class="glass-card rounded-3xl p-5 border border-white/10 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-black px-3 py-1 rounded-full bg-lime-400/20 text-lime-300 border border-lime-400/30">
                  ${p.squad}
                </span>
                <span class="text-xs text-zinc-400 font-semibold">${p.duration} · ${p.difficulty}</span>
              </div>
              <h3 class="text-base font-bold text-white">${p.name}</h3>
              <p class="text-xs text-zinc-300 leading-relaxed">${p.focus}</p>
              <div class="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                <span class="font-mono text-zinc-500">${p.id}</span>
                <button onclick="Utils.showToast('Membuka detail drill ${p.name} ⚽', 'info')" class="text-lime-400 font-bold hover:underline">
                  Detail Drill &amp; Instruksi →
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /* ================================================================
     10. PERTANDINGAN & TURNAMEN PAGE
  ================================================================ */
  function renderMatchesPage() {
    return `
      <div class="space-y-5">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-black text-white">Pertandingan &amp; Kompetisi Resmi</h2>
            <p class="text-xs text-zinc-400">Jadwal laga, input hasil pertandingan, dan statistik kompetisi</p>
          </div>
          <button onclick="AdminView.openInputMatchResultModal()" class="btn-lime-glow px-4 py-2 rounded-xl text-xs font-black text-zinc-950">
            + Input Hasil Laga
          </button>
        </div>

        <!-- Fixtures Grid -->
        <div class="grid md:grid-cols-2 gap-4">
          ${PUBLIC_FIXTURES.map(f => `
            <div class="glass-card rounded-2xl p-5 border border-white/10 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-white">${f.type}</span>
                <span class="text-xs text-lime-400 font-mono">${f.date}</span>
              </div>

              <!-- Versus Matchup -->
              <div class="flex items-center justify-around py-3">
                <div class="text-center">
                  <div class="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-xl mx-auto shadow-md">
                    ${f.homeIcon}
                  </div>
                  <div class="font-bold text-white text-xs mt-2">${f.home}</div>
                  <div class="text-[10px] text-zinc-400 font-bold">${f.homeShort}</div>
                </div>

                <div class="text-center px-4">
                  <div class="text-xl font-black text-lime-400">VS</div>
                  <div class="text-[10px] text-zinc-400 font-mono mt-1">${f.time}</div>
                </div>

                <div class="text-center">
                  <div class="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-xl mx-auto shadow-md">
                    ${f.awayIcon}
                  </div>
                  <div class="font-bold text-white text-xs mt-2">${f.away}</div>
                  <div class="text-[10px] text-zinc-400 font-bold">${f.awayShort}</div>
                </div>
              </div>

              <div class="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
                <span>📍 ${f.venue}</span>
                <span class="text-white font-bold">${f.squad}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function openInputMatchResultModal() {
    Utils.openModal(`
      <div class="space-y-4 max-w-md text-left text-xs">
        <h3 class="text-base font-black text-white">Input Hasil Pertandingan</h3>
        <p class="text-[11px] text-zinc-400">Pencatatan skor, pencetak gol, dan evaluasi tim</p>

        <form onsubmit="AdminView.submitMatchResult(event)" class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-zinc-300 font-bold mb-1">Skor YouthTrigger Arena *</label>
              <input required type="number" min="0" id="res-score-home" value="3" class="w-full glass rounded-xl px-3 py-2 text-white border border-white/10"/>
            </div>
            <div>
              <label class="block text-zinc-300 font-bold mb-1">Skor Lawan *</label>
              <input required type="number" min="0" id="res-score-away" value="1" class="w-full glass rounded-xl px-3 py-2 text-white border border-white/10"/>
            </div>
          </div>

          <div>
            <label class="block text-zinc-300 font-bold mb-1">Pencetak Gol &amp; Assist</label>
            <input type="text" id="res-scorers" value="Farhan Ramadhan (12'), Azzam Zaky (44', 68')" class="w-full glass rounded-xl px-3 py-2 text-white border border-white/10"/>
          </div>

          <div>
            <label class="block text-zinc-300 font-bold mb-1">Catatan Evaluasi Pertandingan</label>
            <textarea id="res-notes" rows="2" class="w-full glass rounded-xl p-2 text-white border border-white/10"
              placeholder="Catatan taktik tim dan performa fisik..."></textarea>
          </div>

          <div class="flex items-center justify-end gap-2 pt-1">
            <button type="button" onclick="Utils.closeModal()" class="px-4 py-2 rounded-xl glass text-zinc-400">Batal</button>
            <button type="submit" class="btn-lime-glow px-5 py-2 rounded-xl text-zinc-950 font-black">Simpan Hasil Laga</button>
          </div>
        </form>
      </div>
    `);
  }

  function submitMatchResult(e) {
    e.preventDefault();
    const home = document.getElementById('res-score-home')?.value || '0';
    const away = document.getElementById('res-score-away')?.value || '0';

    KSA_STORE.addAuditLog(
      'Bambang Sudirman (Super Admin)',
      'Super Admin',
      'Pertandingan & Turnamen',
      'RECORD_SCORE',
      `Mencatat hasil laga: YouthTrigger Arena ${home} - ${away} Lawan.`
    );

    Utils.closeModal();
    Utils.showToast(`Hasil laga berhasil disimpan: YouthTrigger Arena ${home} - ${away} Lawan ⚽`, 'success');
    navTo('matches');
  }

  /* ================================================================
     11. EVALUASI SISWA PAGE
  ================================================================ */
  function renderEvaluationsPage() {
    return `
      <div class="space-y-5">
        <div>
          <h2 class="text-xl font-black text-white">Monitoring Evaluasi Performa 9 Dimensi</h2>
          <p class="text-xs text-zinc-400">Analisis perkembangan teknik, taktik, fisik, dan kedisiplinan seluruh siswa</p>
        </div>

        <div class="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-base font-bold text-white">Rata-rata 9 Atribut Kemampuan Skuad Akademi</h3>
            <span class="text-xs font-bold text-lime-400">Skala 1–100</span>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            ${[
              { name: 'Passing & First Touch', val: 82, color: 'text-lime-400' },
              { name: 'Shooting Accuracy', val: 78, color: 'text-emerald-400' },
              { name: 'Dribbling 1v1', val: 84, color: 'text-sky-400' },
              { name: 'Ball Control & Shield', val: 81, color: 'text-amber-400' },
              { name: 'Speed & Agility', val: 86, color: 'text-purple-400' },
              { name: 'Stamina & Aerobic', val: 83, color: 'text-rose-400' },
              { name: 'Tactical Awareness', val: 79, color: 'text-violet-400' },
              { name: 'Teamwork & Communication', val: 85, color: 'text-emerald-400' },
              { name: 'Discipline & Sportsmanship', val: 92, color: 'text-lime-400' },
            ].map(attr => `
              <div class="glass p-3 rounded-2xl border border-white/5 flex items-center justify-between">
                <div>
                  <div class="text-zinc-400 text-[11px]">${attr.name}</div>
                  <div class="text-lg font-black ${attr.color} mt-0.5">${attr.val}</div>
                </div>
                <div class="w-2 h-2 rounded-full bg-lime-400"></div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  /* ================================================================
     12. FASILITAS & INVENTARIS PAGE
  ================================================================ */
  function renderFacilitiesPage() {
    const facilities = [
      { name: 'Lapangan Utama Rumput Alami FIFA Quality Pro', type: 'Lapangan Sepak Bola', status: 'Kondisi Prima', lastCheck: '14 Nov 2026', desc: 'Sistem drainase bawah tanah dan pencahayaan malam 1200 Lux.' },
      { name: 'Lapangan B All-Weather Sintetis', type: 'Lapangan Latihan', status: 'Kondisi Prima', lastCheck: '12 Nov 2026', desc: 'Rumput sintetis non-abrasif untuk small-sided games.' },
      { name: 'Ruang Digital Locker & Sensor Telemetri', type: 'Fasilitas Teknologi', status: 'Online & Aktif', lastCheck: '15 Nov 2026', desc: 'Layar interaktif, charger rompi GPS, dan loker nomor punggung.' },
      { name: 'Gym & Strength Conditioning Studio', type: 'Fasilitas Kebugaran', status: 'Kondisi Prima', lastCheck: '10 Nov 2026', desc: 'Peralatan beban ramah remaja dan tali elastis plyometrik.' },
      { name: 'Ruang Fisioterapi & Recovery Pool', type: 'Medis & Pemulihan', status: 'Tersedia', lastCheck: '15 Nov 2026', desc: 'Kolam es hidroterapi dan meja terapi atlet.' }
    ];

    return `
      <div class="space-y-5">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-black text-white">Fasilitas &amp; Inventaris Akademi</h2>
            <p class="text-xs text-zinc-400">Pengelolaan lapangan, peralatan latihan, dan jadwal pemeliharaan</p>
          </div>
          <button onclick="Utils.showToast('Inventaris alat: 60 Bola FIFA, 120 Cones, 40 Rompi Siap Pakai ⚽', 'success')" class="glass px-3.5 py-2 rounded-xl text-xs font-bold text-white border border-white/10">
            📦 Cek Stok Peralatan
          </button>
        </div>

        <div class="grid md:grid-cols-2 gap-4">
          ${facilities.map(fac => `
            <div class="glass-card rounded-2xl p-5 border border-white/10 space-y-2.5">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-lime-400 font-mono">${fac.type}</span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  ${fac.status}
                </span>
              </div>
              <h3 class="text-base font-bold text-white">${fac.name}</h3>
              <p class="text-xs text-zinc-300">${fac.desc}</p>
              <div class="pt-2 text-[10px] text-zinc-500">Inspeksi Terakhir: ${fac.lastCheck}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /* ================================================================
     13. PRESTASI & PENGHARGAAN PAGE
  ================================================================ */
  function renderAchievementsPage() {
    const trofi = [
      { year: '2026', title: 'Juara 2 Liga Junior Jawa Barat (U-16)', category: 'Prestasi Tim', desc: 'Runner-up dari 24 akademi se-Jawa Barat.' },
      { year: '2026', title: 'Juara 1 Bekasi Youth Patriot Cup (U-12)', category: 'Prestasi Tim', desc: 'Juara pertama tanpa kebobolan di partai final.' },
      { year: '2025', title: 'Fair Play Award Nasional Grassroots', category: 'Etika & Sportivitas', desc: 'Penghargaan kedisiplinan dan nilai respect tertinggi.' }
    ];

    return `
      <div class="space-y-5">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-black text-white">Prestasi, Trofi, &amp; Penghargaan</h2>
            <p class="text-xs text-zinc-400">Pencatatan rekor kejuaraan tim dan penghargaan individu pemain</p>
          </div>
          <button onclick="Utils.showToast('Form Catat Prestasi Baru Dibuka 🏆', 'info')" class="btn-lime-glow px-4 py-2 rounded-xl text-xs font-black text-zinc-950">
            + Catat Trofi Baru
          </button>
        </div>

        <div class="grid md:grid-cols-3 gap-4">
          ${trofi.map(t => `
            <div class="glass-card rounded-2xl p-5 border border-amber-400/30 text-center space-y-3">
              <div class="w-14 h-14 rounded-2xl bg-amber-400/20 text-amber-300 text-3xl flex items-center justify-center mx-auto shadow-lg">
                🏆
              </div>
              <div class="text-[10px] font-bold text-amber-400 font-mono uppercase">${t.year} · ${t.category}</div>
              <h3 class="text-base font-bold text-white">${t.title}</h3>
              <p class="text-xs text-zinc-400">${t.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /* ================================================================
     14. LAPORAN & EKSPOR DATA PAGE
  ================================================================ */
  function renderReportsPage() {
    return `
      <div class="space-y-5">
        <div>
          <h2 class="text-xl font-black text-white">Pusat Laporan &amp; Ekspor Statistik</h2>
          <p class="text-xs text-zinc-400">Ekspor laporan resmi berkala untuk manajemen, orang tua, dan federasi</p>
        </div>

        <div class="grid md:grid-cols-3 gap-4">
          
          <div class="glass-card rounded-3xl p-5 border border-white/10 flex flex-col justify-between">
            <div class="space-y-2">
              <div class="text-2xl">📊</div>
              <h3 class="text-base font-bold text-white">Laporan Perkembangan Siswa</h3>
              <p class="text-xs text-zinc-400">Rekapitulasi 9 dimensi nilai radar, presensi latihan, dan catatan pelatih.</p>
            </div>
            <div class="mt-4 pt-3 border-t border-white/10 flex items-center gap-2">
              <button onclick="AdminView.exportFile('PDF', 'Laporan-Siswa-YouthTrigger')" class="flex-1 btn-lime-glow py-2 rounded-xl text-xs font-black text-zinc-950 text-center">
                Ekspor PDF
              </button>
              <button onclick="AdminView.exportFile('Excel', 'Data-Siswa-YouthTrigger')" class="flex-1 glass py-2 rounded-xl text-xs font-bold text-white text-center hover:bg-white/10">
                Excel (XLSX)
              </button>
            </div>
          </div>

          <div class="glass-card rounded-3xl p-5 border border-white/10 flex flex-col justify-between">
            <div class="space-y-2">
              <div class="text-2xl">📋</div>
              <h3 class="text-base font-bold text-white">Rekapitulasi Absensi Bulanan</h3>
              <p class="text-xs text-zinc-400">Audit trail kehadiran per kelompok usia, izin, sakit, dan dispensasi.</p>
            </div>
            <div class="mt-4 pt-3 border-t border-white/10 flex items-center gap-2">
              <button onclick="AdminView.exportFile('PDF', 'Rekap-Absensi-Nov2026')" class="flex-1 btn-lime-glow py-2 rounded-xl text-xs font-black text-zinc-950 text-center">
                Ekspor PDF
              </button>
              <button onclick="AdminView.exportFile('Excel', 'Rekap-Absensi-Nov2026')" class="flex-1 glass py-2 rounded-xl text-xs font-bold text-white text-center hover:bg-white/10">
                Excel (XLSX)
              </button>
            </div>
          </div>

          <div class="glass-card rounded-3xl p-5 border border-white/10 flex flex-col justify-between">
            <div class="space-y-2">
              <div class="text-2xl">📝</div>
              <h3 class="text-base font-bold text-white">Laporan Pendaftaran &amp; Seleksi</h3>
              <p class="text-xs text-zinc-400">Statistik calon siswa baru gelombang 2 dan rekap scoring lapangan.</p>
            </div>
            <div class="mt-4 pt-3 border-t border-white/10 flex items-center gap-2">
              <button onclick="AdminView.exportFile('PDF', 'Pendaftaran-Seleksi-2026')" class="flex-1 btn-lime-glow py-2 rounded-xl text-xs font-black text-zinc-950 text-center">
                Ekspor PDF
              </button>
              <button onclick="AdminView.exportFile('Excel', 'Pendaftaran-Seleksi-2026')" class="flex-1 glass py-2 rounded-xl text-xs font-bold text-white text-center hover:bg-white/10">
                Excel (XLSX)
              </button>
            </div>
          </div>

        </div>
      </div>
    `;
  }

  function exportFile(format, docName) {
    Utils.showToast(`Memproses ekspor file ${docName}.${format.toLowerCase()}... ⏳`, 'info');
    setTimeout(() => {
      Utils.showToast(`File ${docName}.${format === 'PDF' ? 'pdf' : 'xlsx'} berhasil diunduh! 📄`, 'success');
    }, 800);
  }

  /* ================================================================
     15. PENGUMUMAN & KOMUNIKASI PAGE
  ================================================================ */
  function renderAnnouncementsPage() {
    return `
      <div class="space-y-5">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-black text-white">Broadcast Pengumuman Akademi</h2>
            <p class="text-xs text-zinc-400">Kirim pesan penting ke portal siswa, pelatih, atau orang tua</p>
          </div>
          <button onclick="AdminView.openCreateAnnouncementModal()" class="btn-lime-glow px-4 py-2 rounded-xl text-xs font-black text-zinc-950">
            📢 Buat Broadcast Baru
          </button>
        </div>

        <div class="space-y-3">
          <div class="glass rounded-2xl p-4 border-l-4 border-lime-400">
            <div class="flex items-center justify-between text-xs">
              <span class="text-lime-400 font-bold">Target: Seluruh Siswa &amp; Orang Tua</span>
              <span class="text-zinc-500">14 Nov 2026</span>
            </div>
            <h4 class="text-sm font-bold text-white mt-1">Konfirmasi Jadwal Matchday Sabtu vs Garuda Muda FC</h4>
            <p class="text-xs text-zinc-300 mt-1">Kickoff berlangsung pukul 16:00 WIB di Stadion Patriot. Seluruh pemain skuad U-16 diharap hadir 45 menit sebelum kickoff.</p>
          </div>

          <div class="glass rounded-2xl p-4 border-l-4 border-sky-400">
            <div class="flex items-center justify-between text-xs">
              <span class="text-sky-400 font-bold">Target: Pelatih Kepala &amp; Asisten</span>
              <span class="text-zinc-500">12 Nov 2026</span>
            </div>
            <h4 class="text-sm font-bold text-white mt-1">Rapat Koordinasi Teknis Kurikulum Periode 2</h4>
            <p class="text-xs text-zinc-300 mt-1">Evaluasi materi transisi defensif dan penyesuaian beban latihan fisik atlet muda.</p>
          </div>
        </div>
      </div>
    `;
  }

  function openCreateAnnouncementModal() {
    Utils.openModal(`
      <div class="space-y-4 max-w-md text-left text-xs">
        <h3 class="text-base font-black text-white">Broadcast Pengumuman Baru</h3>
        <p class="text-[11px] text-zinc-400">Pengumuman akan muncul di notifikasi dan dashboard portal target</p>

        <form onsubmit="AdminView.submitAnnouncement(event)" class="space-y-3">
          <div>
            <label class="block text-zinc-300 font-bold mb-1">Target Audiens *</label>
            <select id="bc-target" class="w-full glass rounded-xl px-3 py-2 bg-zinc-900 text-white border border-white/10">
              <option value="Semua Portal (Publik, Siswa, Pelatih)">Semua Portal (Publik, Siswa, Pelatih)</option>
              <option value="Khusus Siswa & Orang Tua">Khusus Siswa &amp; Orang Tua</option>
              <option value="Khusus Tim Pelatih">Khusus Tim Pelatih</option>
            </select>
          </div>

          <div>
            <label class="block text-zinc-300 font-bold mb-1">Judul Pengumuman *</label>
            <input required type="text" id="bc-title" placeholder="Judul ringkas dan jelas"
              class="w-full glass rounded-xl px-3 py-2 text-white border border-white/10"/>
          </div>

          <div>
            <label class="block text-zinc-300 font-bold mb-1">Isi Pesan *</label>
            <textarea required id="bc-message" rows="3" class="w-full glass rounded-xl p-2 text-white border border-white/10"
              placeholder="Tuliskan instruksi atau informasi penting..."></textarea>
          </div>

          <div class="flex items-center justify-end gap-2 pt-1">
            <button type="button" onclick="Utils.closeModal()" class="px-4 py-2 rounded-xl glass text-zinc-400">Batal</button>
            <button type="submit" class="btn-lime-glow px-5 py-2 rounded-xl text-zinc-950 font-black">Kirim Broadcast</button>
          </div>
        </form>
      </div>
    `);
  }

  function submitAnnouncement(e) {
    e.preventDefault();
    const title = document.getElementById('bc-title')?.value || 'Pengumuman';

    KSA_STORE.addAuditLog(
      'Bambang Sudirman (Super Admin)',
      'Super Admin',
      'Pengumuman',
      'BROADCAST',
      `Menerbitkan pengumuman broadcast: '${title}'.`
    );

    Utils.closeModal();
    Utils.showToast(`Broadcast '${title}' berhasil disebarkan! 📢`, 'success');
    navTo('announcements');
  }

  /* ================================================================
     16. BERITA & GALERI PUBLIK PAGE
  ================================================================ */
  function renderNewsPage() {
    return `
      <div class="space-y-5">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-black text-white">Manajemen Berita &amp; Galeri Website</h2>
            <p class="text-xs text-zinc-400">Artikel dan galeri foto yang ditampilkan di Public Portal</p>
          </div>
          <button onclick="Utils.showToast('Editor artikel berita dibuka 📰', 'info')" class="btn-lime-glow px-4 py-2 rounded-xl text-xs font-black text-zinc-950">
            + Tulis Berita Baru
          </button>
        </div>

        <div class="space-y-3">
          ${ACADEMY_NEWS.map(n => `
            <div class="glass-card rounded-2xl p-4 border border-white/10 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-white/10 text-xl flex items-center justify-center">
                  ${n.icon}
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-lime-400/20 text-lime-300">${n.tag}</span>
                    <span class="text-zinc-500 text-[10px]">${n.date}</span>
                  </div>
                  <h4 class="text-sm font-bold text-white mt-0.5">${n.title}</h4>
                  <p class="text-xs text-zinc-400 line-clamp-1">${n.desc}</p>
                </div>
              </div>
              <button onclick="Utils.showToast('Mode sunting berita: ${n.title} ✏️', 'info')" class="glass px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-300 hover:text-white">
                Sunting
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /* ================================================================
     17. MANAJEMEN PENGGUNA PAGE
  ================================================================ */
  function renderUsersPage() {
    const users = [
      { email: 'superadmin@youthtrigger.id', name: 'Bambang Sudirman', role: 'Super Admin', status: 'Aktif', lastLogin: 'Hari ini, 08:30 WIB' },
      { email: 'admin.ops@youthtrigger.id', name: 'Siti Rahmawati', role: 'Admin Operasional', status: 'Aktif', lastLogin: 'Kemarin, 17:15 WIB' },
      { email: 'coach.hendra@youthtrigger.id', name: 'Coach Hendra Saputra', role: 'Pelatih', status: 'Aktif', lastLogin: 'Hari ini, 07:15 WIB' },
      { email: 'coach.budi@youthtrigger.id', name: 'Coach Budi Santoso', role: 'Pelatih', status: 'Aktif', lastLogin: '14 Nov 2026' },
      { email: 'farhan.10@youthtrigger.id', name: 'Farhan Ramadhan', role: 'Pemain / Siswa', status: 'Aktif', lastLogin: 'Hari ini, 08:22 WIB' }
    ];

    return `
      <div class="space-y-5">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-black text-white">Manajemen Akun &amp; Pengguna</h2>
            <p class="text-xs text-zinc-400">Kontrol akun Super Admin, Admin Operasional, Pelatih, dan Siswa</p>
          </div>
          <button onclick="Utils.showToast('Modal Buat Akun Baru dibuka 🔑', 'info')" class="btn-lime-glow px-4 py-2 rounded-xl text-xs font-black text-zinc-950">
            + Buat Akun Baru
          </button>
        </div>

        <div class="glass rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          <div class="overflow-x-auto table-scroll-x">
            <table class="w-full text-left text-xs text-zinc-300 min-w-[650px]">
            <thead class="bg-zinc-900/80 text-[11px] uppercase tracking-wider text-zinc-400 border-b border-white/10">
              <tr>
                <th class="py-3 px-4">Nama Pengguna</th>
                <th class="py-3 px-4">Email Login</th>
                <th class="py-3 px-4">Role Akses</th>
                <th class="py-3 px-4">Login Terakhir</th>
                <th class="py-3 px-4">Status</th>
                <th class="py-3 px-4 text-center">Tindakan</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              ${users.map(u => `
                <tr class="hover:bg-white/5 transition-colors">
                  <td class="py-3 px-4 font-bold text-white">${u.name}</td>
                  <td class="py-3 px-4 font-mono text-[11px] text-zinc-400">${u.email}</td>
                  <td class="py-3 px-4">
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold ${u.role.includes('Super') ? 'bg-violet-600/30 text-violet-300 border border-violet-500/30' : 'bg-white/10 text-white'}">
                      ${u.role}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-zinc-400">${u.lastLogin}</td>
                  <td class="py-3 px-4">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                      ${u.status}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-center">
                    <button onclick="AdminView.resetPasswordUser('${u.email}')" class="text-xs text-amber-400 hover:underline font-bold">
                      Reset Password 🔑
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    `;
  }

  function resetPasswordUser(email) {
    Utils.showToast(`Tautan reset password terkirim secara aman ke ${email} ✉️`, 'success');
  }

  /* ================================================================
     18. ROLE & PERMISSION (RBAC) PAGE
  ================================================================ */
  function renderRolesPage() {
    const matrix = [
      { module: 'Data Siswa Binaan', superAdmin: 'C, R, U, D', admin: 'C, R, U', coach: 'R (Binaan)', player: 'R (Sendiri)' },
      { module: 'Pendaftaran & Seleksi', superAdmin: 'C, R, U, D, Approve', admin: 'R, U, Approve', coach: 'Scoring', player: 'Create (Apply)' },
      { module: 'Jadwal & Kalender', superAdmin: 'C, R, U, D', admin: 'C, R, U', coach: 'R (Terkait)', player: 'R' },
      { module: 'Absensi Siswa', superAdmin: 'C, R, U (Audit), D', admin: 'R, U (Audit)', coach: 'C, R, U', player: 'R (Sendiri)' },
      { module: 'Evaluasi 9 Dimensi', superAdmin: 'R, Export', admin: 'R, Export', coach: 'C, R, U', player: 'R (Sendiri)' },
      { module: 'Manajemen Pengguna', superAdmin: 'Full Control', admin: 'Read Only', coach: 'No Access', player: 'No Access' },
      { module: 'Audit Log Sistem', superAdmin: 'View Tamper-Evident', admin: 'View Only', coach: 'No Access', player: 'No Access' },
    ];

    return `
      <div class="space-y-5">
        <div>
          <h2 class="text-xl font-black text-white">Role-Based Access Control (RBAC)</h2>
          <p class="text-xs text-zinc-400">Matriks izin hak akses per role (Create, Read, Update, Delete, Approve, Export)</p>
        </div>

        <div class="glass rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          <div class="overflow-x-auto table-scroll-x">
            <table class="w-full text-left text-xs text-zinc-300 min-w-[650px]">
            <thead class="bg-zinc-900/80 text-[11px] uppercase tracking-wider text-zinc-400 border-b border-white/10">
              <tr>
                <th class="py-3 px-4">Modul / Resource</th>
                <th class="py-3 px-4 text-violet-300">Super Admin</th>
                <th class="py-3 px-4 text-white">Admin Operasional</th>
                <th class="py-3 px-4 text-amber-300">Pelatih (Coach)</th>
                <th class="py-3 px-4 text-emerald-300">Pemain (Player)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              ${matrix.map(m => `
                <tr class="hover:bg-white/5 transition-colors">
                  <td class="py-3 px-4 font-bold text-white">${m.module}</td>
                  <td class="py-3 px-4 font-mono font-bold text-violet-400">${m.superAdmin}</td>
                  <td class="py-3 px-4 font-mono text-zinc-200">${m.admin}</td>
                  <td class="py-3 px-4 font-mono text-amber-300">${m.coach}</td>
                  <td class="py-3 px-4 font-mono text-emerald-300">${m.player}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    `;
  }

  /* ================================================================
     19. AUDIT LOG PAGE
  ================================================================ */
  function renderAuditPage() {
    return `
      <div class="space-y-5">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-black text-white">Audit Log &amp; Rekam Jejak Aktivitas</h2>
            <p class="text-xs text-zinc-400">Pencatatan tamper-evident setiap perubahan data, absensi, pendaftaran, dan login</p>
          </div>
          <span class="text-xs font-mono text-zinc-400 glass px-3 py-1 rounded-xl">
            Total ${KSA_STORE.auditLogs.length} Catatan
          </span>
        </div>

        <div class="glass rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          <div class="overflow-x-auto table-scroll-x">
            <table class="w-full text-left text-xs text-zinc-300 min-w-[700px]">
            <thead class="bg-zinc-900/80 text-[11px] uppercase tracking-wider text-zinc-400 border-b border-white/10">
              <tr>
                <th class="py-3 px-4">ID Log</th>
                <th class="py-3 px-4">Waktu</th>
                <th class="py-3 px-4">Pengguna</th>
                <th class="py-3 px-4">Modul</th>
                <th class="py-3 px-4">Aksi</th>
                <th class="py-3 px-4">Rincian Perubahan Data</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              ${KSA_STORE.auditLogs.map(log => `
                <tr class="hover:bg-white/5 transition-colors">
                  <td class="py-3 px-4 font-mono text-violet-300 text-[11px]">${log.id}</td>
                  <td class="py-3 px-4 font-mono text-zinc-400 text-[11px]">${log.timestamp}</td>
                  <td class="py-3 px-4 font-bold text-white">${log.user}</td>
                  <td class="py-3 px-4">${log.module}</td>
                  <td class="py-3 px-4">
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold ${log.action === 'APPROVE' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-white'}">
                      ${log.action}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-zinc-300">${log.detail}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    `;
  }

  /* ================================================================
     20. PENGATURAN AKADEMI PAGE
  ================================================================ */
  function renderSettingsPage() {
    return `
      <div class="space-y-5 max-w-3xl">
        <div>
          <h2 class="text-xl font-black text-white">Pengaturan Utama Akademi</h2>
          <p class="text-xs text-zinc-400">Identitas sekolah sepak bola, nomor kontak darurat, dan tahun ajaran aktif</p>
        </div>

        <div class="glass-card rounded-3xl p-6 border border-white/10 space-y-4 text-xs">
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-zinc-300 font-bold mb-1">Nama Resmi Akademi</label>
              <input type="text" value="YouthTrigger Arena Football Academy" class="w-full glass rounded-xl px-3 py-2 text-white border border-white/10"/>
            </div>
            <div>
              <label class="block text-zinc-300 font-bold mb-1">Tahun Ajaran Aktif</label>
              <input type="text" value="2026 / 2027" class="w-full glass rounded-xl px-3 py-2 text-white border border-white/10"/>
            </div>
          </div>

          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-zinc-300 font-bold mb-1">Hotline WhatsApp Pendaftaran</label>
              <input type="text" value="+62 812-9988-7766" class="w-full glass rounded-xl px-3 py-2 text-white border border-white/10"/>
            </div>
            <div>
              <label class="block text-zinc-300 font-bold mb-1">Email Resmi Pengaduan &amp; Info</label>
              <input type="email" value="info@youthtrigger.id" class="w-full glass rounded-xl px-3 py-2 text-white border border-white/10"/>
            </div>
          </div>

          <div>
            <label class="block text-zinc-300 font-bold mb-1">Alamat Markas &amp; Training Ground</label>
            <input type="text" value="YouthTrigger Sports Complex, Jl. Patriot Raya No. 1, Kota Bekasi, Jawa Barat" class="w-full glass rounded-xl px-3 py-2 text-white border border-white/10"/>
          </div>

          <div class="pt-2 border-t border-white/10 flex items-center justify-end">
            <button onclick="Utils.showToast('Pengaturan akademi berhasil disimpan! ⚙️', 'success')" class="btn-lime-glow px-6 py-2.5 rounded-xl font-black text-xs text-zinc-950">
              Simpan Pengaturan
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function handleGlobalSearch(query) {
    if (!query.trim()) return;
    _studentSearchQuery = query;
    if (_adminPage !== 'students') {
      navTo('students');
    } else {
      filterStudents('search', query);
    }
  }

  return {
    render,
    navTo,
    toggleMobileAdminMenu,
    filterStudents,
    toggleStudentStatus,
    openStudentDetailModal,
    switchStudentTab,
    printStudentReport,
    openQuickAddStudentModal,
    submitAddStudent,
    openAddCoachModal,
    submitAddCoach,
    openEditCoachModal,
    filterRegistrations,
    openRegistrationDetailModal,
    updateRegStatus,
    approveAndConvertToStudent,
    openScoringModal,
    submitScoring,
    openCreateScheduleModal,
    submitCreateSchedule,
    openCorrectionModal,
    submitCorrection,
    openInputMatchResultModal,
    submitMatchResult,
    exportFile,
    openCreateAnnouncementModal,
    submitAnnouncement,
    resetPasswordUser,
    handleGlobalSearch,
  };
})();
