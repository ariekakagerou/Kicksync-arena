/* ============================================================
   YouthTrigger Arena — PLAYER PORTAL v4.0
   File: js/views/player.js

   Full Player Management System:
   1. Dashboard           6. Perkembangan Kemampuan
   2. Profil Pemain       7. Pertandingan
   3. Jadwal Latihan      8. Prestasi & Penghargaan
   4. Program Latihan     9. Pengumuman
   5. Kehadiran          10. Pengaturan
   ============================================================ */

const PlayerView = (() => {

  /* ================================================================
     STATE
  ================================================================ */
  let _cdInterval  = null;
  let _playerPage  = 'dashboard';

  // Legacy compat
  let _currentTab  = 'locker';
  let _drillDone   = {};

  // Perkembangan filter
  let _devPeriod   = 'nov2026';

  // Pengumuman read state
  let _readAnn     = new Set();

  // Izin submission state
  let _izinPending = false;

  /* ================================================================
     STATIC DATA (player-specific)
  ================================================================ */

  const PLAYER_DATA = {
    name:        'Farhan Ramadhan',
    fullName:    'Farhan Ramadhan Putra',
    nickName:    'Farhan',
    studentId:   'KSA-16-010',
    number:      10,
    pos:         'Attacking Midfielder',
    posAlt:      'Central Midfielder',
    squad:       'U-16',
    age:         16,
    dob:         '10 Maret 2010',
    joinDate:    '5 Januari 2022',
    coach:       'Coach Hendra Saputra, S.Or.',
    status:      'Aktif',
    initials:    'FR',
    bg:          'bg-sky-500',
    fitness:     94,
    attendance:  94,
    goals:       12,
    assists:     9,
    matches:     15,
    rating:      8.7,
    email:       'farhanramadhan@youthtrigger.id',
    guardian:    'Bapak Ramadhan Putra',
    guardianPhone: '0812-XXXX-XXXX',
    school:      'SMP Negeri 5 Bekasi',
    motto:       '"Kerja keras tidak pernah mengkhianati hasil"',
  };

  const PLAYER_SKILLS = {
    passing:    82, shooting:   78, dribbling:  88,
    ballControl:85, speed:      90, stamina:    87,
    tactical:   79, teamwork:   84, discipline: 91,
  };

  const PLAYER_HISTORY = [
    { period:'Sep 2026', passing:75, shooting:70, dribbling:82, ballControl:78, speed:85, stamina:80, tactical:72, teamwork:79, discipline:85 },
    { period:'Okt 2026', passing:79, shooting:74, dribbling:85, ballControl:81, speed:88, stamina:84, tactical:76, teamwork:82, discipline:88 },
    { period:'Nov 2026', passing:82, shooting:78, dribbling:88, ballControl:85, speed:90, stamina:87, tactical:79, teamwork:84, discipline:91 },
  ];

  const PLAYER_ATTENDANCE = {
    total: 48, hadir: 45, izin: 2, sakit: 1, alpha: 0,
    monthly: [
      { bulan:'Sep', hadir:15, total:16 },
      { bulan:'Okt', hadir:16, total:17 },
      { bulan:'Nov', hadir:14, total:15 },
    ],
    records: [
      { date:'18 Nov 2026', session:'High Pressing Drill', status:'hadir' },
      { date:'15 Nov 2026', session:'Finishing Practice', status:'hadir' },
      { date:'13 Nov 2026', session:'Video Analysis', status:'hadir' },
      { date:'11 Nov 2026', session:'Tactical Board', status:'izin', note:'Ujian Sekolah' },
      { date:'8 Nov 2026',  session:'Scrimmage 11v11',  status:'hadir' },
      { date:'6 Nov 2026',  session:'Ball Mastery',     status:'hadir' },
      { date:'4 Nov 2026',  session:'Physical Test',    status:'sakit', note:'Demam' },
      { date:'1 Nov 2026',  session:'Rondo 4v2',        status:'hadir' },
    ],
  };

  const PLAYER_SCHEDULE = [
    { title:'High Pressing & Transition Drills', day:'Senin', date:'18 Nov 2026', time:'06:30', duration:'2 jam', location:'Lapangan Utama', coach:'Coach Hendra', squad:'U-16', materi:'Rondo 4v2, Positional Press', status:'upcoming' },
    { title:'Finishing & Shooting Practice',     day:'Rabu',  date:'20 Nov 2026', time:'09:00', duration:'1.5 jam', location:'Lapangan B', coach:'Coach Hendra', squad:'U-16', materi:'1v1 vs GK, Volley', status:'upcoming' },
    { title:'Video Analysis & Tactical Review',  day:'Rabu',  date:'20 Nov 2026', time:'15:00', duration:'1 jam',   location:'Ruang Meeting', coach:'Coach Hendra', squad:'U-16', materi:'Review match footage', status:'upcoming' },
    { title:'Full Match Scrimmage (11v11)',       day:'Jumat', date:'22 Nov 2026', time:'07:00', duration:'2 jam',   location:'Lapangan Utama', coach:'Coach Hendra', squad:'U-16', materi:'Rotasi lineup', status:'upcoming' },
    { title:'Ball Mastery & Dribbling',          day:'Senin', date:'11 Nov 2026', time:'06:30', duration:'2 jam',   location:'Lapangan Utama', coach:'Coach Hendra', squad:'U-16', materi:'Cone Dribbling, 1v1', status:'completed' },
    { title:'Physical Conditioning',             day:'Rabu',  date:'13 Nov 2026', time:'06:30', duration:'1.5 jam', location:'Lapangan Utama', coach:'Coach Hendra', squad:'U-16', materi:'Interval Run, Core', status:'completed' },
  ];

  const PLAYER_PROGRAMS = [
    { id:1, name:'High Pressing & Counter Attack', category:'Tactical Awareness', goal:'Meningkatkan kemampuan pressing dan transisi cepat', duration:'8 Minggu', difficulty:'Tinggi', desc:'Program pressing kolektif 4-2-4 shape, gegenpressing saat kehilangan bola, dan transisi ofensif cepat dalam hitungan 5 detik.', drills:['Rondo 4v2','Transitional Press 6v4','3v2 Counter Attack'], done:true },
    { id:2, name:'Dribbling & 1v1 Mastery',       category:'Dribbling',           goal:'Meningkatkan kemampuan dribbling dan melewati lawan', duration:'6 Minggu', difficulty:'Sedang', desc:'Teknik dribbling di ruang sempit, body feint, step-over, dan pengambilan keputusan saat 1v1 menghadapi bek.', drills:['Cone Dribbling Circuit','1v1 Duel Box','Barcelona Rondo'], done:true },
    { id:3, name:'Finishing & Shooting Clinic',   category:'Shooting',            goal:'Meningkatkan akurasi dan konversi peluang gol', duration:'6 Minggu', difficulty:'Sedang', desc:'Teknik shooting dari berbagai sudut, finishing dalam kotak penalti, volley, dan penyelesaian saat berhadapan 1v1 dengan kiper.', drills:['1v1 vs GK','Crossing & Finish','Volley Box'], done:false },
    { id:4, name:'Ball Control & Receiving',      category:'Ball Control',        goal:'First touch sempurna dan kontrol bola di berbagai situasi', duration:'4 Minggu', difficulty:'Rendah', desc:'Teknik trapping, chest control, ball receiving under pressure, dan persiapan umpan pertama yang efisien.', drills:['Rondo 5v2','Passing Gate','Receiving Wall'], done:false },
    { id:5, name:'Speed & Agility Circuit',       category:'Speed & Agility',     goal:'Meningkatkan kecepatan lari dan kelincahan gerak', duration:'4 Minggu', difficulty:'Tinggi', desc:'Ladder drill, cone sprint, change of direction, dan explosive starting speed khusus untuk Attacking Midfielder.', drills:['Ladder Drill','T-Drill Sprint','Cone Zig-Zag'], done:false },
  ];

  const PLAYER_MATCHES = [
    { opp:'Garuda Muda FC',   date:'Sabtu, 22 Nov 2026', time:'16:00 WIB', venue:'Stadion Patriot, Bekasi', squad:'U-16', type:'Friendly Match', status:'upcoming', inSquad:true, goals:0, assists:0, minutes:0, note:'' },
    { opp:'Putra Nusantara',  date:'Rabu, 19 Nov 2026',  time:'15:30 WIB', venue:'Lapangan Merdeka',       squad:'U-14', type:'Liga Junior Jabar', status:'upcoming', inSquad:false, goals:0, assists:0, minutes:0, note:'' },
    { opp:'Bintang Muda FC',  date:'8 Nov 2026',          time:'10:00 WIB', venue:'Lapangan Merdeka',       squad:'U-16', type:'Friendly Match', status:'completed', result:'W 3-1', inSquad:true, goals:1, assists:1, minutes:85, note:'Bermain solid, assist ke Azzam di menit 56' },
    { opp:'Galuh Junior FC',  date:'25 Okt 2026',         time:'10:00 WIB', venue:'Lapangan Utama',         squad:'U-16', type:'Friendly Match', status:'completed', result:'W 4-0', inSquad:true, goals:1, assists:2, minutes:90, note:'2 assist dari set piece dan through ball' },
    { opp:'Elang Muda FC',    date:'18 Okt 2026',         time:'09:00 WIB', venue:'Stadion Patriot',        squad:'U-16', type:'Liga Junior Jabar', status:'completed', result:'D 1-1', inSquad:true, goals:0, assists:1, minutes:70, note:'Assist gol dari tendangan bebas' },
  ];

  const PLAYER_BADGES = [
    { id:1, name:'First Training',      icon:'🌱', desc:'Menyelesaikan sesi latihan pertama di YouthTrigger Arena', earned:true,  date:'5 Jan 2022',   color:'from-emerald-500 to-teal-500',  rarity:'common'  },
    { id:2, name:'Hat-trick Hero',      icon:'⚽', desc:'Mencetak 3 gol dalam satu pertandingan', earned:true,  date:'15 Mar 2024',  color:'from-sky-500 to-blue-600',       rarity:'rare'    },
    { id:3, name:'Consistent Player',   icon:'📅', desc:'Hadir 90%+ selama 3 bulan berturut-turut', earned:true,  date:'1 Oct 2026',   color:'from-lime-500 to-green-600',     rarity:'uncommon'},
    { id:4, name:'Teamwork Award',      icon:'🤝', desc:'Dinominasikan pelatih atas kontribusi tim yang luar biasa', earned:true, date:'10 Nov 2026',  color:'from-purple-500 to-violet-600',  rarity:'rare'    },
    { id:5, name:'Training Dedication', icon:'💪', desc:'Menyelesaikan 50 sesi latihan penuh', earned:true,  date:'30 Sep 2026',  color:'from-amber-500 to-orange-500',   rarity:'uncommon'},
    { id:6, name:'Match Starter',       icon:'🏟️', desc:'Tampil sebagai starter dalam 10 pertandingan', earned:true,  date:'8 Nov 2026',   color:'from-red-500 to-rose-600',       rarity:'uncommon'},
    { id:7, name:'Academy Star',        icon:'⭐', desc:'Rating rata-rata di atas 8.0 selama satu musim', earned:false, date:null,          color:'from-yellow-500 to-amber-600',   rarity:'epic'    },
    { id:8, name:'Speed Demon',         icon:'⚡', desc:'Mencapai nilai Speed 90+ dalam evaluasi', earned:false, date:null,          color:'from-cyan-500 to-sky-500',        rarity:'rare'    },
    { id:9, name:'100 Training Club',   icon:'🎖️', desc:'Menyelesaikan 100 sesi latihan di YouthTrigger Arena', earned:false, date:null, color:'from-zinc-400 to-zinc-600',      rarity:'legendary'},
  ];

  const PLAYER_ANNOUNCEMENTS = [
    { id:1, title:'Jadwal Latihan Pekan Ini', body:'Latihan U-16 dilaksanakan Senin, Rabu, Jumat pukul 15:30 WIB di Lapangan Utama. Harap hadir 15 menit sebelum jadwal untuk warming up.', category:'Jadwal', date:'15 Nov 2026', pinned:true,  author:'Coach Hendra' },
    { id:2, title:'Persiapan Match Sabtu vs Garuda Muda FC', body:'Seluruh pemain U-16 wajib hadir briefing Jumat pukul 14:00 WIB di Ruang Meeting. Kenakan jersey home hijau-putih. Jaga hidrasi dan tidur yang cukup!', category:'Pertandingan', date:'14 Nov 2026', pinned:true, author:'Coach Hendra' },
    { id:3, title:'Libur Latihan Tanggal Merah', body:'Tidak ada latihan pada Kamis 16 November 2026 (Hari Pahlawan Nasional). Latihan kembali normal Jumat 17 November pukul 06:30 WIB.', category:'Info', date:'11 Nov 2026', pinned:false, author:'Admin Akademi' },
    { id:4, title:'Rekap Evaluasi Oktober 2026 Tersedia', body:'Hasil evaluasi teknik dan taktik periode Oktober 2026 sudah dapat dilihat di menu Perkembangan Kemampuan. Terus tingkatkan kemampuanmu!', category:'Evaluasi', date:'10 Nov 2026', pinned:false, author:'Coach Hendra' },
    { id:5, title:'Pendaftaran Turnamen Junior Jabar Dibuka', body:'YouthTrigger Arena akan mengikutsertakan tim U-16 dan U-14 dalam Turnamen Junior Jabar Desember 2026. Daftar ke Coach Hendra sebelum 25 November.', category:'Turnamen', date:'8 Nov 2026', pinned:false, author:'Admin Akademi' },
  ];

  /* ================================================================
     MAIN RENDER
  ================================================================ */
  function render(container) {
    _playerPage = 'dashboard';
    const p = ROLES.player;
    container.innerHTML = `
      <style>
        /* Player Portal local styles */
        .pp-nav-item { transition: all .2s; }
        .pp-nav-item.active { background: rgba(52,211,153,.13); border-left: 3px solid #34d399; color: #6ee7b7; }
        .pp-nav-item:not(.active):hover { background: rgba(255,255,255,.06); color: #d4d4d8; }
        .pp-stat-card { background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.07); transition: all .2s; }
        .pp-stat-card:hover { border-color: rgba(52,211,153,.3); transform: translateY(-2px); }
        .pp-skill-bar { transition: width .9s cubic-bezier(.4,0,.2,1) .1s; }
        .radar-label { font-size: 10px; fill: #a1a1aa; }
        .badge-card { transition: all .25s; }
        .badge-card:hover { transform: translateY(-4px) scale(1.02); }
        .badge-locked { filter: grayscale(1) opacity(.4); }
        .att-hadir { background:rgba(52,211,153,.18); color:#6ee7b7; border:1px solid rgba(52,211,153,.3); }
        .att-izin  { background:rgba(251,191,36,.18);  color:#fcd34d; border:1px solid rgba(251,191,36,.3); }
        .att-sakit { background:rgba(248,113,113,.18); color:#fca5a5; border:1px solid rgba(248,113,113,.3); }
        .att-alpha { background:rgba(161,161,170,.15); color:#71717a; border:1px solid rgba(161,161,170,.2); }
        @keyframes pp-fadein { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .pp-page { animation: pp-fadein .28s ease; }
        .pp-mobile-open { transform: translateX(0) !important; }
        @keyframes score-count { from { opacity:0; transform:scale(.85) } to { opacity:1; transform:scale(1) } }
        .score-pop { animation: score-count .4s ease; }
        /* Rarity glow */
        .rarity-rare     { box-shadow: 0 0 15px rgba(96,165,250,.3); }
        .rarity-epic     { box-shadow: 0 0 20px rgba(167,139,250,.4); }
        .rarity-legendary{ box-shadow: 0 0 25px rgba(251,191,36,.5); }
        /* Bottom nav mobile */
        .pp-bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; z-index: 50;
          background: rgba(13,17,23,.97); backdrop-filter: blur(16px);
          border-top: 1px solid rgba(255,255,255,.1); display: flex; }
        @media (min-width: 1024px) { .pp-bottom-nav { display: none; } }
      </style>

      <div class="flex h-full overflow-hidden relative text-zinc-100" style="background:#090d16">

        <!-- Mobile Overlay -->
        <div id="pp-overlay" onclick="PlayerView.closeMobileSidebar()"
          class="hidden fixed inset-0 bg-black/70 z-40 lg:hidden"></div>

        <!-- SIDEBAR (Desktop) -->
        <aside id="pp-sidebar"
          class="fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto
                 w-64 flex flex-col flex-shrink-0 overflow-hidden
                 border-r border-white/8
                 -translate-x-full lg:translate-x-0 transition-transform duration-300"
          style="background: linear-gradient(180deg, #060d14 0%, #090d16 100%);">
          ${renderSidebar()}
        </aside>

        <!-- MAIN CONTENT -->
        <div class="flex-1 flex flex-col min-w-0 overflow-hidden pb-16 lg:pb-0">

          <!-- Desktop Top Bar -->
          <header class="hidden lg:flex flex-shrink-0 h-14 items-center justify-between px-4 gap-3 border-b border-white/8 flex-shrink-0"
            style="background:rgba(9,13,22,.96);backdrop-filter:blur(12px)">
            <div class="flex items-center gap-3">
              <div>
                <h1 id="pp-page-title" class="text-sm font-black text-white leading-tight">Dashboard</h1>
                <div class="text-[11px] text-zinc-500">YouthTrigger Arena · Player Portal</div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <!-- Notif -->
              <button onclick="PlayerView.navTo('announcements')"
                class="relative w-9 h-9 rounded-xl glass flex items-center justify-center text-zinc-400 hover:text-white border border-white/10">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                </svg>
                <div class="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-400 text-zinc-950 text-[9px] font-black flex items-center justify-center">3</div>
              </button>
              <!-- Avatar -->
              <button onclick="PlayerView.navTo('profile')"
                class="w-9 h-9 rounded-xl ${PLAYER_DATA.bg} text-white flex items-center justify-center font-black text-xs online-ring select-none">
                ${PLAYER_DATA.initials}
              </button>
            </div>
          </header>

          <!-- Mobile Compact Sub-bar (Single-header architecture) -->
          <div class="lg:hidden flex items-center justify-between px-3 py-2 border-b border-white/8 bg-zinc-950/80 text-xs flex-shrink-0">
            <div class="flex items-center gap-2 min-w-0">
              <span class="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0 animate-pulse"></span>
              <span id="pp-mobile-title" class="font-bold text-white truncate text-xs">Dashboard Siswa</span>
            </div>
            <span class="text-[10px] font-mono text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/25 flex-shrink-0">#10 Farhan</span>
          </div>

          <!-- Page Content -->
          <div id="pp-content" class="flex-1 overflow-y-auto scrollbar-thin">
            ${renderPage()}
          </div>
        </div>

        <!-- BOTTOM NAVIGATION (Mobile) -->
        <nav id="pp-bottom-nav" class="pp-bottom-nav lg:hidden">
          ${renderBottomNav()}
        </nav>

      </div>
    `;

    setTimeout(() => { startCountdown(); initRadar(); }, 80);
  }

  /* ================================================================
     SIDEBAR
  ================================================================ */
  function renderSidebar() {
    const navItems = [
      { id:'dashboard',    icon:'🏠', label:'Dashboard'               },
      { id:'messages',     icon:'💬', label:'Locker Room (Discord)', badge:'NEW' },
      { id:'billing',      icon:'💳', label:'Tagihan & SPP', badge:'1' },
      { id:'profile',      icon:'👤', label:'Profil Pemain'            },
      { id:'schedule',     icon:'📅', label:'Jadwal Latihan'           },
      { id:'programs',     icon:'⚽', label:'Program Latihan'          },
      { id:'attendance',   icon:'📋', label:'Kehadiran'                },
      { id:'development',  icon:'📊', label:'Perkembangan Kemampuan'   },
      { id:'matches',      icon:'🏆', label:'Pertandingan'             },
      { id:'achievements', icon:'🏅', label:'Prestasi & Penghargaan'   },
      { id:'announcements',icon:'📢', label:'Pengumuman',  badge:'3'  },
      { id:'settings',     icon:'⚙️', label:'Pengaturan'               },
    ];

    return `
      <!-- Logo -->
      <div class="flex items-center gap-2.5 px-4 py-4 border-b border-white/8 flex-shrink-0">
        <div class="w-9 h-9 rounded-xl flex items-center justify-center font-black text-zinc-950 text-sm flex-shrink-0"
          style="background:linear-gradient(135deg,#34d399,#a3e635)">⚽</div>
        <div>
          <div class="font-black text-white text-sm">YouthTrigger Arena</div>
          <div class="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">Player Portal</div>
        </div>
      </div>

      <!-- Player Identity -->
      <div class="px-4 py-3 border-b border-white/8 flex-shrink-0">
        <div class="flex items-center gap-3">
          <div class="relative flex-shrink-0">
            <div class="w-12 h-12 rounded-2xl ${PLAYER_DATA.bg} text-white flex items-center justify-center font-black text-lg shadow-lg select-none online-ring">
              ${PLAYER_DATA.initials}
            </div>
            <div class="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-emerald-400 text-zinc-950 flex items-center justify-center font-black text-xs shadow-md border-2 border-zinc-950">#${PLAYER_DATA.number}</div>
          </div>
          <div class="flex-1 min-w-0">
            <div class="font-black text-white text-sm truncate">${PLAYER_DATA.name}</div>
            <div class="text-[11px] text-emerald-400 font-semibold truncate">${PLAYER_DATA.pos}</div>
            <div class="text-[10px] text-zinc-500 mt-0.5">${PLAYER_DATA.squad} · YouthTrigger</div>
          </div>
        </div>
        <div class="mt-2.5 flex items-center gap-2">
          <span class="text-[10px] px-2 py-0.5 rounded-lg bg-emerald-400/15 text-emerald-300 border border-emerald-400/25 font-bold">⚽ Siswa Aktif</span>
          <span class="text-[10px] px-2 py-0.5 rounded-lg bg-sky-400/15 text-sky-300 border border-sky-400/25 font-bold">${PLAYER_DATA.squad}</span>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto py-2 scrollbar-thin px-2">
        ${navItems.map(item => `
          <button onclick="PlayerView.navTo('${item.id}')"
            id="pnav-${item.id}"
            class="pp-nav-item ${_playerPage === item.id ? 'active' : ''}
                   w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left mb-0.5 border-l-[3px]
                   ${_playerPage === item.id ? '' : 'border-transparent text-zinc-400'}">
            <span class="text-base w-5 text-center flex-shrink-0">${item.icon}</span>
            <span class="flex-1 truncate">${item.label}</span>
            ${item.badge ? `<span class="text-[10px] font-black px-1.5 py-0.5 rounded-lg bg-emerald-400/20 text-emerald-400">${item.badge}</span>` : ''}
          </button>
        `).join('')}
      </nav>

      <!-- Logout -->
      <div class="p-3 border-t border-white/8 flex-shrink-0">
        <div class="glass-subtle rounded-2xl p-2.5 mb-2 border border-white/5 text-center">
          <div class="text-[10px] text-zinc-500">Rating Saat Ini</div>
          <div class="text-xl font-black text-emerald-400">${PLAYER_DATA.rating}</div>
          <div class="text-[10px] text-zinc-600">/ 10.0</div>
        </div>
        <button onclick="State.setRole('visitor'); Utils.showToast('Sampai jumpa, ${PLAYER_DATA.nickName}! 👋','info')"
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
    _playerPage = page;
    const titles = {
      dashboard:'Dashboard', messages:'Locker Room (Discord)', billing:'Tagihan & SPP Bulanan', profile:'Profil Pemain', schedule:'Jadwal Latihan',
      programs:'Program Latihan', attendance:'Kehadiran', development:'Perkembangan Kemampuan',
      matches:'Pertandingan', achievements:'Prestasi & Penghargaan',
      announcements:'Pengumuman', settings:'Pengaturan',
    };
    const titleEl = document.getElementById('pp-page-title');
    if (titleEl) titleEl.textContent = titles[page] || page;
    const mobileTitleEl = document.getElementById('pp-mobile-title');
    if (mobileTitleEl) mobileTitleEl.textContent = titles[page] || page;

    document.querySelectorAll('.pp-nav-item').forEach(b => {
      const id = b.id.replace('pnav-','');
      const isActive = id === page;
      b.classList.toggle('active', isActive);
      if (!isActive) b.classList.add('border-transparent','text-zinc-400');
      else b.classList.remove('border-transparent','text-zinc-400');
    });

    const cont = document.getElementById('pp-content');
    if (cont) {
      cont.scrollTop = 0;
      cont.innerHTML = renderPage();
      setTimeout(() => { initRadar(); startCountdown(); }, 60);
    }
    closeMobileSidebar();

    // Update bottom nav active indicator
    const bnav = document.getElementById('pp-bottom-nav');
    if (bnav) bnav.innerHTML = renderBottomNav();
  }

  function renderBottomNav() {
    const items = [
      { id:'dashboard', icon:'🏠', label:'Home' },
      { id:'messages',  icon:'💬', label:'Locker', badge:'NEW' },
      { id:'schedule',  icon:'📅', label:'Jadwal' },
      { id:'billing',   icon:'💳', label:'SPP',    badge:'1' },
      { id:'profile',   icon:'👤', label:'Profil' }
    ];
    return items.map(item => {
      const active = _playerPage === item.id;
      return `
        <button onclick="PlayerView.navTo('${item.id}')"
          class="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-center transition-all relative ${active ? 'text-emerald-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'}">
          <div class="relative">
            <span class="text-lg leading-none">${item.icon}</span>
            ${item.badge ? `<span class="absolute -top-1 -right-2 text-[9px] font-black px-1 rounded-full bg-emerald-400 text-zinc-950">${item.badge}</span>` : ''}
          </div>
          <span class="text-[10px]">${item.label}</span>
          ${active ? '<div class="w-5 h-0.5 rounded-full bg-emerald-400 mt-0.5"></div>' : '<div class="w-5 h-0.5 opacity-0 mt-0.5"></div>'}
        </button>
      `;
    }).join('');
  }

  function renderPage() {
    switch (_playerPage) {
      case 'messages':      return DiscordChat.render('player');
      case 'billing':       return PaymentModule.renderPlayerBilling();
      case 'profile':       return renderProfilePage();
      case 'schedule':      return renderSchedulePage();
      case 'programs':      return renderProgramsPage();
      case 'attendance':    return renderAttendancePage();
      case 'development':   return renderDevelopmentPage();
      case 'matches':       return renderMatchesPage();
      case 'achievements':  return renderAchievementsPage();
      case 'announcements': return renderAnnouncementsPage();
      case 'settings':      return renderSettingsPage();
      default:              return renderDashboardPage();
    }
  }

  /* ================================================================
     MOBILE TOGGLES
  ================================================================ */
  function toggleMobileSidebar() {
    const sb = document.getElementById('pp-sidebar');
    const ov = document.getElementById('pp-overlay');
    if (!sb || !ov) return;
    const isOpen = sb.classList.contains('pp-mobile-open');
    sb.classList.toggle('pp-mobile-open', !isOpen);
    ov.classList.toggle('hidden', isOpen);
  }
  function closeMobileSidebar() {
    const sb = document.getElementById('pp-sidebar');
    const ov = document.getElementById('pp-overlay');
    if (sb) sb.classList.remove('pp-mobile-open');
    if (ov) ov.classList.add('hidden');
  }

  /* ================================================================
     1. DASHBOARD PAGE
  ================================================================ */
  function renderDashboardPage() {
    const nextSession = PLAYER_SCHEDULE.find(s => s.status === 'upcoming');
    const nextMatch   = PLAYER_MATCHES.find(m => m.status === 'upcoming');
    const topSkill    = Object.entries(PLAYER_SKILLS).sort((a,b)=>b[1]-a[1])[0];
    const weakSkill   = Object.entries(PLAYER_SKILLS).sort((a,b)=>a[1]-b[1])[0];
    const skillLabels = { passing:'Passing', shooting:'Shooting', dribbling:'Dribbling', ballControl:'Ball Control', speed:'Speed', stamina:'Stamina', tactical:'Tactical', teamwork:'Teamwork', discipline:'Discipline' };

    return `
      <div class="p-3 sm:p-5 space-y-3.5 sm:space-y-5 pp-page min-w-0 max-w-full overflow-hidden">

        <!-- Hero Greeting Banner -->
        <div class="rounded-2xl sm:rounded-3xl p-4 sm:p-6 relative overflow-hidden border border-emerald-400/20 shadow-2xl"
          style="background:linear-gradient(135deg,#061612 0%,#090d16 60%,#061a26 100%)">
          <div class="absolute inset-0 opacity-8"
            style="background-image:repeating-linear-gradient(45deg,transparent,transparent 18px,rgba(52,211,153,.2) 18px,rgba(52,211,153,.2) 19px)"></div>
          <!-- Jersey number big BG -->
          <div class="absolute right-3 top-2 text-[80px] sm:text-[120px] font-black leading-none select-none pointer-events-none"
            style="color:rgba(52,211,153,.06);">#${PLAYER_DATA.number}</div>

          <div class="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div class="flex items-center gap-3 sm:gap-4 min-w-0">
              <div class="relative flex-shrink-0">
                <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl ${PLAYER_DATA.bg} text-white flex items-center justify-center font-black text-lg sm:text-2xl shadow-2xl online-ring select-none">
                  ${PLAYER_DATA.initials}
                </div>
                <div class="absolute -bottom-1 -right-1 sm:-bottom-1.5 sm:-right-1.5 w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-emerald-400 text-zinc-950 flex items-center justify-center font-black text-xs sm:text-sm shadow-lg border-2 border-zinc-950">#${PLAYER_DATA.number}</div>
              </div>
              <div class="min-w-0">
                <div class="text-[10px] sm:text-xs text-emerald-400 font-bold uppercase tracking-widest truncate">Halo, Selamat datang! 🌟</div>
                <h2 class="text-lg sm:text-xl font-black text-white mt-0.5 truncate">${PLAYER_DATA.name}</h2>
                <div class="text-[11px] sm:text-xs text-zinc-400 mt-0.5 truncate">${PLAYER_DATA.pos} · ${PLAYER_DATA.squad}</div>
                <div class="flex flex-wrap gap-1 sm:gap-1.5 mt-2">
                  <span class="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-lg bg-emerald-400/15 text-emerald-300 border border-emerald-400/25 font-semibold">⭐ Rating ${PLAYER_DATA.rating}</span>
                  <span class="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-lg bg-sky-400/15 text-sky-300 border border-sky-400/25 font-semibold">Musim 2026</span>
                </div>
              </div>
            </div>
            <div class="flex flex-col sm:flex-row gap-2 flex-shrink-0 pt-1 sm:pt-0">
              <button onclick="PlayerView.navTo('development')"
                class="send-btn px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-zinc-950 shadow-lg flex items-center gap-2 justify-center">
                <span>📊</span> Lihat Perkembanganku
              </button>
              <button onclick="PlayerView.navTo('achievements')"
                class="glass px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-zinc-200 border border-white/15 hover:border-emerald-400/40 transition-all flex items-center gap-2 justify-center">
                <span>🏅</span> Prestasiku
              </button>
            </div>
          </div>
        </div>

        <!-- KPI Row -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          ${[
            { icon:'📅', label:'Sesi Latihan', value: PLAYER_ATTENDANCE.total, sub:'Total sesi', color:'text-sky-400', border:'border-sky-400/20', bg:'bg-sky-400/8', page:'attendance' },
            { icon:'✅', label:'Kehadiran',    value: PLAYER_ATTENDANCE.hadir+'%', sub:'Tingkat hadir', color:'text-emerald-400', border:'border-emerald-400/20', bg:'bg-emerald-400/8', page:'attendance' },
            { icon:'⚽', label:'Gol Musim',   value: PLAYER_DATA.goals, sub:`${PLAYER_DATA.assists} assist`, color:'text-lime-400', border:'border-lime-400/20', bg:'bg-lime-400/8', page:'matches' },
            { icon:'🏟️', label:'Penampilan',  value: PLAYER_DATA.matches, sub:'Pertandingan', color:'text-amber-400', border:'border-amber-400/20', bg:'bg-amber-400/8', page:'matches' },
          ].map(k => `
            <div onclick="PlayerView.navTo('${k.page}')" class="pp-stat-card rounded-2xl sm:rounded-3xl p-3 sm:p-4 cursor-pointer border ${k.border}">
              <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl ${k.bg} flex items-center justify-center text-base sm:text-xl mb-2 sm:mb-3 border ${k.border}">${k.icon}</div>
              <div class="text-xl sm:text-2xl font-black ${k.color} leading-none mb-1">${k.value}</div>
              <div class="text-[11px] sm:text-xs font-bold text-white/80 truncate">${k.label}</div>
              <div class="text-[9px] sm:text-[11px] text-zinc-500 mt-0.5 truncate">${k.sub}</div>
            </div>
          `).join('')}
        </div>

        <!-- DISCORD LOCKER ROOM & PESAN KHUSUS WIDGET -->
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
                  <h3 class="text-base font-black text-white">Discord Locker Room &amp; Pesan Khusus</h3>
                  <span class="text-[10px] px-2 py-0.5 rounded-full bg-[#5865F2]/25 text-[#c9cdfb] font-black border border-[#5865F2]/30">ONLINE DISCORD</span>
                </div>
                <div class="text-xs text-zinc-300 mt-1 flex items-center gap-1.5 flex-wrap">
                  <span class="w-2 h-2 rounded-full bg-[#23a55a]"></span>
                  <span><strong>Coach Hendra:</strong> "Farhan, eksekutor utama free-kick tiang jauh..."</span>
                  <span class="text-[10px] text-zinc-400">· 07:25 WIB</span>
                </div>
                <div class="text-[11px] text-zinc-400 mt-1">
                  Ruang pesan khusus 1-on-1 dengan Pelatih &amp; diskusi taktik formasi 4-3-3 skuad U-16.
                </div>
              </div>
            </div>
            <div class="flex items-center gap-2 flex-shrink-0">
              <button onclick="DiscordChat.switchChannel('dm-coach-hendra'); PlayerView.navTo('messages')"
                class="discord-blurple-bg text-white px-4 py-2.5 rounded-2xl text-xs font-black shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
                <span>🔒</span> Pesan Khusus Coach
              </button>
              <button onclick="DiscordChat.switchChannel('u16-tactics-room'); PlayerView.navTo('messages')"
                class="glass hover:bg-white/10 text-white px-4 py-2.5 rounded-2xl text-xs font-bold border border-white/15 transition-all flex items-center gap-2">
                <span>#</span> Ruang Taktik
              </button>
            </div>
          </div>
        </div>

        <!-- 3-col grid -->
        <div class="grid lg:grid-cols-3 gap-4">

          <!-- Next Training -->
          <div class="glass rounded-3xl p-4 border border-emerald-400/20 space-y-3">
            <h3 class="text-sm font-black text-white flex items-center gap-2"><span>📅</span> Latihan Berikutnya</h3>
            ${nextSession ? `
              <div class="glass-subtle rounded-2xl p-3.5 border border-white/5 space-y-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-emerald-400/15 text-emerald-300 border border-emerald-400/25">Segera</span>
                <div class="text-sm font-bold text-white leading-snug">${nextSession.title}</div>
                <div class="text-xs text-zinc-400">📅 ${nextSession.day}, ${nextSession.date}</div>
                <div class="text-xs text-zinc-400">⏰ ${nextSession.time} · ⌛ ${nextSession.duration}</div>
                <div class="text-xs text-zinc-400">📍 ${nextSession.location}</div>
                <div class="text-xs text-zinc-500">📚 ${nextSession.materi}</div>
              </div>
              <button onclick="PlayerView.navTo('schedule')"
                class="w-full send-btn py-2 rounded-2xl text-xs font-bold text-zinc-950">Lihat Semua Jadwal →</button>
            ` : '<div class="text-zinc-500 text-sm text-center py-4">Tidak ada jadwal tersedia</div>'}
          </div>

          <!-- Next Match + Countdown -->
          <div class="glass rounded-3xl p-4 border border-lime-400/20 space-y-3">
            <h3 class="text-sm font-black text-white flex items-center gap-2"><span>🏟️</span> Laga Berikutnya</h3>
            ${nextMatch ? `
              <div class="text-center py-1">
                <div class="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-1">${nextMatch.squad}</div>
                <div class="text-xs text-zinc-400">${nextMatch.inSquad ? '✅ Kamu masuk daftar pemain!' : '⏳ Daftar pemain belum diumumkan'}</div>
                <div class="font-black text-xl text-white mt-2">KSA vs ${nextMatch.opp.split(' ').slice(0,2).join(' ')}</div>
                <div class="text-xs text-zinc-400 mt-0.5">${nextMatch.date} · ${nextMatch.time}</div>
                <div class="text-xs text-zinc-500">📍 ${nextMatch.venue}</div>
              </div>
              <div class="flex justify-center gap-2">
                ${[['c-cd-h','Jam'],['c-cd-m','Mnt'],['c-cd-s','Det']].map(([id,lbl]) => `
                  <div class="text-center glass-subtle rounded-2xl px-3 py-2 min-w-[46px] border border-white/8">
                    <div id="${id}" class="text-lg font-black text-lime-400 score-pop">00</div>
                    <div class="text-[9px] text-zinc-500 uppercase mt-0.5">${lbl}</div>
                  </div>
                `).join('<div class="text-zinc-600 font-black self-center">:</div>')}
              </div>
              <button onclick="PlayerView.navTo('matches')"
                class="w-full glass py-2 rounded-2xl text-xs font-bold text-zinc-200 border border-white/10 hover:border-lime-400/30 transition-all">Detail Pertandingan →</button>
            ` : '<div class="text-zinc-500 text-sm text-center py-4">Tidak ada pertandingan mendatang</div>'}
          </div>

          <!-- Player Performance Snapshot -->
          <div class="glass rounded-3xl p-4 border border-white/5 space-y-3">
            <h3 class="text-sm font-black text-white flex items-center gap-2"><span>⚡</span> Performa Terkini</h3>
            <div class="space-y-2">
              ${Object.entries(PLAYER_SKILLS).slice(0,5).map(([k,v]) => {
                const lbl = skillLabels[k];
                const col = v>=85?'gradient-emerald':v>=75?'bg-amber-400':'bg-red-400';
                const textCol = v>=85?'text-emerald-400':v>=75?'text-amber-400':'text-red-400';
                return `
                  <div>
                    <div class="flex justify-between text-xs mb-1">
                      <span class="text-zinc-400">${lbl}</span>
                      <span class="font-black ${textCol}">${v}</span>
                    </div>
                    <div class="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div class="${col} h-full rounded-full pp-skill-bar" style="width:${v}%"></div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
            <div class="pt-2 border-t border-white/5 grid grid-cols-2 gap-2 text-center text-xs">
              <div class="glass-subtle rounded-xl p-2 border border-emerald-400/15">
                <div class="text-[10px] text-zinc-500">Terbaik</div>
                <div class="font-bold text-emerald-400">${skillLabels[topSkill[0]]}</div>
                <div class="text-[10px] text-emerald-300">${topSkill[1]}/100</div>
              </div>
              <div class="glass-subtle rounded-xl p-2 border border-amber-400/15">
                <div class="text-[10px] text-zinc-500">Tingkatkan</div>
                <div class="font-bold text-amber-400">${skillLabels[weakSkill[0]]}</div>
                <div class="text-[10px] text-amber-300">${weakSkill[1]}/100</div>
              </div>
            </div>
            <button onclick="PlayerView.navTo('development')"
              class="w-full send-btn py-2 rounded-2xl text-xs font-bold text-zinc-950">Lihat Radar Skill →</button>
          </div>
        </div>

        <!-- My Football Journey -->
        <div class="glass rounded-3xl p-5 border border-white/5 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-black text-white flex items-center gap-2"><span>🚀</span> My Football Journey</h3>
            <span class="text-xs text-zinc-500">Bergabung Jan 2022</span>
          </div>
          <div class="relative">
            <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-400 to-transparent opacity-30"></div>
            <div class="space-y-4">
              ${[
                { year:'2022', title:'Bergabung YouthTrigger Arena', desc:'Memulai perjalanan sebagai anggota U-14, pertama kali mengenakan jersey #10', icon:'🌱', done:true },
                { year:'2023', title:'Promosi ke U-16', desc:'Naik ke kelompok U-16 setelah performa konsisten selama 1 tahun di U-14', icon:'📈', done:true },
                { year:'2024', title:'Hat-trick Pertama', desc:'Mencetak 3 gol dalam satu pertandingan vs Muda Jaya FC', icon:'⚽', done:true },
                { year:'2026', title:'50 Sesi Latihan', desc:'Menyelesaikan 50 sesi latihan penuh, meraih badge Training Dedication', icon:'💪', done:true },
                { year:'2027', title:'Target: 100 Sesi', desc:'Terus latihan untuk meraih badge bergengsi 100 Training Club!', icon:'🎯', done:false },
              ].map(e => `
                <div class="flex gap-4 pl-10 relative">
                  <div class="absolute left-2 w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 -translate-x-1/2 ${e.done ? 'bg-emerald-400 text-zinc-950' : 'bg-zinc-800 text-zinc-500 border border-zinc-600'}">
                    ${e.done ? '✓' : '○'}
                  </div>
                  <div class="flex-1 pb-1">
                    <div class="flex items-center gap-2">
                      <span class="text-base">${e.icon}</span>
                      <span class="text-xs font-bold ${e.done ? 'text-white' : 'text-zinc-500'}">${e.title}</span>
                      <span class="text-[10px] text-zinc-600">${e.year}</span>
                    </div>
                    <p class="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">${e.desc}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Recent Badges + Announcements -->
        <div class="grid sm:grid-cols-2 gap-4">
          <!-- Recent Badges -->
          <div class="glass rounded-3xl p-4 border border-white/5 space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-black text-white flex items-center gap-2"><span>🏅</span> Badge Terbaru</h3>
              <button onclick="PlayerView.navTo('achievements')" class="text-xs text-emerald-400 font-semibold hover:text-emerald-300">Semua →</button>
            </div>
            <div class="space-y-2">
              ${PLAYER_BADGES.filter(b=>b.earned).slice(0,3).map(b => `
                <div class="glass-subtle rounded-2xl p-2.5 flex items-center gap-3 border border-white/5">
                  <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-gradient-to-br ${b.color} flex-shrink-0 shadow-md">${b.icon}</div>
                  <div class="flex-1 min-w-0">
                    <div class="text-xs font-bold text-white truncate">${b.name}</div>
                    <div class="text-[10px] text-zinc-500">${b.date}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Upcoming Activities -->
          <div class="glass rounded-3xl p-4 border border-white/5 space-y-3">
            <h3 class="text-sm font-black text-white flex items-center gap-2"><span>📋</span> Upcoming Activities</h3>
            <div class="space-y-2">
              ${[...PLAYER_SCHEDULE.filter(s=>s.status==='upcoming').slice(0,2),
                 ...PLAYER_MATCHES.filter(m=>m.status==='upcoming').slice(0,1)
                ].map(a => `
                <div class="glass-subtle rounded-2xl p-2.5 flex items-center gap-3 border border-white/5">
                  <div class="w-9 h-9 rounded-xl ${a.type ? 'bg-lime-400/15 border-lime-400/20' : 'bg-emerald-400/15 border-emerald-400/20'} flex items-center justify-center text-base border flex-shrink-0">
                    ${a.type ? '🏆' : '⚽'}
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-xs font-bold text-white truncate">${a.title || `vs ${a.opp}`}</div>
                    <div class="text-[10px] text-zinc-500">${a.date || a.date} · ${a.time}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

      </div>
    `;
  }

  /* ================================================================
     2. PROFIL PEMAIN PAGE
  ================================================================ */
  function renderProfilePage() {
    return `
      <div class="p-4 sm:p-6 space-y-5 pp-page">

        <!-- Profile Hero -->
        <div class="glass rounded-3xl p-6 border border-emerald-400/20 relative overflow-hidden">
          <div class="absolute right-0 top-0 text-[180px] font-black leading-none select-none pointer-events-none opacity-5 text-emerald-400">#${PLAYER_DATA.number}</div>
          <div class="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div class="relative">
              <div class="w-24 h-24 rounded-3xl ${PLAYER_DATA.bg} text-white flex items-center justify-center font-black text-4xl shadow-2xl online-ring select-none">
                ${PLAYER_DATA.initials}
              </div>
              <div class="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-emerald-400 text-zinc-950 flex items-center justify-center font-black text-lg shadow-xl border-2 border-zinc-950">#${PLAYER_DATA.number}</div>
            </div>
            <div class="text-center sm:text-left flex-1">
              <div class="text-xs text-emerald-400 font-bold uppercase tracking-widest">${PLAYER_DATA.studentId}</div>
              <h2 class="text-2xl font-black text-white mt-0.5">${PLAYER_DATA.fullName}</h2>
              <div class="text-sm text-zinc-400 mt-0.5">${PLAYER_DATA.pos} · ${PLAYER_DATA.posAlt}</div>
              <div class="flex flex-wrap gap-2 justify-center sm:justify-start mt-2">
                <span class="text-xs px-2.5 py-1 rounded-xl bg-emerald-400/15 text-emerald-300 border border-emerald-400/25 font-semibold">⚽ Siswa Aktif</span>
                <span class="text-xs px-2.5 py-1 rounded-xl bg-sky-400/15 text-sky-300 border border-sky-400/25 font-semibold">${PLAYER_DATA.squad}</span>
                <span class="text-xs px-2.5 py-1 rounded-xl bg-lime-400/15 text-lime-300 border border-lime-400/25 font-semibold">⭐ Rating ${PLAYER_DATA.rating}</span>
              </div>
              <p class="text-xs text-zinc-500 italic mt-3">${PLAYER_DATA.motto}</p>
            </div>
          </div>
        </div>

        <!-- Season Stats -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          ${[
            { label:'Gol Musim', value: PLAYER_DATA.goals, icon:'⚽', color:'text-lime-400' },
            { label:'Assist',    value: PLAYER_DATA.assists, icon:'🎯', color:'text-sky-400' },
            { label:'Penampilan', value: PLAYER_DATA.matches, icon:'🏟️', color:'text-amber-400' },
            { label:'Kehadiran', value: PLAYER_DATA.attendance+'%', icon:'✅', color:'text-emerald-400' },
          ].map(s => `
            <div class="glass rounded-2xl p-3.5 text-center border border-white/5 hover:border-emerald-400/20 transition-all pp-stat-card">
              <div class="text-2xl">${s.icon}</div>
              <div class="text-2xl font-black ${s.color} leading-none mt-1">${s.value}</div>
              <div class="text-xs text-zinc-500 mt-0.5">${s.label}</div>
            </div>
          `).join('')}
        </div>

        <!-- Info Grid -->
        <div class="grid sm:grid-cols-2 gap-4">
          <!-- Player Info -->
          <div class="glass rounded-3xl p-5 border border-white/5 space-y-4">
            <h3 class="text-sm font-bold text-white flex items-center gap-2"><span>👤</span> Informasi Pemain</h3>
            ${[
              { label:'Nama Lengkap',    value: PLAYER_DATA.fullName },
              { label:'ID Siswa',        value: PLAYER_DATA.studentId },
              { label:'Tanggal Lahir',   value: PLAYER_DATA.dob },
              { label:'Kelompok Usia',   value: PLAYER_DATA.squad },
              { label:'Tanggal Bergabung', value: PLAYER_DATA.joinDate },
              { label:'Pelatih Pembina', value: PLAYER_DATA.coach },
              { label:'Status',          value: PLAYER_DATA.status },
            ].map(f => `
              <div class="flex justify-between gap-3 py-1.5 border-b border-white/5 last:border-0">
                <span class="text-xs text-zinc-500">${f.label}</span>
                <span class="text-xs font-semibold text-zinc-200 text-right">${f.value}</span>
              </div>
            `).join('')}
          </div>

          <!-- Football Info + Guardian -->
          <div class="space-y-4">
            <div class="glass rounded-3xl p-5 border border-white/5 space-y-3">
              <h3 class="text-sm font-bold text-white flex items-center gap-2"><span>⚽</span> Info Sepak Bola</h3>
              ${[
                { label:'Nomor Punggung', value: '#'+PLAYER_DATA.number },
                { label:'Posisi Utama',   value: PLAYER_DATA.pos },
                { label:'Posisi Alternatif', value: PLAYER_DATA.posAlt },
                { label:'Kebugaran Fisik', value: PLAYER_DATA.fitness+'%' },
                { label:'Rating Pelatih', value: PLAYER_DATA.rating+'/10' },
              ].map(f => `
                <div class="flex justify-between gap-3 py-1.5 border-b border-white/5 last:border-0">
                  <span class="text-xs text-zinc-500">${f.label}</span>
                  <span class="text-xs font-bold text-emerald-400">${f.value}</span>
                </div>
              `).join('')}
            </div>

            <div class="glass rounded-3xl p-5 border border-amber-400/15 space-y-3">
              <h3 class="text-sm font-bold text-white flex items-center gap-2"><span>👨‍👩‍👦</span> Info Wali</h3>
              <div class="text-xs text-zinc-500 bg-amber-400/8 rounded-xl p-2.5 border border-amber-400/20">
                🔒 Informasi kontak wali hanya ditampilkan sebagian untuk menjaga privasi data keluarga.
              </div>
              ${[
                { label:'Nama Wali',   value: PLAYER_DATA.guardian },
                { label:'No. Telepon', value: PLAYER_DATA.guardianPhone },
                { label:'Sekolah',     value: PLAYER_DATA.school },
              ].map(f => `
                <div class="flex justify-between gap-3 py-1.5 border-b border-white/5 last:border-0">
                  <span class="text-xs text-zinc-500">${f.label}</span>
                  <span class="text-xs font-semibold text-zinc-300">${f.value}</span>
                </div>
              `).join('')}
              <p class="text-[11px] text-zinc-600">Untuk mengubah data profil, hubungi Admin Akademi atau pelatih pembina.</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /* ================================================================
     3. JADWAL LATIHAN PAGE
  ================================================================ */
  function renderSchedulePage() {
    const upcoming   = PLAYER_SCHEDULE.filter(s=>s.status==='upcoming');
    const completed  = PLAYER_SCHEDULE.filter(s=>s.status==='completed');

    return `
      <div class="p-4 sm:p-6 space-y-5 pp-page">
        <div>
          <h2 class="text-xl font-black text-white">📅 Jadwal Latihan</h2>
          <p class="text-xs text-zinc-400 mt-0.5">${upcoming.length} sesi mendatang · ${completed.length} selesai</p>
        </div>

        <!-- Upcoming -->
        <div>
          <div class="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-3">📌 Jadwal Mendatang</div>
          <div class="space-y-3">
            ${upcoming.map(s => renderScheduleCard(s)).join('')}
          </div>
        </div>

        <!-- Completed -->
        <div>
          <div class="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-3">✅ Selesai</div>
          <div class="space-y-3">
            ${completed.map(s => renderScheduleCard(s)).join('')}
          </div>
        </div>
      </div>
    `;
  }

  function renderScheduleCard(s) {
    const isUpcoming = s.status === 'upcoming';
    const borderColor = isUpcoming ? 'border-emerald-400/20 hover:border-emerald-400/40' : 'border-white/5';
    return `
      <div class="glass rounded-3xl p-4 border ${borderColor} transition-all group">
        <div class="flex flex-col sm:flex-row sm:items-start gap-3">
          <div class="w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center text-xl
            ${isUpcoming ? 'bg-emerald-400/15 border border-emerald-400/25' : 'bg-zinc-700/40 border border-zinc-600/30'}">
            ${isUpcoming ? '⚽' : '✅'}
          </div>
          <div class="flex-1 space-y-1.5">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-lg border ${isUpcoming ? 'bg-emerald-400/15 text-emerald-300 border-emerald-400/25' : 'bg-zinc-700/40 text-zinc-400 border-zinc-600/30'}">
                ${isUpcoming ? '◎ Mendatang' : '✓ Selesai'}
              </span>
              <span class="text-[10px] text-zinc-500">${s.squad} · ${s.day}</span>
            </div>
            <h3 class="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">${s.title}</h3>
            <div class="grid sm:grid-cols-2 gap-1 text-[11px] text-zinc-500">
              <span>📅 ${s.date} · ⏰ ${s.time}</span>
              <span>⌛ ${s.duration} · 📍 ${s.location}</span>
              <span>👤 ${s.coach}</span>
              <span>📚 ${s.materi}</span>
            </div>
          </div>
          ${isUpcoming ? `
            <button onclick="Utils.showToast('Jadwal ditambahkan ke pengingat! 🔔','success')"
              class="glass-subtle px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-300 border border-white/8 hover:border-emerald-400/30 transition-all self-start">
              🔔 Ingatkan
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }

  /* ================================================================
     4. PROGRAM LATIHAN PAGE
  ================================================================ */
  function renderProgramsPage() {
    const categories = ['Semua','Tactical Awareness','Dribbling','Shooting','Ball Control','Speed & Agility'];
    const doneCount = PLAYER_PROGRAMS.filter(p=>p.done||_drillDone[p.id]).length;

    return `
      <div class="p-4 sm:p-6 space-y-5 pp-page">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-black text-white">⚽ Program Latihanku</h2>
            <p class="text-xs text-zinc-400 mt-0.5">${doneCount}/${PLAYER_PROGRAMS.length} program selesai</p>
          </div>
        </div>

        <!-- Progress Overview -->
        <div class="glass rounded-2xl p-3.5 border border-white/5">
          <div class="flex justify-between text-xs mb-2">
            <span class="text-zinc-400">Progress Program</span>
            <span class="text-emerald-400 font-black">${Math.round(doneCount/PLAYER_PROGRAMS.length*100)}%</span>
          </div>
          <div class="h-2.5 bg-zinc-800 rounded-full overflow-hidden">
            <div class="h-full rounded-full" style="width:${Math.round(doneCount/PLAYER_PROGRAMS.length*100)}%;background:linear-gradient(90deg,#34d399,#a3e635)"></div>
          </div>
        </div>

        <!-- Program Cards -->
        <div class="space-y-4">
          ${PLAYER_PROGRAMS.map(prog => {
            const done = prog.done || !!_drillDone[prog.id];
            const diffColor = prog.difficulty==='Tinggi' ? 'text-red-400 bg-red-400/10 border-red-400/20' : prog.difficulty==='Sedang' ? 'text-amber-400 bg-amber-400/10 border-amber-400/20' : 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
            return `
              <div class="glass rounded-3xl p-5 border ${done ? 'border-emerald-400/25' : 'border-white/5'} hover:border-emerald-400/20 transition-all group space-y-3">
                <div class="flex items-start justify-between gap-2">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-lg ${done ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30' : 'bg-zinc-700/40 text-zinc-400 border border-zinc-600/30'}">
                      ${done ? '✅ Selesai' : '📖 Berlangsung'}
                    </span>
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-lg border ${diffColor}">${prog.difficulty}</span>
                    <span class="text-[10px] text-zinc-500">${prog.category}</span>
                  </div>
                  <span class="text-[10px] text-zinc-500 flex-shrink-0">${prog.duration}</span>
                </div>

                <div>
                  <h3 class="text-sm font-black text-white group-hover:text-emerald-300 transition-colors">${prog.name}</h3>
                  <p class="text-xs text-zinc-500 mt-1 leading-relaxed">${prog.desc}</p>
                </div>

                <div>
                  <div class="text-[10px] text-zinc-500 uppercase tracking-wider mb-1.5 font-bold">Drill Latihan:</div>
                  <div class="flex flex-wrap gap-1.5">
                    ${prog.drills.map(d => `<span class="text-[10px] px-2.5 py-1 rounded-xl glass-subtle text-zinc-300 border border-white/8">${d}</span>`).join('')}
                  </div>
                </div>

                <div class="flex gap-2 pt-1">
                  <button onclick="Utils.showToast('Detail program ${prog.name} 📖','info')"
                    class="flex-1 glass py-2 rounded-2xl text-xs font-bold text-zinc-300 border border-white/8 hover:border-emerald-400/30 transition-all">
                    Lihat Detail
                  </button>
                  ${!done ? `
                    <button onclick="PlayerView._markDone(${prog.id})"
                      class="flex-1 send-btn py-2 rounded-2xl text-xs font-bold text-zinc-950">
                      ✅ Tandai Selesai
                    </button>
                  ` : `
                    <div class="flex-1 py-2 rounded-2xl text-xs font-bold text-emerald-400 text-center border border-emerald-400/25 bg-emerald-400/8">
                      ✅ Sudah Selesai
                    </div>
                  `}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  function _markDone(id) {
    _drillDone[id] = true;
    Utils.showToast('Program ditandai selesai! 🎉 Keren, terus semangat!','success');
    const c = document.getElementById('pp-content');
    if (c) c.innerHTML = renderProgramsPage();
  }

  /* ================================================================
     5. KEHADIRAN PAGE
  ================================================================ */
  function renderAttendancePage() {
    const pct = Math.round(PLAYER_ATTENDANCE.hadir / PLAYER_ATTENDANCE.total * 100);
    const attColors = { hadir:'att-hadir', izin:'att-izin', sakit:'att-sakit', alpha:'att-alpha' };
    const attLabels = { hadir:'Hadir', izin:'Izin', sakit:'Sakit', alpha:'Tanpa Ket.' };
    const attIcons  = { hadir:'✅', izin:'📝', sakit:'🤒', alpha:'❌' };

    return `
      <div class="p-4 sm:p-6 space-y-5 pp-page">
        <div>
          <h2 class="text-xl font-black text-white">📋 Riwayat Kehadiran</h2>
          <p class="text-xs text-zinc-400 mt-0.5">Rekap absensi pribadimu di YouthTrigger Arena</p>
        </div>

        <!-- Summary Ring -->
        <div class="glass rounded-3xl p-5 border border-emerald-400/20 flex flex-col sm:flex-row items-center gap-5">
          <!-- Big Percentage -->
          <div class="relative flex-shrink-0">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="12"/>
              <circle cx="60" cy="60" r="50" fill="none" stroke="#34d399" stroke-width="12"
                stroke-dasharray="${2*Math.PI*50}" stroke-dashoffset="${2*Math.PI*50*(1-pct/100)}"
                stroke-linecap="round" transform="rotate(-90 60 60)"/>
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <div class="text-2xl font-black text-emerald-400">${pct}%</div>
              <div class="text-[10px] text-zinc-500">Hadir</div>
            </div>
          </div>

          <!-- Stats -->
          <div class="flex-1 grid grid-cols-2 gap-3">
            ${[
              { label:'Total Sesi',   value: PLAYER_ATTENDANCE.total,  color:'text-white' },
              { label:'✅ Hadir',     value: PLAYER_ATTENDANCE.hadir,  color:'text-emerald-400' },
              { label:'📝 Izin',      value: PLAYER_ATTENDANCE.izin,   color:'text-amber-400' },
              { label:'🤒 Sakit',     value: PLAYER_ATTENDANCE.sakit,  color:'text-red-400' },
              { label:'❌ Alpha',     value: PLAYER_ATTENDANCE.alpha,  color:'text-zinc-500' },
              { label:'🎯 Target',    value: '95%',                    color:'text-lime-400' },
            ].map(s => `
              <div class="glass-subtle rounded-2xl p-2.5 text-center border border-white/5">
                <div class="text-xl font-black ${s.color}">${s.value}</div>
                <div class="text-[11px] text-zinc-500">${s.label}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Monthly Bars -->
        <div class="glass rounded-3xl p-5 border border-white/5 space-y-4">
          <h3 class="text-sm font-bold text-white flex items-center gap-2"><span>📊</span> Kehadiran per Bulan</h3>
          <div class="space-y-3">
            ${PLAYER_ATTENDANCE.monthly.map(m => {
              const pct = Math.round(m.hadir/m.total*100);
              return `
                <div>
                  <div class="flex justify-between text-xs mb-1.5">
                    <span class="text-zinc-300 font-semibold">${m.bulan} 2026</span>
                    <span class="font-black text-emerald-400">${m.hadir}/${m.total} (${pct}%)</span>
                  </div>
                  <div class="h-3 bg-zinc-800 rounded-full overflow-hidden">
                    <div class="h-full rounded-full" style="width:${pct}%;background:linear-gradient(90deg,#34d399,#a3e635)"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Record List -->
        <div class="glass rounded-3xl p-5 border border-white/5 space-y-3">
          <h3 class="text-sm font-bold text-white flex items-center gap-2"><span>📅</span> Riwayat Detail</h3>
          <div class="space-y-2">
            ${PLAYER_ATTENDANCE.records.map(r => `
              <div class="glass-subtle rounded-2xl p-3 flex items-center gap-3 border border-white/5">
                <span class="text-xl flex-shrink-0">${attIcons[r.status]}</span>
                <div class="flex-1 min-w-0">
                  <div class="text-xs font-bold text-white truncate">${r.session}</div>
                  <div class="text-[11px] text-zinc-500">${r.date}${r.note ? ' · '+r.note : ''}</div>
                </div>
                <span class="text-[11px] font-bold px-2.5 py-1 rounded-xl ${attColors[r.status]} flex-shrink-0">${attLabels[r.status]}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Ajukan Izin -->
        <div class="glass rounded-3xl p-5 border border-amber-400/15 space-y-3">
          <h3 class="text-sm font-bold text-white flex items-center gap-2"><span>📝</span> Ajukan Izin / Sakit</h3>
          <p class="text-xs text-zinc-500">Ajukan permohonan izin ke pelatih sebelum jadwal latihan. Pelatih akan menyetujui atau menolak permohonan.</p>
          ${_izinPending ? `
            <div class="glass-subtle rounded-2xl p-3 border border-amber-400/25 text-xs text-amber-300 flex items-center gap-2">
              <span>⏳</span> Permohonan izin kamu sedang menunggu persetujuan Coach Hendra.
            </div>
          ` : `
            <div class="grid sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-zinc-400 mb-1.5">Tanggal Izin</label>
                <input type="date" id="izin-date" class="w-full glass rounded-xl px-3 py-2.5 text-sm text-white border border-white/10 bg-zinc-900 focus:outline-none focus:border-amber-400/50"/>
              </div>
              <div>
                <label class="block text-xs font-semibold text-zinc-400 mb-1.5">Alasan</label>
                <select id="izin-reason" class="w-full glass rounded-xl px-3 py-2.5 text-sm text-zinc-200 bg-zinc-900 border border-white/10 focus:outline-none focus:border-amber-400/50">
                  <option>Sakit</option><option>Keperluan Sekolah</option><option>Keperluan Keluarga</option><option>Lainnya</option>
                </select>
              </div>
            </div>
            <button onclick="PlayerView.submitIzin()"
              class="w-full py-2.5 rounded-2xl text-sm font-bold text-zinc-950 shadow-md"
              style="background:linear-gradient(135deg,#f59e0b,#fbbf24)">
              📝 Kirim Permohonan Izin
            </button>
          `}
        </div>
      </div>
    `;
  }

  function submitIzin() {
    _izinPending = true;
    Utils.showToast('Permohonan izin dikirim ke Coach Hendra! Tunggu konfirmasi ya 📝','success');
    const c = document.getElementById('pp-content');
    if (c) c.innerHTML = renderAttendancePage();
  }

  /* ================================================================
     6. PERKEMBANGAN KEMAMPUAN PAGE
  ================================================================ */
  function renderDevelopmentPage() {
    const skillLabels = { passing:'Passing', shooting:'Shooting', dribbling:'Dribbling', ballControl:'Ball Control', speed:'Speed', stamina:'Stamina', tactical:'Tactical', teamwork:'Teamwork', discipline:'Discipline' };
    const getColor = v => v>=85?'text-emerald-400':v>=75?'text-amber-400':'text-red-400';
    const getBar   = v => v>=85?'gradient-emerald':v>=75?'bg-amber-400':'bg-red-400';

    const topSkill  = Object.entries(PLAYER_SKILLS).sort((a,b)=>b[1]-a[1])[0];
    const weakSkill = Object.entries(PLAYER_SKILLS).sort((a,b)=>a[1]-b[1])[0];
    const avg       = Math.round(Object.values(PLAYER_SKILLS).reduce((a,b)=>a+b,0)/Object.values(PLAYER_SKILLS).length);

    return `
      <div class="p-4 sm:p-6 space-y-5 pp-page">
        <div>
          <h2 class="text-xl font-black text-white">📊 Perkembangan Kemampuanku</h2>
          <p class="text-xs text-zinc-400 mt-0.5">Pantau perkembangan skill sepak bola kamu dari waktu ke waktu</p>
        </div>

        <!-- Summary Row -->
        <div class="grid grid-cols-3 gap-3">
          <div class="glass rounded-2xl p-3.5 text-center border border-emerald-400/20 pp-stat-card">
            <div class="text-2xl font-black text-emerald-400">${avg}</div>
            <div class="text-xs text-zinc-500">Rata-rata</div>
          </div>
          <div class="glass rounded-2xl p-3.5 text-center border border-lime-400/20 pp-stat-card">
            <div class="text-sm font-black text-lime-400">${skillLabels[topSkill[0]]}</div>
            <div class="text-xs text-zinc-500">Terbaik (${topSkill[1]})</div>
          </div>
          <div class="glass rounded-2xl p-3.5 text-center border border-amber-400/20 pp-stat-card">
            <div class="text-sm font-black text-amber-400">${skillLabels[weakSkill[0]]}</div>
            <div class="text-xs text-zinc-500">Tingkatkan (${weakSkill[1]})</div>
          </div>
        </div>

        <!-- Two Column -->
        <div class="grid lg:grid-cols-2 gap-5">

          <!-- Skill Bars -->
          <div class="glass rounded-3xl p-5 border border-white/5 space-y-4">
            <h3 class="text-sm font-bold text-white flex items-center gap-2"><span>📈</span> Nilai Kemampuan Terkini</h3>
            ${Object.entries(PLAYER_SKILLS).map(([k,v]) => `
              <div>
                <div class="flex justify-between text-xs mb-1.5">
                  <span class="text-zinc-300">${skillLabels[k]}</span>
                  <span class="font-black ${getColor(v)}">${v} / 100</span>
                </div>
                <div class="h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div class="${getBar(v)} h-full rounded-full pp-skill-bar" style="width:${v}%"></div>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Radar + Period comparison -->
          <div class="space-y-4">
            <div class="glass rounded-3xl p-5 border border-white/5">
              <h3 class="text-sm font-bold text-white mb-3 flex items-center gap-2"><span>🕸️</span> Radar Kemampuan</h3>
              <div id="pp-radar-wrap" class="flex justify-center">
                ${renderPlayerRadar()}
              </div>
            </div>

            <!-- Period Comparison -->
            <div class="glass rounded-3xl p-5 border border-white/5 space-y-3">
              <h3 class="text-sm font-bold text-white flex items-center gap-2"><span>📅</span> Perkembangan 3 Bulan</h3>
              <div class="space-y-3">
                ${PLAYER_HISTORY.map((h, hi) => {
                  const hAvg = Math.round(Object.values(h).filter(v=>typeof v==='number').reduce((a,b)=>a+b,0)/9);
                  const prev = hi > 0 ? Math.round(Object.values(PLAYER_HISTORY[hi-1]).filter(v=>typeof v==='number').reduce((a,b)=>a+b,0)/9) : hAvg;
                  const delta = hAvg - prev;
                  return `
                    <div class="flex items-center gap-3">
                      <div class="text-xs text-zinc-500 w-16 flex-shrink-0 font-semibold">${h.period}</div>
                      <div class="flex-1 h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div class="h-full rounded-full" style="width:${hAvg}%;background:linear-gradient(90deg,#34d399,#a3e635)"></div>
                      </div>
                      <div class="text-xs font-black text-emerald-400 w-8 text-right">${hAvg}</div>
                      ${hi > 0 ? `<span class="text-[10px] font-bold ${delta>=0?'text-emerald-400':'text-red-400'} flex-shrink-0">${delta>=0?'↑':'↓'}${Math.abs(delta)}</span>` : '<span class="w-6"></span>'}
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>
        </div>

        <!-- Development Report (child-friendly) -->
        <div class="glass rounded-3xl p-5 border border-emerald-400/15 space-y-4">
          <h3 class="text-sm font-bold text-white flex items-center gap-2"><span>📋</span> My Development Report</h3>
          <div class="grid sm:grid-cols-3 gap-3 text-center">
            <div class="glass-subtle rounded-2xl p-3.5 border border-emerald-400/15">
              <div class="text-2xl mb-1">🌟</div>
              <div class="text-xs font-bold text-white">Kamu Sangat Bagus Di</div>
              <div class="text-sm font-black text-emerald-400 mt-1">Speed & Discipline</div>
              <div class="text-[11px] text-zinc-500 mt-0.5">Terus pertahankan!</div>
            </div>
            <div class="glass-subtle rounded-2xl p-3.5 border border-amber-400/15">
              <div class="text-2xl mb-1">📈</div>
              <div class="text-xs font-bold text-white">Perlu Ditingkatkan</div>
              <div class="text-sm font-black text-amber-400 mt-1">Shooting & Tactical</div>
              <div class="text-[11px] text-zinc-500 mt-0.5">Fokus di sesi latihan ya!</div>
            </div>
            <div class="glass-subtle rounded-2xl p-3.5 border border-sky-400/15">
              <div class="text-2xl mb-1">🏆</div>
              <div class="text-xs font-bold text-white">Progress Bulan Ini</div>
              <div class="text-sm font-black text-sky-400 mt-1">+3 poin rata-rata</div>
              <div class="text-[11px] text-zinc-500 mt-0.5">Kerja kerasmu terbayar!</div>
            </div>
          </div>
          <div class="glass-subtle rounded-2xl p-4 border border-white/5">
            <div class="text-xs font-bold text-amber-400 mb-2">📝 Pesan dari Coach Hendra:</div>
            <p class="text-sm text-zinc-300 leading-relaxed italic">
              "Farhan menunjukkan perkembangan yang sangat bagus terutama dalam kecepatan dan disiplin bermain. Terus latih finishing dan kesadaran taktis agar bisa tampil lebih optimal sebagai CAM. Kamu punya potensi besar!"
            </p>
          </div>
        </div>
      </div>
    `;
  }

  function renderPlayerRadar() {
    const keys  = ['passing','shooting','dribbling','ballControl','speed','stamina','tactical','teamwork'];
    const vals  = keys.map(k => PLAYER_SKILLS[k] / 100);
    const lbs   = ['Passing','Shooting','Dribbling','Ball Ctrl','Speed','Stamina','Tactical','Teamwork'];
    const cx=120, cy=120, r=90, n=keys.length;
    const pt = (val, i) => {
      const angle = (Math.PI*2*i/n) - Math.PI/2;
      return { x: cx + val*r*Math.cos(angle), y: cy + val*r*Math.sin(angle) };
    };
    const grid = [.25,.5,.75,1].map(s => {
      const pts = Array.from({length:n},(_,i)=>pt(s,i));
      return `<polygon points="${pts.map(p=>`${p.x},${p.y}`).join(' ')}" fill="none" stroke="rgba(255,255,255,0.09)" stroke-width="1"/>`;
    }).join('');
    const spokes = Array.from({length:n},(_,i) => {
      const p = pt(1,i);
      return `<line x1="${cx}" y1="${cy}" x2="${p.x}" y2="${p.y}" stroke="rgba(255,255,255,0.09)" stroke-width="1"/>`;
    }).join('');
    const pts = vals.map((v,i) => pt(v,i));
    const poly = `<polygon points="${pts.map(p=>`${p.x},${p.y}`).join(' ')}" fill="rgba(52,211,153,.18)" stroke="#34d399" stroke-width="2"/>`;
    const dots = pts.map(p => `<circle cx="${p.x}" cy="${p.y}" r="4" fill="#34d399" stroke="#052e16" stroke-width="1.5"/>`).join('');
    const lbls = lbs.map((l,i) => {
      const p = pt(1.18,i);
      return `<text x="${p.x}" y="${p.y}" text-anchor="middle" dominant-baseline="middle" class="radar-label" fill="#a1a1aa" font-size="10">${l}</text>`;
    }).join('');
    return `<svg viewBox="0 0 240 240" width="220" height="220" xmlns="http://www.w3.org/2000/svg">
      ${grid}${spokes}${poly}${dots}${lbls}
    </svg>`;
  }

  function initRadar() {
    const wrap = document.getElementById('pp-radar-wrap');
    if (wrap && !wrap.querySelector('svg')) wrap.innerHTML = renderPlayerRadar();
  }

  /* ================================================================
     7. PERTANDINGAN PAGE
  ================================================================ */
  function renderMatchesPage() {
    const totalGoals   = PLAYER_MATCHES.filter(m=>m.status==='completed').reduce((s,m)=>s+m.goals,0);
    const totalAssists = PLAYER_MATCHES.filter(m=>m.status==='completed').reduce((s,m)=>s+m.assists,0);
    const totalMins    = PLAYER_MATCHES.filter(m=>m.status==='completed').reduce((s,m)=>s+m.minutes,0);
    const appearances  = PLAYER_MATCHES.filter(m=>m.status==='completed' && m.inSquad).length;

    return `
      <div class="p-4 sm:p-6 space-y-5 pp-page">
        <div>
          <h2 class="text-xl font-black text-white">🏆 Riwayat Pertandingan</h2>
          <p class="text-xs text-zinc-400 mt-0.5">Semua pertandingan musim 2026</p>
        </div>

        <!-- Season Stats -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          ${[
            { icon:'🏟️', label:'Penampilan', value: appearances, color:'text-sky-400'     },
            { icon:'⚽', label:'Gol',         value: totalGoals,   color:'text-lime-400'   },
            { icon:'🎯', label:'Assist',       value: totalAssists, color:'text-emerald-400'},
            { icon:'⏱️', label:'Menit Bermain', value: totalMins+'\'', color:'text-amber-400' },
          ].map(s => `
            <div class="pp-stat-card rounded-3xl p-4 text-center border border-white/5">
              <div class="text-2xl">${s.icon}</div>
              <div class="text-2xl font-black ${s.color} leading-none mt-1">${s.value}</div>
              <div class="text-xs text-zinc-500">${s.label}</div>
            </div>
          `).join('')}
        </div>

        <!-- Upcoming Matches -->
        <div>
          <div class="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-3">📅 Mendatang</div>
          <div class="space-y-3">
            ${PLAYER_MATCHES.filter(m=>m.status==='upcoming').map(m => `
              <div class="glass rounded-3xl p-4 border border-lime-400/20 hover:border-lime-400/40 transition-all">
                <div class="flex items-center justify-between flex-wrap gap-2 mb-3">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-lime-400/15 text-lime-400 border border-lime-400/25">${m.squad}</span>
                    <span class="text-[10px] text-zinc-500">${m.type}</span>
                  </div>
                  ${m.inSquad ? '<span class="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-emerald-400/15 text-emerald-300 border border-emerald-400/25">✅ Kamu bermain!</span>' : '<span class="text-[10px] text-zinc-500">⏳ Daftar pemain belum diumumkan</span>'}
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <div class="text-sm font-black text-white">YouthTrigger vs ${m.opp}</div>
                    <div class="text-xs text-zinc-400 mt-0.5">${m.date} · ${m.time}</div>
                    <div class="text-xs text-zinc-500">📍 ${m.venue}</div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Match Results -->
        <div>
          <div class="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-3">📊 Riwayat Laga</div>
          <div class="space-y-3">
            ${PLAYER_MATCHES.filter(m=>m.status==='completed').map(m => {
              const resultColor = m.result?.startsWith('W') ? 'match-badge-W' : m.result?.startsWith('D') ? 'match-badge-D' : 'match-badge-L';
              return `
                <div class="glass rounded-3xl p-4 border border-white/5 hover:border-emerald-400/15 transition-all space-y-3">
                  <div class="flex items-center gap-3 flex-wrap">
                    <div class="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm flex-shrink-0 ${resultColor}">
                      ${m.result?.split(' ')[0]}
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="text-sm font-bold text-white">YouthTrigger ${m.squad} vs ${m.opp}</div>
                      <div class="text-xs text-zinc-500">${m.date} · 📍 ${m.venue}</div>
                    </div>
                    <div class="text-xl font-black text-white">${m.result?.split(' ')[1]}</div>
                  </div>
                  ${m.inSquad ? `
                    <div class="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-white/5">
                      <div class="glass-subtle rounded-xl p-2 border border-white/5">
                        <div class="font-black text-lime-400 text-base">${m.goals}</div>
                        <div class="text-zinc-500 text-[10px]">Gol</div>
                      </div>
                      <div class="glass-subtle rounded-xl p-2 border border-white/5">
                        <div class="font-black text-sky-400 text-base">${m.assists}</div>
                        <div class="text-zinc-500 text-[10px]">Assist</div>
                      </div>
                      <div class="glass-subtle rounded-xl p-2 border border-white/5">
                        <div class="font-black text-amber-400 text-base">${m.minutes}'</div>
                        <div class="text-zinc-500 text-[10px]">Menit</div>
                      </div>
                    </div>
                    ${m.note ? `<p class="text-[11px] text-zinc-500 italic border-t border-white/5 pt-2">📝 ${m.note}</p>` : ''}
                  ` : '<div class="text-xs text-zinc-600 italic pt-1">Kamu tidak terdaftar dalam pertandingan ini.</div>'}
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  }

  /* ================================================================
     8. PRESTASI & PENGHARGAAN PAGE
  ================================================================ */
  function renderAchievementsPage() {
    const earned  = PLAYER_BADGES.filter(b=>b.earned);
    const locked  = PLAYER_BADGES.filter(b=>!b.earned);
    const rarityGlow = { rare:'rarity-rare', epic:'rarity-epic', legendary:'rarity-legendary', uncommon:'', common:'' };

    return `
      <div class="p-4 sm:p-6 space-y-5 pp-page">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-black text-white">🏅 Prestasi & Penghargaan</h2>
            <p class="text-xs text-zinc-400 mt-0.5">${earned.length} diraih · ${locked.length} belum terbuka</p>
          </div>
        </div>

        <!-- Progress Banner -->
        <div class="glass rounded-3xl p-5 border border-amber-400/20 relative overflow-hidden">
          <div class="absolute inset-0 opacity-5" style="background-image:radial-gradient(circle,rgba(251,191,36,.4) 0%,transparent 70%)"></div>
          <div class="relative z-10 flex items-center gap-4">
            <div class="text-5xl">🏆</div>
            <div class="flex-1">
              <div class="text-base font-black text-white">${earned.length} dari ${PLAYER_BADGES.length} Badge Diraih</div>
              <div class="h-2.5 bg-zinc-800 rounded-full overflow-hidden mt-2">
                <div class="h-full rounded-full" style="width:${Math.round(earned.length/PLAYER_BADGES.length*100)}%;background:linear-gradient(90deg,#f59e0b,#fbbf24)"></div>
              </div>
              <div class="text-xs text-zinc-400 mt-1">Terus latihan untuk membuka badge selanjutnya! 💪</div>
            </div>
            <div class="text-right flex-shrink-0">
              <div class="text-2xl font-black text-amber-400">${Math.round(earned.length/PLAYER_BADGES.length*100)}%</div>
              <div class="text-[10px] text-zinc-500">Progress</div>
            </div>
          </div>
        </div>

        <!-- Rarity Legend -->
        <div class="flex gap-2 flex-wrap text-[10px]">
          ${[['⚪','Common','text-zinc-300'],['🟢','Uncommon','text-emerald-400'],['🔵','Rare','text-sky-400'],['🟣','Epic','text-purple-400'],['🟡','Legendary','text-amber-400']].map(([dot,lbl,col]) => `
            <span class="flex items-center gap-1 glass-subtle px-2 py-1 rounded-lg border border-white/5">
              <span>${dot}</span><span class="${col} font-semibold">${lbl}</span>
            </span>
          `).join('')}
        </div>

        <!-- Earned Badges -->
        <div>
          <div class="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-3">🌟 Badge Kamu</div>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            ${earned.map(b => `
              <div class="badge-card glass rounded-3xl p-4 border border-white/5 text-center space-y-2 cursor-pointer
                ${rarityGlow[b.rarity]||''}"
                onclick="Utils.showToast('${b.name}: ${b.desc} (${b.date})','success')">
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-br ${b.color} flex items-center justify-center text-3xl mx-auto shadow-lg">
                  ${b.icon}
                </div>
                <div class="text-xs font-black text-white">${b.name}</div>
                <div class="text-[10px] text-zinc-500 leading-tight">${b.desc}</div>
                <div class="text-[10px] text-zinc-600">${b.date}</div>
                <span class="inline-block text-[9px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-wider
                  ${b.rarity==='legendary'?'bg-amber-400/20 text-amber-300 border border-amber-400/25':
                    b.rarity==='epic'?'bg-purple-400/20 text-purple-300 border border-purple-400/25':
                    b.rarity==='rare'?'bg-sky-400/20 text-sky-300 border border-sky-400/25':
                    'bg-zinc-700/40 text-zinc-400 border border-zinc-600/30'}">
                  ${b.rarity}
                </span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Locked Badges -->
        <div>
          <div class="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-3">🔒 Belum Terbuka</div>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            ${locked.map(b => `
              <div class="badge-card badge-locked glass rounded-3xl p-4 border border-white/5 text-center space-y-2 cursor-pointer"
                onclick="Utils.showToast('Badge terkunci: ${b.desc}','info')">
                <div class="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center text-3xl mx-auto shadow-lg">
                  🔒
                </div>
                <div class="text-xs font-black text-zinc-500">${b.name}</div>
                <div class="text-[10px] text-zinc-600 leading-tight">${b.desc}</div>
                <span class="inline-block text-[9px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-wider
                  ${b.rarity==='legendary'?'bg-amber-400/10 text-amber-500/60 border border-amber-400/15':
                    b.rarity==='epic'?'bg-purple-400/10 text-purple-500/60 border border-purple-400/15':
                    'bg-zinc-800/60 text-zinc-600 border border-zinc-700/30'}">
                  ${b.rarity}
                </span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Academy Certificate -->
        <div class="glass rounded-3xl p-5 border border-sky-400/20 space-y-3">
          <h3 class="text-sm font-bold text-white flex items-center gap-2"><span>📜</span> Sertifikat Akademi</h3>
          <div class="glass-subtle rounded-2xl p-4 border border-white/5 flex items-center gap-4">
            <div class="text-4xl flex-shrink-0">🏅</div>
            <div class="flex-1">
              <div class="text-sm font-bold text-white">Sertifikat Partisipasi Musim 2026</div>
              <div class="text-xs text-zinc-400 mt-0.5">YouthTrigger Arena · Kelompok U-16 · Farhan Ramadhan</div>
              <div class="text-[11px] text-zinc-500 mt-1">Diterbitkan: Desember 2026</div>
            </div>
            <button onclick="Utils.showToast('Sertifikat siap diunduh! 📜 (Fitur tersedia akhir musim)','info')"
              class="glass-subtle px-3 py-1.5 rounded-xl text-xs font-bold text-sky-300 border border-sky-400/25 flex-shrink-0">
              Unduh
            </button>
          </div>
        </div>
      </div>
    `;
  }

  /* ================================================================
     9. PENGUMUMAN PAGE
  ================================================================ */
  function renderAnnouncementsPage() {
    const categories = ['Semua','Jadwal','Pertandingan','Turnamen','Evaluasi','Info'];
    const catColors  = { Jadwal:'bg-sky-400/15 text-sky-300 border-sky-400/25', Pertandingan:'bg-lime-400/15 text-lime-300 border-lime-400/25', Turnamen:'bg-amber-400/15 text-amber-300 border-amber-400/25', Evaluasi:'bg-purple-400/15 text-purple-300 border-purple-400/25', Info:'bg-zinc-700/40 text-zinc-400 border-zinc-600/30' };

    return `
      <div class="p-4 sm:p-6 space-y-5 pp-page">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-black text-white">📢 Pengumuman</h2>
            <p class="text-xs text-zinc-400 mt-0.5">${PLAYER_ANNOUNCEMENTS.length} pengumuman · ${PLAYER_ANNOUNCEMENTS.filter(a=>!_readAnn.has(a.id)).length} belum dibaca</p>
          </div>
          <button onclick="PlayerView.markAllRead()"
            class="text-xs text-zinc-400 hover:text-emerald-400 font-semibold transition-colors">Tandai Semua Dibaca</button>
        </div>

        <!-- Pinned -->
        <div>
          <div class="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-3">📌 Penting</div>
          <div class="space-y-3">
            ${PLAYER_ANNOUNCEMENTS.filter(a=>a.pinned).map(a => renderAnnCard(a, catColors)).join('')}
          </div>
        </div>

        <!-- Others -->
        <div>
          <div class="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-3">📋 Lainnya</div>
          <div class="space-y-3">
            ${PLAYER_ANNOUNCEMENTS.filter(a=>!a.pinned).map(a => renderAnnCard(a, catColors)).join('')}
          </div>
        </div>
      </div>
    `;
  }

  function renderAnnCard(a, catColors) {
    const isRead = _readAnn.has(a.id);
    return `
      <div onclick="PlayerView.markRead(${a.id})"
        class="glass rounded-3xl p-4 border ${a.pinned ? 'border-emerald-400/20' : 'border-white/5'} hover:border-emerald-400/20 transition-all cursor-pointer ${isRead ? 'opacity-60' : ''}">
        <div class="flex items-start gap-3">
          ${!isRead ? '<div class="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0 mt-1.5 pulse-dot"></div>' : '<div class="w-2 h-2 rounded-full bg-transparent flex-shrink-0 mt-1.5"></div>'}
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2 flex-wrap mb-1.5">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-lg border ${catColors[a.category] || 'bg-zinc-700/40 text-zinc-400 border-zinc-600/30'}">${a.category}</span>
                ${a.pinned ? '<span class="text-[10px] font-bold text-amber-400">📌</span>' : ''}
              </div>
              <span class="text-[10px] text-zinc-500 flex-shrink-0">${a.date}</span>
            </div>
            <div class="text-sm font-bold text-white">${a.title}</div>
            <p class="text-xs text-zinc-400 mt-1 leading-relaxed">${a.body}</p>
            <div class="text-[11px] text-zinc-600 mt-1.5">— ${a.author}</div>
          </div>
        </div>
      </div>
    `;
  }

  function markRead(id) {
    _readAnn.add(id);
    const c = document.getElementById('pp-content');
    if (c) c.innerHTML = renderAnnouncementsPage();
  }

  function markAllRead() {
    PLAYER_ANNOUNCEMENTS.forEach(a => _readAnn.add(a.id));
    const c = document.getElementById('pp-content');
    if (c) c.innerHTML = renderAnnouncementsPage();
    Utils.showToast('Semua pengumuman ditandai sudah dibaca ✅','success');
  }

  /* ================================================================
     10. PENGATURAN PAGE
  ================================================================ */
  function renderSettingsPage() {
    return `
      <div class="p-4 sm:p-6 space-y-5 pp-page">
        <div>
          <h2 class="text-xl font-black text-white">⚙️ Pengaturan</h2>
          <p class="text-xs text-zinc-400 mt-0.5">Atur akun dan preferensi Player Portal kamu</p>
        </div>

        ${[
          {
            title:'🔐 Keamanan Akun',
            items:[
              { label:'Ubah Password',         desc:'Perbarui kata sandi akun secara rutin untuk keamanan', action:'Ubah',       cb:"Utils.showToast('Form ubah password dibuka 🔐','info')" },
              { label:'Verifikasi 2 Langkah',  desc:'Tambahkan keamanan ekstra untuk melindungi akunmu', action:'Aktifkan',    cb:"Utils.showToast('2FA aktif! Scan QR code di authenticator ✅','success')" },
              { label:'Sesi Login Aktif',       desc:'Lihat perangkat yang sedang login ke akunmu', action:'Lihat',        cb:"Utils.showToast('Riwayat login dimuat 📋','info')" },
            ]
          },
          {
            title:'🔔 Notifikasi',
            items:[
              { label:'Pengingat Jadwal Latihan', desc:'Dapat notifikasi 1 jam sebelum jadwal latihan', toggle:true, default:true  },
              { label:'Info Pertandingan',          desc:'Notifikasi lineup dan jadwal pertandingan',     toggle:true, default:true  },
              { label:'Hasil Evaluasi Baru',        desc:'Notifikasi saat Coach menginput evaluasi kamu', toggle:true, default:true  },
              { label:'Pengumuman Akademi',         desc:'Notifikasi pengumuman dari Admin atau Coach',   toggle:true, default:false },
            ]
          },
          {
            title:'🎨 Tampilan & Preferensi',
            items:[
              { label:'Tema Aplikasi',   desc:'Mode gelap atau terang',     action:'Dark Mode ✓',   cb:"Utils.showToast('Mode gelap aktif 🌑','info')" },
              { label:'Bahasa',          desc:'Bahasa antarmuka aplikasi',   action:'🇮🇩 Indonesia', cb:"Utils.showToast('Bahasa: Bahasa Indonesia ✅','info')" },
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
                    <button onclick="this.classList.toggle('bg-emerald-400'); this.classList.toggle('bg-zinc-700'); this.firstElementChild.classList.toggle('right-0.5'); this.firstElementChild.classList.toggle('left-0.5')"
                      class="w-10 h-5 rounded-full relative flex-shrink-0 transition-colors ${item.default ? 'bg-emerald-400' : 'bg-zinc-700'}">
                      <div class="absolute top-0.5 ${item.default ? 'right-0.5' : 'left-0.5'} w-4 h-4 rounded-full bg-white shadow transition-all"></div>
                    </button>
                  ` : `
                    <button onclick="${item.cb}"
                      class="glass-subtle px-3.5 py-1.5 rounded-xl text-xs font-bold text-zinc-200 border border-white/10 hover:border-emerald-400/40 transition-all flex-shrink-0 whitespace-nowrap">
                      ${item.action}
                    </button>
                  `}
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}

        <!-- Privacy Note (child-friendly) -->
        <div class="glass rounded-3xl p-5 border border-sky-400/15 space-y-2">
          <h3 class="text-sm font-bold text-white flex items-center gap-2"><span>🛡️</span> Privasi & Keamanan Data</h3>
          <div class="text-xs text-zinc-400 leading-relaxed space-y-1.5">
            <p>🔒 Data pribadimu hanya dapat diakses oleh kamu, Coach, dan Admin Akademi yang berwenang.</p>
            <p>📱 Jangan pernah bagikan password akunmu kepada siapapun, termasuk teman-temanmu.</p>
            <p>👨‍👩‍👦 Orang tua/wali dapat memantau perkembanganmu melalui portal khusus wali.</p>
          </div>
        </div>

        <!-- Logout -->
        <button onclick="State.setRole('visitor'); Utils.showToast('Sampai jumpa, ${PLAYER_DATA.nickName}! Terus semangat berlatih! 👋⚽','info')"
          class="w-full py-3 rounded-2xl text-sm font-bold text-red-400 border border-red-400/25 bg-red-400/8 hover:bg-red-400/15 transition-all flex items-center justify-center gap-2">
          <span>🚪</span> Keluar dari Player Portal
        </button>
      </div>
    `;
  }

  /* ================================================================
     COUNTDOWN (legacy + player)
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
     LEGACY COMPAT — keep old public API so app.js / header.js work
  ================================================================ */
  function switchTab(tab) {
    const map = { locker:'dashboard', stats:'development', schedule:'schedule', badges:'achievements' };
    navTo(map[tab] || 'dashboard');
  }
  function toggleMobileSidebar_legacy() { toggleMobileSidebar(); }
  function toggleRightPanel() { Utils.showToast('Gunakan menu sidebar untuk navigasi 👈','info'); }
  function sendMsg() { Utils.showToast('Chat tim tersedia di halaman Dashboard 💬','info'); }
  function handleKey(e) { if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMsg();} }
  function addQuickReaction(emoji) { Utils.showToast(`Reaksi ${emoji} dikirim!`,'success'); }
  function toggleDrillRSVP(id) { _drillDone[id] = !_drillDone[id]; }
  function openAthleteCardModal() { navTo('profile'); }

  /* ================================================================
     PUBLIC API
  ================================================================ */
  return {
    render,
    navTo,
    // Sidebar
    toggleMobileSidebar,
    closeMobileSidebar,
    // Programs
    _markDone,
    // Attendance
    submitIzin,
    // Announcements
    markRead,
    markAllRead,
    // Settings (no-op, handled inline)
    // ── Legacy compat ──
    switchTab,
    sendMsg,
    handleKey,
    addQuickReaction,
    toggleDrillRSVP,
    toggleRightPanel,
    openAthleteCardModal,
    toggleMobileSidebar: toggleMobileSidebar,
  };
})();
