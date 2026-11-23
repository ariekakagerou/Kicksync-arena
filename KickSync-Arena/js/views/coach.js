/* ============================================================
   YouthTrigger Arena — COACH PORTAL v4.0
   File: js/views/coach.js

   Full Coach Management System:
   1. Dashboard        6. Program Latihan
   2. Siswa Binaan     7. Pertandingan & Turnamen
   3. Jadwal Latihan   8. Pengumuman
   4. Absensi          9. Profil Pelatih
   5. Evaluasi        10. Pengaturan
   ============================================================ */

const CoachView = (() => {

  /* ================================================================
     STATE
  ================================================================ */
  let _cdInterval     = null;
  let _coachPage      = 'dashboard';
  let _coachTab       = 'squad';      // legacy compat
  let _squadFilter    = 'all';
  let _annMode        = false;
  let _sidebarCollapsed = false;

  // Siswa Binaan filters
  let _studentSearch  = '';
  let _studentAgeFilter = 'all';
  let _studentPosFilter = 'all';

  // Absensi
  let _absDate        = new Date().toISOString().slice(0,10);
  let _absGroup       = 'U-16';
  let _absData        = {};  // { 'name': 'hadir'|'izin'|'sakit'|'alpha' }

  // Evaluasi
  let _evalTarget     = null;  // nama siswa yang dievaluasi
  let _evalScores     = { passing:80, shooting:75, dribbling:82, ballControl:79, speed:85, stamina:88, tactical:76, teamwork:83, discipline:90 };

  // Jadwal view mode
  let _scheduleView   = 'list'; // 'list' | 'calendar'

  // Pertandingan tab
  let _matchTab       = 'upcoming';

  // Roster, programs, announcements — initialized after data constants below
  let _roster         = [];
  let _rosterLoadedFromApi = false;
  let _programs       = [];
  let _announcements  = [];

  /* ================================================================
     EXTENDED STATIC DATA (defined inline for self-containment)
     NOTE: Must be defined BEFORE any let that references them.
  ================================================================ */

  // Extended roster dengan data lengkap
  const SQUAD_ROSTER_FULL = (() => {
    const ages = { 1:'U-16', 2:'U-16', 3:'U-16', 4:'U-16', 5:'U-16', 6:'U-16', 7:'U-16', 8:'U-16',
                   9:'U-14', 10:'U-14', 11:'U-14', 12:'U-14', 13:'U-18', 14:'U-18' };
    const bgs  = ['bg-sky-500','bg-purple-500','bg-lime-500','bg-red-500','bg-orange-500',
                  'bg-zinc-500','bg-blue-500','bg-pink-500','bg-teal-500','bg-indigo-500',
                  'bg-cyan-500','bg-rose-500','bg-violet-500','bg-emerald-500'];
    const positions = ['Goalkeeper','Left Back','Centre Back','Right Back','Defensive Mid',
                       'Central Mid','Attacking Mid','Left Winger','Striker','Right Winger'];
    const baseData = [
      { name:'Farhan Ramadhan', number:10, pos:'Attacking Mid', squad:'U-16', fitness:94, attendance:94, status:'active',  age:16, goals:12, assists:9  },
      { name:'Azzam Zaky',      number:7,  pos:'Right Winger',  squad:'U-16', fitness:88, attendance:91, status:'active',  age:16, goals:8,  assists:11 },
      { name:'Raffi Dinata',    number:3,  pos:'Left Back',     squad:'U-16', fitness:92, attendance:96, status:'active',  age:15, goals:1,  assists:4  },
      { name:'Bagas Kurniawan', number:9,  pos:'Striker',       squad:'U-16', fitness:70, attendance:78, status:'injured', age:16, goals:10, assists:3  },
      { name:'Dimas Aditya',    number:11, pos:'Left Winger',   squad:'U-16', fitness:85, attendance:85, status:'active',  age:15, goals:6,  assists:7  },
      { name:'Rizki Pratama',   number:1,  pos:'Goalkeeper',    squad:'U-16', fitness:97, attendance:100,status:'active',  age:16, goals:0,  assists:0  },
      { name:'Fikri Haikal',    number:6,  pos:'Central Mid',   squad:'U-16', fitness:90, attendance:93, status:'active',  age:15, goals:3,  assists:8  },
      { name:'Ilham Ramli',     number:8,  pos:'Central Mid',   squad:'U-16', fitness:83, attendance:88, status:'active',  age:16, goals:4,  assists:5  },
      { name:'Dani Pratama',    number:4,  pos:'Centre Back',   squad:'U-14', fitness:89, attendance:95, status:'active',  age:14, goals:1,  assists:2  },
      { name:'Alif Zaidan',     number:5,  pos:'Centre Back',   squad:'U-14', fitness:91, attendance:90, status:'active',  age:14, goals:2,  assists:1  },
      { name:'Budi Santoso',    number:2,  pos:'Right Back',    squad:'U-14', fitness:86, attendance:87, status:'active',  age:13, goals:0,  assists:3  },
      { name:'Zidan Putra',     number:12, pos:'Goalkeeper',    squad:'U-14', fitness:95, attendance:98, status:'active',  age:13, goals:0,  assists:0  },
      { name:'Rehan Saputra',   number:14, pos:'Central Mid',   squad:'U-18', fitness:88, attendance:92, status:'active',  age:17, goals:5,  assists:6  },
      { name:'Genta Pratama',   number:16, pos:'Centre Back',   squad:'U-18', fitness:93, attendance:97, status:'active',  age:18, goals:1,  assists:0  },
    ];
    const textByBg = { 'bg-lime-500':'text-zinc-900', 'bg-yellow-400':'text-zinc-900' };
    return baseData.map((p,i) => ({
      ...p,
      initials: p.name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase(),
      bg: bgs[i % bgs.length],
      text: textByBg[bgs[i%bgs.length]] || 'text-white',
      rating: (7 + Math.random() * 1.5).toFixed(1),
      email: `${p.name.toLowerCase().replace(/\s+/g,'')}@youthtrigger.id`,
      phone: `0812${Math.floor(10000000+Math.random()*89999999)}`,
      joinDate: `${2022 + (i%3)}-0${1+i%9}-15`,
    }));
  })();

  const COACH_PROGRAMS = [
    { id:1, name:'High Pressing & Counter Attack', squad:'U-16', goal:'Meningkatkan kemampuan pressing kolektif dan transisi cepat', duration:'8 Minggu', difficulty:'Tinggi',   status:'active',   drills:['Rondo 4v2','Transitional Press','3v2 Counter'] },
    { id:2, name:'Ball Mastery & Dribbling Circuit', squad:'U-14', goal:'Teknik dribbling dan ball control pemain muda', duration:'6 Minggu', difficulty:'Sedang',   status:'active',   drills:['Cone Dribbling','1v1 Duel','Rondos'] },
    { id:3, name:'Defensive Organization & Set Piece', squad:'U-18', goal:'Soliditas pertahanan dan efektifitas set piece', duration:'4 Minggu', difficulty:'Tinggi',   status:'active',   drills:['Zonal Marking','Corner Defense','Free Kick Wall'] },
    { id:4, name:'Finishing & Crossing Combination', squad:'U-16', goal:'Meningkatkan konversi peluang dan delivery bola silang', duration:'6 Minggu', difficulty:'Sedang',   status:'planned',  drills:['1v1 vs GK','Crossing Box','Volley Finish'] },
    { id:5, name:'Goalkeeper Training Specific', squad:'U-16', goal:'Refleks, distribusi, dan keberanian kiper', duration:'4 Minggu', difficulty:'Spesifik', status:'active',   drills:['Shot Stopping','Cross Claiming','Distribution'] },
    { id:6, name:'Futsal Speed & Agility', squad:'U-14', goal:'Kecepatan reaksi dan kelincahan di ruang sempit', duration:'3 Minggu', difficulty:'Rendah',   status:'completed', drills:['Ladder Drill','5v5 Futsal','Quick Feet'] },
  ];

  const COACH_ANNOUNCEMENTS = [
    { id:1, title:'Jadwal Latihan Pekan Ini', body:'Latihan U-16 dilaksanakan Senin, Rabu, Jumat pukul 15:30 WIB di Lapangan Utama. Hadir tepat waktu.', target:'U-16', date:'15 Nov 2026', pinned:true,  author:'Coach Hendra' },
    { id:2, title:'Persiapan Match Sabtu vs Garuda Muda FC', body:'Seluruh pemain U-16 wajib hadir briefing Jumat pukul 14:00 WIB. Jersey home hijau-putih. Jaga hidrasi!', target:'U-16', date:'14 Nov 2026', pinned:true,  author:'Coach Hendra' },
    { id:3, title:'Rekap Evaluasi Periode Oktober 2026', body:'Hasil evaluasi teknik dan taktik periode Oktober telah diinput. Silahkan orang tua memantau progress siswa di portal.', target:'Semua', date:'12 Nov 2026', pinned:false, author:'Coach Hendra' },
    { id:4, title:'Libur Latihan Tanggal Merah', body:'Tidak ada latihan pada Kamis 16 November 2026 (Hari Pahlawan). Latihan kembali normal Jumat 17 November.', target:'Semua', date:'11 Nov 2026', pinned:false, author:'Coach Hendra' },
  ];

  const MATCH_RESULTS = [
    { opp:'Bintang Muda FC', date:'8 Nov 2026', venue:'Lapangan Merdeka', squad:'U-16', home:true,  score:'3-1', result:'W', scorers:['Farhan 23\'','Azzam 56\'','Dimas 78\''], assists:['Raffi','Farhan','Azzam'] },
    { opp:'Putra Nusantara',  date:'1 Nov 2026', venue:'Stadion Patriot', squad:'U-14', home:false, score:'1-1', result:'D', scorers:['Alif 67\''], assists:['Dani'] },
    { opp:'Galuh Junior FC',  date:'25 Oct 2026', venue:'Lapangan Utama', squad:'U-16', home:true,  score:'4-0', result:'W', scorers:['Bagas 12\'','Bagas 34\'','Farhan 55\'','Azzam 80\''], assists:['Farhan','Farhan','Fikri','Dimas'] },
  ];

  // Initialize mutable state from constants (must come AFTER const definitions)
  _roster        = JSON.parse(JSON.stringify(SQUAD_ROSTER_FULL));
  _programs      = JSON.parse(JSON.stringify(COACH_PROGRAMS));
  _announcements = JSON.parse(JSON.stringify(COACH_ANNOUNCEMENTS));

  /* ================================================================
     API LOADER
  ================================================================ */
  async function loadRosterFromApi() {
    if (_rosterLoadedFromApi) return;
    try {
      const students = await API.getStudents();
      if (students && students.length) {
        // merge API data, keep visual props
        _roster = students.map((s,i) => ({
          ...SQUAD_ROSTER_FULL[i % SQUAD_ROSTER_FULL.length],
          name: s.name,
          pos: s.position || SQUAD_ROSTER_FULL[i%SQUAD_ROSTER_FULL.length].pos,
          fitness: s.fitness || SQUAD_ROSTER_FULL[i%SQUAD_ROSTER_FULL.length].fitness,
          status: s.status === 1 ? 'active' : 'injured',
          email: `${s.name.toLowerCase().replace(/\s+/g,'')}@youthtrigger.id`,
          initials: s.name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase(),
        }));
        _rosterLoadedFromApi = true;
      }
    } catch(_) {}
  }

  /* ================================================================
     MAIN RENDER
  ================================================================ */
  function render(container) {
    // Reset roster on each fresh render (programs & announcements persist across page switches)
    _roster = JSON.parse(JSON.stringify(SQUAD_ROSTER_FULL));
    if (_programs.length === 0) _programs = JSON.parse(JSON.stringify(COACH_PROGRAMS));
    if (_announcements.length === 0) _announcements = JSON.parse(JSON.stringify(COACH_ANNOUNCEMENTS));
    _coachPage = 'dashboard';
    _rosterLoadedFromApi = false;
    loadRosterFromApi();
    const p = ROLES.coach;
    container.innerHTML = `
      <style>
        /* Coach Portal local styles */
        .cp-nav-item { transition: all .2s; }
        .cp-nav-item.active { background: rgba(163,230,53,.12); border-left: 3px solid #a3e635; color: #d9f99d; }
        .cp-nav-item:not(.active):hover { background: rgba(255,255,255,.06); color: #d4d4d8; }
        .cp-stat-card { background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.07); }
        .cp-stat-card:hover { border-color: rgba(163,230,53,.3); transform: translateY(-2px); }
        .skill-bar-fill { transition: width .8s cubic-bezier(.4,0,.2,1); }
        .radar-label { font-size: 11px; fill: #a1a1aa; }
        .abs-btn { transition: all .15s; border-radius: 10px; padding: 4px 10px; font-size: 11px; font-weight: 700; border: 1px solid transparent; }
        .abs-btn.hadir   { background: rgba(52,211,153,.2); color: #6ee7b7; border-color: rgba(52,211,153,.3); }
        .abs-btn.izin    { background: rgba(251,191,36,.2);  color: #fcd34d; border-color: rgba(251,191,36,.3); }
        .abs-btn.sakit   { background: rgba(248,113,113,.2); color: #fca5a5; border-color: rgba(248,113,113,.3); }
        .abs-btn.alpha   { background: rgba(161,161,170,.15);color: #71717a; border-color: rgba(161,161,170,.2); }
        .score-slider { -webkit-appearance:none; background:rgba(255,255,255,.1); height:6px; border-radius:9999px; outline:none; }
        .score-slider::-webkit-slider-thumb { -webkit-appearance:none; width:18px; height:18px; border-radius:50%; background:#a3e635; cursor:pointer; border:2px solid #052e16; }
        .cp-table tr:hover td { background: rgba(255,255,255,.025); }
        .match-badge-W { background:rgba(52,211,153,.2); color:#6ee7b7; border:1px solid rgba(52,211,153,.3); }
        .match-badge-D { background:rgba(251,191,36,.2); color:#fcd34d; border:1px solid rgba(251,191,36,.3); }
        .match-badge-L { background:rgba(248,113,113,.2); color:#fca5a5; border:1px solid rgba(248,113,113,.3); }
        @keyframes cp-fadein { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .cp-page { animation: cp-fadein .25s ease; }
        .sidebar-mobile-open { transform: translateX(0) !important; }
      </style>

      <div class="flex h-full overflow-hidden relative">

        <!-- Mobile Sidebar Overlay -->
        <div id="cp-overlay" onclick="CoachView.closeMobileSidebar()"
          class="hidden fixed inset-0 bg-black/60 z-40 lg:hidden"></div>

        <!-- SIDEBAR -->
        <aside id="cp-sidebar"
          class="fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto
                 w-64 flex flex-col flex-shrink-0 overflow-hidden
                 border-r border-white/8
                 -translate-x-full lg:translate-x-0 transition-transform duration-300"
          style="background: linear-gradient(180deg, #0d1117 0%, #0a0f1a 100%);">
          ${renderSidebar(p)}
        </aside>

        <!-- MAIN CONTENT -->
        <div class="flex-1 flex flex-col min-w-0 overflow-hidden">

          <!-- Desktop Top Bar -->
          <header class="hidden lg:flex flex-shrink-0 h-14 items-center justify-between px-4 gap-3 border-b border-white/8 flex-shrink-0"
            style="background: rgba(13,17,23,.95); backdrop-filter: blur(12px);">
            <!-- Page Title -->
            <div class="flex items-center gap-3">
              <div>
                <h1 id="cp-page-title" class="text-sm font-black text-white leading-tight">Dashboard Pelatih</h1>
                <div class="text-[11px] text-zinc-500">YouthTrigger Academy · Coach Portal</div>
              </div>
            </div>

            <!-- Right: actions -->
            <div class="flex items-center gap-2">
              <!-- Notif Bell -->
              <button onclick="CoachView.navTo('announcements')"
                class="relative w-9 h-9 rounded-xl glass flex items-center justify-center text-zinc-400 hover:text-white border border-white/10 transition-all">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                </svg>
                <div class="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-lime-400 text-zinc-950 text-[9px] font-black flex items-center justify-center">2</div>
              </button>
              <!-- Quick Abs -->
              <button onclick="CoachView.navTo('attendance')"
                class="hidden sm:flex items-center gap-1.5 px-3 py-1.5 send-btn rounded-xl text-xs font-bold text-zinc-950 shadow">
                <span>📋</span> Absensi
              </button>
              <!-- Avatar -->
              <button onclick="CoachView.navTo('profile')"
                class="w-9 h-9 rounded-xl ${p.avatarBg} ${p.avatarText} flex items-center justify-center font-black text-xs online-ring select-none">
                ${p.initials}
              </button>
            </div>
          </header>

          <!-- Mobile Compact Sub-bar (Single-header architecture) -->
          <div class="lg:hidden flex items-center justify-between px-3 py-2 border-b border-white/8 bg-zinc-950/80 text-xs flex-shrink-0">
            <div class="flex items-center gap-2 min-w-0">
              <span class="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0 animate-pulse"></span>
              <span id="cp-mobile-title" class="font-bold text-white truncate text-xs">Dashboard Pelatih</span>
            </div>
            <span class="text-[10px] font-mono text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20 flex-shrink-0">Coach Hendra</span>
          </div>

          <!-- Page Content -->
          <div id="cp-content" class="flex-1 overflow-y-auto scrollbar-thin pb-16 lg:pb-0">
            ${renderPage()}
          </div>
        </div>

        <!-- Coach Bottom Navigation (Mobile) -->
        <nav id="cp-bottom-nav" class="fixed bottom-0 left-0 right-0 z-50 lg:hidden flex items-center justify-around"
          style="background: rgba(13,17,23,.97); backdrop-filter: blur(16px); border-top: 1px solid rgba(255,255,255,.1);">
          ${renderBottomNav()}
        </nav>

      </div>
    `;

    setTimeout(() => { startCountdown(); initRadarChart(); }, 80);
  }

  /* ================================================================
     SIDEBAR
  ================================================================ */
  function renderSidebar(p) {
    const navItems = [
      { id:'dashboard',     icon:'🏠', label:'Dashboard' },
      { id:'messages',      icon:'💬', label:'Locker Room (Discord)', badge:'2' },
      { id:'students',      icon:'👥', label:'Siswa Binaan' },
      { id:'schedule',      icon:'📅', label:'Jadwal Latihan' },
      { id:'attendance',    icon:'📋', label:'Absensi Siswa' },
      { id:'evaluation',    icon:'📊', label:'Evaluasi Performa' },
      { id:'programs',      icon:'⚽', label:'Program Latihan' },
      { id:'matches',       icon:'🏆', label:'Pertandingan & Turnamen' },
      { id:'announcements', icon:'📢', label:'Pengumuman' },
      { id:'profile',       icon:'👤', label:'Profil Pelatih' },
      { id:'settings',      icon:'⚙️', label:'Pengaturan' },
    ];

    return `
      <!-- Logo Area -->
      <div class="flex items-center gap-2.5 px-4 py-4 border-b border-white/8 flex-shrink-0">
        <div class="w-9 h-9 rounded-xl flex items-center justify-center font-black text-zinc-950 text-sm flex-shrink-0"
          style="background: linear-gradient(135deg, #a3e635, #34d399);">⚽</div>
        <div class="min-w-0">
          <div class="font-black text-white text-sm leading-tight truncate">YouthTrigger Arena</div>
          <div class="text-[10px] text-lime-400 font-semibold uppercase tracking-wider">Coach Portal</div>
        </div>
      </div>

      <!-- Coach Identity -->
      <div class="px-4 py-3 border-b border-white/8 flex-shrink-0">
        <div class="flex items-center gap-3">
          <div class="relative flex-shrink-0">
            <div class="w-11 h-11 rounded-2xl ${p.avatarBg} ${p.avatarText} flex items-center justify-center font-black text-sm shadow-lg select-none online-ring">
              ${p.initials}
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <div class="font-black text-white text-sm truncate">${p.name}</div>
            <div class="text-[11px] text-lime-400 font-semibold truncate">Head Coach · Lisensi A</div>
            <div class="flex items-center gap-1 mt-0.5">
              <div class="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot"></div>
              <span class="text-[10px] text-zinc-400">Online · Di Lapangan</span>
            </div>
          </div>
        </div>
        <!-- Role Badge -->
        <div class="mt-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-xl border border-amber-400/25 bg-amber-400/8 w-fit">
          <span class="text-[10px]">👑</span>
          <span class="text-[10px] font-bold text-amber-300 uppercase tracking-wider">Head Coach</span>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto py-2 scrollbar-thin px-2">
        ${navItems.map(item => `
          <button onclick="CoachView.navTo('${item.id}')"
            id="nav-${item.id}"
            class="cp-nav-item ${_coachPage === item.id ? 'active' : ''}
                   w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left mb-0.5 border-l-[3px]
                   ${_coachPage === item.id ? '' : 'border-transparent text-zinc-400'}">
            <span class="text-base w-5 text-center flex-shrink-0">${item.icon}</span>
            <span class="truncate">${item.label}</span>
            ${item.id === 'announcements' ? '<span class="ml-auto text-[10px] font-black px-1.5 py-0.5 rounded-lg bg-lime-400/20 text-lime-400">2</span>' : ''}
          </button>
        `).join('')}
      </nav>

      <!-- Logout -->
      <div class="p-3 border-t border-white/8 flex-shrink-0">
        <button onclick="State.setRole('visitor'); Utils.showToast('Keluar dari Coach Portal 👋','info')"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-500 hover:text-red-400 hover:bg-red-400/8 transition-all">
          <span class="text-base w-5 text-center">🚪</span>
          <span>Keluar / Logout</span>
        </button>
      </div>
    `;
  }

  /* ================================================================
     NAV ROUTER
  ================================================================ */
  function navTo(page) {
    _coachPage = page;
    // update page title
    const titles = {
      dashboard:'Dashboard Pelatih', messages:'Locker Room (Discord)', students:'Siswa Binaan', schedule:'Jadwal Latihan',
      attendance:'Absensi Siswa', evaluation:'Evaluasi Performa', programs:'Program Latihan',
      matches:'Pertandingan & Turnamen', announcements:'Pengumuman',
      profile:'Profil Pelatih', settings:'Pengaturan',
    };
    const titleEl = document.getElementById('cp-page-title');
    if (titleEl) titleEl.textContent = titles[page] || page;
    const mobileTitleEl = document.getElementById('cp-mobile-title');
    if (mobileTitleEl) mobileTitleEl.textContent = titles[page] || page;

    // Update nav active state
    document.querySelectorAll('.cp-nav-item').forEach(b => {
      const id = b.id.replace('nav-','');
      const isActive = id === page;
      b.classList.toggle('active', isActive);
      if (!isActive) b.classList.add('border-transparent','text-zinc-400');
      else b.classList.remove('border-transparent','text-zinc-400');
    });

    // Render content
    const cont = document.getElementById('cp-content');
    if (cont) {
      cont.scrollTop = 0;
      cont.innerHTML = renderPage();
      setTimeout(() => { initRadarChart(); startCountdown(); }, 60);
    }

    // Auto-close mobile sidebar
    closeMobileSidebar();

    // Update mobile bottom nav
    const bnav = document.getElementById('cp-bottom-nav');
    if (bnav) bnav.innerHTML = renderBottomNav();
  }

  function renderBottomNav() {
    const items = [
      { id:'dashboard',  icon:'🏠', label:'Home' },
      { id:'messages',   icon:'💬', label:'Locker', badge:'2' },
      { id:'students',   icon:'👥', label:'Skuad' },
      { id:'attendance', icon:'📋', label:'Absen' },
      { id:'schedule',   icon:'📅', label:'Jadwal' },
    ];
    return items.map(item => {
      const active = _coachPage === item.id;
      return `
        <button onclick="CoachView.navTo('${item.id}')"
          class="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-center transition-all relative ${active ? 'text-amber-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'}">
          <div class="relative">
            <span class="text-lg leading-none">${item.icon}</span>
            ${item.badge ? `<span class="absolute -top-1 -right-2 text-[9px] font-black px-1 rounded-full bg-amber-400 text-zinc-950">${item.badge}</span>` : ''}
          </div>
          <span class="text-[10px]">${item.label}</span>
          ${active ? '<div class="w-5 h-0.5 rounded-full bg-amber-400 mt-0.5"></div>' : '<div class="w-5 h-0.5 opacity-0 mt-0.5"></div>'}
        </button>
      `;
    }).join('');
  }

  function renderPage() {
    switch (_coachPage) {
      case 'messages':      return DiscordChat.render('coach');
      case 'students':      return renderStudentsPage();
      case 'schedule':      return renderSchedulePage();
      case 'attendance':    return renderAttendancePage();
      case 'evaluation':    return renderEvaluationPage();
      case 'programs':      return renderProgramsPage();
      case 'matches':       return renderMatchesPage();
      case 'announcements': return renderAnnouncementsPage();
      case 'profile':       return renderProfilePage();
      case 'settings':      return renderSettingsPage();
      default:              return renderDashboardPage();
    }
  }

  /* ================================================================
     MOBILE SIDEBAR TOGGLE
  ================================================================ */
  function toggleMobileSidebar() {
    const sb = document.getElementById('cp-sidebar');
    const ov = document.getElementById('cp-overlay');
    if (!sb || !ov) return;
    const isOpen = sb.classList.contains('sidebar-mobile-open');
    if (isOpen) {
      sb.classList.remove('sidebar-mobile-open');
      ov.classList.add('hidden');
    } else {
      sb.classList.add('sidebar-mobile-open');
      ov.classList.remove('hidden');
    }
  }
  function closeMobileSidebar() {
    const sb = document.getElementById('cp-sidebar');
    const ov = document.getElementById('cp-overlay');
    if (sb) sb.classList.remove('sidebar-mobile-open');
    if (ov) ov.classList.add('hidden');
  }

  /* ================================================================
     1. DASHBOARD PAGE
  ================================================================ */
  function renderDashboardPage() {
    const activeStudents = _roster.filter(r => r.status === 'active').length;
    const injuredStudents = _roster.filter(r => r.status === 'injured').length;
    const todaySessions = TRAINING_SESSIONS.filter(s => s.status === 'active' || s.status === 'upcoming');
    const avgAttendance = Math.round(_roster.reduce((s,r) => s + r.attendance, 0) / _roster.length);

    const kpis = [
      { icon:'👥', label:'Total Siswa Binaan', value:_roster.length, sub:'Aktif: '+activeStudents+'  Cedera: '+injuredStudents, color:'text-lime-400', border:'border-lime-400/20', bg:'bg-lime-400/8', cb:'navTo(\'students\')' },
      { icon:'📅', label:'Sesi Latihan Hari Ini', value: todaySessions.length, sub:'Lokasi: Lap. Utama & Lap. B', color:'text-sky-400', border:'border-sky-400/20', bg:'bg-sky-400/8', cb:'navTo(\'schedule\')' },
      { icon:'✅', label:'Rata-rata Kehadiran', value: avgAttendance+'%', sub:'Kehadiran 14 hari terakhir', color:'text-emerald-400', border:'border-emerald-400/20', bg:'bg-emerald-400/8', cb:'navTo(\'attendance\')' },
      { icon:'🏆', label:'Win Rate Tim', value:'73%', sub:'11 menang dari 15 laga', color:'text-amber-400', border:'border-amber-400/20', bg:'bg-amber-400/8', cb:'navTo(\'matches\')' },
    ];

    const recentActivity = [
      { icon:'📋', text:'Absensi U-16 · Sesi Pagi dicatat', time:'08:45', color:'text-emerald-400' },
      { icon:'📊', text:'Evaluasi Farhan Ramadhan diperbarui', time:'Kemarin', color:'text-sky-400' },
      { icon:'📢', text:'Pengumuman matchday Sabtu dikirim', time:'14 Nov', color:'text-amber-400' },
      { icon:'⚽', text:'Program Finishing Drill dimulai', time:'13 Nov', color:'text-lime-400' },
      { icon:'🏆', text:'KSA U-16 Menang 3-1 vs Bintang Muda', time:'8 Nov', color:'text-purple-400' },
    ];

    const upcomingMatches = PUBLIC_FIXTURES.slice(0,2);

    return `
      <div class="p-3 sm:p-6 space-y-4 sm:space-y-6 cp-page min-w-0 max-w-full overflow-hidden">

        <!-- Welcome Banner -->
        <div class="rounded-2xl sm:rounded-3xl p-4 sm:p-6 relative overflow-hidden border border-lime-400/20 shadow-2xl"
          style="background: linear-gradient(135deg, #0a1a0a 0%, #0d1117 50%, #131a0d 100%);">
          <div class="absolute inset-0 opacity-10"
            style="background-image: repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(163,230,53,.3) 20px, rgba(163,230,53,.3) 21px);">
          </div>
          <div class="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div class="min-w-0">
              <div class="text-[10px] sm:text-xs text-lime-400 font-bold uppercase tracking-widest mb-1 truncate">Selamat Datang Kembali 👋</div>
              <h2 class="text-xl sm:text-2xl font-black text-white leading-tight truncate">Coach Hendra Saputra</h2>
              <p class="text-xs sm:text-sm text-zinc-400 mt-0.5 truncate">Head Coach · YouthTrigger Academy · Lisensi A</p>
              <div class="flex flex-wrap gap-1.5 sm:gap-2 mt-2.5">
                <span class="text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg sm:rounded-xl bg-lime-400/15 text-lime-300 border border-lime-400/25 font-semibold truncate max-w-full">📅 ${new Date().toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'short',year:'numeric'})}</span>
                <span class="text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg sm:rounded-xl bg-emerald-400/15 text-emerald-300 border border-emerald-400/25 font-semibold truncate">⚽ 3 Kelompok Binaan</span>
              </div>
            </div>
            <div class="flex flex-col sm:flex-row gap-2 flex-shrink-0 pt-1 sm:pt-0">
              <button onclick="CoachView.navTo('attendance')"
                class="send-btn px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-zinc-950 shadow-lg flex items-center gap-2 justify-center">
                <span>📋</span> Mulai Absensi
              </button>
              <button onclick="CoachView.navTo('evaluation')"
                class="glass px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-zinc-200 border border-white/15 hover:border-lime-400/40 transition-all flex items-center gap-2 justify-center">
                <span>📊</span> Input Evaluasi
              </button>
            </div>
          </div>
        </div>

        <!-- KPI Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          ${kpis.map(k => `
            <div onclick="CoachView.${k.cb}" class="cp-stat-card rounded-2xl sm:rounded-3xl p-3 sm:p-4 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl ${k.border}">
              <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl ${k.bg} flex items-center justify-center text-base sm:text-xl mb-2 sm:mb-3 border ${k.border}">
                ${k.icon}
              </div>
              <div class="text-xl sm:text-3xl font-black ${k.color} leading-none mb-1">${k.value}</div>
              <div class="text-[11px] sm:text-xs font-bold text-white/80 leading-tight truncate">${k.label}</div>
              <div class="text-[9px] sm:text-[11px] text-zinc-500 mt-1 leading-tight truncate">${k.sub}</div>
            </div>
          `).join('')}
        </div>

        <!-- DISCORD LOCKER ROOM & PUSAT PESAN PELATIH WIDGET -->
        <div class="rounded-3xl p-5 border border-[#5865F2]/40 shadow-2xl relative overflow-hidden"
          style="background: linear-gradient(135deg, #1e1f22 0%, #2b2d31 60%, #1e1f22 100%);">
          <div class="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-[#5865F2]/10 blur-2xl pointer-events-none"></div>
          <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="flex items-start sm:items-center gap-3.5">
              <div class="w-12 h-12 rounded-2xl discord-blurple-bg text-white flex items-center justify-center text-2xl shadow-lg flex-shrink-0">
                💬
              </div>
              <div>
                <div class="flex items-center gap-2 flex-wrap">
                  <h3 class="text-base font-black text-white">Discord Locker Room &amp; Pusat Pesan Pelatih</h3>
                  <span class="text-[10px] px-2 py-0.5 rounded-full bg-[#5865F2]/25 text-[#c9cdfb] font-black border border-[#5865F2]/30">ONLINE DISCORD</span>
                </div>
                <div class="text-xs text-zinc-300 mt-1 flex items-center gap-1.5 flex-wrap">
                  <span class="w-2 h-2 rounded-full bg-[#23a55a]"></span>
                  <span><strong>Farhan Ramadhan (#10):</strong> "Siap Coach! Saya targetkan distribusi passing 90%..."</span>
                  <span class="text-[10px] text-zinc-400">· 07:10 WIB</span>
                </div>
                <div class="text-[11px] text-zinc-400 mt-1">
                  Kirim instruksi taktik 1-on-1, bagikan papan formasi 4-3-3, dan pantau ruang diskusi skuad.
                </div>
              </div>
            </div>
            <div class="flex items-center gap-2 flex-shrink-0">
              <button onclick="DiscordChat.switchChannel('dm-coach-hendra'); CoachView.navTo('messages')"
                class="discord-blurple-bg text-white px-4 py-2.5 rounded-2xl text-xs font-black shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
                <span>🔒</span> Pesan Farhan #10
              </button>
              <button onclick="DiscordChat.switchChannel('u16-tactics-room'); CoachView.navTo('messages')"
                class="glass hover:bg-white/10 text-white px-4 py-2.5 rounded-2xl text-xs font-bold border border-white/15 transition-all flex items-center gap-2">
                <span>📋</span> Bagikan Taktik Skuad
              </button>
            </div>
          </div>
        </div>

        <!-- Match Countdown + Recent Activity + Upcoming -->
        <div class="grid lg:grid-cols-3 gap-4">

          <!-- Match Countdown -->
          <div class="lg:col-span-1 glass rounded-3xl p-5 border border-emerald-400/20 space-y-3">
            <div class="flex items-center gap-2">
              <span class="text-lg">🏟️</span>
              <h3 class="text-sm font-black text-white">Laga Berikutnya</h3>
            </div>
            <div class="text-center py-2">
              <div class="text-xs text-zinc-500 uppercase tracking-widest mb-1">YouthTrigger U-16</div>
              <div class="font-black text-2xl text-white">VS</div>
              <div class="text-xs text-zinc-400 mt-0.5">Garuda Muda FC</div>
              <div class="text-[11px] text-emerald-400 mt-1 font-semibold">Sabtu · 16:00 · Stadion Patriot</div>
            </div>
            <!-- Countdown digits -->
            <div class="flex justify-center gap-2">
              ${[['c-cd-h','Jam'],['c-cd-m','Menit'],['c-cd-s','Detik']].map(([id,lbl]) => `
                <div class="text-center glass-subtle rounded-2xl px-3 py-2 min-w-[52px] border border-white/8">
                  <div id="${id}" class="text-xl font-black text-lime-400">00</div>
                  <div class="text-[9px] text-zinc-500 uppercase mt-0.5">${lbl}</div>
                </div>
              `).join('<div class="text-zinc-600 font-black text-lg self-center">:</div>')}
            </div>
            <button onclick="CoachView.navTo('matches')"
              class="w-full send-btn py-2 rounded-2xl text-xs font-bold text-zinc-950 flex items-center justify-center gap-1.5">
              <span>📋</span> Detail & Lineup
            </button>
          </div>

          <!-- Recent Activity -->
          <div class="lg:col-span-1 glass rounded-3xl p-5 border border-white/5 space-y-3">
            <h3 class="text-sm font-black text-white flex items-center gap-2"><span>⚡</span> Aktivitas Terbaru</h3>
            <div class="space-y-2">
              ${recentActivity.map(a => `
                <div class="flex items-start gap-2.5 py-1.5 border-b border-white/5 last:border-0">
                  <span class="${a.color} text-base flex-shrink-0 mt-0.5">${a.icon}</span>
                  <div class="flex-1 min-w-0">
                    <div class="text-xs text-zinc-200 leading-tight">${a.text}</div>
                    <div class="text-[10px] text-zinc-500 mt-0.5">${a.time}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Upcoming Matches -->
          <div class="lg:col-span-1 glass rounded-3xl p-5 border border-white/5 space-y-3">
            <h3 class="text-sm font-black text-white flex items-center gap-2"><span>📅</span> Agenda Pertandingan</h3>
            <div class="space-y-2.5">
              ${upcomingMatches.map(m => `
                <div class="glass-subtle rounded-2xl p-3 border border-white/5 hover:border-lime-400/20 transition-all">
                  <div class="flex items-center justify-between mb-1.5">
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-lime-400/15 text-lime-400">${m.squad}</span>
                    <span class="text-[10px] text-zinc-500">${m.type}</span>
                  </div>
                  <div class="text-xs font-bold text-white truncate">${m.homeShort} vs ${m.awayShort}</div>
                  <div class="text-[11px] text-zinc-400 mt-1">${m.date} · ${m.time}</div>
                  <div class="text-[11px] text-zinc-500">📍 ${m.venue}</div>
                </div>
              `).join('')}
            </div>
            <button onclick="CoachView.navTo('matches')"
              class="w-full glass py-2 rounded-2xl text-xs font-bold text-zinc-300 border border-white/10 hover:border-lime-400/30 transition-all">
              Lihat Semua Pertandingan →
            </button>
          </div>
        </div>

        <!-- Today's Sessions -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-black text-white flex items-center gap-2"><span>📅</span> Sesi Latihan Hari Ini</h3>
            <button onclick="CoachView.navTo('schedule')" class="text-xs text-lime-400 hover:text-lime-300 font-semibold">Kelola Jadwal →</button>
          </div>
          <div class="grid sm:grid-cols-3 gap-3">
            ${TRAINING_SESSIONS.map(s => {
              const pct = Math.round(s.present/s.total*100);
              const statusColor = s.status==='active' ? 'bg-emerald-400/15 text-emerald-300 border-emerald-400/25'
                                : s.status==='upcoming' ? 'bg-sky-400/15 text-sky-300 border-sky-400/25'
                                : 'bg-zinc-700/50 text-zinc-400 border-zinc-600/30';
              return `
                <div class="glass rounded-3xl p-4 border border-white/5 hover:border-lime-400/20 transition-all space-y-3">
                  <div class="flex items-start justify-between gap-2">
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-lg border ${statusColor}">${s.status==='active'?'Berlangsung':s.status==='upcoming'?'Segera':'Terjadwal'}</span>
                    <span class="text-[10px] text-zinc-500">${s.squad}</span>
                  </div>
                  <div class="text-sm font-bold text-white leading-snug">${s.title}</div>
                  <div class="text-[11px] text-zinc-400">⏰ ${s.time} · 📍 ${s.location}</div>
                  <div>
                    <div class="flex justify-between text-[11px] mb-1">
                      <span class="text-zinc-500">Kehadiran</span>
                      <span class="text-emerald-400 font-bold">${s.present}/${s.total} (${pct}%)</span>
                    </div>
                    <div class="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div class="h-full gradient-emerald rounded-full" style="width:${pct}%"></div>
                    </div>
                  </div>
                  <button onclick="CoachView.navTo('attendance')"
                    class="w-full glass py-1.5 rounded-xl text-[11px] font-bold text-zinc-300 border border-white/8 hover:border-emerald-400/30 transition-all">
                    Catat Absensi →
                  </button>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Quick Stats Row -->
        <div class="grid sm:grid-cols-4 gap-3">
          ${[
            { label:'Rata-rata Kebugaran Tim', value:'88%', icon:'💪', color:'text-emerald-400' },
            { label:'Program Aktif', value: _programs.filter(p=>p.status==='active').length, icon:'⚽', color:'text-lime-400' },
            { label:'Pengumuman Bulan Ini', value: _announcements.length, icon:'📢', color:'text-amber-400' },
            { label:'Evaluasi Pending', value:'4', icon:'📊', color:'text-sky-400' },
          ].map(s => `
            <div class="cp-stat-card rounded-2xl p-3.5 flex items-center gap-3 hover:cursor-pointer">
              <div class="text-2xl">${s.icon}</div>
              <div>
                <div class="text-lg font-black ${s.color} leading-none">${s.value}</div>
                <div class="text-[11px] text-zinc-500 leading-tight">${s.label}</div>
              </div>
            </div>
          `).join('')}
        </div>

      </div>
    `;
  }

  /* ================================================================
     2. SISWA BINAAN PAGE
  ================================================================ */
  function renderStudentsPage() {
    const ages    = ['all','U-10','U-12','U-14','U-16','U-18'];
    const positions = ['all','Goalkeeper','Defender','Midfielder','Forward'];
    const posMap = { Goalkeeper:'Defender', 'Left Back':'Defender','Centre Back':'Defender','Right Back':'Defender','Defensive Mid':'Midfielder','Central Mid':'Midfielder','Attacking Mid':'Midfielder','Left Winger':'Forward','Striker':'Forward','Right Winger':'Forward' };

    let filtered = _roster.filter(r => {
      const matchSearch = !_studentSearch || r.name.toLowerCase().includes(_studentSearch.toLowerCase());
      const matchAge    = _studentAgeFilter === 'all' || r.squad === _studentAgeFilter;
      const matchPos    = _studentPosFilter === 'all' || (posMap[r.pos] || r.pos) === _studentPosFilter;
      return matchSearch && matchAge && matchPos;
    });

    return `
      <div class="p-4 sm:p-6 space-y-5 cp-page">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 class="text-xl font-black text-white">👥 Daftar Siswa Binaan</h2>
            <p class="text-xs text-zinc-400 mt-0.5">${_roster.length} siswa terdaftar · ${_roster.filter(r=>r.status==='active').length} aktif</p>
          </div>
          <button onclick="CoachView.openAddPlayerModal()"
            class="btn-lime-glow px-4 py-2.5 rounded-2xl text-sm font-bold text-zinc-950 flex items-center gap-2 self-start sm:self-auto shadow-lg">
            <span>+</span> Tambah Siswa
          </button>
        </div>

        <!-- Search + Filters -->
        <div class="glass rounded-2xl p-3 border border-white/5 flex flex-col sm:flex-row gap-2.5">
          <div class="flex-1 relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input type="text" id="student-search" placeholder="Cari nama siswa..."
              value="${_studentSearch}"
              oninput="CoachView._setStudentSearch(this.value)"
              class="w-full bg-transparent pl-9 pr-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none"/>
          </div>
          <div class="flex gap-2 flex-wrap">
            <select onchange="CoachView._setAgeFilter(this.value)"
              class="glass rounded-xl px-3 py-2 text-xs text-zinc-200 bg-zinc-900 border border-white/10 focus:outline-none focus:border-lime-400/50">
              ${ages.map(a => `<option value="${a}" ${_studentAgeFilter===a?'selected':''}>${a==='all'?'Semua Usia':a}</option>`).join('')}
            </select>
            <select onchange="CoachView._setPosFilter(this.value)"
              class="glass rounded-xl px-3 py-2 text-xs text-zinc-200 bg-zinc-900 border border-white/10 focus:outline-none focus:border-lime-400/50">
              ${positions.map(po => `<option value="${po}" ${_studentPosFilter===po?'selected':''}>${po==='all'?'Semua Posisi':po}</option>`).join('')}
            </select>
          </div>
        </div>

        <!-- Student Grid / Table -->
        ${filtered.length === 0 ? `
          <div class="text-center py-16">
            <div class="text-5xl mb-3">🔍</div>
            <div class="text-zinc-400 font-semibold">Tidak ada siswa ditemukan</div>
            <div class="text-zinc-600 text-sm mt-1">Coba ubah filter pencarian</div>
          </div>
        ` : `
          <!-- Desktop Table -->
          <div class="hidden lg:block glass rounded-3xl overflow-hidden border border-white/5 shadow-xl">
            <div class="overflow-x-auto scrollbar-thin">
              <table class="w-full text-left text-xs cp-table">
                <thead>
                  <tr class="border-b border-white/10 text-zinc-500 bg-white/3">
                    ${['#','Nama Siswa','Kelompok','Posisi','Kebugaran','Kehadiran','Gol/Assist','Status','Aksi'].map(h =>
                      `<th class="px-4 py-3 font-bold uppercase tracking-wider whitespace-nowrap">${h}</th>`
                    ).join('')}
                  </tr>
                </thead>
                <tbody class="divide-y divide-white/5">
                  ${filtered.map(pl => `
                    <tr class="transition-colors">
                      <td class="px-4 py-3 font-black text-zinc-500">${pl.number}</td>
                      <td class="px-4 py-3">
                        <div class="flex items-center gap-2.5">
                          <div class="w-9 h-9 rounded-xl ${pl.bg} ${pl.text} flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-md">${pl.initials}</div>
                          <div>
                            <div class="font-bold text-white">${pl.name}</div>
                            <div class="text-[10px] text-zinc-500">${pl.email}</div>
                          </div>
                        </div>
                      </td>
                      <td class="px-4 py-3"><span class="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-sky-400/15 text-sky-300 border border-sky-400/20">${pl.squad}</span></td>
                      <td class="px-4 py-3 text-zinc-300 font-medium">${pl.pos}</td>
                      <td class="px-4 py-3">
                        <div class="flex items-center gap-2">
                          <div class="w-14 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                            <div class="h-full gradient-emerald rounded-full" style="width:${pl.fitness}%"></div>
                          </div>
                          <span class="font-bold text-emerald-400">${pl.fitness}%</span>
                        </div>
                      </td>
                      <td class="px-4 py-3 font-bold text-sky-400">${pl.attendance}%</td>
                      <td class="px-4 py-3 text-zinc-300">${pl.goals ?? 0}G / ${pl.assists ?? 0}A</td>
                      <td class="px-4 py-3">
                        <span class="px-2 py-0.5 rounded-xl text-[11px] font-bold border ${pl.status==='active' ? 'bg-emerald-400/15 text-emerald-300 border-emerald-400/25' : 'bg-red-400/15 text-red-300 border-red-400/25'}">
                          ${pl.status === 'active' ? '● Aktif' : '✖ Cedera'}
                        </span>
                      </td>
                      <td class="px-4 py-3">
                        <div class="flex gap-1.5">
                          <button onclick="CoachView.openPlayerDetail('${pl.name}')"
                            class="glass-subtle px-2.5 py-1.5 rounded-xl text-[11px] font-bold text-zinc-300 border border-white/8 hover:border-lime-400/40 transition-all">Detail</button>
                          <button onclick="CoachView._setEvalTarget('${pl.name}'); CoachView.navTo('evaluation')"
                            class="glass-subtle px-2.5 py-1.5 rounded-xl text-[11px] font-bold text-sky-300 border border-sky-400/25 hover:border-sky-400/50 transition-all">Evaluasi</button>
                        </div>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Mobile Card Grid -->
          <div class="grid sm:grid-cols-2 lg:hidden gap-3">
            ${filtered.map(pl => `
              <div class="glass rounded-3xl p-4 border border-white/5 hover:border-lime-400/20 transition-all space-y-3">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-2xl ${pl.bg} ${pl.text} flex items-center justify-center font-black text-sm flex-shrink-0">${pl.initials}</div>
                  <div class="flex-1 min-w-0">
                    <div class="font-bold text-white truncate">${pl.name}</div>
                    <div class="text-xs text-zinc-400">${pl.pos} · ${pl.squad}</div>
                    <span class="mt-1 inline-block text-[10px] font-bold px-2 py-0.5 rounded-lg border ${pl.status==='active'?'bg-emerald-400/15 text-emerald-300 border-emerald-400/25':'bg-red-400/15 text-red-300 border-red-400/25'}">
                      ${pl.status==='active'?'● Aktif':'✖ Cedera'}
                    </span>
                  </div>
                </div>
                <div class="grid grid-cols-3 gap-2 text-center text-xs">
                  <div class="glass-subtle rounded-xl p-2 border border-white/5">
                    <div class="font-black text-emerald-400">${pl.fitness}%</div>
                    <div class="text-[10px] text-zinc-500">Kebugaran</div>
                  </div>
                  <div class="glass-subtle rounded-xl p-2 border border-white/5">
                    <div class="font-black text-sky-400">${pl.attendance}%</div>
                    <div class="text-[10px] text-zinc-500">Hadir</div>
                  </div>
                  <div class="glass-subtle rounded-xl p-2 border border-white/5">
                    <div class="font-black text-amber-400">${pl.goals??0}G/${pl.assists??0}A</div>
                    <div class="text-[10px] text-zinc-500">Kontribusi</div>
                  </div>
                </div>
                <div class="flex gap-2">
                  <button onclick="CoachView.openPlayerDetail('${pl.name}')"
                    class="flex-1 glass py-2 rounded-xl text-xs font-bold text-zinc-200 border border-white/10">Detail</button>
                  <button onclick="CoachView._setEvalTarget('${pl.name}'); CoachView.navTo('evaluation')"
                    class="flex-1 send-btn py-2 rounded-xl text-xs font-bold text-zinc-950">Evaluasi</button>
                </div>
              </div>
            `).join('')}
          </div>
        `}

        <!-- Summary Stats -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          ${[
            { label:'U-16', count: _roster.filter(r=>r.squad==='U-16').length, color:'text-lime-400', bg:'bg-lime-400/10' },
            { label:'U-14', count: _roster.filter(r=>r.squad==='U-14').length, color:'text-sky-400', bg:'bg-sky-400/10' },
            { label:'U-18', count: _roster.filter(r=>r.squad==='U-18').length, color:'text-purple-400', bg:'bg-purple-400/10' },
            { label:'Cedera', count: _roster.filter(r=>r.status==='injured').length, color:'text-red-400', bg:'bg-red-400/10' },
          ].map(s => `
            <div class="cp-stat-card rounded-2xl p-3 text-center ${s.bg} border border-white/5">
              <div class="text-2xl font-black ${s.color}">${s.count}</div>
              <div class="text-xs text-zinc-400 mt-0.5">Kelompok ${s.label}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function _setStudentSearch(val) {
    _studentSearch = val;
    const cont = document.getElementById('cp-content');
    if (cont) cont.innerHTML = renderStudentsPage();
  }
  function _setAgeFilter(val)  { _studentAgeFilter = val; const c=document.getElementById('cp-content'); if(c) c.innerHTML=renderStudentsPage(); }
  function _setPosFilter(val)  { _studentPosFilter = val; const c=document.getElementById('cp-content'); if(c) c.innerHTML=renderStudentsPage(); }
  function _setEvalTarget(name) { _evalTarget = name; }

  /* ================================================================
     3. JADWAL LATIHAN PAGE
  ================================================================ */
  function renderSchedulePage() {
    const extended = [
      { title:'High Pressing & Transition Drills', time:'06:30',  duration:'2 jam',   location:'Lapangan Utama', squad:'U-16', day:'Senin', date:'18 Nov 2026', status:'active',    present:18, total:22, materi:'Rondo 4v2, Positional Press, Transition 3v3' },
      { title:'Ball Mastery & Dribbling Circuit',  time:'07:00',  duration:'1.5 jam', location:'Lapangan B',    squad:'U-14', day:'Senin', date:'18 Nov 2026', status:'upcoming',   present:0,  total:18, materi:'Cone Dribbling, 1v1 Duel, Rondos' },
      { title:'Finishing & Shooting Practice',     time:'09:00',  duration:'1.5 jam', location:'Lapangan B',    squad:'U-16', day:'Rabu',  date:'20 Nov 2026', status:'scheduled',  present:0,  total:22, materi:'Crossing & Finish, 1v1 GK, Volley' },
      { title:'Tactical Video Analysis',           time:'15:00',  duration:'1 jam',   location:'Ruang Meeting', squad:'U-16', day:'Rabu',  date:'20 Nov 2026', status:'scheduled',  present:0,  total:22, materi:'Review match footage, Formasi lawan' },
      { title:'Set Piece & Dead Ball Practice',    time:'06:30',  duration:'2 jam',   location:'Lapangan Utama', squad:'U-18', day:'Kamis', date:'21 Nov 2026', status:'scheduled',  present:0,  total:14, materi:'Corner routine, Free kick, Throw-in long' },
      { title:'Full Match Scrimmage (11v11)',      time:'07:00',  duration:'2 jam',   location:'Lapangan Utama', squad:'U-16', day:'Jumat', date:'22 Nov 2026', status:'scheduled',  present:0,  total:22, materi:'Full 2×20 menit, Rotasi lineup' },
    ];

    return `
      <div class="p-4 sm:p-6 space-y-5 cp-page">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 class="text-xl font-black text-white">📅 Jadwal Latihan</h2>
            <p class="text-xs text-zinc-400 mt-0.5">Pekan ini · ${extended.length} sesi dijadwalkan</p>
          </div>
          <div class="flex items-center gap-2">
            <div class="flex items-center gap-1 glass-subtle rounded-xl p-1 border border-white/5">
              <button onclick="CoachView._setScheduleView('list')"
                class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${_scheduleView==='list' ? 'bg-lime-400/20 text-lime-300' : 'text-zinc-400'}">
                📋 List
              </button>
              <button onclick="CoachView._setScheduleView('calendar')"
                class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${_scheduleView==='calendar' ? 'bg-lime-400/20 text-lime-300' : 'text-zinc-400'}">
                📆 Kalender
              </button>
            </div>
            <button onclick="CoachView.openCreateDrillModal()"
              class="send-btn px-4 py-2 rounded-2xl text-xs font-bold text-zinc-950 flex items-center gap-1.5">
              <span>+</span> Sesi Baru
            </button>
          </div>
        </div>

        ${_scheduleView === 'calendar' ? renderCalendarView(extended) : renderListView(extended)}
      </div>
    `;
  }

  function _setScheduleView(v) {
    _scheduleView = v;
    const c = document.getElementById('cp-content');
    if (c) c.innerHTML = renderSchedulePage();
  }

  function renderCalendarView(sessions) {
    const days = ['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu'];
    return `
      <div class="glass rounded-3xl p-4 border border-white/5 overflow-x-auto scrollbar-thin">
        <div class="grid grid-cols-7 gap-1 min-w-[700px]">
          <!-- Day headers -->
          ${days.map(d => `
            <div class="text-center text-xs font-bold text-zinc-400 py-2 uppercase tracking-wider">${d}</div>
          `).join('')}
          <!-- Days 18-24 Nov as the demo week -->
          ${Array.from({length:7}, (_,i) => {
            const dayName = days[i];
            const daySessions = sessions.filter(s => s.day === dayName);
            const dateNum = 18 + i;
            return `
              <div class="glass-subtle rounded-2xl p-2 min-h-[120px] border border-white/5 hover:border-lime-400/15 transition-all">
                <div class="text-xs font-black text-zinc-400 mb-2">${dateNum}</div>
                ${daySessions.map(s => {
                  const col = s.status==='active' ? 'border-emerald-400/50 bg-emerald-400/10 text-emerald-300' : 'border-sky-400/30 bg-sky-400/8 text-sky-300';
                  return `<div class="text-[10px] font-semibold p-1.5 rounded-lg border ${col} mb-1 leading-tight cursor-pointer hover:opacity-80"
                    onclick="Utils.showToast('${s.title} · ${s.time} · ${s.location}','info')">
                    ${s.squad} ${s.time}<br/>${s.title.length>22 ? s.title.slice(0,22)+'…' : s.title}
                  </div>`;
                }).join('')}
                ${daySessions.length===0 ? '<div class="text-[10px] text-zinc-700 text-center pt-3">—</div>' : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  function renderListView(sessions) {
    return `
      <div class="space-y-3">
        ${sessions.map(s => {
          const pct = s.present > 0 ? Math.round(s.present/s.total*100) : 0;
          const statusColor = s.status==='active' ? 'bg-emerald-400/15 text-emerald-300 border-emerald-400/25'
            : s.status==='upcoming' ? 'bg-amber-400/15 text-amber-300 border-amber-400/25'
            : 'bg-zinc-700/40 text-zinc-400 border-zinc-600/30';
          return `
            <div class="glass rounded-3xl p-5 border border-white/5 hover:border-lime-400/20 transition-all group">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="flex items-start gap-3">
                  <div class="w-10 h-10 rounded-2xl bg-lime-400/10 border border-lime-400/20 flex items-center justify-center text-xl flex-shrink-0">
                    ${s.squad==='U-16' ? '⚽' : s.squad==='U-14' ? '🌱' : '🏅'}
                  </div>
                  <div class="space-y-1">
                    <div class="flex items-center gap-2 flex-wrap">
                      <span class="text-[10px] font-bold px-2 py-0.5 rounded-lg border ${statusColor}">${s.status==='active'?'● Berlangsung':s.status==='upcoming'?'◎ Segera':'📅 Terjadwal'}</span>
                      <span class="text-[10px] text-zinc-500">${s.squad} · ${s.day}, ${s.date}</span>
                    </div>
                    <h3 class="text-sm font-bold text-white group-hover:text-lime-300 transition-colors">${s.title}</h3>
                    <div class="text-[11px] text-zinc-500">⏰ ${s.time} · ⌛ ${s.duration} · 📍 ${s.location}</div>
                    <div class="text-[11px] text-zinc-500">📚 Materi: ${s.materi}</div>
                  </div>
                </div>
                <div class="flex flex-col items-end gap-2 flex-shrink-0">
                  ${s.status!=='scheduled' ? `
                    <div class="text-xs text-right">
                      <div class="text-zinc-500">Kehadiran</div>
                      <div class="font-black text-emerald-400">${s.present}/${s.total}</div>
                    </div>
                    <div class="w-20 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div class="h-full gradient-emerald rounded-full" style="width:${pct}%"></div>
                    </div>
                  ` : ''}
                  <div class="flex gap-2">
                    <button onclick="CoachView.navTo('attendance')"
                      class="send-btn px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-950">Absensi</button>
                    <button onclick="Utils.showToast('Edit jadwal: ${s.title}','info')"
                      class="glass px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-300 border border-white/10 hover:border-lime-400/30 transition-all">Edit</button>
                  </div>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  /* ================================================================
     4. ABSENSI PAGE
  ================================================================ */
  function renderAttendancePage() {
    const groups = ['U-16','U-14','U-18'];
    const groupRoster = _roster.filter(r => r.squad === _absGroup);
    const statusOptions = ['hadir','izin','sakit','alpha'];
    const statusLabel   = { hadir:'Hadir', izin:'Izin', sakit:'Sakit', alpha:'Tanpa Ket.' };

    // Calculate summary
    const summary = statusOptions.reduce((acc,s) => {
      acc[s] = Object.values(_absData).filter(v => v===s).length;
      return acc;
    }, {hadir:0, izin:0, sakit:0, alpha:0});
    const totalFilled = Object.values(_absData).length;

    return `
      <div class="p-4 sm:p-6 space-y-5 cp-page">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 class="text-xl font-black text-white">📋 Absensi Siswa</h2>
            <p class="text-xs text-zinc-400 mt-0.5">Input kehadiran langsung dari lapangan</p>
          </div>
          <div class="flex gap-2">
            <button onclick="CoachView.saveAttendance()"
              class="send-btn px-4 py-2.5 rounded-2xl text-sm font-bold text-zinc-950 flex items-center gap-2">
              <span>💾</span> Simpan Absensi
            </button>
          </div>
        </div>

        <!-- Controls Bar -->
        <div class="glass rounded-2xl p-3.5 border border-white/5 flex flex-col sm:flex-row gap-3">
          <div class="flex-1">
            <label class="text-[10px] text-zinc-500 uppercase tracking-wider font-bold mb-1 block">Tanggal Latihan</label>
            <input type="date" value="${_absDate}"
              onchange="CoachView._setAbsDate(this.value)"
              class="glass rounded-xl px-3 py-2 text-sm text-white border border-white/10 bg-zinc-900 focus:outline-none focus:border-lime-400/50 w-full"/>
          </div>
          <div class="flex-1">
            <label class="text-[10px] text-zinc-500 uppercase tracking-wider font-bold mb-1 block">Kelompok Usia</label>
            <div class="flex gap-1.5">
              ${groups.map(g => `
                <button onclick="CoachView._setAbsGroup('${g}')"
                  class="flex-1 py-2 rounded-xl text-xs font-bold transition-all ${_absGroup===g ? 'bg-lime-400/20 text-lime-300 border border-lime-400/30' : 'glass text-zinc-400 border border-white/8 hover:text-zinc-200'}">
                  ${g}
                </button>
              `).join('')}
            </div>
          </div>
          <div class="flex-1">
            <label class="text-[10px] text-zinc-500 uppercase tracking-wider font-bold mb-1 block">Semua Hadir</label>
            <button onclick="CoachView.markAllHadir()"
              class="w-full glass py-2 rounded-xl text-xs font-bold text-emerald-300 border border-emerald-400/25 hover:bg-emerald-400/10 transition-all">
              ✅ Semua Hadir
            </button>
          </div>
        </div>

        <!-- Attendance Summary Pills -->
        <div class="grid grid-cols-4 gap-2.5">
          ${[
            { status:'hadir', label:'Hadir', count: summary.hadir, color:'text-emerald-400', bg:'bg-emerald-400/10', border:'border-emerald-400/25' },
            { status:'izin',  label:'Izin',  count: summary.izin,  color:'text-amber-400',  bg:'bg-amber-400/10',  border:'border-amber-400/25'  },
            { status:'sakit', label:'Sakit', count: summary.sakit, color:'text-red-400',    bg:'bg-red-400/10',    border:'border-red-400/25'    },
            { status:'alpha', label:'Alpha', count: summary.alpha, color:'text-zinc-400',   bg:'bg-zinc-700/30',   border:'border-zinc-600/30'   },
          ].map(s => `
            <div class="rounded-2xl p-3 text-center ${s.bg} border ${s.border}">
              <div class="text-2xl font-black ${s.color}">${s.count}</div>
              <div class="text-xs text-zinc-400">${s.label}</div>
            </div>
          `).join('')}
        </div>

        <!-- Progress -->
        <div class="glass rounded-2xl p-3 border border-white/5">
          <div class="flex justify-between text-xs mb-2">
            <span class="text-zinc-400">Sudah diisi: <strong class="text-white">${totalFilled}/${groupRoster.length}</strong></span>
            <span class="text-lime-400 font-bold">${groupRoster.length>0 ? Math.round(totalFilled/groupRoster.length*100) : 0}% selesai</span>
          </div>
          <div class="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div class="h-full rounded-full transition-all duration-500"
              style="width:${groupRoster.length>0?Math.round(totalFilled/groupRoster.length*100):0}%;background:linear-gradient(90deg,#a3e635,#34d399)"></div>
          </div>
        </div>

        <!-- Attendance List (Mobile-first card layout) -->
        <div class="space-y-2">
          ${groupRoster.length === 0 ? `
            <div class="text-center py-12 text-zinc-500">Tidak ada siswa di kelompok ${_absGroup}</div>
          ` : groupRoster.map(pl => {
            const curStatus = _absData[pl.name] || null;
            return `
              <div class="glass rounded-2xl p-3.5 border border-white/5 hover:border-lime-400/15 transition-all">
                <div class="flex flex-col sm:flex-row sm:items-center gap-3">
                  <!-- Player Info -->
                  <div class="flex items-center gap-3 flex-1 min-w-0">
                    <div class="w-10 h-10 rounded-xl ${pl.bg} ${pl.text} flex items-center justify-center font-black text-sm flex-shrink-0">${pl.initials}</div>
                    <div class="min-w-0">
                      <div class="font-bold text-white text-sm truncate">${pl.name}</div>
                      <div class="text-[11px] text-zinc-500">#${pl.number} · ${pl.pos}</div>
                    </div>
                    ${pl.status === 'injured' ? '<span class="ml-auto sm:ml-0 text-[10px] font-bold px-2 py-0.5 rounded-lg bg-red-400/15 text-red-300 border border-red-400/25 flex-shrink-0">🤕 Cedera</span>' : ''}
                  </div>

                  <!-- Attendance Buttons -->
                  <div class="flex gap-1.5 flex-wrap sm:flex-nowrap">
                    ${statusOptions.map(s => `
                      <button
                        onclick="CoachView.setAbsStatus('${pl.name}', '${s}')"
                        class="abs-btn ${curStatus === s ? s : ''} flex-1 sm:flex-none sm:w-20 text-center
                          ${curStatus !== s ? 'text-zinc-500 border-zinc-700/50 bg-transparent hover:border-zinc-500' : ''}">
                        ${s==='hadir'?'✅':s==='izin'?'📝':s==='sakit'?'🤒':'❌'} ${statusLabel[s]}
                      </button>
                    `).join('')}
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Save Button (bottom) -->
        <div class="sticky bottom-4">
          <button onclick="CoachView.saveAttendance()"
            class="w-full send-btn py-3.5 rounded-2xl text-sm font-black text-zinc-950 shadow-2xl flex items-center justify-center gap-2">
            💾 Simpan Lembar Absensi ${_absGroup} · ${new Date(_absDate).toLocaleDateString('id-ID',{day:'numeric',month:'long'})}
          </button>
        </div>
      </div>
    `;
  }

  function _setAbsDate(val) { _absDate = val; const c=document.getElementById('cp-content'); if(c) c.innerHTML=renderAttendancePage(); }
  function _setAbsGroup(g) { _absGroup = g; const c=document.getElementById('cp-content'); if(c) c.innerHTML=renderAttendancePage(); }

  function setAbsStatus(name, status) {
    _absData[name] = status;
    const c = document.getElementById('cp-content');
    if (c) c.innerHTML = renderAttendancePage();
  }

  function markAllHadir() {
    const groupRoster = _roster.filter(r => r.squad === _absGroup);
    groupRoster.forEach(pl => { _absData[pl.name] = 'hadir'; });
    const c = document.getElementById('cp-content');
    if (c) c.innerHTML = renderAttendancePage();
    Utils.showToast('Semua siswa ditandai Hadir ✅', 'success');
  }

  function saveAttendance() {
    const totalFilled = Object.values(_absData).length;
    const hadir = Object.values(_absData).filter(v => v==='hadir').length;
    Utils.showToast(`Absensi ${_absGroup} disimpan! ${hadir}/${totalFilled} hadir ✅`, 'success');
  }

  /* ================================================================
     5. EVALUASI PERFORMA PAGE
  ================================================================ */
  function renderEvaluationPage() {
    const target = _evalTarget
      ? (_roster.find(r => r.name === _evalTarget) || _roster[0])
      : _roster[0];

    const skills = [
      { key:'passing',   label:'Passing',           icon:'🎯' },
      { key:'shooting',  label:'Shooting',           icon:'⚽' },
      { key:'dribbling', label:'Dribbling',          icon:'🏃' },
      { key:'ballControl',label:'Ball Control',      icon:'🖐️' },
      { key:'speed',     label:'Speed',              icon:'⚡' },
      { key:'stamina',   label:'Stamina',            icon:'💪' },
      { key:'tactical',  label:'Tactical Awareness', icon:'🧠' },
      { key:'teamwork',  label:'Teamwork',           icon:'🤝' },
      { key:'discipline',label:'Discipline',         icon:'🎖️' },
    ];

    const getColor = (v) => v >= 85 ? 'text-emerald-400' : v >= 70 ? 'text-amber-400' : 'text-red-400';
    const getBarColor = (v) => v >= 85 ? 'gradient-emerald' : v >= 70 ? 'bg-amber-400' : 'bg-red-400';

    return `
      <div class="p-4 sm:p-6 space-y-5 cp-page">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 class="text-xl font-black text-white">📊 Evaluasi Performa Siswa</h2>
            <p class="text-xs text-zinc-400 mt-0.5">Input nilai kemampuan dan pantau perkembangan atlet</p>
          </div>
          <button onclick="CoachView.saveEvaluation()"
            class="send-btn px-4 py-2.5 rounded-2xl text-sm font-bold text-zinc-950 flex items-center gap-2 self-start sm:self-auto">
            <span>💾</span> Simpan Evaluasi
          </button>
        </div>

        <!-- Student Selector -->
        <div class="glass rounded-2xl p-3.5 border border-white/5">
          <label class="text-xs text-zinc-400 font-bold mb-2 block">Pilih Siswa yang Dievaluasi</label>
          <div class="flex flex-wrap gap-2 max-h-28 overflow-y-auto scrollbar-thin">
            ${_roster.map(r => `
              <button onclick="CoachView._setEvalTarget('${r.name}'); CoachView.navTo('evaluation')"
                class="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border
                  ${(target && r.name === target.name) ? 'bg-lime-400/20 text-lime-300 border-lime-400/35' : 'glass text-zinc-400 border-white/8 hover:border-lime-400/25'}">
                <div class="w-5 h-5 rounded-lg ${r.bg} ${r.text} flex items-center justify-center font-bold text-[9px]">${r.initials}</div>
                ${r.name.split(' ')[0]}
              </button>
            `).join('')}
          </div>
        </div>

        ${target ? `
          <!-- Target Player Info -->
          <div class="glass rounded-3xl p-4 border border-lime-400/20 flex items-center gap-4">
            <div class="w-14 h-14 rounded-2xl ${target.bg} ${target.text} flex items-center justify-center font-black text-xl flex-shrink-0 shadow-lg online-ring">${target.initials}</div>
            <div class="flex-1">
              <div class="text-base font-black text-white">${target.name}</div>
              <div class="text-xs text-zinc-400">${target.pos} · ${target.squad} · #${target.number}</div>
              <div class="text-xs text-lime-400 font-semibold mt-0.5">Rating saat ini: ${target.rating}</div>
            </div>
            <div class="text-right">
              <div class="text-xs text-zinc-500">Rata-rata Nilai</div>
              <div class="text-3xl font-black text-lime-400">${Math.round(Object.values(_evalScores).reduce((a,b)=>a+b,0)/Object.values(_evalScores).length)}</div>
              <div class="text-[10px] text-zinc-500">/ 100</div>
            </div>
          </div>

          <!-- Two-column layout -->
          <div class="grid lg:grid-cols-2 gap-5">

            <!-- Skill Input Sliders -->
            <div class="glass rounded-3xl p-5 border border-white/5 space-y-4">
              <h3 class="text-sm font-bold text-white flex items-center gap-2"><span>🎚️</span> Input Nilai Kemampuan</h3>
              <div class="space-y-4">
                ${skills.map(sk => `
                  <div>
                    <div class="flex justify-between items-center mb-1.5">
                      <div class="flex items-center gap-2 text-xs font-semibold text-zinc-300">
                        <span>${sk.icon}</span> ${sk.label}
                      </div>
                      <div class="flex items-center gap-2">
                        <input type="number" min="0" max="100" value="${_evalScores[sk.key]}"
                          onchange="CoachView._setScore('${sk.key}', parseInt(this.value))"
                          class="w-14 text-center text-sm font-black ${getColor(_evalScores[sk.key])} bg-transparent border border-white/10 rounded-lg py-0.5 focus:outline-none focus:border-lime-400/50"/>
                      </div>
                    </div>
                    <input type="range" min="0" max="100" value="${_evalScores[sk.key]}"
                      oninput="CoachView._setScore('${sk.key}', parseInt(this.value))"
                      class="score-slider w-full cursor-pointer"/>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Visual Stats + Radar -->
            <div class="space-y-4">
              <!-- Skill Bars -->
              <div class="glass rounded-3xl p-5 border border-white/5 space-y-3">
                <h3 class="text-sm font-bold text-white flex items-center gap-2"><span>📈</span> Profil Kemampuan</h3>
                ${skills.map(sk => `
                  <div>
                    <div class="flex justify-between text-xs mb-1">
                      <span class="text-zinc-400">${sk.label}</span>
                      <span class="font-black ${getColor(_evalScores[sk.key])}">${_evalScores[sk.key]}</span>
                    </div>
                    <div class="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div class="${getBarColor(_evalScores[sk.key])} h-full rounded-full skill-bar-fill" style="width:${_evalScores[sk.key]}%"></div>
                    </div>
                  </div>
                `).join('')}
              </div>

              <!-- Radar Chart (SVG) -->
              <div class="glass rounded-3xl p-5 border border-white/5">
                <h3 class="text-sm font-bold text-white mb-3 flex items-center gap-2"><span>🕸️</span> Radar Kemampuan</h3>
                <div id="radar-chart-wrap" class="flex justify-center">
                  ${renderRadarSVG()}
                </div>
              </div>
            </div>
          </div>

          <!-- Coach Notes -->
          <div class="glass rounded-3xl p-5 border border-amber-400/15 space-y-3">
            <h3 class="text-sm font-bold text-white flex items-center gap-2"><span>📝</span> Catatan & Rekomendasi Pelatih</h3>
            <textarea id="eval-notes" rows="3" placeholder="Tuliskan catatan evaluasi, kekuatan, kelemahan, dan rekomendasi pengembangan untuk ${target.name}..."
              class="w-full glass rounded-2xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 border border-white/10 focus:outline-none focus:border-lime-400/40 transition-colors resize-none leading-relaxed bg-transparent"></textarea>
            <div class="flex gap-2">
              <button onclick="CoachView.saveEvaluation()"
                class="flex-1 send-btn py-2.5 rounded-2xl text-sm font-bold text-zinc-950">
                💾 Simpan & Kirim ke Orang Tua
              </button>
              <button onclick="Utils.showToast('Riwayat evaluasi ${target.name} dimuat 📊','info')"
                class="flex-1 glass py-2.5 rounded-2xl text-sm font-bold text-zinc-300 border border-white/10 hover:border-lime-400/30 transition-all">
                📅 Lihat Riwayat
              </button>
            </div>
          </div>

          <!-- Comparison (previous period) -->
          <div class="glass rounded-3xl p-5 border border-white/5 space-y-3">
            <h3 class="text-sm font-bold text-white flex items-center gap-2"><span>📊</span> Perbandingan Antarperiode</h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              ${skills.slice(0,6).map(sk => {
                const delta = Math.floor(Math.random()*10) - 3;
                return `
                  <div class="glass-subtle rounded-2xl p-3 border border-white/5 text-center">
                    <div class="text-[11px] text-zinc-500 mb-1">${sk.label}</div>
                    <div class="text-lg font-black ${getColor(_evalScores[sk.key])}">${_evalScores[sk.key]}</div>
                    <div class="text-[11px] font-bold mt-0.5 ${delta>=0?'text-emerald-400':'text-red-400'}">
                      ${delta>=0?'↑':'↓'} ${Math.abs(delta)} dari Oktober
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        ` : `<div class="text-center py-16 text-zinc-500">Pilih siswa untuk mulai evaluasi</div>`}
      </div>
    `;
  }

  function _setScore(key, val) {
    _evalScores[key] = Math.max(0, Math.min(100, val || 0));
    const wrap = document.getElementById('radar-chart-wrap');
    if (wrap) wrap.innerHTML = renderRadarSVG();
    // Update skill bars live
    const c = document.getElementById('cp-content');
    if (c) c.innerHTML = renderEvaluationPage();
  }

  function renderRadarSVG() {
    const keys  = ['passing','shooting','dribbling','ballControl','speed','stamina','tactical','teamwork'];
    const vals  = keys.map(k => _evalScores[k] / 100);
    const labels= ['Passing','Shooting','Dribbling','Ball Ctrl','Speed','Stamina','Tactical','Teamwork'];
    const cx=120, cy=120, r=90, n=keys.length;
    const pt = (val, i) => {
      const angle = (Math.PI*2*i/n) - Math.PI/2;
      return { x: cx + val*r*Math.cos(angle), y: cy + val*r*Math.sin(angle) };
    };
    const grid = [0.25,0.5,0.75,1].map(scale => {
      const pts = Array.from({length:n},(_,i)=>pt(scale,i));
      return `<polygon points="${pts.map(p=>`${p.x},${p.y}`).join(' ')}" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>`;
    }).join('');
    const spokes = Array.from({length:n},(_,i) => {
      const p = pt(1,i);
      return `<line x1="${cx}" y1="${cy}" x2="${p.x}" y2="${p.y}" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>`;
    }).join('');
    const pts = vals.map((v,i) => pt(v,i));
    const poly = `<polygon points="${pts.map(p=>`${p.x},${p.y}`).join(' ')}" fill="rgba(163,230,53,0.2)" stroke="#a3e635" stroke-width="2"/>`;
    const dots = pts.map(p => `<circle cx="${p.x}" cy="${p.y}" r="4" fill="#a3e635" stroke="#052e16" stroke-width="1.5"/>`).join('');
    const lbls = labels.map((l,i) => {
      const p = pt(1.18,i);
      return `<text x="${p.x}" y="${p.y}" text-anchor="middle" dominant-baseline="middle" class="radar-label" fill="#a1a1aa" font-size="10">${l}</text>`;
    }).join('');
    return `<svg viewBox="0 0 240 240" width="220" height="220" xmlns="http://www.w3.org/2000/svg">
      ${grid}${spokes}${poly}${dots}${lbls}
    </svg>`;
  }

  function initRadarChart() {
    const wrap = document.getElementById('radar-chart-wrap');
    if (wrap && !wrap.querySelector('svg')) wrap.innerHTML = renderRadarSVG();
  }

  function saveEvaluation() {
    const name = _evalTarget || (_roster[0] && _roster[0].name) || 'Siswa';
    const avg  = Math.round(Object.values(_evalScores).reduce((a,b)=>a+b,0)/Object.values(_evalScores).length);
    Utils.showToast(`Evaluasi ${name} disimpan! Rata-rata: ${avg}/100 📊`, 'success');
  }

  /* ================================================================
     6. PROGRAM LATIHAN PAGE
  ================================================================ */
  function renderProgramsPage() {
    const statusColors = {
      active:    'bg-emerald-400/15 text-emerald-300 border-emerald-400/25',
      planned:   'bg-sky-400/15 text-sky-300 border-sky-400/25',
      completed: 'bg-zinc-700/40 text-zinc-400 border-zinc-600/30',
    };
    const diffColors = {
      'Tinggi':   'text-red-400',
      'Sedang':   'text-amber-400',
      'Rendah':   'text-emerald-400',
      'Spesifik': 'text-purple-400',
    };

    return `
      <div class="p-4 sm:p-6 space-y-5 cp-page">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 class="text-xl font-black text-white">⚽ Program Latihan</h2>
            <p class="text-xs text-zinc-400 mt-0.5">${_programs.filter(p=>p.status==='active').length} aktif · ${_programs.length} total program</p>
          </div>
          <button onclick="CoachView.openCreateProgramModal()"
            class="btn-lime-glow px-4 py-2.5 rounded-2xl text-sm font-bold text-zinc-950 flex items-center gap-2 self-start sm:self-auto shadow-lg">
            <span>+</span> Program Baru
          </button>
        </div>

        <!-- Program Cards -->
        <div class="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          ${_programs.map((prog,idx) => `
            <div class="glass rounded-3xl p-5 border border-white/5 hover:border-lime-400/20 transition-all group space-y-3.5">
              <!-- Top -->
              <div class="flex items-start justify-between gap-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-lg border ${statusColors[prog.status] || statusColors.planned}">
                  ${prog.status==='active'?'● Aktif':prog.status==='completed'?'✓ Selesai':'◎ Direncanakan'}
                </span>
                <div class="flex gap-1">
                  <button onclick="Utils.showToast('Edit program: ${prog.name}','info')"
                    class="glass-subtle w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-lime-400 border border-white/5 text-xs">✏️</button>
                  <button onclick="CoachView.deleteProgram(${idx})"
                    class="glass-subtle w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-red-400 border border-white/5 text-xs">🗑️</button>
                </div>
              </div>

              <!-- Title -->
              <div>
                <h3 class="text-sm font-black text-white group-hover:text-lime-300 transition-colors leading-snug">${prog.name}</h3>
                <div class="text-[11px] text-zinc-500 mt-1">${prog.goal}</div>
              </div>

              <!-- Meta -->
              <div class="flex flex-wrap gap-2 text-[11px]">
                <span class="px-2 py-0.5 rounded-lg bg-sky-400/10 text-sky-300 border border-sky-400/20">${prog.squad}</span>
                <span class="px-2 py-0.5 rounded-lg bg-white/5 text-zinc-300 border border-white/8">⌛ ${prog.duration}</span>
                <span class="px-2 py-0.5 rounded-lg bg-white/5 border border-white/8 ${diffColors[prog.difficulty] || 'text-zinc-300'}">🎚️ ${prog.difficulty}</span>
              </div>

              <!-- Drills list -->
              <div>
                <div class="text-[10px] text-zinc-500 uppercase tracking-wider mb-1.5 font-bold">Drill Latihan:</div>
                <div class="flex flex-wrap gap-1.5">
                  ${prog.drills.map(d => `
                    <span class="text-[10px] px-2 py-0.5 rounded-lg glass-subtle text-zinc-300 border border-white/8">${d}</span>
                  `).join('')}
                </div>
              </div>

              <!-- Action -->
              <button onclick="Utils.showToast('Detail program: ${prog.name}','info')"
                class="w-full glass py-2 rounded-2xl text-xs font-bold text-zinc-300 border border-white/8 hover:border-lime-400/30 transition-all">
                Lihat Detail & Instruksi →
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function deleteProgram(idx) {
    if (confirm('Hapus program ini?')) {
      _programs.splice(idx, 1);
      const c = document.getElementById('cp-content');
      if (c) c.innerHTML = renderProgramsPage();
      Utils.showToast('Program dihapus.', 'warning');
    }
  }

  /* ================================================================
     7. PERTANDINGAN PAGE
  ================================================================ */
  function renderMatchesPage() {
    const tabs = [
      { id:'upcoming', label:'Mendatang', data: PUBLIC_FIXTURES },
      { id:'results',  label:'Hasil Laga', data: MATCH_RESULTS  },
    ];

    return `
      <div class="p-4 sm:p-6 space-y-5 cp-page">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 class="text-xl font-black text-white">🏆 Pertandingan & Turnamen</h2>
            <p class="text-xs text-zinc-400 mt-0.5">Kelola jadwal, lineup, dan evaluasi laga</p>
          </div>
          <button onclick="Utils.showToast('Form input hasil pertandingan dibuka 🏆','info')"
            class="send-btn px-4 py-2.5 rounded-2xl text-sm font-bold text-zinc-950 flex items-center gap-2 self-start sm:self-auto">
            <span>+</span> Input Hasil Laga
          </button>
        </div>

        <!-- Season Stats -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          ${[
            { icon:'🏆', label:'Menang', value:'11', color:'text-emerald-400', bg:'bg-emerald-400/10 border-emerald-400/20' },
            { icon:'🤝', label:'Seri',   value:'2',  color:'text-amber-400',  bg:'bg-amber-400/10 border-amber-400/20'  },
            { icon:'❌', label:'Kalah',  value:'2',  color:'text-red-400',    bg:'bg-red-400/10 border-red-400/20'    },
            { icon:'⚽', label:'Total Gol', value:'38', color:'text-lime-400', bg:'bg-lime-400/10 border-lime-400/20' },
          ].map(s => `
            <div class="rounded-2xl p-3 text-center border ${s.bg}">
              <div class="text-2xl">${s.icon}</div>
              <div class="text-2xl font-black ${s.color} leading-none mt-1">${s.value}</div>
              <div class="text-xs text-zinc-500 mt-0.5">${s.label}</div>
            </div>
          `).join('')}
        </div>

        <!-- Tabs -->
        <div class="flex gap-1 glass-subtle rounded-2xl p-1 border border-white/5 w-fit">
          ${tabs.map(t => `
            <button onclick="CoachView._setMatchTab('${t.id}')"
              class="px-5 py-2 rounded-xl text-sm font-bold transition-all ${_matchTab===t.id ? 'bg-lime-400/20 text-lime-300 border border-lime-400/30' : 'text-zinc-400 hover:text-zinc-200'}">
              ${t.label}
            </button>
          `).join('')}
        </div>

        <!-- Upcoming Matches -->
        ${_matchTab === 'upcoming' ? `
          <div class="space-y-4">
            ${PUBLIC_FIXTURES.map(m => `
              <div class="glass rounded-3xl p-5 border border-white/5 hover:border-lime-400/20 transition-all">
                <!-- Match header -->
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-2">
                    <span class="text-[10px] font-bold px-2.5 py-1 rounded-xl bg-lime-400/15 text-lime-400 border border-lime-400/25">${m.squad}</span>
                    <span class="text-[10px] text-zinc-500">${m.type}</span>
                  </div>
                  <span class="text-xs text-zinc-500">${m.date} · ${m.time}</span>
                </div>

                <!-- Teams -->
                <div class="flex items-center justify-center gap-6 my-2">
                  <div class="text-center flex-1">
                    <div class="text-3xl mb-1">${m.homeIcon}</div>
                    <div class="text-sm font-black text-white">${m.home}</div>
                  </div>
                  <div class="text-center px-4">
                    <div class="text-xs text-zinc-500 font-semibold uppercase tracking-widest">VS</div>
                  </div>
                  <div class="text-center flex-1">
                    <div class="text-3xl mb-1">${m.awayIcon}</div>
                    <div class="text-sm font-black text-white">${m.away}</div>
                  </div>
                </div>

                <div class="text-center text-xs text-zinc-500 mt-2">📍 ${m.venue}</div>

                <!-- Action buttons -->
                <div class="flex gap-2 mt-4">
                  <button onclick="CoachView.navTo('students')"
                    class="flex-1 send-btn py-2.5 rounded-2xl text-xs font-bold text-zinc-950">📋 Susun Lineup</button>
                  <button onclick="CoachView.openAnnouncementModal()"
                    class="flex-1 glass py-2.5 rounded-2xl text-xs font-bold text-amber-300 border border-amber-400/25 hover:border-amber-400/50 transition-all">📢 Briefing Tim</button>
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <!-- Match Results -->
          <div class="space-y-4">
            ${MATCH_RESULTS.map(m => `
              <div class="glass rounded-3xl p-5 border border-white/5 hover:border-lime-400/15 transition-all space-y-4">
                <div class="flex items-center justify-between flex-wrap gap-2">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg border match-badge-${m.result}">
                      ${m.result}
                    </div>
                    <div>
                      <div class="font-black text-white text-sm">YouthTrigger ${m.squad} vs ${m.opp}</div>
                      <div class="text-xs text-zinc-500">${m.date} · 📍 ${m.venue}</div>
                    </div>
                  </div>
                  <div class="text-3xl font-black text-white">${m.score}</div>
                </div>

                <!-- Scorers -->
                <div class="pt-3 border-t border-white/5">
                  <div class="text-[10px] text-zinc-500 uppercase tracking-wider mb-1.5 font-bold">Pencetak Gol</div>
                  <div class="flex flex-wrap gap-1.5">
                    ${m.scorers.map(s => `
                      <span class="text-[11px] px-2.5 py-1 rounded-xl glass-subtle text-zinc-200 border border-white/8">⚽ ${s}</span>
                    `).join('')}
                  </div>
                </div>

                <button onclick="Utils.showToast('Laporan evaluasi tim untuk laga ini dibuka 📊','info')"
                  class="w-full glass py-2 rounded-2xl text-xs font-bold text-zinc-300 border border-white/8 hover:border-lime-400/30 transition-all">
                  📊 Lihat Evaluasi Tim →
                </button>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;
  }

  function _setMatchTab(t) {
    _matchTab = t;
    const c = document.getElementById('cp-content');
    if (c) c.innerHTML = renderMatchesPage();
  }

  /* ================================================================
     8. PENGUMUMAN PAGE
  ================================================================ */
  function renderAnnouncementsPage() {
    return `
      <div class="p-4 sm:p-6 space-y-5 cp-page">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 class="text-xl font-black text-white">📢 Pengumuman</h2>
            <p class="text-xs text-zinc-400 mt-0.5">${_announcements.length} pengumuman · ${_announcements.filter(a=>a.pinned).length} disematkan</p>
          </div>
          <button onclick="CoachView.openAnnouncementModal()"
            class="send-btn px-4 py-2.5 rounded-2xl text-sm font-bold text-zinc-950 flex items-center gap-2 self-start sm:self-auto shadow-lg">
            <span>+</span> Buat Pengumuman
          </button>
        </div>

        <!-- Pinned Announcements -->
        <div>
          <div class="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-2">📌 Disematkan</div>
          <div class="space-y-3">
            ${_announcements.filter(a => a.pinned).map((a,i) => renderAnnouncementCard(a, i, true)).join('')}
          </div>
        </div>

        <!-- Other Announcements -->
        <div>
          <div class="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-2">🗂️ Riwayat</div>
          <div class="space-y-3">
            ${_announcements.filter(a => !a.pinned).map((a,i) => renderAnnouncementCard(a, i, false)).join('')}
          </div>
        </div>
      </div>
    `;
  }

  function renderAnnouncementCard(a, i, pinned) {
    return `
      <div class="glass rounded-3xl p-4 border ${pinned ? 'border-amber-400/25' : 'border-white/5'} hover:border-lime-400/15 transition-all">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-2xl ${pinned ? 'bg-amber-400/15' : 'bg-white/5'} flex items-center justify-center text-xl flex-shrink-0 border ${pinned ? 'border-amber-400/25' : 'border-white/8'}">
            ${pinned ? '📌' : '📢'}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <div class="font-bold text-white text-sm">${a.title}</div>
                <div class="text-[11px] text-zinc-500 mt-0.5">${a.author} · ${a.date} · Target: ${a.target}</div>
              </div>
              <div class="flex gap-1.5 flex-shrink-0">
                ${pinned ? '<span class="text-[10px] px-2 py-0.5 rounded-lg bg-amber-400/15 text-amber-300 border border-amber-400/20 font-bold">Disematkan</span>' : ''}
                <button onclick="Utils.showToast('Pengumuman diedit','info')"
                  class="glass-subtle w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-lime-400 border border-white/5 text-xs">✏️</button>
                <button onclick="CoachView.deleteAnnouncement(${i}, ${pinned})"
                  class="glass-subtle w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-red-400 border border-white/5 text-xs">🗑️</button>
              </div>
            </div>
            <p class="text-xs text-zinc-400 mt-2 leading-relaxed">${a.body}</p>
          </div>
        </div>
      </div>
    `;
  }

  function deleteAnnouncement(idx, pinned) {
    const list = pinned
      ? _announcements.filter(a=>a.pinned)
      : _announcements.filter(a=>!a.pinned);
    const realIdx = _announcements.indexOf(list[idx]);
    if (realIdx >= 0) _announcements.splice(realIdx, 1);
    const c = document.getElementById('cp-content');
    if (c) c.innerHTML = renderAnnouncementsPage();
    Utils.showToast('Pengumuman dihapus.','warning');
  }

  /* ================================================================
     9. PROFIL PELATIH PAGE
  ================================================================ */
  function renderProfilePage() {
    const p = ROLES.coach;
    const certs = [
      { name:'AFC Grassroots C License',       year:'2018', issuer:'AFC / PSSI' },
      { name:'Kepelatihan Sepak Bola Nasional', year:'2020', issuer:'PSSI' },
      { name:'Sports Nutrition Fundamentals',  year:'2021', issuer:'NSCA Indonesia' },
      { name:'Youth Development Coaching',     year:'2022', issuer:'FIFA' },
    ];

    return `
      <div class="p-4 sm:p-6 space-y-5 cp-page">
        <!-- Profile Hero -->
        <div class="glass rounded-3xl p-6 border border-lime-400/15 relative overflow-hidden">
          <div class="absolute inset-0 opacity-5"
            style="background-image: repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(163,230,53,.5) 20px, rgba(163,230,53,.5) 21px);">
          </div>
          <div class="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div class="relative">
              <div class="w-24 h-24 rounded-3xl ${p.avatarBg} ${p.avatarText} flex items-center justify-center font-black text-4xl shadow-2xl online-ring select-none">
                ${p.initials}
              </div>
              <button onclick="Utils.showToast('Upload foto profil (fitur produksi)','info')"
                class="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl glass flex items-center justify-center text-xs border border-white/15 hover:border-lime-400/50 transition-all">
                📷
              </button>
            </div>
            <div class="text-center sm:text-left flex-1">
              <h2 class="text-2xl font-black text-white">${p.fullName}</h2>
              <div class="text-lime-400 font-semibold mt-0.5">Head Coach · YouthTrigger Academy</div>
              <div class="flex flex-wrap gap-2 justify-center sm:justify-start mt-2">
                <span class="text-xs px-2.5 py-1 rounded-xl bg-amber-400/15 text-amber-300 border border-amber-400/25 font-semibold">👑 Head Coach</span>
                <span class="text-xs px-2.5 py-1 rounded-xl bg-lime-400/15 text-lime-300 border border-lime-400/25 font-semibold">🏅 Lisensi A</span>
                <span class="text-xs px-2.5 py-1 rounded-xl bg-emerald-400/15 text-emerald-300 border border-emerald-400/25 font-semibold">● Online</span>
              </div>
            </div>
            <button onclick="Utils.showToast('Profil diedit! Simpan perubahan.','info')"
              class="send-btn px-4 py-2 rounded-2xl text-xs font-bold text-zinc-950 flex-shrink-0">
              ✏️ Edit Profil
            </button>
          </div>
        </div>

        <!-- Info Grid -->
        <div class="grid sm:grid-cols-2 gap-4">
          <!-- Personal Info -->
          <div class="glass rounded-3xl p-5 border border-white/5 space-y-4">
            <h3 class="text-sm font-bold text-white flex items-center gap-2"><span>👤</span> Informasi Pribadi</h3>
            ${[
              { label:'Nama Lengkap',   value:'Hendra Saputra, S.Or.' },
              { label:'ID Pelatih',     value:'KSA-COACH-001' },
              { label:'Spesialisasi',   value:'Teknik Menyerang & Pressing' },
              { label:'Lisensi',        value:'AFC Lisensi A (2024)' },
              { label:'Kelompok Binaan', value:'U-14, U-16, U-18' },
              { label:'Email',          value:'hendra@youthtrigger.id' },
              { label:'Telepon',        value:'0812-3456-7890' },
              { label:'Bergabung',      value:'Januari 2019' },
            ].map(f => `
              <div class="flex justify-between gap-3 py-1.5 border-b border-white/5 last:border-0">
                <span class="text-xs text-zinc-500">${f.label}</span>
                <span class="text-xs font-semibold text-zinc-200 text-right">${f.value}</span>
              </div>
            `).join('')}
          </div>

          <!-- Stats + Certs -->
          <div class="space-y-4">
            <!-- Coaching Stats -->
            <div class="glass rounded-3xl p-5 border border-white/5 space-y-3">
              <h3 class="text-sm font-bold text-white flex items-center gap-2"><span>📊</span> Statistik Kepelatihan</h3>
              <div class="grid grid-cols-2 gap-2">
                ${[
                  { label:'Total Siswa', value:'58', color:'text-lime-400' },
                  { label:'Tahun Melatih', value:'7', color:'text-amber-400' },
                  { label:'Win Rate', value:'73%', color:'text-emerald-400' },
                  { label:'Trofi', value:'12', color:'text-purple-400' },
                ].map(s => `
                  <div class="glass-subtle rounded-2xl p-3 text-center border border-white/5">
                    <div class="text-xl font-black ${s.color}">${s.value}</div>
                    <div class="text-[11px] text-zinc-500">${s.label}</div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Certifications -->
            <div class="glass rounded-3xl p-5 border border-white/5 space-y-3">
              <h3 class="text-sm font-bold text-white flex items-center gap-2"><span>🏅</span> Sertifikasi & Lisensi</h3>
              <div class="space-y-2">
                ${certs.map(c => `
                  <div class="glass-subtle rounded-2xl p-3 flex items-center gap-3 border border-white/5">
                    <div class="w-8 h-8 rounded-xl bg-lime-400/15 flex items-center justify-center text-sm flex-shrink-0 border border-lime-400/20">🏅</div>
                    <div class="flex-1 min-w-0">
                      <div class="text-xs font-semibold text-white truncate">${c.name}</div>
                      <div class="text-[10px] text-zinc-500">${c.issuer} · ${c.year}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /* ================================================================
     10. PENGATURAN PAGE
  ================================================================ */
  function renderSettingsPage() {
    return `
      <div class="p-4 sm:p-6 space-y-5 cp-page">
        <div>
          <h2 class="text-xl font-black text-white">⚙️ Pengaturan</h2>
          <p class="text-xs text-zinc-400 mt-0.5">Kelola akun dan preferensi Coach Portal</p>
        </div>

        <!-- Settings Groups -->
        ${[
          {
            title: '🔐 Keamanan Akun',
            items: [
              { label:'Ubah Password', desc:'Perbarui kata sandi akun secara berkala', action:'Ubah', cb:"Utils.showToast('Form ubah password dibuka 🔐','info')" },
              { label:'Verifikasi 2 Langkah (2FA)', desc:'Tambahkan lapisan keamanan ekstra via SMS / Authenticator', action:'Aktifkan', cb:"Utils.showToast('2FA diaktifkan! Scan QR code di app authenticator ✅','success')" },
              { label:'Riwayat Login', desc:'Pantau aktivitas login dari perangkat lain', action:'Lihat', cb:"Utils.showToast('Riwayat login diload 📋','info')" },
            ]
          },
          {
            title: '🔔 Notifikasi',
            items: [
              { label:'Notifikasi Absensi', desc:'Terima alert ketika siswa tidak hadir tanpa keterangan', toggle:true, default:true },
              { label:'Reminder Jadwal Latihan', desc:'Pengingat 1 jam sebelum sesi latihan dimulai', toggle:true, default:true },
              { label:'Update Evaluasi', desc:'Notifikasi ketika evaluasi siswa disubmit orang tua', toggle:true, default:false },
              { label:'Pengumuman Akademi', desc:'Notifikasi pengumuman dari manajemen akademi', toggle:true, default:true },
            ]
          },
          {
            title: '🎨 Tampilan',
            items: [
              { label:'Tema Aplikasi', desc:'Pilih tema gelap atau terang (dark/light mode)', action:'Dark Mode ✓', cb:"Utils.showToast('Tema sudah Dark Mode 🌑','info')" },
              { label:'Bahasa', desc:'Pilih bahasa antarmuka aplikasi', action:'🇮🇩 Bahasa Indonesia', cb:"Utils.showToast('Bahasa: Bahasa Indonesia ✅','info')" },
              { label:'Ukuran Teks', desc:'Sesuaikan ukuran font untuk kenyamanan membaca', action:'Normal', cb:"Utils.showToast('Ukuran teks: Normal 📝','info')" },
            ]
          },
          {
            title: '👤 Akun & Data',
            items: [
              { label:'Export Data Siswa', desc:'Unduh laporan data siswa dalam format Excel/PDF', action:'Export', cb:"Utils.showToast('File Excel/PDF disiapkan untuk diunduh 📁','success')" },
              { label:'Hapus Cache Aplikasi', desc:'Bersihkan data sementara untuk performa optimal', action:'Bersihkan', cb:"Utils.showToast('Cache berhasil dibersihkan ✨','success')" },
              { label:'Keluar dari Semua Perangkat', desc:'Logout dari semua sesi aktif', action:'Logout Semua', cb:"Utils.showToast('Semua sesi aktif telah diakhiri 🔒','warning')" },
            ]
          },
        ].map(group => `
          <div class="glass rounded-3xl p-5 border border-white/5 space-y-4">
            <h3 class="text-sm font-bold text-white">${group.title}</h3>
            <div class="space-y-3">
              ${group.items.map((item,i) => `
                <div class="flex items-center justify-between gap-4 py-2.5 ${i<group.items.length-1 ? 'border-b border-white/5' : ''}">
                  <div class="min-w-0">
                    <div class="text-sm font-semibold text-white">${item.label}</div>
                    <div class="text-xs text-zinc-500 mt-0.5">${item.desc}</div>
                  </div>
                  ${item.toggle ? `
                    <button onclick="this.classList.toggle('bg-lime-400'); this.classList.toggle('bg-zinc-700'); this.firstElementChild.classList.toggle('right-0.5'); this.firstElementChild.classList.toggle('left-0.5')"
                      class="w-10 h-5 rounded-full relative flex-shrink-0 transition-colors ${item.default ? 'bg-lime-400' : 'bg-zinc-700'}">
                      <div class="absolute top-0.5 ${item.default ? 'right-0.5' : 'left-0.5'} w-4 h-4 rounded-full bg-white shadow transition-all"></div>
                    </button>
                  ` : `
                    <button onclick="${item.cb}"
                      class="glass-subtle px-3.5 py-1.5 rounded-xl text-xs font-bold text-zinc-200 border border-white/10 hover:border-lime-400/40 transition-all flex-shrink-0 whitespace-nowrap">
                      ${item.action}
                    </button>
                  `}
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}

        <!-- Danger Zone -->
        <div class="glass rounded-3xl p-5 border border-red-400/20 space-y-4">
          <h3 class="text-sm font-bold text-red-400">⚠️ Zona Berbahaya</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between gap-4">
              <div>
                <div class="text-sm font-semibold text-white">Nonaktifkan Akun</div>
                <div class="text-xs text-zinc-500">Akun akan dinonaktifkan sementara, data tidak terhapus</div>
              </div>
              <button onclick="Utils.showToast('Hubungi administrator akademi untuk menonaktifkan akun 📞','warning')"
                class="px-3.5 py-1.5 rounded-xl text-xs font-bold text-red-300 border border-red-400/30 bg-red-400/8 hover:bg-red-400/15 transition-all flex-shrink-0">
                Nonaktifkan
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /* ================================================================
     MODALS
  ================================================================ */
  function openAnnouncementModal() {
    Utils.openModal(`
      <div class="space-y-4">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center text-xl">📢</div>
          <div>
            <h3 class="text-base font-bold text-white">Buat Pengumuman Baru</h3>
            <p class="text-xs text-zinc-400">Pesan dikirim ke tim atau semua kelompok</p>
          </div>
        </div>
        <div class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-zinc-400 mb-1.5">Target Kelompok</label>
            <select id="ann-target" class="w-full glass rounded-xl px-3 py-2.5 text-sm text-zinc-200 bg-zinc-900 border border-white/10 focus:outline-none focus:border-amber-400/50">
              <option>U-16</option><option>U-14</option><option>U-18</option><option>Semua</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-zinc-400 mb-1.5">Judul Pengumuman</label>
            <input type="text" id="ann-title" placeholder="Judul singkat dan jelas..."
              class="w-full glass rounded-xl px-3 py-2.5 text-sm text-white border border-white/10 focus:outline-none focus:border-amber-400/50 transition-colors"/>
          </div>
          <div>
            <label class="block text-xs font-semibold text-zinc-400 mb-1.5">Isi Pesan</label>
            <textarea id="ann-body" rows="4" placeholder="Tulis isi pengumuman lengkap di sini..."
              class="w-full glass rounded-xl px-3 py-2.5 text-sm text-white border border-white/10 focus:outline-none focus:border-amber-400/50 transition-colors resize-none leading-relaxed"></textarea>
          </div>
          <div class="flex items-center gap-2">
            <input type="checkbox" id="ann-pinned" class="w-4 h-4 rounded accent-lime-400"/>
            <label for="ann-pinned" class="text-xs text-zinc-300">Sematkan pengumuman ini</label>
          </div>
        </div>
        <div class="flex justify-end gap-2 pt-1">
          <button onclick="Utils.closeModal()" class="px-4 py-2 glass rounded-xl text-xs text-zinc-400">Batal</button>
          <button onclick="CoachView.submitAnnouncement()" class="px-5 py-2 rounded-xl text-xs font-bold text-zinc-950 shadow-md"
            style="background:linear-gradient(135deg,#f59e0b,#fbbf24)">📢 Kirim</button>
        </div>
      </div>
    `);
  }

  function submitAnnouncement() {
    const title  = document.getElementById('ann-title')?.value.trim() || 'Pengumuman Baru';
    const body   = document.getElementById('ann-body')?.value.trim()  || '';
    const target = document.getElementById('ann-target')?.value || 'Semua';
    const pinned = document.getElementById('ann-pinned')?.checked || false;

    if (!body) { Utils.showToast('Isi pesan tidak boleh kosong!','error'); return; }

    _announcements.unshift({
      id: Date.now(), title, body, target, pinned,
      date: new Date().toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'}),
      author: 'Coach Hendra',
    });

    Utils.closeModal();
    Utils.showToast(`Pengumuman "${title}" berhasil dikirim! 📢`, 'success');
    if (_coachPage === 'announcements') {
      const c = document.getElementById('cp-content');
      if (c) c.innerHTML = renderAnnouncementsPage();
    }
  }

  function openAddPlayerModal() {
    Utils.openModal(`
      <div class="space-y-4">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl" style="background:linear-gradient(135deg,#a3e635,#34d399);display:flex;align-items:center;justify-content:center;font-size:1.25rem">⚽</div>
          <div>
            <h3 class="text-base font-bold text-white">Tambah Siswa Baru</h3>
            <p class="text-xs text-zinc-400">Data didaftarkan ke sistem akademi</p>
          </div>
        </div>
        <div class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-zinc-400 mb-1.5">Nama Lengkap</label>
            <input type="text" id="new-player-name" placeholder="Nama lengkap siswa"
              class="w-full glass rounded-xl px-3 py-2.5 text-sm text-white border border-white/10 focus:outline-none focus:border-lime-400/50"/>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-zinc-400 mb-1.5">Kelompok Usia</label>
              <select id="new-player-squad" class="w-full glass rounded-xl px-3 py-2.5 text-sm text-zinc-200 bg-zinc-900 border border-white/10 focus:outline-none focus:border-lime-400/50">
                <option>U-16</option><option>U-14</option><option>U-18</option><option>U-10</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-zinc-400 mb-1.5">No. Punggung</label>
              <input type="number" id="new-player-num" value="17"
                class="w-full glass rounded-xl px-3 py-2.5 text-sm text-white border border-white/10 focus:outline-none focus:border-lime-400/50"/>
            </div>
          </div>
          <div>
            <label class="block text-xs font-semibold text-zinc-400 mb-1.5">Posisi</label>
            <select id="new-player-pos" class="w-full glass rounded-xl px-3 py-2.5 text-sm text-zinc-200 bg-zinc-900 border border-white/10 focus:outline-none focus:border-lime-400/50">
              ${['Goalkeeper','Left Back','Centre Back','Right Back','Defensive Mid','Central Mid','Attacking Mid','Left Winger','Striker','Right Winger']
                .map(p => `<option>${p}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="flex justify-end gap-2 pt-1">
          <button onclick="Utils.closeModal()" class="px-4 py-2 glass rounded-xl text-xs text-zinc-400">Batal</button>
          <button onclick="CoachView.addPlayerSubmit()" class="btn-lime-glow px-5 py-2 rounded-xl text-xs font-bold text-zinc-950">✅ Tambahkan</button>
        </div>
      </div>
    `);
  }

  async function addPlayerSubmit() {
    const name  = document.getElementById('new-player-name')?.value.trim() || 'Pemain Baru';
    const num   = parseInt(document.getElementById('new-player-num')?.value || '17');
    const pos   = document.getElementById('new-player-pos')?.value || 'Central Mid';
    const squad = document.getElementById('new-player-squad')?.value || 'U-16';
    const email = `${name.toLowerCase().replace(/[^a-z0-9]/g,'')}${num}@youthtrigger.id`;

    _roster.push({
      name, number: num, pos, squad,
      initials: name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase(),
      bg:'bg-emerald-600', text:'text-white',
      fitness:90, attendance:100, status:'active',
      goals:0, assists:0, rating:'7.0', age:14, email, phone:'-', joinDate:new Date().toISOString().slice(0,10),
    });

    Utils.closeModal();
    if (_coachPage === 'students') {
      const c = document.getElementById('cp-content');
      if (c) c.innerHTML = renderStudentsPage();
    }
    Utils.showToast(`Mendaftarkan ${name} ke sistem... ⏳`, 'info');
    try {
      const res = await API.createStudent({ name, email, nohp:'081200000000', date_birth:'2010-01-01', gender:'L', photo:'' });
      Utils.showToast(`${name} (#${num}) berhasil didaftarkan! ID: ${res.id_student || `KSA${num*10}`} ⚽`, 'success');
    } catch(_) {
      Utils.showToast(`${name} (#${num}) ditambahkan ke skuad ${squad}! ⚽`, 'success');
    }
  }

  function _renderRingkasanTab(pl) {
    return `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Card 1: Statistik Umum -->
        <div class="bg-zinc-900/80 border border-white/10 rounded-2xl p-4 flex flex-col justify-between shadow-xl">
          <div>
            <div class="flex items-center gap-2 text-xs font-bold text-white mb-3">
              <span class="text-amber-400 text-sm">📊</span> Statistik Umum
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center mb-4">
              <div class="flex items-center gap-3">
                <div class="relative w-16 h-16 flex-shrink-0">
                  <svg class="w-full h-full transform -rotate-90" viewBox="0 0 72 72">
                    <circle cx="36" cy="36" r="30" stroke="#27272a" stroke-width="6" fill="none"/>
                    <circle cx="36" cy="36" r="30" stroke="#10b981" stroke-width="6" stroke-dasharray="188.5" stroke-dashoffset="11.3" stroke-linecap="round" fill="none"/>
                  </svg>
                  <div class="absolute inset-0 flex items-center justify-center font-black text-sm text-white">${pl.fitness || 94}%</div>
                </div>
                <div>
                  <div class="text-[11px] text-zinc-400 font-medium">Performa</div>
                  <div class="text-xs font-bold text-white">Keseluruhan</div>
                </div>
              </div>
              <div class="space-y-2">
                <div class="flex items-center gap-2 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-xl">
                  <span>📅</span> ${pl.attendance || 94}% Kehadiran
                </div>
                <div class="flex items-center gap-2 bg-sky-950/40 border border-sky-500/30 text-sky-400 text-xs font-bold px-3 py-1.5 rounded-xl">
                  <span>⏱️</span> 94% Kedisiplinan
                </div>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-3 gap-2 pt-3 border-t border-white/5 text-center">
            <div class="bg-white/[0.02] rounded-xl p-2">
              <div class="text-base font-black text-white flex items-center justify-center gap-1">
                <span>⚽</span> ${pl.goals ?? 12}
              </div>
              <div class="text-[10px] text-zinc-400 mt-0.5">Gol / Assist</div>
            </div>
            <div class="bg-white/[0.02] rounded-xl p-2">
              <div class="text-base font-black text-white flex items-center justify-center gap-1">
                <span>👕</span> 9
              </div>
              <div class="text-[10px] text-zinc-400 mt-0.5">Pertandingan</div>
            </div>
            <div class="bg-white/[0.02] rounded-xl p-2">
              <div class="text-base font-black text-amber-400 flex items-center justify-center gap-1">
                <span>⭐</span> ${pl.rating || '7.8'}
              </div>
              <div class="text-[10px] text-zinc-400 mt-0.5">Rating Rata-rata</div>
            </div>
          </div>
        </div>

        <!-- Card 2: Evaluasi Pelatih Terakhir -->
        <div class="bg-zinc-900/80 border border-white/10 rounded-2xl p-4 flex flex-col justify-between shadow-xl">
          <div>
            <div class="flex items-center gap-2 text-xs font-bold text-white mb-2">
              <span class="text-amber-400 text-sm">📝</span> Evaluasi Pelatih Terakhir
            </div>
            <p class="text-xs text-zinc-300 leading-relaxed italic border-l-2 border-amber-400/80 pl-3 py-1.5 bg-white/[0.02] rounded-r-xl mt-2">
              "Disiplin dalam latihan, perkembangan teknik yang baik, dan mulai menunjukkan visi permainan yang lebih matang. Perlu meningkatkan akurasi umpan jarak jauh."
            </p>
          </div>
          <div class="flex items-center justify-between pt-3 mt-4 border-t border-white/5 text-xs">
            <div class="flex items-center gap-1.5 text-zinc-400 font-medium">
              <span>📅</span> 10 Nov 2026
            </div>
            <span class="bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <span>📈</span> Perkembangan: Baik
            </span>
          </div>
        </div>

        <!-- Card 3: Perkembangan Performa -->
        <div class="bg-zinc-900/80 border border-white/10 rounded-2xl p-4 shadow-xl">
          <div class="flex items-center gap-2 text-xs font-bold text-white mb-2">
            <span class="text-amber-400 text-sm">⭐</span> Perkembangan Performa
          </div>
          <div class="w-full mt-2">
            <svg viewBox="0 0 400 145" class="w-full h-auto overflow-visible select-none">
              <defs>
                <linearGradient id="yellowArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.38"/>
                  <stop offset="100%" stop-color="#f59e0b" stop-opacity="0.0"/>
                </linearGradient>
              </defs>
              <!-- Horizontal gridlines & Y labels -->
              <text x="5" y="18" fill="#71717a" font-size="9" font-family="sans-serif">100%</text>
              <line x1="38" y1="15" x2="390" y2="15" stroke="rgba(255,255,255,0.06)" stroke-dasharray="3 3"/>

              <text x="10" y="43" fill="#71717a" font-size="9" font-family="sans-serif">90%</text>
              <line x1="38" y1="40" x2="390" y2="40" stroke="rgba(255,255,255,0.06)" stroke-dasharray="3 3"/>

              <text x="10" y="68" fill="#71717a" font-size="9" font-family="sans-serif">80%</text>
              <line x1="38" y1="65" x2="390" y2="65" stroke="rgba(255,255,255,0.06)" stroke-dasharray="3 3"/>

              <text x="10" y="93" fill="#71717a" font-size="9" font-family="sans-serif">70%</text>
              <line x1="38" y1="90" x2="390" y2="90" stroke="rgba(255,255,255,0.06)" stroke-dasharray="3 3"/>

              <text x="10" y="118" fill="#71717a" font-size="9" font-family="sans-serif">60%</text>
              <line x1="38" y1="115" x2="390" y2="115" stroke="rgba(255,255,255,0.06)" stroke-dasharray="3 3"/>

              <!-- Area fill -->
              <polygon points="55,90 120,78 185,61 250,54 315,42 375,30 375,115 55,115" fill="url(#yellowArea)"/>

              <!-- Line stroke -->
              <polyline points="55,90 120,78 185,61 250,54 315,42 375,30" fill="none" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>

              <!-- Points -->
              <circle cx="55" cy="90" r="3.5" fill="#fbbf24" stroke="#18181b" stroke-width="1.5"/>
              <circle cx="120" cy="78" r="3.5" fill="#fbbf24" stroke="#18181b" stroke-width="1.5"/>
              <circle cx="185" cy="61" r="3.5" fill="#fbbf24" stroke="#18181b" stroke-width="1.5"/>
              <circle cx="250" cy="54" r="3.5" fill="#fbbf24" stroke="#18181b" stroke-width="1.5"/>
              <circle cx="315" cy="42" r="3.5" fill="#fbbf24" stroke="#18181b" stroke-width="1.5"/>
              <circle cx="375" cy="30" r="4.5" fill="#fbbf24" stroke="#ffffff" stroke-width="1.5"/>

              <!-- 94% Peak Badge -->
              <g transform="translate(360, 8)">
                <rect width="30" height="15" rx="4" fill="#fbbf24"/>
                <text x="15" y="11" fill="#18181b" font-size="9" font-weight="900" text-anchor="middle" font-family="sans-serif">94%</text>
              </g>

              <!-- X-axis Month labels -->
              <text x="55" y="133" fill="#a1a1aa" font-size="9" text-anchor="middle" font-family="sans-serif">Jun</text>
              <text x="120" y="133" fill="#a1a1aa" font-size="9" text-anchor="middle" font-family="sans-serif">Jul</text>
              <text x="185" y="133" fill="#a1a1aa" font-size="9" text-anchor="middle" font-family="sans-serif">Agt</text>
              <text x="250" y="133" fill="#a1a1aa" font-size="9" text-anchor="middle" font-family="sans-serif">Sep</text>
              <text x="315" y="133" fill="#a1a1aa" font-size="9" text-anchor="middle" font-family="sans-serif">Okt</text>
              <text x="375" y="133" fill="#a1a1aa" font-size="9" text-anchor="middle" font-family="sans-serif">Nov</text>
            </svg>
          </div>
        </div>

        <!-- Card 4: Atribut Kemampuan -->
        <div class="bg-zinc-900/80 border border-white/10 rounded-2xl p-4 shadow-xl">
          <div class="flex items-center gap-2 text-xs font-bold text-white mb-2">
            <span class="text-amber-400 text-sm">⭐</span> Atribut Kemampuan
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            <!-- Pentagon Radar Chart -->
            <div class="flex items-center justify-center p-1">
              <svg viewBox="0 0 140 140" class="w-28 h-28 sm:w-32 sm:h-32 select-none overflow-visible">
                <!-- Concentric pentagons -->
                <polygon points="70,18 116,51 98,107 42,107 24,51" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
                <polygon points="70,31 104.5,56 91,98 49,98 35.5,56" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
                <polygon points="70,44 93,60.5 84,88.5 56,88.5 47,60.5" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
                <!-- Axes -->
                <line x1="70" y1="70" x2="70" y2="18" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
                <line x1="70" y1="70" x2="116" y2="51" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
                <line x1="70" y1="70" x2="98" y2="107" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
                <line x1="70" y1="70" x2="42" y2="107" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
                <line x1="70" y1="70" x2="24" y2="51" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
                <!-- Player Value Polygon: Teknik 92%, Fisik 88%, Taktik 90%, Mental 93%, Kerja Sama 91% -->
                <polygon points="70,22.2 110.5,53.3 95.2,103.3 44,104.4 28.1,52.7" fill="rgba(250, 204, 21, 0.22)" stroke="#fbbf24" stroke-width="1.8"/>
                <!-- Vertices -->
                <circle cx="70" cy="22.2" r="3" fill="#fbbf24"/>
                <circle cx="110.5" cy="53.3" r="3" fill="#fbbf24"/>
                <circle cx="95.2" cy="103.3" r="3" fill="#fbbf24"/>
                <circle cx="44" cy="104.4" r="3" fill="#fbbf24"/>
                <circle cx="28.1" cy="52.7" r="3" fill="#fbbf24"/>
              </svg>
            </div>
            <!-- Attribute Bars -->
            <div class="space-y-2 text-xs">
              <div>
                <div class="flex justify-between text-zinc-300 font-medium text-[11px] mb-1">
                  <span>Teknik</span>
                  <span class="font-bold text-white">92%</span>
                </div>
                <div class="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div class="h-full bg-amber-400 rounded-full" style="width: 92%"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-zinc-300 font-medium text-[11px] mb-1">
                  <span>Fisik</span>
                  <span class="font-bold text-white">88%</span>
                </div>
                <div class="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div class="h-full bg-amber-400 rounded-full" style="width: 88%"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-zinc-300 font-medium text-[11px] mb-1">
                  <span>Taktik</span>
                  <span class="font-bold text-white">90%</span>
                </div>
                <div class="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div class="h-full bg-amber-400 rounded-full" style="width: 90%"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-zinc-300 font-medium text-[11px] mb-1">
                  <span>Mental</span>
                  <span class="font-bold text-white">93%</span>
                </div>
                <div class="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div class="h-full bg-amber-400 rounded-full" style="width: 93%"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-zinc-300 font-medium text-[11px] mb-1">
                  <span>Kerja Sama</span>
                  <span class="font-bold text-white">91%</span>
                </div>
                <div class="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div class="h-full bg-amber-400 rounded-full" style="width: 91%"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function _renderPerformaTab(pl) {
    return `
      <div class="bg-zinc-900/80 border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-sm font-bold text-white">
            <span class="text-amber-400">📈</span> Rincian Uji Fisik & Ketahanan Lapangan
          </div>
          <span class="text-xs bg-amber-400/10 text-amber-400 px-3 py-1 rounded-full border border-amber-400/20 font-bold">Teruji: 12 Nov 2026</span>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div class="bg-white/[0.02] border border-white/5 rounded-xl p-3">
            <div class="text-[11px] text-zinc-400">Sprint 30 Meter</div>
            <div class="text-lg font-black text-emerald-400 mt-1">4.08 dtk</div>
            <div class="text-[10px] text-zinc-500">Peringkat 1 di skuad</div>
          </div>
          <div class="bg-white/[0.02] border border-white/5 rounded-xl p-3">
            <div class="text-[11px] text-zinc-400">Yo-Yo Test Level</div>
            <div class="text-lg font-black text-sky-400 mt-1">18.4</div>
            <div class="text-[10px] text-zinc-500">VO2 Max: 56 ml/kg</div>
          </div>
          <div class="bg-white/[0.02] border border-white/5 rounded-xl p-3">
            <div class="text-[11px] text-zinc-400">Agility T-Test</div>
            <div class="text-lg font-black text-amber-400 mt-1">9.62 dtk</div>
            <div class="text-[10px] text-zinc-500">Kelincahan Tinggi</div>
          </div>
          <div class="bg-white/[0.02] border border-white/5 rounded-xl p-3">
            <div class="text-[11px] text-zinc-400">Akurasi Tembakan</div>
            <div class="text-lg font-black text-rose-400 mt-1">78.5%</div>
            <div class="text-[10px] text-zinc-500">14 On Target / 18</div>
          </div>
        </div>
        <div class="pt-3 border-t border-white/5 flex gap-2">
          <button onclick="CoachView._setEvalTarget('${pl.name}'); CoachView.navTo('evaluation'); Utils.closeModal()" class="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-all">
            <span>📊</span> Buka Input Evaluasi & Nilai Ulang
          </button>
        </div>
      </div>
    `;
  }

  function _renderLatihanTab(pl) {
    return `
      <div class="bg-zinc-900/80 border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-sm font-bold text-white">
            <span class="text-amber-400">⚽</span> Catatan Presensi & Drill Latihan
          </div>
          <span class="text-xs text-zinc-400">Total 24 Sesi Bulan Ini</span>
        </div>
        <div class="space-y-2 text-xs">
          <div class="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <div class="flex items-center gap-3">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <div>
                <div class="font-bold text-white">Rondo 4v2 & High Counter Attack</div>
                <div class="text-[11px] text-zinc-400">Senin, 17 Nov 2026 · Lapangan Utama</div>
              </div>
            </div>
            <span class="text-emerald-400 font-bold px-2.5 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-500/20">Hadir · Tepat Waktu</span>
          </div>
          <div class="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <div class="flex items-center gap-3">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <div>
                <div class="font-bold text-white">Set-Piece Defense & Zonal Marking</div>
                <div class="text-[11px] text-zinc-400">Rabu, 15 Nov 2026 · Lapangan Sintetis B</div>
              </div>
            </div>
            <span class="text-emerald-400 font-bold px-2.5 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-500/20">Hadir · Tepat Waktu</span>
          </div>
          <div class="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <div class="flex items-center gap-3">
              <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <div>
                <div class="font-bold text-white">Speed & Agility Circuit Training</div>
                <div class="text-[11px] text-zinc-400">Jumat, 10 Nov 2026 · Gym & Trek Lari</div>
              </div>
            </div>
            <span class="text-amber-400 font-bold px-2.5 py-0.5 rounded-md bg-amber-950/60 border border-amber-500/20">Izin · Seleksi Daerah</span>
          </div>
        </div>
      </div>
    `;
  }

  function _renderCatatanTab(pl) {
    return `
      <div class="bg-zinc-900/80 border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-sm font-bold text-white">
            <span class="text-amber-400">📝</span> Buku Catatan Staf Pelatih
          </div>
          <button onclick="CoachView._addPlayerCoachNote('${pl.name}')" class="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs flex items-center gap-1 transition-all">
            + Tambah Catatan
          </button>
        </div>
        <div class="space-y-3">
          <div class="p-3.5 rounded-xl bg-white/[0.02] border border-amber-400/20 space-y-1.5">
            <div class="flex items-center justify-between text-xs">
              <span class="font-bold text-amber-400">Coach Hendra Saputra (Head Coach)</span>
              <span class="text-zinc-500 text-[11px]">10 Nov 2026, 17:30</span>
            </div>
            <p class="text-xs text-zinc-300 leading-relaxed">
              "Farhan menunjukkan kepemimpinan yang sangat impresif saat mini tournament pekan lalu. Pemahaman taktik 4-3-3 sebagai gelandang serang semakin matang, namun perlu terus melatih kelemahan kaki kiri saat situasi shooting cepat."
            </p>
          </div>
          <div class="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
            <div class="flex items-center justify-between text-xs">
              <span class="font-bold text-sky-400">Coach Bambang (Fitness Coach)</span>
              <span class="text-zinc-500 text-[11px]">02 Nov 2026, 09:15</span>
            </div>
            <p class="text-xs text-zinc-300 leading-relaxed">
              "Kondisi kardio prima. Berat badan stabil di 58 kg dengan massa otot ideal. Disarankan menjaga hidrasi elektrolit selama sesi latihan cuaca panas."
            </p>
          </div>
        </div>
      </div>
    `;
  }

  function _renderRiwayatTab(pl) {
    return `
      <div class="bg-zinc-900/80 border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-sm font-bold text-white">
            <span class="text-amber-400">🏆</span> Riwayat Turnamen & Prestasi Individu
          </div>
          <span class="text-xs text-zinc-400">Musim 2026/2027</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div class="p-3 rounded-xl bg-amber-400/5 border border-amber-400/20">
            <div class="flex items-center gap-2 font-bold text-amber-400">
              <span>🏅</span> Top Assist — Youth Elite Cup 2026
            </div>
            <p class="text-[11px] text-zinc-400 mt-1">Mencatatkan 6 assist dalam 5 pertandingan turnamen regional U-16.</p>
          </div>
          <div class="p-3 rounded-xl bg-amber-400/5 border border-amber-400/20">
            <div class="flex items-center gap-2 font-bold text-amber-400">
              <span>🌟</span> Player of The Month (Oktober 2026)
            </div>
            <p class="text-[11px] text-zinc-400 mt-1">Penghargaan performa dan kedisiplinan tertinggi akademi YouthTrigger.</p>
          </div>
        </div>
        <div class="pt-2">
          <div class="text-xs font-bold text-zinc-300 mb-2">Riwayat Pertandingan Terakhir:</div>
          <div class="space-y-1.5 text-xs text-zinc-300">
            <div class="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5">
              <span>vs SSB Nusantara Mandiri (Menang 3 - 1)</span>
              <span class="font-bold text-emerald-400">1 Gol, 1 Assist (Rating 8.2)</span>
            </div>
            <div class="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5">
              <span>vs Jakarta Youth All-Stars (Seri 2 - 2)</span>
              <span class="font-bold text-amber-400">1 Assist (Rating 7.6)</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function _switchPlayerDetailTab(tab, name) {
    const pl = _roster.find(r => r.name === name) || _roster[0];
    const tabs = ['ringkasan', 'performa', 'latihan', 'catatan', 'riwayat'];
    tabs.forEach(t => {
      const btn = document.getElementById(`pdb-tab-${t}`);
      if (btn) {
        if (t === tab) {
          btn.className = 'pdb-tab-btn px-4 py-2 rounded-full font-bold transition-all bg-amber-400 text-zinc-950 shadow-md flex items-center gap-1.5 whitespace-nowrap';
        } else {
          btn.className = 'pdb-tab-btn px-4 py-2 rounded-full font-medium transition-all text-zinc-400 hover:text-white hover:bg-white/5 flex items-center gap-1.5 whitespace-nowrap';
        }
      }
    });

    const body = document.getElementById('player-detail-tab-body');
    if (!body) return;
    if (tab === 'ringkasan') body.innerHTML = _renderRingkasanTab(pl);
    else if (tab === 'performa') body.innerHTML = _renderPerformaTab(pl);
    else if (tab === 'latihan') body.innerHTML = _renderLatihanTab(pl);
    else if (tab === 'catatan') body.innerHTML = _renderCatatanTab(pl);
    else if (tab === 'riwayat') body.innerHTML = _renderRiwayatTab(pl);
  }

  function _editPlayerData(name) {
    const pl = _roster.find(r => r.name === name) || _roster[0];
    Utils.showToast(`Mode edit profil aktif untuk ${pl.name} (#${pl.number || 10})`, 'info');
  }

  function _openPlayerMenu(name) {
    const pl = _roster.find(r => r.name === name) || _roster[0];
    Utils.showToast(`Menu cepat untuk ${pl.name}: Unduh Rapor / Hubungi Wali`, 'info');
  }

  function _addPlayerCoachNote(name) {
    Utils.showToast(`Form catatan staf pelatih dibuka untuk ${name}`, 'info');
  }

  function openPlayerDetail(name) {
    const pl = _roster.find(r => r.name === name) || _roster[0];
    
    // Posisi display text
    const displayPos = (pl.pos === 'Attacking Mid' || !pl.pos) ? 'Attacking Midfielder (AMF)' : pl.pos;
    const playerNum = pl.number || 10;
    const playerAge = pl.age || 16;
    const playerSquad = pl.squad || 'U-16';

    Utils.openModal(`
      <div class="text-left font-sans select-none">
        <!-- Header -->
        <div class="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div class="flex items-center gap-2.5 text-base font-bold text-white">
            <span class="w-6 h-6 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center text-sm">👤</span>
            Detail Pemain
          </div>
        </div>

        <!-- Banner Card Pemain -->
        <div class="rounded-2xl border border-amber-400/20 bg-zinc-900/80 p-4 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden shadow-xl">
          <div class="flex items-center gap-4">
            <!-- Foto Pemain dengan Nomor Punggung Kuning -->
            <div class="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden relative border border-white/10 bg-zinc-950 flex-shrink-0 shadow-lg">
              <img src="https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=400&auto=format&fit=crop&q=80"
                alt="${pl.name}"
                class="w-full h-full object-cover object-top"
                onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&auto=format&fit=crop&q=80';" />
              <div class="absolute top-1.5 right-1.5 bg-amber-400 text-zinc-950 font-black text-xs px-2 py-0.5 rounded-md shadow-md">
                #${playerNum}
              </div>
              <div class="absolute bottom-1 left-1 right-1 text-[8px] text-zinc-300 font-bold bg-black/60 backdrop-blur-xs px-1 py-0.5 rounded text-center tracking-wider">
                YOUTHTRIGGER
              </div>
            </div>

            <!-- Detail Info Pemain -->
            <div class="space-y-1.5">
              <div class="flex items-center gap-2 flex-wrap">
                <h2 class="text-xl font-black text-white tracking-wide">${pl.name}</h2>
                <span class="bg-amber-400 text-zinc-950 font-bold text-[11px] px-2.5 py-0.5 rounded-full shadow-xs">Pemain Akademi</span>
                <span class="bg-zinc-800 text-zinc-300 border border-white/10 font-bold text-[11px] px-2.5 py-0.5 rounded-full">${playerSquad}</span>
              </div>
              <div class="flex items-center gap-2 text-xs text-zinc-300 font-medium">
                <span class="text-amber-400">⚽</span>
                <span>${displayPos}</span>
              </div>
              <div class="flex items-center gap-2 text-xs text-zinc-400">
                <span>📅</span>
                <span>Lahir, 12 Mar 2010 (${playerAge} Tahun)</span>
              </div>
              <div class="flex items-center gap-4 text-xs text-zinc-400 font-medium">
                <div class="flex items-center gap-1"><span>📏</span><span>168 cm</span></div>
                <div class="flex items-center gap-1"><span>⚖️</span><span>58 kg</span></div>
              </div>
            </div>
          </div>

          <!-- Aksi Pojok Kanan -->
          <div class="flex items-center gap-2 self-start sm:self-center">
            <button onclick="CoachView._editPlayerData('${pl.name}')" class="px-3.5 py-2 rounded-xl border border-white/15 bg-zinc-800 hover:bg-zinc-700 text-xs text-white font-semibold flex items-center gap-1.5 transition-all shadow-sm">
              <span>✏️</span> Edit Data
            </button>
            <button onclick="CoachView._openPlayerMenu('${pl.name}')" class="w-9 h-9 rounded-xl border border-white/15 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center font-bold text-sm transition-all shadow-sm">
              ⋯
            </button>
          </div>
        </div>

        <!-- Tab Navigasi Horizontal -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1 mb-4 no-scrollbar border-b border-white/5 text-xs">
          <button onclick="CoachView._switchPlayerDetailTab('ringkasan', '${pl.name}')" id="pdb-tab-ringkasan" class="pdb-tab-btn px-4 py-2 rounded-full font-bold transition-all bg-amber-400 text-zinc-950 shadow-md flex items-center gap-1.5 whitespace-nowrap">
            <span>📊</span> Ringkasan
          </button>
          <button onclick="CoachView._switchPlayerDetailTab('performa', '${pl.name}')" id="pdb-tab-performa" class="pdb-tab-btn px-4 py-2 rounded-full font-medium transition-all text-zinc-400 hover:text-white hover:bg-white/5 flex items-center gap-1.5 whitespace-nowrap">
            <span>📈</span> Performa
          </button>
          <button onclick="CoachView._switchPlayerDetailTab('latihan', '${pl.name}')" id="pdb-tab-latihan" class="pdb-tab-btn px-4 py-2 rounded-full font-medium transition-all text-zinc-400 hover:text-white hover:bg-white/5 flex items-center gap-1.5 whitespace-nowrap">
            <span>⚽</span> Latihan
          </button>
          <button onclick="CoachView._switchPlayerDetailTab('catatan', '${pl.name}')" id="pdb-tab-catatan" class="pdb-tab-btn px-4 py-2 rounded-full font-medium transition-all text-zinc-400 hover:text-white hover:bg-white/5 flex items-center gap-1.5 whitespace-nowrap">
            <span>📝</span> Catatan Pelatih
          </button>
          <button onclick="CoachView._switchPlayerDetailTab('riwayat', '${pl.name}')" id="pdb-tab-riwayat" class="pdb-tab-btn px-4 py-2 rounded-full font-medium transition-all text-zinc-400 hover:text-white hover:bg-white/5 flex items-center gap-1.5 whitespace-nowrap">
            <span>🏆</span> Riwayat
          </button>
        </div>

        <!-- Container Isi Tab -->
        <div id="player-detail-tab-body">
          ${_renderRingkasanTab(pl)}
        </div>
      </div>
    `, 'max-w-4xl');
  }

  function openCreateDrillModal() {
    Utils.openModal(`
      <div class="space-y-4">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl gradient-emerald flex items-center justify-center text-xl">⚽</div>
          <div>
            <h3 class="text-base font-bold text-white">Buat Sesi Latihan Baru</h3>
            <p class="text-xs text-zinc-400">Jadwalkan drill taktik atau fisik</p>
          </div>
        </div>
        <div class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-zinc-400 mb-1.5">Nama Sesi Latihan</label>
            <input type="text" id="drill-title" placeholder="Misal: Counter Attack & Finishing 3v2"
              class="w-full glass rounded-xl px-3 py-2.5 text-sm text-white border border-white/10 focus:outline-none focus:border-emerald-400/50"/>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-zinc-400 mb-1.5">Waktu Mulai</label>
              <input type="time" value="16:00" class="w-full glass rounded-xl px-3 py-2.5 text-sm text-white border border-white/10 bg-zinc-900 focus:outline-none"/>
            </div>
            <div>
              <label class="block text-xs font-semibold text-zinc-400 mb-1.5">Kelompok</label>
              <select class="w-full glass rounded-xl px-3 py-2.5 text-sm text-zinc-200 bg-zinc-900 border border-white/10 focus:outline-none">
                <option>U-16</option><option>U-14</option><option>U-18</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-xs font-semibold text-zinc-400 mb-1.5">Lokasi</label>
            <input type="text" value="Lapangan Utama"
              class="w-full glass rounded-xl px-3 py-2.5 text-sm text-white border border-white/10 focus:outline-none focus:border-emerald-400/50"/>
          </div>
          <div>
            <label class="block text-xs font-semibold text-zinc-400 mb-1.5">Materi Latihan</label>
            <input type="text" placeholder="Rondo 4v2, Transition drill, 3v3 Press..."
              class="w-full glass rounded-xl px-3 py-2.5 text-sm text-white border border-white/10 focus:outline-none focus:border-emerald-400/50"/>
          </div>
        </div>
        <div class="flex justify-end gap-2">
          <button onclick="Utils.closeModal()" class="px-4 py-2 glass rounded-xl text-xs text-zinc-400">Batal</button>
          <button onclick="CoachView.submitCreateDrill()" class="send-btn px-5 py-2 rounded-xl text-xs font-bold text-zinc-950">✅ Simpan</button>
        </div>
      </div>
    `);
  }

  async function submitCreateDrill() {
    const title = document.getElementById('drill-title')?.value || 'Drill Taktik Baru';
    Utils.closeModal();
    Utils.showToast('Menyimpan sesi... ⏳','info');
    try {
      await API.createSchedule({ name_schedule:title, date_schedule:new Date().toISOString(), status_schedule:1 });
      Utils.showToast(`Sesi "${title}" tersimpan di backend! 📅`,'success');
    } catch(_) {
      Utils.showToast(`Sesi "${title}" dijadwalkan! 📅`,'success');
    }
    navTo('schedule');
  }

  function openCreateProgramModal() {
    Utils.openModal(`
      <div class="space-y-4">
        <h3 class="text-base font-bold text-white flex items-center gap-2"><span>⚽</span> Program Latihan Baru</h3>
        <div class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-zinc-400 mb-1.5">Nama Program</label>
            <input type="text" id="prog-name" placeholder="Misal: Ball Mastery Level 2"
              class="w-full glass rounded-xl px-3 py-2.5 text-sm text-white border border-white/10 focus:outline-none focus:border-lime-400/50"/>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-zinc-400 mb-1.5">Kelompok</label>
              <select id="prog-squad" class="w-full glass rounded-xl px-3 py-2.5 text-sm text-zinc-200 bg-zinc-900 border border-white/10 focus:outline-none">
                <option>U-16</option><option>U-14</option><option>U-18</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-zinc-400 mb-1.5">Durasi</label>
              <select id="prog-dur" class="w-full glass rounded-xl px-3 py-2.5 text-sm text-zinc-200 bg-zinc-900 border border-white/10 focus:outline-none">
                <option>2 Minggu</option><option>4 Minggu</option><option>6 Minggu</option><option>8 Minggu</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-xs font-semibold text-zinc-400 mb-1.5">Tujuan Program</label>
            <textarea id="prog-goal" rows="2" placeholder="Tujuan dan target kemampuan yang ingin dicapai..."
              class="w-full glass rounded-xl px-3 py-2.5 text-sm text-white border border-white/10 focus:outline-none focus:border-lime-400/50 resize-none"></textarea>
          </div>
          <div>
            <label class="block text-xs font-semibold text-zinc-400 mb-1.5">Tingkat Kesulitan</label>
            <div class="flex gap-2">
              ${['Rendah','Sedang','Tinggi','Spesifik'].map(d => `
                <button onclick="this.parentElement.querySelectorAll('button').forEach(b=>b.classList.remove('bg-lime-400/20','text-lime-300','border-lime-400/35')); this.classList.add('bg-lime-400/20','text-lime-300','border-lime-400/35'); this.setAttribute('data-sel','1')"
                  class="flex-1 py-1.5 rounded-xl text-xs font-bold glass text-zinc-400 border border-white/8 hover:border-lime-400/30 transition-all"
                  data-diff="${d}">${d}</button>
              `).join('')}
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-2">
          <button onclick="Utils.closeModal()" class="px-4 py-2 glass rounded-xl text-xs text-zinc-400">Batal</button>
          <button onclick="CoachView.submitCreateProgram()" class="btn-lime-glow px-5 py-2 rounded-xl text-xs font-bold text-zinc-950">✅ Simpan</button>
        </div>
      </div>
    `);
  }

  function submitCreateProgram() {
    const name  = document.getElementById('prog-name')?.value.trim() || 'Program Baru';
    const squad = document.getElementById('prog-squad')?.value || 'U-16';
    const dur   = document.getElementById('prog-dur')?.value || '4 Minggu';
    const goal  = document.getElementById('prog-goal')?.value.trim() || 'Peningkatan kemampuan teknis';
    const selBtn = document.querySelector('[data-diff][data-sel]');
    const diff  = selBtn ? selBtn.getAttribute('data-diff') : 'Sedang';

    _programs.unshift({ id: Date.now(), name, squad, goal, duration: dur, difficulty: diff, status:'planned', drills:['Drill 1','Drill 2'] });
    Utils.closeModal();
    Utils.showToast(`Program "${name}" berhasil dibuat! ⚽`, 'success');
    const c = document.getElementById('cp-content');
    if (c) c.innerHTML = renderProgramsPage();
  }

  /* ================================================================
     COUNTDOWN (legacy compat)
  ================================================================ */
  function startCountdown() {
    if (_cdInterval) clearInterval(_cdInterval);
    _cdInterval = setInterval(() => {
      const cd = Utils.countdown(16);
      ['c-cd-h','c-cd-m','c-cd-s'].forEach((id,i) => {
        const el = document.getElementById(id);
        if (el) el.textContent = [cd.h, cd.m, cd.s][i];
      });
    }, 1000);
  }

  /* ================================================================
     LEGACY COMPAT — keep old public API so app.js doesn't break
  ================================================================ */
  function setTab(tab) { navTo(tab === 'squad' ? 'students' : tab === 'training' ? 'schedule' : tab === 'lineup' ? 'matches' : tab === 'analytics' ? 'evaluation' : 'dashboard'); }
  function filterSquad(s) { _studentAgeFilter = s==='all'?'all':s; navTo('students'); }
  function broadcastLineupToChat() { openAnnouncementModal(); }
  function toggleAnnouncement() { _annMode = !_annMode; Utils.showToast(_annMode?'Mode Pengumuman Aktif 📢':'Chat normal','info'); }
  function sendMsg() { Utils.showToast('Gunakan panel chat di halaman Dashboard 💬','info'); }
  function handleKey(e) { if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMsg();} }
  function toggleMobileSidebar_legacy() { toggleMobileSidebar(); }
  function toggleChatDrawer() { Utils.showToast('Chat tim tersedia di panel kanan (xl screens) 💬','info'); }

  /* ================================================================
     PUBLIC API
  ================================================================ */
  return {
    render,
    navTo,
    // Sidebar / layout
    toggleMobileSidebar,
    closeMobileSidebar,
    // Students
    _setStudentSearch,
    _setAgeFilter,
    _setPosFilter,
    _setEvalTarget,
    openPlayerDetail,
    _switchPlayerDetailTab,
    _editPlayerData,
    _openPlayerMenu,
    _addPlayerCoachNote,
    openAddPlayerModal,
    addPlayerSubmit,
    // Schedule
    _setScheduleView,
    openCreateDrillModal,
    submitCreateDrill,
    // Attendance
    setAbsStatus,
    _setAbsDate,
    _setAbsGroup,
    markAllHadir,
    saveAttendance,
    // Evaluation
    _setScore,
    saveEvaluation,
    // Programs
    deleteProgram,
    openCreateProgramModal,
    submitCreateProgram,
    // Matches
    _setMatchTab,
    // Announcements
    openAnnouncementModal,
    submitAnnouncement,
    deleteAnnouncement,
    // ── Legacy compat (preserves old call sites from app.js / header.js) ──
    setTab,
    filterSquad,
    broadcastLineupToChat,
    toggleAnnouncement,
    sendMsg,
    handleKey,
    toggleChatDrawer,
    openAttendanceChecklist: (_title) => { _absGroup = 'U-16'; navTo('attendance'); },
    submitBroadcast: submitAnnouncement,
  };
})();
