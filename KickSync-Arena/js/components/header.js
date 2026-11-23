/* ============================================================
   YouthTrigger Arena — Header Component with Live Status & 3-Role Switcher
   File: js/components/header.js
   ============================================================ */

const Header = (() => {

  function render() {
    const headerEl = document.getElementById('app-header');
    if (!headerEl) return;

    headerEl.innerHTML = `
      <div class="sticky top-0 z-50 w-full max-w-full px-3 sm:px-6 lg:px-8 py-2 sm:py-2.5 flex items-center justify-between gap-2 lg:gap-4 border-b border-white/10 shadow-lg" style="background:rgba(9,13,22,0.97);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);">

        <!-- ===== LEFT: LOGO & BADGE ===== -->
        <div class="flex items-center gap-2 sm:gap-3 flex-shrink-0 min-w-0">
          <!-- Mobile Menu Hamburger -->
          <button onclick="Header.toggleMobileNav()" aria-label="Buka Menu Navigasi"
            class="lg:hidden w-8 h-8 sm:w-9 sm:h-9 glass rounded-xl flex items-center justify-center text-zinc-300 hover:text-white border border-white/10 flex-shrink-0">
            <span class="text-base sm:text-lg">☰</span>
          </button>

          <!-- Shield Emblem Brand -->
          <div onclick="Header.switchRole('visitor')" class="flex items-center gap-2 cursor-pointer group flex-shrink-0" title="Kembali ke Beranda">
            <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl gradient-lime flex items-center justify-center shadow-lg shadow-lime-500/25 group-hover:scale-105 transition-transform flex-shrink-0">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-zinc-950" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm0 3c3.87 0 7 3.13 7 7s-3.13 7-7 7-7-3.13-7-7 3.13-7 7-7zm0 2.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z"/>
                <circle cx="12" cy="12" r="2.5" fill="#09090b"/>
              </svg>
            </div>
            <div class="leading-none">
              <div class="text-sm sm:text-base font-black text-white tracking-tight flex items-center gap-1">
                <span>YouthTrigger</span>
              </div>
              <div class="text-[9px] sm:text-[11px] font-extrabold text-lime-400 tracking-widest mt-0.5">ARENA</div>
            </div>
          </div>

          <!-- Divider -->
          <div class="hidden sm:block h-6 w-[1px] bg-white/20 mx-1"></div>

          <!-- Tagline Pill -->
          <div class="hidden 2xl:inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass border border-white/10 text-xs text-zinc-300 font-medium">
            <span class="text-sm">⚽</span>
            <span>Digital Locker Room &amp; Academy</span>
          </div>
        </div>

        <!-- ===== CENTER: INSTITUTIONAL DROPDOWN NAVBAR (Matching Image 2) ===== -->
        <nav id="header-nav-container" class="hidden xl:flex items-center gap-0.5 2xl:gap-1.5 text-xs font-semibold">
          
          <!-- 1. Beranda -->
          <div class="relative py-2">
            <button onclick="Header.navigateOrOpen('beranda')" id="nav-item-beranda"
              class="nav-institutional-link active">
              <span>Beranda</span>
            </button>
          </div>

          <!-- 2. Tentang ▾ -->
          <div class="relative group py-2">
            <button onclick="Header.navigateOrOpen('tentang')" id="nav-item-tentang"
              class="nav-institutional-link">
              <span>Tentang</span>
              <svg class="w-3.5 h-3.5 text-zinc-400 group-hover:text-lime-400 transition-transform duration-200 group-hover:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
            <div class="nav-dropdown-menu min-w-[240px]">
              <div onclick="Header.navigateOrOpen('tentang')" class="dropdown-item group/item">
                <div class="flex items-center gap-2.5">
                  <span class="text-lime-400">🛡️</span>
                  <span>Profil &amp; Filosofi Akademi</span>
                </div>
                <span class="text-zinc-600 group-hover/item:text-lime-400 text-xs">▸</span>
              </div>
              <div onclick="Header.navigateOrOpen('tentang')" class="dropdown-item group/item">
                <div class="flex items-center gap-2.5">
                  <span class="text-lime-400">🎯</span>
                  <span>4 Pilar Pembinaan Atlet</span>
                </div>
                <span class="text-zinc-600 group-hover/item:text-lime-400 text-xs">▸</span>
              </div>
              <div onclick="Header.navigateOrOpen('tentang')" class="dropdown-item group/item">
                <div class="flex items-center gap-2.5">
                  <span class="text-lime-400">📜</span>
                  <span>Legalitas Lisensi AFC &amp; PSSI</span>
                </div>
              </div>
              <div class="border-t border-white/10 my-1"></div>
              <div onclick="Header.navigateOrOpen('beranda')" class="dropdown-item group/item">
                <div class="flex items-center gap-2.5">
                  <span class="text-lime-400">🏆</span>
                  <span>Statistik &amp; Capaian Trofi</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 3. Program ▾ -->
          <div class="relative group py-2">
            <button onclick="Header.navigateOrOpen('program')" id="nav-item-program"
              class="nav-institutional-link">
              <span>Program</span>
              <svg class="w-3.5 h-3.5 text-zinc-400 group-hover:text-lime-400 transition-transform duration-200 group-hover:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
            <div class="nav-dropdown-menu min-w-[270px]">
              <div onclick="Header.openProgramModal()" class="dropdown-item group/item">
                <div class="flex items-center gap-2.5">
                  <span class="text-emerald-400">🌱</span>
                  <div>
                    <div class="text-white">Grassroots Foundation</div>
                    <div class="text-[10px] text-zinc-400">Kelompok Usia U-8 &amp; U-10</div>
                  </div>
                </div>
                <span class="text-zinc-600 group-hover/item:text-lime-400 text-xs">▸</span>
              </div>
              <div onclick="Header.openProgramModal()" class="dropdown-item group/item">
                <div class="flex items-center gap-2.5">
                  <span class="text-sky-400">⚡</span>
                  <div>
                    <div class="text-white">Skill Builders</div>
                    <div class="text-[10px] text-zinc-400">Kelompok Usia U-12</div>
                  </div>
                </div>
                <span class="text-zinc-600 group-hover/item:text-lime-400 text-xs">▸</span>
              </div>
              <div onclick="Header.openProgramModal()" class="dropdown-item group/item">
                <div class="flex items-center gap-2.5">
                  <span class="text-indigo-400">📋</span>
                  <div>
                    <div class="text-white">Tactical Squad</div>
                    <div class="text-[10px] text-zinc-400">Kelompok Usia U-14</div>
                  </div>
                </div>
                <span class="text-zinc-600 group-hover/item:text-lime-400 text-xs">▸</span>
              </div>
              <div onclick="Header.openProgramModal()" class="dropdown-item group/item">
                <div class="flex items-center gap-2.5">
                  <span class="text-amber-400">🌟</span>
                  <div>
                    <div class="text-white">Elite Academy Pathway</div>
                    <div class="text-[10px] text-zinc-400">Kelompok Usia U-16 &amp; U-18</div>
                  </div>
                </div>
                <span class="text-zinc-600 group-hover/item:text-lime-400 text-xs">▸</span>
              </div>
              <div class="border-t border-white/10 my-1"></div>
              <div onclick="Header.openProgramModal()" class="dropdown-item group/item text-lime-400 font-bold">
                <div class="flex items-center gap-2.5">
                  <span>📖</span>
                  <span>Detail Kurikulum AFC &amp; PSSI</span>
                </div>
                <span>▸</span>
              </div>
            </div>
          </div>

          <!-- 4. Pelatih ▾ -->
          <div class="relative group py-2">
            <button onclick="Header.navigateOrOpen('pelatih')" id="nav-item-pelatih"
              class="nav-institutional-link">
              <span>Pelatih</span>
              <svg class="w-3.5 h-3.5 text-zinc-400 group-hover:text-lime-400 transition-transform duration-200 group-hover:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
            <div class="nav-dropdown-menu min-w-[260px]">
              <div onclick="Header.navigateOrOpen('pelatih')" class="dropdown-item group/item">
                <div class="flex items-center gap-2.5">
                  <span class="text-amber-400">👨‍💼</span>
                  <div>
                    <div class="text-white">Coach Hendra Saputra</div>
                    <div class="text-[10px] text-amber-300 font-mono">Head Coach · Lisensi AFC A</div>
                  </div>
                </div>
                <span class="text-zinc-600 group-hover/item:text-lime-400 text-xs">▸</span>
              </div>
              <div onclick="Header.navigateOrOpen('pelatih')" class="dropdown-item group/item">
                <div class="flex items-center gap-2.5">
                  <span class="text-lime-400">👨‍🏫</span>
                  <span>Staf Pelatih Berlisensi Nasional</span>
                </div>
              </div>
              <div onclick="Header.navigateOrOpen('pelatih')" class="dropdown-item group/item">
                <div class="flex items-center gap-2.5">
                  <span class="text-rose-400">🩺</span>
                  <span>Tim Medis &amp; Fisioterapi Olahraga</span>
                </div>
              </div>
              <div class="border-t border-white/10 my-1"></div>
              <div onclick="Header.navigateOrOpen('pelatih')" class="dropdown-item group/item text-zinc-400 text-[11px]">
                <div class="flex items-center gap-2.5">
                  <span>⚖️</span>
                  <span>Rasio Ideal 1:10 Pelatih-Siswa</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 5. Fasilitas ▾ -->
          <div class="relative group py-2">
            <button onclick="Header.navigateOrOpen('fasilitas')" id="nav-item-fasilitas"
              class="nav-institutional-link">
              <span>Fasilitas</span>
              <svg class="w-3.5 h-3.5 text-zinc-400 group-hover:text-lime-400 transition-transform duration-200 group-hover:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
            <div class="nav-dropdown-menu min-w-[260px]">
              <div onclick="Header.navigateOrOpen('fasilitas')" class="dropdown-item group/item">
                <div class="flex items-center gap-2.5">
                  <span class="text-emerald-400">🏟️</span>
                  <span>Stadion Utama Rumput Standar FIFA</span>
                </div>
                <span class="text-zinc-600 group-hover/item:text-lime-400 text-xs">▸</span>
              </div>
              <div onclick="Header.navigateOrOpen('fasilitas')" class="dropdown-item group/item">
                <div class="flex items-center gap-2.5">
                  <span class="text-sky-400">🔒</span>
                  <span>Digital Locker Room &amp; Telemetri</span>
                </div>
                <span class="text-zinc-600 group-hover/item:text-lime-400 text-xs">▸</span>
              </div>
              <div onclick="Header.navigateOrOpen('fasilitas')" class="dropdown-item group/item">
                <div class="flex items-center gap-2.5">
                  <span class="text-lime-400">🏋️</span>
                  <span>Athletic Gym &amp; Recovery Center</span>
                </div>
              </div>
              <div onclick="Header.navigateOrOpen('fasilitas')" class="dropdown-item group/item">
                <div class="flex items-center gap-2.5">
                  <span class="text-violet-400">📹</span>
                  <span>Video Tactical Analysis Lab</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 6. Jadwal ▾ -->
          <div class="relative group py-2">
            <button onclick="Header.navigateOrOpen('jadwal')" id="nav-item-jadwal"
              class="nav-institutional-link">
              <span>Jadwal</span>
              <svg class="w-3.5 h-3.5 text-zinc-400 group-hover:text-lime-400 transition-transform duration-200 group-hover:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
            <div class="nav-dropdown-menu min-w-[250px]">
              <div onclick="Header.openJadwalModal()" class="dropdown-item group/item">
                <div class="flex items-center gap-2.5">
                  <span class="text-emerald-400">⚽</span>
                  <span>Kalender Matchday &amp; Tanding</span>
                </div>
                <span class="text-zinc-600 group-hover/item:text-lime-400 text-xs">▸</span>
              </div>
              <div onclick="Header.navigateOrOpen('jadwal')" class="dropdown-item group/item">
                <div class="flex items-center gap-2.5">
                  <span class="text-sky-400">📅</span>
                  <span>Jadwal Latihan Rutin Skuad</span>
                </div>
                <span class="text-zinc-600 group-hover/item:text-lime-400 text-xs">▸</span>
              </div>
              <div onclick="VisitorView.openRegistrationModal()" class="dropdown-item group/item">
                <div class="flex items-center gap-2.5">
                  <span class="text-amber-400">📢</span>
                  <span>Seleksi Terbuka Gelombang 2</span>
                </div>
                <span class="text-zinc-600 group-hover/item:text-lime-400 text-xs">▸</span>
              </div>
              <div class="border-t border-white/10 my-1"></div>
              <div onclick="VisitorView.openAgendaModal()" class="dropdown-item group/item text-lime-400 font-bold">
                <div class="flex items-center gap-2.5">
                  <span>🗓️</span>
                  <span>Agenda &amp; Workshop Terbuka</span>
                </div>
                <span>▸</span>
              </div>
            </div>
          </div>

          <!-- 7. Berita ▾ -->
          <div class="relative group py-2">
            <button onclick="Header.navigateOrOpen('berita')" id="nav-item-berita"
              class="nav-institutional-link">
              <span>Berita</span>
              <svg class="w-3.5 h-3.5 text-zinc-400 group-hover:text-lime-400 transition-transform duration-200 group-hover:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
            <div class="nav-dropdown-menu min-w-[240px]">
              <div onclick="Header.navigateOrOpen('berita')" class="dropdown-item group/item">
                <div class="flex items-center gap-2.5">
                  <span class="text-lime-400">📰</span>
                  <span>Berita &amp; Update Terkini</span>
                </div>
                <span class="text-zinc-600 group-hover/item:text-lime-400 text-xs">▸</span>
              </div>
              <div onclick="Header.openNotificationsModal()" class="dropdown-item group/item">
                <div class="flex items-center gap-2.5">
                  <span class="text-sky-400">📢</span>
                  <span>Pengumuman Resmi Matchday</span>
                </div>
                <span class="text-zinc-600 group-hover/item:text-lime-400 text-xs">▸</span>
              </div>
              <div onclick="Header.navigateOrOpen('berita')" class="dropdown-item group/item">
                <div class="flex items-center gap-2.5">
                  <span class="text-amber-400">🏅</span>
                  <span>Galeri Prestasi &amp; Trofi</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 8. Kontak -->
          <div class="relative py-2">
            <button onclick="Header.navigateOrOpen('kontak')" id="nav-item-kontak"
              class="nav-institutional-link">
              <span>Kontak</span>
            </button>
          </div>

          <!-- 9. PORTAL ▾ (HIGHLIGHTED STYLE MATCHING IMAGE 2) -->
          <div class="relative group py-2">
            <button onclick="Header.openPortalAuth()" id="nav-item-portal"
              class="nav-institutional-link nav-portal-highlight font-black" title="Buka Portal Autentikasi Akademi">
              <span>Portal</span>
              <svg class="w-3.5 h-3.5 text-yellow-400 group-hover:rotate-180 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </button>

            <!-- Dropdown Box (Styled exactly like Image 2) -->
            <div class="nav-dropdown-menu min-w-[270px]">
              <div class="text-[10px] font-black text-yellow-400 px-3 py-1.5 uppercase tracking-wider border-b border-white/10 flex items-center justify-between">
                <span>PORTAL TERINTEGRASI</span>
                <span>⚡ SSO</span>
              </div>

              <!-- Item 1: Akademik / Player -->
              <div onclick="Header.openPortalLogin('player')" class="dropdown-item group/item">
                <div class="flex items-center gap-2.5">
                  <span class="w-6 h-6 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center text-xs font-black">#10</span>
                  <div>
                    <div class="text-white font-bold">Portal Siswa</div>
                    <div class="text-[10px] text-zinc-400 font-mono">Farhan Ramadhan · Telemetri</div>
                  </div>
                </div>
                <span class="text-zinc-500 group-hover/item:text-yellow-400 text-xs font-bold">▸</span>
              </div>

              <!-- Item 2: BPMI / Coach -->
              <div onclick="Header.openPortalLogin('coach')" class="dropdown-item group/item">
                <div class="flex items-center gap-2.5">
                  <span class="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs">👨‍💼</span>
                  <div>
                    <div class="text-white font-bold">Portal Pelatih</div>
                    <div class="text-[10px] text-zinc-400 font-mono">Coach Hendra · Skuad Binaan</div>
                  </div>
                </div>
                <span class="text-zinc-500 group-hover/item:text-yellow-400 text-xs font-bold">▸</span>
              </div>

              <!-- Item 3: Perpus / Admin -->
              <div onclick="Header.openPortalLogin('admin')" class="dropdown-item group/item">
                <div class="flex items-center gap-2.5">
                  <span class="w-6 h-6 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center text-xs font-black">⚡</span>
                  <div>
                    <div class="text-white font-bold">Admin Management</div>
                    <div class="text-[10px] text-zinc-400 font-mono">Super Admin · Pusat Kendali</div>
                  </div>
                </div>
                <span class="text-zinc-500 group-hover/item:text-yellow-400 text-xs font-bold">▸</span>
              </div>

              <div class="border-t border-white/10 my-1"></div>

              <!-- Item 4: Locker Room Discord -->
              <div onclick="Header.openDiscordLockerRoom()" class="dropdown-item group/item">
                <div class="flex items-center gap-2.5">
                  <span class="w-6 h-6 rounded-lg bg-[#5865F2]/20 text-[#5865F2] flex items-center justify-center text-xs">💬</span>
                  <div class="text-zinc-200">Digital Locker Room</div>
                </div>
                <span class="text-zinc-500 group-hover/item:text-yellow-400 text-xs font-bold">▸</span>
              </div>

              <!-- Item 5: Pembayaran SPP -->
              <div onclick="PaymentModule.openPaymentModal()" class="dropdown-item group/item">
                <div class="flex items-center gap-2.5">
                  <span class="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">💳</span>
                  <div class="text-zinc-200">Pembayaran SPP &amp; Finansial</div>
                </div>
                <span class="text-zinc-500 group-hover/item:text-yellow-400 text-xs font-bold">▸</span>
              </div>

              <!-- Item 6: Dokumen / Pendaftaran -->
              <div onclick="Header.openRegisterPage()" class="dropdown-item group/item text-lime-400 font-bold">
                <div class="flex items-center gap-2.5">
                  <span class="w-6 h-6 rounded-lg bg-lime-400/20 text-lime-400 flex items-center justify-center text-xs">📝</span>
                  <div>Pendaftaran Siswa Baru</div>
                </div>
                <span class="text-lime-400 text-xs font-bold">▸</span>
              </div>
            </div>
          </div>

        </nav>

        <!-- ===== RIGHT: STATUS, LOGIN, REGISTER & ROLE ===== -->
        <div class="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          
          <!-- Backend Connection Status Pill (Hidden in Visitor Mode) -->
          <div onclick="Header.openBackendModal()" id="backend-status-pill"
            style="display: none;"
            class="items-center gap-1.5 glass rounded-full px-2.5 py-1 cursor-pointer border border-white/15 hover:border-lime-400/50 transition-all"
            title="Klik untuk info koneksi backend API REST">
            <div id="backend-dot" class="w-2 h-2 rounded-full bg-amber-400 pulse-dot"></div>
            <span id="backend-text" class="text-[11px] font-semibold text-zinc-300">API: Standby</span>
          </div>

          <!-- Notification Bell (Hidden in Visitor Mode) -->
          <button onclick="Header.openNotificationsModal()" id="header-notif-btn" aria-label="Buka Notifikasi"
            style="display: none;"
            class="w-9 h-9 glass rounded-xl items-center justify-center text-zinc-300 hover:text-white transition-colors relative border border-white/10">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0113 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-lime-400 rounded-full animate-pulse"></span>
          </button>

          <!-- Discord Locker Room Pill (Hidden in Visitor Mode) -->
          <button onclick="Header.openDiscordLockerRoom()" id="header-locker-btn" aria-label="Buka Discord Locker Room" title="Buka Discord Locker Room & Pesan Khusus"
            style="display: none;"
            class="items-center gap-1.5 glass hover:border-[#5865F2] hover:bg-[#5865F2]/15 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold text-white transition-all border border-white/10 group">
            <span class="text-sm">💬</span>
            <span class="hidden sm:inline text-zinc-200 group-hover:text-white">Locker</span>
            <span class="w-1.5 h-1.5 rounded-full bg-[#23a55a] animate-pulse"></span>
          </button>

          <!-- Login Button (Hidden in Visitor Mode as Portal handles login) -->
          <button onclick="Header.openLoginModal()" id="header-login-btn"
            style="display: none;"
            class="glass hover:bg-white/10 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white items-center gap-1.5 border border-white/20 transition-all">
            <span>🔑</span>
            <span>Masuk</span>
          </button>

          <!-- Quick Register CTA Button (Shown for Visitor) -->
          <button onclick="Header.openRegisterPage()" id="header-register-btn"
            class="flex btn-lime-glow px-4 py-2 rounded-xl text-xs font-black text-zinc-950 items-center gap-1.5 shadow-md hover:scale-105 transition-transform">
            <span>Daftar Siswa Baru</span>
            <span class="text-xs">→</span>
          </button>

          <!-- User Role Avatar Dropdown Trigger -->
          <div class="relative">
            <button onclick="Header.toggleRoleDropdown()" id="user-avatar-btn"
              class="flex items-center gap-1.5 sm:gap-2 glass px-2 sm:px-2.5 py-1.5 rounded-xl border border-white/10 hover:border-lime-400/50 transition-all">
              <div id="header-avatar-circle" class="w-7 h-7 rounded-full bg-zinc-200 text-zinc-950 flex items-center justify-center font-bold text-xs select-none">
                👁️
              </div>
              <div class="hidden md:block text-left">
                <div id="header-role-label" class="text-xs font-bold text-white leading-tight">Pengunjung</div>
                <div class="text-[10px] text-lime-400 leading-tight">Ganti Role ▾</div>
              </div>
            </button>

            <!-- Role Switcher Popover -->
            <div id="role-dropdown" class="hidden absolute right-0 mt-2 w-60 glass-stronger rounded-2xl border border-white/15 p-2 shadow-2xl z-50">
              <div class="text-[10px] font-bold text-zinc-400 px-3 py-1.5 uppercase tracking-wider">Akses Portal Akademi:</div>
              <button onclick="Header.switchRole('visitor'); Header.toggleRoleDropdown()"
                class="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-white hover:bg-white/10 flex items-center gap-2.5">
                <span class="w-6 h-6 rounded-lg bg-zinc-800 flex items-center justify-center text-sm">👁️</span>
                <div>
                  <div class="font-bold">Pengunjung / Publik</div>
                  <div class="text-[10px] text-zinc-400">Portal Website &amp; Pendaftaran</div>
                </div>
              </button>
              <button onclick="Header.openPortalLogin('player'); Header.toggleRoleDropdown()"
                class="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-emerald-300 hover:bg-emerald-400/10 flex items-center gap-2.5">
                <span class="w-6 h-6 rounded-lg bg-sky-500/20 text-sky-300 flex items-center justify-center text-sm font-black">#10</span>
                <div>
                  <div class="font-bold">Siswa (Farhan Ramadhan)</div>
                  <div class="text-[10px] text-zinc-400">Player Portal &amp; Telemetri</div>
                </div>
              </button>
              <button onclick="Header.openPortalLogin('coach'); Header.toggleRoleDropdown()"
                class="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-amber-300 hover:bg-amber-400/10 flex items-center gap-2.5">
                <span class="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center text-sm">👨‍💼</span>
                <div>
                  <div class="font-bold">Pelatih (Coach Hendra)</div>
                  <div class="text-[10px] text-zinc-400">Coach Portal &amp; Skuad Binaan</div>
                </div>
              </button>
              <button onclick="Header.openPortalLogin('admin'); Header.toggleRoleDropdown()"
                class="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-violet-300 hover:bg-violet-400/10 flex items-center gap-2.5">
                <span class="w-6 h-6 rounded-lg bg-violet-500/20 text-violet-300 flex items-center justify-center text-sm">⚡</span>
                <div>
                  <div class="font-bold">Admin Management Portal</div>
                  <div class="text-[10px] text-zinc-400">Pusat Kendali &amp; Super Admin</div>
                </div>
              </button>
            </div>
          </div>
        </div>

      </div>

      <!-- Mobile Navigation Drawer -->
      <div id="mobile-nav-drawer" class="hidden lg:hidden glass-stronger border-b border-white/15 px-4 py-3 space-y-2">
        <div class="text-[11px] font-bold text-zinc-400 px-3 uppercase tracking-wider">Halaman Publik:</div>
        <div class="grid grid-cols-2 gap-1.5">
          <button onclick="Header.navigateOrOpen('beranda'); Header.toggleMobileNav()" class="text-left px-3 py-2 rounded-xl text-xs font-bold text-lime-400 flex items-center gap-2 bg-white/5">
            <span>🏠</span> Beranda
          </button>
          <button onclick="Header.navigateOrOpen('tentang'); Header.toggleMobileNav()" class="text-left px-3 py-2 rounded-xl text-xs font-semibold text-zinc-200 flex items-center gap-2 hover:bg-white/5">
            <span>🛡️</span> Tentang
          </button>
          <button onclick="Header.navigateOrOpen('program'); Header.toggleMobileNav()" class="text-left px-3 py-2 rounded-xl text-xs font-semibold text-zinc-200 flex items-center gap-2 hover:bg-white/5">
            <span>⚽</span> Program
          </button>
          <button onclick="Header.navigateOrOpen('pelatih'); Header.toggleMobileNav()" class="text-left px-3 py-2 rounded-xl text-xs font-semibold text-zinc-200 flex items-center gap-2 hover:bg-white/5">
            <span>👨‍🏫</span> Pelatih
          </button>
          <button onclick="Header.navigateOrOpen('fasilitas'); Header.toggleMobileNav()" class="text-left px-3 py-2 rounded-xl text-xs font-semibold text-zinc-200 flex items-center gap-2 hover:bg-white/5">
            <span>🏟️</span> Fasilitas
          </button>
          <button onclick="Header.navigateOrOpen('jadwal'); Header.toggleMobileNav()" class="text-left px-3 py-2 rounded-xl text-xs font-semibold text-zinc-200 flex items-center gap-2 hover:bg-white/5">
            <span>📅</span> Jadwal
          </button>
          <button onclick="Header.navigateOrOpen('berita'); Header.toggleMobileNav()" class="text-left px-3 py-2 rounded-xl text-xs font-semibold text-zinc-200 flex items-center gap-2 hover:bg-white/5">
            <span>📰</span> Berita
          </button>
          <button onclick="Header.navigateOrOpen('kontak'); Header.toggleMobileNav()" class="text-left px-3 py-2 rounded-xl text-xs font-semibold text-zinc-200 flex items-center gap-2 hover:bg-white/5">
            <span>📞</span> Kontak
          </button>
        </div>

        <div class="border-t border-white/10 pt-2 flex items-center gap-2">
          <button onclick="Header.openLoginModal(); Header.toggleMobileNav();" class="flex-1 glass py-2 rounded-xl text-xs font-bold text-white text-center border border-white/15">
            🔑 Masuk
          </button>
          <button onclick="Header.openRegisterPage(); Header.toggleMobileNav();" class="flex-1 btn-lime-glow py-2 rounded-xl text-xs font-black text-zinc-950 text-center">
            👤+ Daftar Baru
          </button>
        </div>
        
        <div class="border-t border-white/10 pt-2 text-[11px] font-bold text-zinc-400 px-3 uppercase tracking-wider">Fitur Utama &amp; Komunikasi:</div>
        <button onclick="Header.openDiscordLockerRoom(); Header.toggleMobileNav()" class="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-white flex items-center justify-between bg-[#5865F2]/20 border border-[#5865F2]/30 hover:bg-[#5865F2]/30 transition-all">
          <span class="flex items-center gap-2"><span>💬</span> Discord Locker Room (Pesan Khusus &amp; Tim)</span>
          <span class="w-2 h-2 rounded-full bg-[#23a55a] animate-pulse"></span>
        </button>

        <div class="border-t border-white/10 pt-2 text-[11px] font-bold text-zinc-400 px-3 uppercase tracking-wider">Akses Portal Sesuai Role:</div>
        <button onclick="Header.openPortalLogin('player'); Header.toggleMobileNav()" class="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-emerald-300 flex items-center gap-2.5 hover:bg-emerald-400/10">
          <span>⚽</span> Portal Siswa (Farhan Ramadhan #10)
        </button>
        <button onclick="Header.openPortalLogin('coach'); Header.toggleMobileNav()" class="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-amber-300 flex items-center gap-2.5 hover:bg-amber-400/10">
          <span>👨‍💼</span> Portal Pelatih (Coach Hendra)
        </button>
        <button onclick="Header.openPortalLogin('admin'); Header.toggleMobileNav()" class="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-violet-300 flex items-center gap-2.5 hover:bg-violet-400/10">
          <span>⚡</span> Admin Management Portal (Super Admin)
        </button>
        
        <div class="border-t border-white/10 pt-2"></div>
        <button onclick="Header.openBackendModal(); Header.toggleMobileNav()" class="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-lime-300 flex items-center gap-2.5 hover:bg-white/5">
          <span>⚙️</span> Info Status Backend REST API (Port 3000)
        </button>
      </div>
    `;

    // Hook backend status listener
    if (typeof API !== 'undefined' && API.onStatusChange) {
      API.onStatusChange(updateBackendPill);
      updateBackendPill(API.isOnline, API.healthData);
    }

    // Initialize header visibility based on current role
    syncHeaderForRole((typeof State !== 'undefined' && State.role) ? State.role : 'visitor');
  }

  function syncHeaderForRole(roleId) {
    const isVisitor = (roleId === 'visitor');
    const headerEl = document.getElementById('app-header');

    if (headerEl) {
      headerEl.style.display = isVisitor ? 'block' : 'none';
    }

    const backendPill = document.getElementById('backend-status-pill');
    const notifBtn = document.getElementById('header-notif-btn');
    const lockerBtn = document.getElementById('header-locker-btn');
    const loginBtn = document.getElementById('header-login-btn');
    const registerBtn = document.getElementById('header-register-btn');

    if (backendPill) {
      backendPill.style.display = isVisitor ? 'none' : 'flex';
    }
    if (notifBtn) {
      notifBtn.style.display = isVisitor ? 'none' : 'flex';
    }
    if (lockerBtn) {
      lockerBtn.style.display = isVisitor ? 'none' : 'flex';
    }
    if (loginBtn) {
      loginBtn.style.display = 'none'; // Login is done through Portal dropdown
    }
    if (registerBtn) {
      registerBtn.style.display = isVisitor ? 'flex' : 'none';
    }
  }

  function updateBackendPill(isOnline, healthData) {
    const dot = document.getElementById('backend-dot');
    const text = document.getElementById('backend-text');
    const pill = document.getElementById('backend-status-pill');
    if (!dot || !text) return;

    if (isOnline) {
      dot.className = 'w-2 h-2 rounded-full bg-emerald-400 pulse-dot';
      text.textContent = 'API: Online';
      text.className = 'text-xs font-bold text-emerald-300';
      if (pill) pill.className = 'items-center gap-1.5 glass rounded-full px-3 py-1 cursor-pointer border border-emerald-400/40 shadow-sm shadow-emerald-500/20';
    } else {
      dot.className = 'w-2 h-2 rounded-full bg-amber-400 pulse-dot';
      text.textContent = 'API: Standby';
      text.className = 'text-xs font-semibold text-amber-300';
      if (pill) pill.className = 'items-center gap-1.5 glass rounded-full px-3 py-1 cursor-pointer border border-amber-400/30';
    }

    const curRole = (typeof State !== 'undefined' && State.role) ? State.role : 'visitor';
    if (pill) {
      pill.style.display = curRole === 'visitor' ? 'none' : 'flex';
    }
  }

  function toggleRoleDropdown() {
    const el = document.getElementById('role-dropdown');
    if (el) el.classList.toggle('hidden');
  }

  function toggleMobileNav() {
    const role = (typeof State !== 'undefined' && State.role) ? State.role : 'visitor';
    if (role === 'player' && typeof PlayerView !== 'undefined' && PlayerView.toggleMobileSidebar) {
      PlayerView.toggleMobileSidebar();
      return;
    }
    if (role === 'coach' && typeof CoachView !== 'undefined' && CoachView.toggleMobileSidebar) {
      CoachView.toggleMobileSidebar();
      return;
    }
    if (role === 'admin' && typeof AdminView !== 'undefined' && AdminView.toggleMobileAdminMenu) {
      AdminView.toggleMobileAdminMenu();
      return;
    }
    const el = document.getElementById('mobile-nav-drawer');
    if (el) el.classList.toggle('hidden');
  }

  function navigateOrOpen(sectionId) {
    if (State.role !== 'visitor') {
      switchRole('visitor');
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 100);
    } else {
      scrollToSection(sectionId);
    }
  }

  function scrollToSection(id) {
    const view = document.getElementById('app-view');
    const target = document.getElementById(id);
    if (view && target) {
      view.scrollTo({ top: target.offsetTop - 12, behavior: 'smooth' });
    } else if (id === 'program') {
      openProgramModal();
    }
  }

  function switchRole(roleId) {
    const navBeranda = document.getElementById('nav-item-beranda');
    const navPortal = document.getElementById('nav-item-portal');

    if (navBeranda) {
      if (roleId === 'visitor') {
        navBeranda.classList.add('active');
      } else {
        navBeranda.classList.remove('active');
      }
    }

    if (navPortal) {
      if (roleId !== 'visitor') {
        navPortal.classList.add('active');
      } else {
        navPortal.classList.remove('active');
      }
    }

    const label = document.getElementById('header-role-label');
    const circle = document.getElementById('header-avatar-circle');
    if (label && circle) {
      if (roleId === 'visitor') {
        label.textContent = 'Pengunjung';
        circle.textContent = '👁️';
        circle.className = 'w-7 h-7 rounded-full bg-zinc-200 text-zinc-950 flex items-center justify-center font-bold text-xs';
      } else if (roleId === 'player') {
        label.textContent = 'Farhan (#10)';
        circle.textContent = 'FR';
        circle.className = 'w-7 h-7 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold text-xs online-ring';
      } else if (roleId === 'coach') {
        label.textContent = 'Coach Hendra';
        circle.textContent = 'CH';
        circle.className = 'w-7 h-7 rounded-full bg-amber-400 text-zinc-950 flex items-center justify-center font-bold text-xs online-ring';
      } else if (roleId === 'admin') {
        label.textContent = 'Super Admin';
        circle.textContent = '⚡';
        circle.className = 'w-7 h-7 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold text-xs online-ring';
      }
    }

    syncHeaderForRole(roleId);
    State.setRole(roleId);
  }

  function openPortalLogin(role) {
    if (typeof AuthView !== 'undefined') {
      const screenMap = {
        player: 'login-player',
        coach: 'login-coach',
        admin: 'login-admin',
      };
      AuthView.render({ screen: screenMap[role] || 'role-select' });
    } else {
      switchRole(role);
    }
  }

  function openPortalAuth() {
    if (typeof AuthView !== 'undefined') {
      AuthView.render({ screen: 'role-select' });
    }
  }

  function openLoginModal() {
    if (typeof AuthView !== 'undefined') {
      AuthView.render({ tab: 'login' });
    }
  }

  function openRegisterPage() {
    if (typeof AuthView !== 'undefined') {
      AuthView.render({ tab: 'register' });
    }
  }

  function openBackendModal() {
    const isOnline = API.isOnline;
    const health = API.healthData;

    Utils.openModal(`
      <div class="space-y-4">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl ${isOnline ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-400/20 text-amber-300'} flex items-center justify-center text-xl font-bold shadow-md">
            <span>⚙️</span>
          </div>
          <div>
            <h3 class="text-lg font-bold text-white">Status Koneksi Backend REST API</h3>
            <p class="text-xs text-zinc-400">Youth Tiger &amp; YouthTrigger Soccer School Backend</p>
          </div>
        </div>

        <div class="glass rounded-xl p-3.5 border ${isOnline ? 'border-emerald-400/30' : 'border-amber-400/30'} space-y-2 text-xs">
          <div class="flex items-center justify-between">
            <span class="text-zinc-400">Status Server:</span>
            <span class="font-bold ${isOnline ? 'text-emerald-400' : 'text-amber-300'}">
              ${isOnline ? '● ONLINE &amp; TERHUBUNG' : '○ STANDBY (Auto Local Fallback Aktif)'}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-zinc-400">Target Base URL:</span>
            <span class="font-mono text-white">${API.baseUrl}</span>
          </div>
          ${health ? `
            <div class="flex items-center justify-between">
              <span class="text-zinc-400">Database Engine:</span>
              <span class="font-bold text-lime-400">${health.database?.mode === 'mysql' ? 'MySQL Pool (Port 3306)' : 'In-Memory Resilient Store'}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-zinc-400">Versi Backend:</span>
              <span class="text-zinc-300">${health.version}</span>
            </div>
          ` : ''}
        </div>

        <!-- Action / Instruction -->
        <div class="glass rounded-xl p-3 text-xs text-zinc-300 space-y-2 border border-white/5">
          <div class="font-bold text-white flex items-center gap-1.5">
            <span>🚀</span> Cara Menjalankan Backend:
          </div>
          <p class="text-zinc-400">
            Jalankan file <strong>start-backend.bat</strong> yang ada di folder proyek atau jalankan perintah di terminal:
          </p>
          <div class="bg-zinc-950 p-2.5 rounded-lg font-mono text-[11px] text-emerald-400 select-all border border-white/10">
            cd "Youth-Tiger-Soccer-School-back-end-" &amp;&amp; npm start
          </div>
        </div>

        ${isOnline ? `
          <div class="grid grid-cols-2 gap-2 text-xs">
            <a href="http://localhost:3000/api-docs" target="_blank" class="p-2.5 glass rounded-xl text-center text-lime-400 font-bold hover:bg-white/10 transition-all border border-lime-400/30">
              📖 Buka Swagger Docs →
            </a>
            <a href="http://localhost:3000/api/health" target="_blank" class="p-2.5 glass rounded-xl text-center text-sky-400 font-bold hover:bg-white/10 transition-all border border-sky-400/30">
              💓 Buka Health JSON →
            </a>
          </div>
        ` : ''}

        <div class="flex items-center gap-2 pt-1">
          <button onclick="Header.retestBackend()" class="btn-lime-glow flex-1 py-2.5 rounded-xl font-bold text-xs text-zinc-950">
            🔄 Test Ulang Koneksi Backend
          </button>
          <button onclick="Utils.closeModal()" class="px-4 py-2.5 glass rounded-xl text-xs text-zinc-400 hover:text-white">
            Tutup
          </button>
        </div>
      </div>
    `);
  }

  async function retestBackend() {
    Utils.showToast('Memeriksa koneksi ke http://localhost:3000/api/health...', 'info');
    const result = await API.checkHealth();
    if (result.online) {
      Utils.showToast('Berhasil terhubung ke Backend Server (Port 3000)! 🚀', 'success');
    } else {
      Utils.showToast('Backend belum aktif di port 3000. Mode offline resilient tetap aktif dengan mulus.', 'warning');
    }
    openBackendModal();
  }

  function openProgramModal() {
    Utils.openModal(`
      <div class="space-y-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl gradient-lime flex items-center justify-center text-xl text-zinc-950 font-black">⚽</div>
          <div>
            <h3 class="text-lg font-bold text-white">Program Pembinaan Sepak Bola</h3>
            <p class="text-xs text-zinc-400">Kurikulum Lisensi AFC Grassroots &amp; Youth Development</p>
          </div>
        </div>
        <div class="space-y-2.5 text-xs">
          <div class="glass rounded-xl p-3 border border-white/5">
            <div class="flex items-center justify-between mb-1">
              <span class="font-bold text-lime-400 text-sm">Grassroots Foundation (U-8 &amp; U-10)</span>
              <span class="text-zinc-400">2x Sesi / Minggu</span>
            </div>
            <p class="text-zinc-300">Penguasaan bola dasar, koordinasi gerak motorik, kegembiraan bermain (fun football), dan menumbuhkan rasa percaya diri.</p>
          </div>

          <div class="glass rounded-xl p-3 border border-emerald-400/20">
            <div class="flex items-center justify-between mb-1">
              <span class="font-bold text-emerald-400 text-sm">Skill Builders (U-12)</span>
              <span class="text-zinc-400">3x Sesi / Minggu</span>
            </div>
            <p class="text-zinc-300">Pengasahan teknik dribbling, first-touch passing, akurasi shooting, serta pemahaman peran posisi di lapangan hijau.</p>
          </div>

          <div class="glass rounded-xl p-3 border border-sky-400/20">
            <div class="flex items-center justify-between mb-1">
              <span class="font-bold text-sky-400 text-sm">Tactical Squad (U-14)</span>
              <span class="text-zinc-400">3x Sesi + Match</span>
            </div>
            <p class="text-zinc-300">Formasi 4-3-3 modern, transisi cepat bertahan-menyerang, set-piece tactical, serta penguatan fisik terstruktur.</p>
          </div>

          <div class="glass rounded-xl p-3 border border-amber-400/20">
            <div class="flex items-center justify-between mb-1">
              <span class="font-bold text-amber-400 text-sm">Elite Academy Pathway (U-16 &amp; U-18)</span>
              <span class="text-zinc-400">4x Sesi + Analisis Video</span>
            </div>
            <p class="text-zinc-300">Persiapan kejuaraan liga pro, telemetri performa, program gym atletik, dan rekomendasi scouting klub nasional.</p>
          </div>
        </div>
        <button onclick="Utils.closeModal(); VisitorView.openRegistrationModal()" class="w-full btn-lime-glow py-2.5 rounded-xl font-bold text-zinc-950 text-xs shadow-lg">
          Daftar Siswa Baru Sekarang →
        </button>
      </div>
    `);
  }

  function openJadwalModal() {
    Utils.openModal(`
      <div class="space-y-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xl font-bold">📅</div>
          <div>
            <h3 class="text-lg font-bold text-white">Jadwal Tanding &amp; Agenda Seleksi</h3>
            <p class="text-xs text-zinc-400">Musim Kompetisi 2026/2027</p>
          </div>
        </div>
        <div class="space-y-2 text-xs">
          ${PUBLIC_FIXTURES.map(f => `
            <div class="glass rounded-xl p-3 flex items-center justify-between border border-white/5 hover:border-lime-400/30 transition-all">
              <div>
                <span class="text-lime-400 font-bold">${f.squad}</span> · <span class="text-white font-semibold">${f.homeShort} vs ${f.awayShort}</span>
                <div class="text-zinc-400 text-[11px] mt-0.5">${f.date} · ${f.time} (${f.venue})</div>
              </div>
              <span class="text-xs text-emerald-300 glass px-2 py-1 rounded font-medium border border-emerald-400/20">${f.type}</span>
            </div>
          `).join('')}
        </div>
        <button onclick="Utils.closeModal()" class="w-full btn-lime-glow py-2.5 rounded-xl font-bold text-zinc-950 text-xs">Tutup</button>
      </div>
    `);
  }

  function openNotificationsModal() {
    Utils.openModal(`
      <div class="space-y-3">
        <h3 class="text-base font-bold text-white flex items-center gap-2">
          <span>🔔</span> Notifikasi &amp; Pengumuman Akademi
        </h3>
        <div class="space-y-2 text-xs">
          <div class="glass rounded-xl p-3 border-l-2 border-lime-400">
            <span class="text-lime-400 font-bold">Matchday Sabtu Dikonfirmasi</span>
            <p class="text-zinc-300 mt-0.5">Kickoff laga U-16 YouthTrigger Arena vs Garuda Muda FC berlangsung pukul 16:00 WIB di Stadion Patriot.</p>
          </div>
          <div class="glass rounded-xl p-3 border-l-2 border-emerald-400">
            <span class="text-emerald-400 font-bold">Seleksi Gelombang 2 Dibuka</span>
            <p class="text-zinc-300 mt-0.5">Pendaftaran online dibuka untuk kelompok umur U-10, U-14, U-16, dan U-18.</p>
          </div>
          <div class="glass rounded-xl p-3 border-l-2 border-sky-400">
            <span class="text-sky-400 font-bold">Papan Taktik 4-3-3 Telah Diunggah</span>
            <p class="text-zinc-300 mt-0.5">Head Coach Hendra menyematkan strategi Gegenpressing di Digital Locker Room.</p>
          </div>
        </div>
        <button onclick="Utils.closeModal()" class="w-full btn-lime-glow py-2.5 rounded-xl font-bold text-zinc-950 text-xs">Tutup</button>
      </div>
    `);
  }

  function openDiscordLockerRoom() {
    const curRole = State.role;
    if (curRole === 'player') {
      if (typeof PlayerView !== 'undefined') PlayerView.navTo('messages');
    } else if (curRole === 'coach') {
      if (typeof CoachView !== 'undefined') CoachView.navTo('messages');
    } else {
      switchRole('player');
      setTimeout(() => {
        if (typeof PlayerView !== 'undefined') PlayerView.navTo('messages');
      }, 100);
    }
  }

  return {
    render,
    switchRole,
    navigateOrOpen,
    toggleRoleDropdown,
    toggleMobileNav,
    openPortalLogin,
    openPortalAuth,
    openBackendModal,
    retestBackend,
    openProgramModal,
    openJadwalModal,
    openNotificationsModal,
    openLoginModal,
    openRegisterPage,
    openDiscordLockerRoom,
    syncHeaderForRole,
  };
})();
