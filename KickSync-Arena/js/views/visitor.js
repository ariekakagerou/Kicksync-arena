/* ============================================================
   YouthTrigger Arena — VISITOR VIEW (Public Portal v4.0)
   Website Resmi, Informasi Akademi & Pendaftaran Siswa Baru
   File: js/views/visitor.js
   ============================================================ */

const VisitorView = (() => {

  const CONFIG = {
    stats: [
      { label: 'Siswa Aktif Binaan', value: 300, suffix: '+' },
      { label: 'Pelatih Berlisensi AFC/PSSI', value: 18, suffix: '' },
      { label: 'Trofi Kejuaraan', value: 25, suffix: '' },
      { label: 'Alumni ke Klub Pro & EPA', value: 40, suffix: '+' },
    ],
    selectionDate: '2026-11-22T08:00:00+07:00',
    selectionLabel: 'Seleksi Terbuka Gelombang 2',
    agenda: [
      {
        color: 'lime',
        title: 'Seleksi Terbuka Gelombang 2',
        date: '2026-11-22T08:00:00+07:00',
        dateLabel: 'Sabtu, 22 Nov 2026',
        venue: 'Stadion Utama YouthTrigger Arena',
        desc: 'Uji fisik, kelincahan bola, dan mini tournament untuk calon atlet usia 8-18 tahun.',
      },
      {
        color: 'emerald',
        title: 'Workshop Nutrisi Atlet Muda & Parenting',
        date: '2026-11-30T09:00:00+07:00',
        dateLabel: 'Minggu, 30 Nov 2026',
        venue: 'Auditorium YouthTrigger Complex',
        desc: 'Sesi edukasi pola makan, hidrasi atletik, dan pendampingan mental atlet bersama dokter spesialis olahraga.',
      },
      {
        color: 'sky',
        title: 'YouthTrigger Youth Championship 2026',
        date: '2026-12-12T08:00:00+07:00',
        dateLabel: '12 – 14 Des 2026',
        venue: 'Stadion Patriot Candrabhaga, Bekasi',
        desc: 'Kejuaraan bergengsi mengundang 16 akademi sepak bola terbaik se-Jabodetabek & Jawa Barat.',
      },
    ],
  };

  let countdownTimer = null;

  const esc = (s) => String(s || '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

  /* ================================================================
     MAIN RENDER FUNCTION
  ================================================================ */
  function render(container) {
    stopTimers();

    container.innerHTML = `
      <div class="relative w-full overflow-x-hidden bg-zinc-950 text-zinc-100">

        <!-- ================= 1. HERO SECTION ================= -->
        <section id="beranda" class="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-white/10">
          
          <!-- Background Visuals -->
          <div class="absolute inset-0 z-0">
            <img src="assets/hero-bg.jpg" alt="YouthTrigger Arena Stadium"
              onerror="this.style.display='none'"
              class="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.38] contrast-[1.1] scale-105"/>
            <div class="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/85 to-zinc-950/40"></div>
            <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent"></div>
            <div class="absolute inset-0 pitch-lines opacity-75"></div>
            <div class="absolute -top-32 -left-32 w-[32rem] h-[32rem] rounded-full bg-lime-500/15 blur-3xl pointer-events-none"></div>
            <div class="absolute top-48 right-0 w-[28rem] h-[28rem] rounded-full bg-emerald-500/15 blur-3xl pointer-events-none"></div>
          </div>

          <!-- Hero Content -->
          <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">

              <!-- Kiri: Headline & CTA -->
              <div class="lg:col-span-7 space-y-5 sm:space-y-6 text-left min-w-0 max-w-full">
                
                <!-- Badge Promo -->
                <div class="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full glass border border-lime-400/40 text-[11px] sm:text-sm font-bold text-white shadow-lg max-w-full">
                  <span class="relative flex w-2 h-2 flex-shrink-0">
                    <span class="absolute inset-0 rounded-full bg-lime-400 animate-ping"></span>
                    <span class="relative w-2 h-2 rounded-full bg-lime-400"></span>
                  </span>
                  <span class="truncate">Pendaftaran Siswa Baru Musim 2026/2027 Dibuka</span>
                </div>

                <!-- Main Title -->
                <div class="space-y-2">
                  <h1 class="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white tracking-tight leading-[1.1]">
                    Tempa Karakter &amp;<br/>
                    Bakat <span class="text-gradient drop-shadow-[0_0_35px_rgba(163,230,53,0.45)]">Sepak Bola</span><br/>
                    Sejak Usia Dini
                  </h1>
                  <div class="flex items-center gap-1.5 sm:gap-2 pt-1" aria-hidden="true">
                    <span class="w-6 sm:w-8 h-1.5 bg-lime-400 -skew-x-12 rounded-sm shadow-[0_0_10px_#a3e635]"></span>
                    <span class="w-6 sm:w-8 h-1.5 bg-lime-400/70 -skew-x-12 rounded-sm shadow-[0_0_10px_#a3e635]"></span>
                    <span class="w-6 sm:w-8 h-1.5 bg-lime-400/40 -skew-x-12 rounded-sm shadow-[0_0_10px_#a3e635]"></span>
                  </div>
                </div>

                <!-- Subtitle -->
                <p class="text-zinc-300 text-xs sm:text-base lg:text-lg max-w-xl leading-relaxed">
                  Sekolah sepak bola modern berlisensi AFC &amp; PSSI yang memadukan pelatihan lapangan berstandar tinggi dengan 
                  <strong class="text-white font-bold">Digital Locker Room</strong> untuk memantau performa, absensi, dan grafik perkembangan anak Anda secara real-time.
                </p>

                <!-- CTA Action Buttons -->
                <div class="flex items-stretch sm:items-center gap-2.5 sm:gap-3.5 flex-col sm:flex-row pt-2">
                  <button onclick="AuthView.render({ tab: 'register' })"
                    class="btn-lime-glow px-6 sm:px-7 py-3 sm:py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 shadow-xl w-full sm:w-auto">
                    <span class="text-base">👤+</span>
                    <span>Daftar Siswa Baru</span>
                    <span class="text-base font-bold">→</span>
                  </button>
                  <a href="#program" data-scroll
                    class="glass px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl font-bold text-sm text-white hover:bg-white/10 border border-white/20 transition-all flex items-center justify-center gap-2 shadow-lg w-full sm:w-auto">
                    <span>Lihat Kurikulum Program</span>
                    <span>▾</span>
                  </a>
                  <button onclick="AuthView.render({ tab: 'login' })"
                    class="glass px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl font-bold text-sm text-zinc-300 hover:text-white hover:bg-white/10 border border-white/15 transition-all text-center w-full sm:w-auto">
                    <span>🔑 Masuk Akun Portal</span>
                  </button>
                </div>

                <!-- Quick Role Preview Toggles -->
                <div class="flex items-center gap-1.5 sm:gap-2.5 flex-wrap pt-1 text-xs">
                  <span class="text-zinc-400 font-semibold w-full sm:w-auto mb-1 sm:mb-0">Coba Portal Sesuai Role:</span>
                  <button onclick="Header.openPortalLogin('coach');"
                    class="glass px-3 py-1.5 rounded-xl font-bold text-amber-300 hover:bg-amber-400/15 border border-amber-400/40 transition-all flex items-center gap-1.5 text-xs">
                    <span>👨‍💼 Pelatih</span>
                  </button>
                  <button onclick="Header.openPortalLogin('player');"
                    class="glass px-3 py-1.5 rounded-xl font-bold text-emerald-300 hover:bg-emerald-400/15 border border-emerald-400/40 transition-all flex items-center gap-1.5 text-xs">
                    <span>⚽ Siswa (#10)</span>
                  </button>
                  <button onclick="Header.openPortalLogin('admin');"
                    class="glass px-3 py-1.5 rounded-xl font-bold text-violet-300 hover:bg-violet-400/15 border border-violet-400/40 transition-all flex items-center gap-1.5 text-xs">
                    <span>⚡ Super Admin</span>
                  </button>
                </div>

              </div>

              <!-- Kanan: FUT Hologram Card & Countdown -->
              <div class="lg:col-span-5 flex flex-col items-center">
                
                <!-- FUT Authentic Shield Card Showcase -->
                <div class="fut-card-wrapper w-72 sm:w-80">
                  <div class="fut-card-shield">
                    <div class="fut-card-inner fut-card-texture p-5 pt-6 pb-6 text-center relative">
                      
                      <!-- Top Left: 89 OVR CAM IDN & Mini Crest -->
                      <div class="absolute top-5 left-5 text-left z-20">
                        <div class="text-4xl font-black text-lime-400 leading-none tracking-tight drop-shadow-md">89</div>
                        <div class="text-[9px] font-black text-zinc-400 uppercase tracking-widest mt-0.5">OVR</div>
                        <div class="text-xs font-black text-white mt-1">CAM</div>
                        <div class="text-[10px] font-bold text-emerald-300 flex items-center gap-1 mt-0.5">
                          <span>🇮🇩</span> <span>IDN</span>
                        </div>
                        <div class="mt-1 text-[11px] text-amber-400">⚡</div>
                      </div>

                      <!-- Top Right Academy Badge -->
                      <div class="absolute top-5 right-5 text-right z-20">
                        <div class="w-8 h-8 rounded-lg bg-zinc-900/80 border border-lime-400/30 flex items-center justify-center text-xs shadow-md">
                          🛡️
                        </div>
                      </div>

                      <!-- Center: Circular Player Badge with #10 -->
                      <div class="relative w-28 h-28 mx-auto mt-1 mb-2 z-10 flex items-center justify-center">
                        <div class="absolute inset-0 rounded-full bg-gradient-to-tr from-lime-500/30 to-emerald-400/30 blur-md"></div>
                        <div class="relative w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-lime-400 via-emerald-300 to-lime-500 shadow-2xl">
                          <div class="w-full h-full rounded-full bg-zinc-950 flex flex-col items-center justify-center relative overflow-hidden">
                            <div class="absolute inset-0 bg-gradient-to-b from-lime-400/20 to-transparent"></div>
                            <span class="text-3xl font-black text-lime-400 drop-shadow-sm select-none z-10">#10</span>
                            <span class="text-[8px] font-black tracking-widest text-zinc-400 uppercase z-10">CAPTAIN</span>
                          </div>
                        </div>
                      </div>

                      <!-- Player Name & Academy Ribbon -->
                      <div class="relative z-10 mt-1">
                        <div class="bg-gradient-to-r from-transparent via-lime-400/20 to-transparent border-y border-lime-400/30 py-1.5 my-1">
                          <h3 class="text-base sm:text-lg font-black text-white tracking-widest uppercase">FARHAN RAMADHAN</h3>
                        </div>
                        <div class="text-[11px] text-lime-400 font-extrabold tracking-wider uppercase">
                          YOUTHTRIGGER ACADEMY · U-16
                        </div>
                      </div>

                      <!-- Telemetry Attributes (6 FUT Stats) -->
                      <div class="relative z-10 mt-3 pt-2.5 border-t border-white/10 grid grid-cols-6 gap-1 text-center font-mono">
                        <div class="border-r border-white/5"><div class="text-xs font-black text-white">88</div><div class="text-[8px] font-bold text-zinc-400">PAC</div></div>
                        <div class="border-r border-white/5"><div class="text-xs font-black text-white">85</div><div class="text-[8px] font-bold text-zinc-400">SHO</div></div>
                        <div class="border-r border-white/5"><div class="text-xs font-black text-white">92</div><div class="text-[8px] font-bold text-zinc-400">PAS</div></div>
                        <div class="border-r border-white/5"><div class="text-xs font-black text-white">89</div><div class="text-[8px] font-bold text-zinc-400">DRI</div></div>
                        <div class="border-r border-white/5"><div class="text-xs font-black text-white">74</div><div class="text-[8px] font-bold text-zinc-400">DEF</div></div>
                        <div><div class="text-xs font-black text-white">81</div><div class="text-[8px] font-bold text-zinc-400">PHY</div></div>
                      </div>

                      <!-- Action Button -->
                      <button onclick="Header.openPortalLogin('player')"
                        class="relative z-10 mt-3.5 w-full py-2.5 rounded-xl text-xs font-black text-zinc-950 bg-gradient-to-r from-lime-400 via-emerald-400 to-lime-400 hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-lime-500/30 flex items-center justify-center gap-1.5">
                        <span>Buka Telemetri Siswa Ini</span> <span>→</span>
                      </button>

                      <!-- Bottom V-Point Shield Accent -->
                      <div class="relative z-10 mt-2 text-[9px] font-black text-lime-400/80 tracking-widest uppercase flex items-center justify-center gap-1">
                        <span>★</span> VERIFIED TALENT <span>★</span>
                      </div>

                    </div>
                  </div>
                </div>

                <!-- Live Selection Countdown Widget -->
                <div class="mt-6 w-full max-w-sm glass rounded-2xl p-4 border border-white/10 text-center">
                  <div class="text-xs font-bold text-zinc-300 flex items-center justify-center gap-2 mb-2">
                    <span class="w-2 h-2 rounded-full bg-lime-400 animate-ping"></span>
                    <span>Hitung Mundur Seleksi Gelombang 2:</span>
                  </div>
                  <div class="grid grid-cols-4 gap-2 text-center">
                    <div class="glass-subtle rounded-xl p-2"><div id="v-cd-d" class="text-lg font-black text-lime-400">07</div><div class="text-[9px] text-zinc-400 uppercase">Hari</div></div>
                    <div class="glass-subtle rounded-xl p-2"><div id="v-cd-h" class="text-lg font-black text-white">14</div><div class="text-[9px] text-zinc-400 uppercase">Jam</div></div>
                    <div class="glass-subtle rounded-xl p-2"><div id="v-cd-m" class="text-lg font-black text-white">35</div><div class="text-[9px] text-zinc-400 uppercase">Menit</div></div>
                    <div class="glass-subtle rounded-xl p-2"><div id="v-cd-s" class="text-lg font-black text-white">50</div><div class="text-[9px] text-zinc-400 uppercase">Detik</div></div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

        <!-- ================= STATISTIK PENCAPAIAN ================= -->
        <section class="border-b border-white/10 py-10 bg-zinc-900/40">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              ${CONFIG.stats.map(s => `
                <div class="space-y-1">
                  <div class="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                    <span class="text-gradient">${s.value}</span><span>${s.suffix}</span>
                  </div>
                  <div class="text-xs sm:text-sm font-semibold text-zinc-400">${s.label}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </section>

        <!-- ================= 2. TENTANG AKADEMI ================= -->
        <section id="tentang" class="py-20 border-b border-white/10">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
            
            <div class="text-center max-w-3xl mx-auto space-y-3">
              <span class="inline-block text-xs font-black uppercase tracking-widest text-lime-400 glass px-3 py-1 rounded-full border border-lime-400/30">
                Profil &amp; Filosofi
              </span>
              <h2 class="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                Membangun Karakter &amp; <span class="text-gradient">Standar Pro</span> Sejak 2018
              </h2>
              <p class="text-zinc-400 text-sm sm:text-base leading-relaxed">
                Didirikan oleh mantan atlet tim nasional dan praktisi kepelatihan berlisensi AFC, YouthTrigger Arena berkomitmen menghadirkan kurikulum sepak bola modern yang seimbang antara keterampilan fisik, kecerdasan taktik, dan pendidikan akhlak.
              </p>
            </div>

            <!-- 4 Pilar Filosofi Pembinaan -->
            <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div class="glass-card rounded-3xl p-6 border border-white/10 space-y-3">
                <div class="w-12 h-12 rounded-2xl bg-lime-400/15 text-lime-400 flex items-center justify-center text-2xl font-black">
                  🎯
                </div>
                <h3 class="text-lg font-bold text-white">Technical Mastery</h3>
                <p class="text-xs text-zinc-400 leading-relaxed">
                  Penguasaan sentuhan bola murni, first-touch shield, akurasi operan dua kaki, dan efisiensi gerak biomekanik.
                </p>
              </div>

              <div class="glass-card rounded-3xl p-6 border border-white/10 space-y-3">
                <div class="w-12 h-12 rounded-2xl bg-sky-400/15 text-sky-400 flex items-center justify-center text-2xl font-black">
                  🧠
                </div>
                <h3 class="text-lg font-bold text-white">Tactical Intelligence</h3>
                <p class="text-xs text-zinc-400 leading-relaxed">
                  Kemampuan membaca ruang, pengambilan keputusan di bawah tekanan lawan, dan adaptasi skema permainan 4-3-3.
                </p>
              </div>

              <div class="glass-card rounded-3xl p-6 border border-white/10 space-y-3">
                <div class="w-12 h-12 rounded-2xl bg-amber-400/15 text-amber-300 flex items-center justify-center text-2xl font-black">
                  ⚡
                </div>
                <h3 class="text-lg font-bold text-white">Physical Literacy</h3>
                <p class="text-xs text-zinc-400 leading-relaxed">
                  Ketahanan kardiovaskular, kecepatan sprint eksplosif, kelincahan gerak (*agility*), dan pencegahan cedera dini.
                </p>
              </div>

              <div class="glass-card rounded-3xl p-6 border border-white/10 space-y-3">
                <div class="w-12 h-12 rounded-2xl bg-purple-400/15 text-purple-400 flex items-center justify-center text-2xl font-black">
                  🛡️
                </div>
                <h3 class="text-lg font-bold text-white">Character &amp; Grit</h3>
                <p class="text-xs text-zinc-400 leading-relaxed">
                  Kedisiplinan, respek terhadap wasit dan lawan, ketangguhan mental bangkit dari kekalahan, dan kerja sama tim.
                </p>
              </div>

            </div>

            <!-- Visi & Misi Box -->
            <div class="glass rounded-3xl p-8 border border-white/10 grid md:grid-cols-2 gap-8">
              <div class="space-y-3">
                <div class="text-xs font-black text-lime-400 uppercase tracking-widest">Visi Kami</div>
                <h4 class="text-xl font-bold text-white">Pusat Inkubasi Pesepak Bola Muda Terbaik di Indonesia</h4>
                <p class="text-xs text-zinc-300 leading-relaxed">
                  Menjadi rujukan akademi sepak bola usia dini yang melahirkan pemain profesional berintegritas tinggi serta berdaya saing di kancah nasional maupun internasional.
                </p>
              </div>
              <div class="space-y-3">
                <div class="text-xs font-black text-emerald-400 uppercase tracking-widest">Misi Kami</div>
                <ul class="text-xs text-zinc-300 space-y-2 leading-relaxed">
                  <li class="flex items-start gap-2"><span>✓</span><span>Menerapkan kurikulum periodisasi bertahap berbasis kelompok usia.</span></li>
                  <li class="flex items-start gap-2"><span>✓</span><span>Mengintegrasikan teknologi Digital Locker Room untuk transparansi progres ke orang tua.</span></li>
                  <li class="flex items-start gap-2"><span>✓</span><span>Menyediakan jalur kompetisi berkala dan scouting resmi ke klub liga profesional.</span></li>
                </ul>
              </div>
            </div>

          </div>
        </section>

        <!-- ================= 3. PROGRAM LATIHAN KATALOG ================= -->
        <section id="program" class="py-20 border-b border-white/10">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <span class="inline-block text-xs font-black uppercase tracking-widest text-lime-400 glass px-3 py-1 rounded-full border border-lime-400/30">
                  Katalog Kelas Berjenjang
                </span>
                <h2 class="text-3xl sm:text-4xl font-black text-white tracking-tight mt-3">
                  Kelompok Usia U-8 hingga U-18
                </h2>
              </div>
              <p class="text-zinc-400 text-sm max-w-md">
                Setiap kelompok usia dirancang khusus dengan target pembinaan, rasio pelatih 1:10, dan evaluasi berkala.
              </p>
            </div>

            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              
              <!-- U-8 -->
              <div class="card-hover glass rounded-3xl p-6 border border-white/10 flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-black px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">U-8</span>
                    <span class="text-xl">🌟</span>
                  </div>
                  <h3 class="text-xl font-black text-white mt-4">Grassroots Fun Football</h3>
                  <div class="text-xs text-zinc-400 mt-2 space-y-1.5">
                    <div><strong>Target:</strong> Motorik dasar &amp; keceriaan bermain</div>
                    <div><strong>Materi:</strong> Dribbling ringan, koordinasi lari, mini games 3v3</div>
                    <div><strong>Jadwal:</strong> 2x Seminggu · 60 Menit</div>
                    <div><strong>Syarat:</strong> Usia 6 – 8 Tahun</div>
                  </div>
                </div>
                <div class="mt-6 pt-4 border-t border-white/10">
                  <button onclick="VisitorView.openRegistrationModal('U-8')" class="w-full btn-lime-glow py-2.5 rounded-xl text-xs font-black text-zinc-950">
                    Daftar Kelas U-8 →
                  </button>
                </div>
              </div>

              <!-- U-10 -->
              <div class="card-hover glass rounded-3xl p-6 border border-white/10 flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-black px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">U-10</span>
                    <span class="text-xl">⚽</span>
                  </div>
                  <h3 class="text-xl font-black text-white mt-4">Ball Mastery &amp; Agility</h3>
                  <div class="text-xs text-zinc-400 mt-2 space-y-1.5">
                    <div><strong>Target:</strong> Penguasaan bola 1v1 &amp; kelincahan gerak</div>
                    <div><strong>Materi:</strong> First touch, dribble dua kaki, shooting akurasi</div>
                    <div><strong>Jadwal:</strong> 3x Seminggu · 75 Menit</div>
                    <div><strong>Syarat:</strong> Usia 9 – 10 Tahun</div>
                  </div>
                </div>
                <div class="mt-6 pt-4 border-t border-white/10">
                  <button onclick="VisitorView.openRegistrationModal('U-10')" class="w-full btn-lime-glow py-2.5 rounded-xl text-xs font-black text-zinc-950">
                    Daftar Kelas U-10 →
                  </button>
                </div>
              </div>

              <!-- U-12 -->
              <div class="card-hover glass rounded-3xl p-6 border border-emerald-400/30 flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-black px-3 py-1 rounded-full bg-lime-400/20 text-lime-300 border border-lime-400/30">U-12</span>
                    <span class="text-xl">🔥</span>
                  </div>
                  <h3 class="text-xl font-black text-white mt-4">Skill Specialization</h3>
                  <div class="text-xs text-zinc-400 mt-2 space-y-1.5">
                    <div><strong>Target:</strong> Spesialisasi posisi &amp; small-sided games</div>
                    <div><strong>Materi:</strong> Passing kombinasi, transisi cepat, duel udara dasar</div>
                    <div><strong>Jadwal:</strong> 3x Seminggu · 90 Menit</div>
                    <div><strong>Syarat:</strong> Usia 11 – 12 Tahun</div>
                  </div>
                </div>
                <div class="mt-6 pt-4 border-t border-white/10">
                  <button onclick="VisitorView.openRegistrationModal('U-12')" class="w-full btn-lime-glow py-2.5 rounded-xl text-xs font-black text-zinc-950">
                    Daftar Kelas U-12 →
                  </button>
                </div>
              </div>

              <!-- U-14 -->
              <div class="card-hover glass rounded-3xl p-6 border border-white/10 flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-black px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">U-14</span>
                    <span class="text-xl">🧠</span>
                  </div>
                  <h3 class="text-xl font-black text-white mt-4">Tactical Squad Development</h3>
                  <div class="text-xs text-zinc-400 mt-2 space-y-1.5">
                    <div><strong>Target:</strong> Pemahaman formasi 4-3-3 &amp; ketahanan fisik</div>
                    <div><strong>Materi:</strong> Gegenpressing, bola mati (*set-pieces*), komunikasi</div>
                    <div><strong>Jadwal:</strong> 3x Sesi + 1x Matchday</div>
                    <div><strong>Syarat:</strong> Usia 13 – 14 Tahun</div>
                  </div>
                </div>
                <div class="mt-6 pt-4 border-t border-white/10">
                  <button onclick="VisitorView.openRegistrationModal('U-14')" class="w-full btn-lime-glow py-2.5 rounded-xl text-xs font-black text-zinc-950">
                    Daftar Kelas U-14 →
                  </button>
                </div>
              </div>

              <!-- U-16 -->
              <div class="card-hover glass rounded-3xl p-6 border border-lime-400/40 flex flex-col justify-between relative overflow-hidden">
                <div class="absolute top-0 right-0 bg-lime-400 text-zinc-950 text-[9px] font-black uppercase px-3 py-0.5 rounded-bl-xl">Unggulan</div>
                <div>
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-black px-3 py-1 rounded-full bg-lime-400/20 text-lime-300 border border-lime-400/30">U-16</span>
                    <span class="text-xl">⚡</span>
                  </div>
                  <h3 class="text-xl font-black text-white mt-4">Pre-Academy Elite</h3>
                  <div class="text-xs text-zinc-400 mt-2 space-y-1.5">
                    <div><strong>Target:</strong> Kesiapan kompetisi liga pro &amp; telemetri</div>
                    <div><strong>Materi:</strong> Analisis rekaman video, gym atletik, taktik intensif</div>
                    <div><strong>Jadwal:</strong> 4x Seminggu · Intensif Pro</div>
                    <div><strong>Syarat:</strong> Usia 15 – 16 Tahun</div>
                  </div>
                </div>
                <div class="mt-6 pt-4 border-t border-white/10">
                  <button onclick="VisitorView.openRegistrationModal('U-16')" class="w-full btn-lime-glow py-2.5 rounded-xl text-xs font-black text-zinc-950">
                    Daftar Kelas U-16 →
                  </button>
                </div>
              </div>

              <!-- U-18 -->
              <div class="card-hover glass rounded-3xl p-6 border border-white/10 flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-black px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30">U-18</span>
                    <span class="text-xl">👑</span>
                  </div>
                  <h3 class="text-xl font-black text-white mt-4">Pro Pathway &amp; Scouting</h3>
                  <div class="text-xs text-zinc-400 mt-2 space-y-1.5">
                    <div><strong>Target:</strong> Penyaluran trial klub Liga 1 &amp; beasiswa atlet</div>
                    <div><strong>Materi:</strong> High performance conditioning, scouting showcase</div>
                    <div><strong>Jadwal:</strong> 4x Sesi + 1x Matchday</div>
                    <div><strong>Syarat:</strong> Usia 17 – 18 Tahun</div>
                  </div>
                </div>
                <div class="mt-6 pt-4 border-t border-white/10">
                  <button onclick="VisitorView.openRegistrationModal('U-18')" class="w-full btn-lime-glow py-2.5 rounded-xl text-xs font-black text-zinc-950">
                    Daftar Kelas U-18 →
                  </button>
                </div>
              </div>

            </div>

          </div>
        </section>

        <!-- ================= 4. PROFIL PELATIH PUBLIK ================= -->
        <section id="pelatih" class="py-20 border-b border-white/10 bg-zinc-900/30">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            <div class="text-center max-w-2xl mx-auto space-y-3">
              <span class="inline-block text-xs font-black uppercase tracking-widest text-lime-400 glass px-3 py-1 rounded-full border border-lime-400/30">
                Tim Kepelatihan
              </span>
              <h2 class="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Instruktur Berlisensi AFC &amp; PSSI
              </h2>
              <p class="text-zinc-400 text-sm">
                Dipimpin oleh mantan pemain tim nasional dan spesialis kebugaran fisik berstandar internasional.
              </p>
            </div>

            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              ${KSA_STORE.coaches.map(c => `
                <div class="glass-card rounded-3xl p-6 border border-white/10 flex flex-col justify-between">
                  <div>
                    <div class="flex items-center gap-3.5 mb-4">
                      <div class="w-14 h-14 rounded-2xl ${c.avatarBg} text-zinc-950 font-black text-lg flex items-center justify-center shadow-lg">
                        ${c.initials}
                      </div>
                      <div>
                        <h3 class="text-base font-bold text-white">${c.name}</h3>
                        <div class="text-xs text-lime-400 font-semibold">${c.role}</div>
                        <div class="text-[10px] text-zinc-400 font-mono mt-0.5">${c.license}</div>
                      </div>
                    </div>
                    <div class="space-y-2 text-xs text-zinc-300">
                      <div><strong class="text-zinc-400">Spesialisasi:</strong> ${c.specialty}</div>
                      <div><strong class="text-zinc-400">Pengalaman:</strong> ${c.experience}</div>
                      <div><strong class="text-zinc-400">Kelompok:</strong> ${c.assignedSquads.join(', ')}</div>
                    </div>
                  </div>
                  <div class="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span class="text-emerald-400 font-bold">✓ Terverifikasi AFC</span>
                    <span class="text-zinc-500 text-[10px]">Staff Tetap YouthTrigger</span>
                  </div>
                </div>
              `).join('')}
            </div>

          </div>
        </section>

        <!-- ================= 5. FASILITAS AKADEMI ================= -->
        <section id="fasilitas" class="py-20 border-b border-white/10">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            <div class="text-center max-w-2xl mx-auto space-y-3">
              <span class="inline-block text-xs font-black uppercase tracking-widest text-lime-400 glass px-3 py-1 rounded-full border border-lime-400/30">
                Infrastruktur Bertaraf Internasional
              </span>
              <h2 class="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Fasilitas Unggulan YouthTrigger Arena
              </h2>
              <p class="text-zinc-400 text-sm">
                Sarana lapangan, gym kebugaran, dan teknologi analisis digital untuk menunjang performa optimal atlet.
              </p>
            </div>

            <div class="grid md:grid-cols-3 gap-6">
              
              <div class="glass-card rounded-3xl p-6 border border-white/10 space-y-3">
                <div class="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-2xl">
                  🏟️
                </div>
                <h3 class="text-lg font-bold text-white">Lapangan Rumput FIFA Quality Pro</h3>
                <p class="text-xs text-zinc-300 leading-relaxed">
                  Lapangan ukuran resmi dengan drainase bawah tanah anti-genangan dan pencahayaan malam 1200 Lux standar siaran.
                </p>
              </div>

              <div class="glass-card rounded-3xl p-6 border border-white/10 space-y-3">
                <div class="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-300 flex items-center justify-center text-2xl">
                  💻
                </div>
                <h3 class="text-lg font-bold text-white">Digital Locker Room &amp; Telemetri</h3>
                <p class="text-xs text-zinc-300 leading-relaxed">
                  Papan taktik layar sentuh interaktif dan pelacakan rompi GPS untuk memantau detak jantung serta kecepatan lari pemain.
                </p>
              </div>

              <div class="glass-card rounded-3xl p-6 border border-white/10 space-y-3">
                <div class="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-2xl">
                  🏋️
                </div>
                <h3 class="text-lg font-bold text-white">Youth Performance Gym Studio</h3>
                <p class="text-xs text-zinc-300 leading-relaxed">
                  Peralatan beban ramah remaja, agility ladder, dan tali elastis plyometrik didampingi spesialis Strength &amp; Conditioning.
                </p>
              </div>

              <div class="glass-card rounded-3xl p-6 border border-white/10 space-y-3">
                <div class="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center text-2xl">
                  📹
                </div>
                <h3 class="text-lg font-bold text-white">Ruang Teori &amp; Analisis Taktik Video</h3>
                <p class="text-xs text-zinc-300 leading-relaxed">
                  Auditorium ber-AC untuk membedah rekaman pertandingan tim, evaluasi pergerakan lawan, dan briefing strategi.
                </p>
              </div>

              <div class="glass-card rounded-3xl p-6 border border-white/10 space-y-3">
                <div class="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-300 flex items-center justify-center text-2xl">
                  🧊
                </div>
                <h3 class="text-lg font-bold text-white">Hydrotherapy &amp; Recovery Pool</h3>
                <p class="text-xs text-zinc-300 leading-relaxed">
                  Kolam pemulihan asam laktat atlet dan ruang fisioterapi berlisensi untuk percepatan rehabilitasi fisik.
                </p>
              </div>

              <div class="glass-card rounded-3xl p-6 border border-white/10 space-y-3">
                <div class="w-12 h-12 rounded-2xl bg-lime-500/20 text-lime-300 flex items-center justify-center text-2xl">
                  🌿
                </div>
                <h3 class="text-lg font-bold text-white">Lapangan Mini Sintetis All-Weather</h3>
                <p class="text-xs text-zinc-300 leading-relaxed">
                  Khusus latihan intensif ball mastery, sentuhan cepat, dan rondo drill untuk kelompok umur usia dini.
                </p>
              </div>

            </div>

          </div>
        </section>

        <!-- ================= 6. JADWAL & AGENDA KEGIATAN ================= -->
        <section id="jadwal" class="py-20 border-b border-white/10 bg-zinc-900/30">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            
            <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <span class="inline-block text-xs font-black uppercase tracking-widest text-lime-400 glass px-3 py-1 rounded-full border border-lime-400/30">
                  Agenda Terbuka
                </span>
                <h2 class="text-3xl sm:text-4xl font-black text-white tracking-tight mt-3">
                  Jadwal Tanding &amp; Kegiatan Mendatang
                </h2>
              </div>
              <button onclick="VisitorView.openAgendaModal()" class="btn-lime-glow px-4 py-2 rounded-xl text-xs font-black text-zinc-950">
                Lihat Kalender Lengkap →
              </button>
            </div>

            <div class="grid md:grid-cols-3 gap-6">
              ${CONFIG.agenda.map(a => `
                <div class="glass-card rounded-3xl p-6 border-l-4 border-lime-400 space-y-2.5">
                  <div class="flex items-center justify-between text-xs">
                    <span class="font-bold text-lime-400">${a.dateLabel}</span>
                    <span class="px-2 py-0.5 rounded text-[10px] bg-white/10 text-white">Publik</span>
                  </div>
                  <h3 class="text-base font-bold text-white">${a.title}</h3>
                  <div class="text-xs text-zinc-400">📍 ${a.venue}</div>
                  <p class="text-xs text-zinc-300 leading-relaxed pt-1">${a.desc}</p>
                </div>
              `).join('')}
            </div>

          </div>
        </section>

        <!-- ================= 7. BERITA & GALERI ================= -->
        <section id="berita" class="py-20 border-b border-white/10">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            <div class="text-center max-w-2xl mx-auto space-y-3">
              <span class="inline-block text-xs font-black uppercase tracking-widest text-lime-400 glass px-3 py-1 rounded-full border border-lime-400/30">
                Kabar Akademi
              </span>
              <h2 class="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Berita Terbaru &amp; Galeri Prestasi
              </h2>
            </div>

            <div class="grid md:grid-cols-3 gap-6">
              ${ACADEMY_NEWS.map(n => `
                <div class="glass-card rounded-3xl p-6 border border-white/10 space-y-3 flex flex-col justify-between">
                  <div>
                    <div class="flex items-center justify-between">
                      <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-lime-400/20 text-lime-300">${n.tag}</span>
                      <span class="text-zinc-500 text-xs">${n.date}</span>
                    </div>
                    <h3 class="text-base font-bold text-white mt-3">${n.title}</h3>
                    <p class="text-xs text-zinc-400 leading-relaxed mt-2">${n.desc}</p>
                  </div>
                  <div class="pt-3 border-t border-white/10">
                    <button onclick="Utils.showToast('Membaca artikel: ${n.title} 📰', 'info')" class="text-xs font-bold text-lime-400 hover:underline">
                      Baca Selengkapnya →
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>

          </div>
        </section>

        <!-- ================= 8. ON-PAGE FORM PENDAFTARAN SISWA BARU ================= -->
        <section id="daftar" class="bg-gradient-to-b from-zinc-950 via-zinc-900/60 to-zinc-950 py-20 border-b border-white/10">
          <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div class="glass-card rounded-3xl p-6 sm:p-10 border border-lime-400/30 shadow-2xl relative">
              <div class="text-center max-w-xl mx-auto space-y-2 mb-8">
                <span class="inline-block text-xs font-black uppercase tracking-widest text-lime-400 glass px-3 py-1 rounded-full border border-lime-400/30">
                  Formulir Pendaftaran Siswa Baru
                </span>
                <h2 class="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  Daftarkan Putra-Putri Anda
                </h2>
                <p class="text-zinc-400 text-sm">
                  Isi formulir di bawah ini. Permohonan Anda akan langsung tercatat di sistem admin dan diterbitkan nomor registrasi resmi.
                </p>
              </div>

              <form id="onpage-reg-form" onsubmit="VisitorView.submitOnpageRegistration(event)" class="space-y-4">
                
                <div class="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label for="onpage-name" class="block text-xs font-bold text-zinc-300 mb-1">Nama Lengkap Calon Siswa *</label>
                    <input required type="text" id="onpage-name" placeholder="Contoh: Muhammad Azzam Zaky"
                      class="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-lime-400 border border-white/10 transition-colors"/>
                  </div>
                  <div>
                    <label for="onpage-phone" class="block text-xs font-bold text-zinc-300 mb-1">Nomor WhatsApp Orang Tua / Wali *</label>
                    <input required type="tel" id="onpage-phone" placeholder="08xxxxxxxxxx" pattern="^(\\+62|62|0)8[0-9]{8,12}$"
                      class="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-lime-400 border border-white/10 transition-colors"/>
                  </div>
                </div>

                <div class="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label for="onpage-age" class="block text-xs font-bold text-zinc-300 mb-1">Pilihan Kelompok Usia *</label>
                    <select id="onpage-age" class="w-full glass rounded-xl px-3 py-3 text-sm text-zinc-200 bg-zinc-900 border border-white/10 focus:outline-none focus:border-lime-400">
                      <option value="U-8">U-8 (Grassroots Fun)</option>
                      <option value="U-10">U-10 (Ball Mastery)</option>
                      <option value="U-12">U-12 (Skill Builders)</option>
                      <option value="U-14">U-14 (Tactical Squad)</option>
                      <option value="U-16" selected>U-16 (Youth Elite)</option>
                      <option value="U-18">U-18 (Pro Pathway)</option>
                    </select>
                  </div>
                  <div>
                    <label for="onpage-gender" class="block text-xs font-bold text-zinc-300 mb-1">Jenis Kelamin *</label>
                    <select id="onpage-gender" class="w-full glass rounded-xl px-3 py-3 text-sm text-zinc-200 bg-zinc-900 border border-white/10 focus:outline-none focus:border-lime-400">
                      <option value="L" selected>Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                  </div>
                  <div>
                    <label for="onpage-pos" class="block text-xs font-bold text-zinc-300 mb-1">Posisi Favorit / Minat *</label>
                    <select id="onpage-pos" class="w-full glass rounded-xl px-3 py-3 text-sm text-zinc-200 bg-zinc-900 border border-white/10 focus:outline-none focus:border-lime-400">
                      <option value="Gelandang Serang (CAM)" selected>Gelandang (Midfielder)</option>
                      <option value="Penyerang Tengah (CF)">Penyerang (Striker)</option>
                      <option value="Penyerang Sayap (LW/RW)">Penyerang Sayap (Winger)</option>
                      <option value="Bek Tengah (CB)">Bek Tengah (Defender)</option>
                      <option value="Kiper Utama (GK)">Kiper (Goalkeeper)</option>
                    </select>
                  </div>
                </div>

                <div class="glass rounded-xl p-3.5 text-xs text-zinc-400 flex items-start gap-2.5 border border-white/5">
                  <span class="text-lime-400 text-sm">ℹ️</span>
                  <span>Jadwal seleksi gelombang terdekat diadakan <strong>Sabtu, 22 November 2026 pukul 08:00 WIB</strong> di YouthTrigger Arena Complex. Pendaftaran langsung masuk antrean verifikasi Super Admin.</span>
                </div>

                <div class="pt-2 text-center">
                  <button type="submit" id="onpage-submit-btn" class="btn-lime-glow px-10 py-3.5 rounded-2xl text-zinc-950 font-black text-sm shadow-xl hover:scale-105 active:scale-95 transition-transform">
                    Kirim Pendaftaran &amp; Dapatkan Nomor Registrasi →
                  </button>
                </div>

              </form>
            </div>

          </div>
        </section>

        <!-- ================= 9. TESTIMONI ORANG TUA ================= -->
        <section class="py-20 border-b border-white/10">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div class="text-center max-w-2xl mx-auto space-y-3">
              <span class="inline-block text-xs font-black uppercase tracking-widest text-lime-400 glass px-3 py-1 rounded-full border border-lime-400/30">
                Ulasan Terverifikasi
              </span>
              <h2 class="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Pengalaman Nyata Orang Tua Siswa
              </h2>
            </div>

            <div class="grid md:grid-cols-3 gap-6">
              <div class="glass-card rounded-3xl p-6 border border-white/10 flex flex-col justify-between">
                <p class="text-xs sm:text-sm text-zinc-300 leading-relaxed italic">
                  &ldquo;Portal Digital Locker Room sangat memudahkan kami memantau kebugaran Farhan, absensi latihan, dan catatan evaluasi pelatih setiap akhir pekan. Transparansi pembinaan luar biasa!&rdquo;
                </p>
                <div class="mt-6 flex items-center gap-3 pt-4 border-t border-white/10">
                  <div class="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-sm">BR</div>
                  <div>
                    <div class="font-bold text-white text-sm">Bpk. Rahmat Santoso</div>
                    <div class="text-xs text-zinc-400">Orang Tua Farhan (#10, Skuad U-16)</div>
                  </div>
                </div>
              </div>

              <div class="glass-card rounded-3xl p-6 border border-white/10 flex flex-col justify-between">
                <p class="text-xs sm:text-sm text-zinc-300 leading-relaxed italic">
                  &ldquo;Disiplin dan metode taktikal di YouthTrigger sangat terasa dampaknya. Anak saya yang tadinya pemalu sekarang jadi kapten tim dan percaya dirinya meningkat drastis di sekolah.&rdquo;
                </p>
                <div class="mt-6 flex items-center gap-3 pt-4 border-t border-white/10">
                  <div class="w-10 h-10 rounded-full bg-sky-500/20 text-sky-300 flex items-center justify-center font-bold text-sm">ID</div>
                  <div>
                    <div class="font-bold text-white text-sm">Ibu Dian Pratama</div>
                    <div class="text-xs text-zinc-400">Orang Tua Rafi (#8, Skuad U-14)</div>
                  </div>
                </div>
              </div>

              <div class="glass-card rounded-3xl p-6 border border-white/10 flex flex-col justify-between">
                <p class="text-xs sm:text-sm text-zinc-300 leading-relaxed italic">
                  &ldquo;Fondasi taktik dan latihan fisik di YouthTrigger Arena menjadi jembatan utama saya berhasil lolos seleksi tim Elite Pro Academy Liga 1. Terima kasih seluruh tim pelatih berlisensi!&rdquo;
                </p>
                <div class="mt-6 flex items-center gap-3 pt-4 border-t border-white/10">
                  <div class="w-10 h-10 rounded-full bg-lime-500/20 text-lime-300 flex items-center justify-center font-bold text-sm">DA</div>
                  <div>
                    <div class="font-bold text-white text-sm">Dimas Aditya</div>
                    <div class="text-xs text-lime-400 font-semibold">Alumni YouthTrigger · EPA Liga 1</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ================= 10. KONTAK & FAQ ================= -->
        <section id="kontak" class="py-20 border-b border-white/10 bg-zinc-900/30">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            <div class="grid lg:grid-cols-2 gap-10">
              
              <!-- Kiri: Kontak & Peta Info -->
              <div class="space-y-6">
                <div>
                  <span class="inline-block text-xs font-black uppercase tracking-widest text-lime-400 glass px-3 py-1 rounded-full border border-lime-400/30">
                    Hubungi Kami
                  </span>
                  <h2 class="text-3xl font-black text-white tracking-tight mt-3">
                    YouthTrigger Arena Complex
                  </h2>
                  <p class="text-zinc-400 text-xs sm:text-sm mt-1">
                    Sekretariat pendaftaran dan pusat pelatihan resmi YouthTrigger Football Academy.
                  </p>
                </div>

                <div class="space-y-3 text-xs">
                  <div class="glass p-3.5 rounded-2xl flex items-center gap-3 border border-white/5">
                    <span class="text-lg">📍</span>
                    <div>
                      <div class="font-bold text-white">Alamat Training Ground</div>
                      <div class="text-zinc-400">Jl. Patriot Raya No. 1, Kota Bekasi, Jawa Barat 17144</div>
                    </div>
                  </div>
                  <div class="glass p-3.5 rounded-2xl flex items-center gap-3 border border-white/5">
                    <span class="text-lg">📱</span>
                    <div>
                      <div class="font-bold text-white">Hotline WhatsApp Resmi</div>
                      <div class="text-emerald-400 font-mono">+62 812-9988-7766 (Senin–Minggu 07:00–20:00 WIB)</div>
                    </div>
                  </div>
                  <div class="glass p-3.5 rounded-2xl flex items-center gap-3 border border-white/5">
                    <span class="text-lg">✉️</span>
                    <div>
                      <div class="font-bold text-white">Email Sekretariat</div>
                      <div class="text-zinc-400 font-mono">info@youthtrigger.id / pendaftaran@youthtrigger.id</div>
                    </div>
                  </div>
                </div>

                <div class="glass p-4 rounded-2xl border border-white/5">
                  <div class="font-bold text-white text-xs mb-1">Jam Operasional Lapangan:</div>
                  <div class="text-[11px] text-zinc-400 space-y-0.5">
                    <div>• Sesi Latihan Pagi: 06:00 – 10:00 WIB</div>
                    <div>• Sesi Latihan Sore: 15:30 – 18:30 WIB</div>
                    <div>• Layanan Administrasi Kantor: 08:00 – 17:00 WIB</div>
                  </div>
                </div>
              </div>

              <!-- Kanan: FAQ Accordion -->
              <div class="space-y-4">
                <div class="space-y-1">
                  <h3 class="text-xl font-bold text-white">Pertanyaan Sering Diajukan (FAQ)</h3>
                  <p class="text-xs text-zinc-400">Informasi praktis seputar pendaftaran dan sistem pelatihan</p>
                </div>

                <div class="space-y-2.5 text-xs">
                  ${renderFaqItem('Apakah calon siswa tanpa pengalaman SSB bisa bergabung?', 'Sangat bisa! Program U-8 dan U-10 fokus melatih kemampuan motorik bola dari nol dengan pendekatan yang ramah anak dan suportif.')}
                  ${renderFaqItem('Berapa biaya pendaftaran dan apakah ada beasiswa prestasi?', 'Biaya pendaftaran mencakup 2 set jersey latihan, tas perlengkapan, dan akses aplikasi. Kami juga membuka seleksi beasiswa rutin setiap semester bagi atlet berprestasi.')}
                  ${renderFaqItem('Bagaimana orang tua memantau perkembangan fisik dan absensi anak?', 'Orang tua mendapatkan akses ke Player Portal di mana grafik radar 9 dimensi kemampuan, catatan evaluasi pelatih, dan histori kehadiran dicatat secara real-time.')}
                  ${renderFaqItem('Apakah YouthTrigger terhubung dengan seleksi klub profesional?', 'Ya, YouthTrigger bermitra dengan tim Elite Pro Academy Liga 1 dan klub sepak bola profesional nasional untuk memfasilitasi trial pemain berbakat.')}
                </div>
              </div>

            </div>

          </div>
        </section>

        <!-- ================= 11. FOOTER ================= -->
        <footer class="border-t border-white/10 bg-zinc-950 py-12 text-xs text-zinc-400">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-8 pb-10 border-b border-white/10">
              
              <!-- Kolom 1: Brand Info -->
              <div class="col-span-2 md:col-span-1 space-y-3">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-lg gradient-lime text-zinc-950 flex items-center justify-center font-black">⚽</div>
                  <span class="text-base font-black text-white tracking-tight">YouthTrigger Arena</span>
                </div>
                <p class="text-xs text-zinc-400 leading-relaxed">
                  Sekolah sepak bola modern berlisensi AFC &amp; PSSI dengan ekosistem Digital Locker Room terintegrasi untuk pemain, pelatih, dan manajemen.
                </p>
                <div class="text-[11px] text-zinc-500 font-mono">
                  Standard Afiliasi AFC · Lisensi PSSI No. 2024/SSB-082
                </div>
              </div>

              <!-- Kolom 2: Navigasi Cepat -->
              <div class="space-y-2">
                <div class="font-bold text-white text-xs uppercase tracking-wider mb-2">Halaman Publik</div>
                <div><a href="#beranda" data-scroll class="hover:text-lime-400">Beranda Utama</a></div>
                <div><a href="#tentang" data-scroll class="hover:text-lime-400">Tentang Akademi</a></div>
                <div><a href="#program" data-scroll class="hover:text-lime-400">Program Kelompok Usia</a></div>
                <div><a href="#pelatih" data-scroll class="hover:text-lime-400">Profil Pelatih AFC</a></div>
                <div><a href="#fasilitas" data-scroll class="hover:text-lime-400">Fasilitas Standar FIFA</a></div>
              </div>

              <!-- Kolom 3: Portal Role -->
              <div class="space-y-2">
                <div class="font-bold text-white text-xs uppercase tracking-wider mb-2">Akses Portal</div>
                <div><button onclick="Header.switchRole('player')" class="hover:text-emerald-400 text-left">Portal Siswa (#10 Farhan)</button></div>
                <div><button onclick="Header.switchRole('coach')" class="hover:text-amber-400 text-left">Portal Pelatih (Coach Hendra)</button></div>
                <div><button onclick="Header.switchRole('admin')" class="hover:text-violet-400 text-left">Admin Management Portal ⚡</button></div>
                <div><button onclick="Header.openLoginModal()" class="hover:text-lime-400 text-left">Single Sign-On (SSO)</button></div>
              </div>

              <!-- Kolom 4: Legal & Keamanan -->
              <div class="space-y-2">
                <div class="font-bold text-white text-xs uppercase tracking-wider mb-2">Keamanan &amp; Etika</div>
                <div><a href="javascript:void(0)" onclick="Utils.showToast('Kebijakan Privasi Data Anak & Siswa terverifikasi standar perlindungan anak 🛡️','info')" class="hover:text-white">Perlindungan Data Anak</a></div>
                <div><a href="javascript:void(0)" onclick="Utils.showToast('Standar Keamanan Latihan & Medis Darurat Siap 24 Jam 🏥','info')" class="hover:text-white">Protokol Keselamatan Medis</a></div>
                <div><a href="javascript:void(0)" onclick="Utils.showToast('Kode Etik Sportivitas Fair Play AFC / PSSI ⚽','info')" class="hover:text-white">Kode Etik Sportivitas</a></div>
              </div>

            </div>

            <div class="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
              <div>&copy; 2026 YouthTrigger Arena Football Academy. Seluruh hak cipta dilindungi undang-undang.</div>
              <div class="flex items-center gap-4">
                <span>Versi 4.0 Athletic Tech</span>
                <span>•</span>
                <span>Bekasi, Jawa Barat, Indonesia</span>
              </div>
            </div>

          </div>
        </footer>

      </div>
    `;

    initSmoothScroll(container);
    startCountdown();
  }

  function renderFaqItem(question, answer) {
    return `
      <details class="glass rounded-2xl p-3.5 border border-white/5 group">
        <summary class="font-bold text-white cursor-pointer list-none flex items-center justify-between">
          <span>${esc(question)}</span>
          <span class="text-lime-400 group-open:rotate-180 transition-transform">▾</span>
        </summary>
        <p class="mt-2 text-zinc-300 text-xs leading-relaxed border-t border-white/5 pt-2">
          ${esc(answer)}
        </p>
      </details>
    `;
  }

  function startCountdown() {
    stopTimers();
    const target = new Date(CONFIG.selectionDate).getTime();

    function update() {
      const now = Date.now();
      const diff = Math.max(0, target - now);

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      const pad = (n) => String(n).padStart(2, '0');

      const elD = document.getElementById('v-cd-d');
      const elH = document.getElementById('v-cd-h');
      const elM = document.getElementById('v-cd-m');
      const elS = document.getElementById('v-cd-s');

      if (elD) elD.textContent = pad(d);
      if (elH) elH.textContent = pad(h);
      if (elM) elM.textContent = pad(m);
      if (elS) elS.textContent = pad(s);
    }

    update();
    countdownTimer = setInterval(update, 1000);
  }

  function stopTimers() {
    if (countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }
  }

  function initSmoothScroll(container) {
    const view = document.getElementById('app-view') || window;
    container.querySelectorAll('a[data-scroll]').forEach(a => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (!href || !href.startsWith('#')) return;
        const target = container.querySelector(href);
        if (target) {
          e.preventDefault();
          view.scrollTo({ top: target.offsetTop - 12, behavior: 'smooth' });
        }
      });
    });
  }

  /* ================================================================
     ON-PAGE SUBMIT & MULTI-STEP MODAL REGISTRATION
  ================================================================ */
  async function submitOnpageRegistration(e) {
    e.preventDefault();
    const btn = document.getElementById('onpage-submit-btn');
    if (btn) { btn.disabled = true; btn.textContent = 'Memproses Pendaftaran...'; }

    const name = (document.getElementById('onpage-name')?.value || '').trim() || 'Calon Siswa';
    const nohp = (document.getElementById('onpage-phone')?.value || '').trim();
    const age = document.getElementById('onpage-age')?.value || 'U-16';
    const gender = document.getElementById('onpage-gender')?.value || 'L';
    const pos = document.getElementById('onpage-pos')?.value || 'Gelandang';

    // Real single-source integration with KSA_STORE!
    const newReg = KSA_STORE.addRegistration({
      name,
      gender,
      ageGroup: age,
      position: pos,
      guardianPhone: nohp,
      guardianName: 'Orang Tua dari ' + name,
      program: age === 'U-16' || age === 'U-18' ? 'Elite Development Academy' : 'Grassroots Foundation'
    });

    Utils.showToast(`Pendaftaran ${name} berhasil disimpan! No. Registrasi: ${newReg.id} ⚽`, 'success');
    document.getElementById('onpage-reg-form')?.reset();

    // Show confirmation modal
    Utils.openModal(`
      <div class="text-center space-y-4 py-2">
        <div class="w-16 h-16 rounded-full gradient-lime text-zinc-950 flex items-center justify-center text-3xl mx-auto shadow-xl">✓</div>
        <div>
          <h3 class="text-xl font-black text-white">Pendaftaran Berhasil Diterima!</h3>
          <div class="text-xs text-lime-400 font-mono font-bold mt-1">Nomor Registrasi: ${newReg.id}</div>
          <div class="text-[11px] text-zinc-400">Kelompok Usia: ${age} · Status: Pending (Menunggu Seleksi)</div>
        </div>
        <p class="text-xs text-zinc-300 leading-relaxed max-w-sm mx-auto">
          Terima kasih telah mendaftar di <strong>YouthTrigger Arena</strong>. Permohonan Anda telah tercatat di sistem admin. Undangan seleksi dan jadwal uji coba gratis akan dikirimkan ke nomor WhatsApp <strong>${nohp}</strong>.
        </p>
        <div class="pt-2 flex items-center gap-2">
          <button onclick="Utils.closeModal()" class="w-full btn-lime-glow py-3 rounded-xl font-bold text-zinc-950 text-xs">
            Selesai &amp; Kembali ke Beranda
          </button>
        </div>
      </div>
    `);

    if (btn) { btn.disabled = false; btn.textContent = 'Kirim Pendaftaran & Dapatkan Nomor Registrasi →'; }
  }

  /* ================================================================
     COMPREHENSIVE MULTI-STEP REGISTRATION MODAL
  ================================================================ */
  function openRegistrationModal(preselectedAge = 'U-16') {
    Utils.openModal(`
      <div class="space-y-4 max-w-xl w-full text-left text-xs modal-responsive-card">
        
        <div class="flex items-center gap-3 pb-3 border-b border-white/10">
          <div class="w-11 h-11 rounded-2xl gradient-lime text-zinc-950 font-black flex items-center justify-center text-xl shadow-lg flex-shrink-0">
            ⚽
          </div>
          <div>
            <h3 class="text-base font-black text-white">Formulir Pendaftaran Siswa Baru</h3>
            <p class="text-[11px] text-lime-400 font-semibold">YouthTrigger Arena Football Academy — Musim 2026/2027</p>
          </div>
        </div>

        <form id="modal-reg-form" onsubmit="VisitorView.submitRegistration(event)" class="space-y-3.5">
          
          <!-- Section 1: Data Calon Siswa -->
          <div class="p-3 bg-zinc-900/60 rounded-2xl border border-white/5 space-y-2.5">
            <div class="text-[11px] font-bold text-lime-400 uppercase tracking-wider">1. Data Calon Siswa</div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-zinc-300 font-semibold mb-1">Nama Lengkap *</label>
                <input required type="text" id="m-reg-name" placeholder="Nama lengkap siswa"
                  class="w-full glass rounded-xl px-3 py-2 text-white border border-white/10 focus:outline-none focus:border-lime-400"/>
              </div>
              <div>
                <label class="block text-zinc-300 font-semibold mb-1">Nama Panggilan *</label>
                <input required type="text" id="m-reg-nick" placeholder="Contoh: Farhan"
                  class="w-full glass rounded-xl px-3 py-2 text-white border border-white/10 focus:outline-none focus:border-lime-400"/>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label class="block text-zinc-300 font-semibold mb-1">Tanggal Lahir *</label>
                <input required type="date" id="m-reg-dob" value="2012-05-15"
                  class="w-full glass rounded-xl px-2 py-2 text-white border border-white/10 focus:outline-none focus:border-lime-400"/>
              </div>
              <div>
                <label class="block text-zinc-300 font-semibold mb-1">Jenis Kelamin *</label>
                <select id="m-reg-gender" class="w-full glass rounded-xl px-2 py-2 bg-zinc-900 text-white border border-white/10">
                  <option value="L" selected>Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
              <div>
                <label class="block text-zinc-300 font-semibold mb-1">Kaki Dominan *</label>
                <select id="m-reg-foot" class="w-full glass rounded-xl px-2 py-2 bg-zinc-900 text-white border border-white/10">
                  <option value="Kanan" selected>Kanan</option>
                  <option value="Kiri">Kiri</option>
                  <option value="Kedua Kaki">Kedua Kaki</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-zinc-300 font-semibold mb-1">Kelompok Usia *</label>
                <select id="m-reg-age" class="w-full glass rounded-xl px-3 py-2 bg-zinc-900 text-white border border-white/10">
                  <option value="U-8" ${preselectedAge === 'U-8' ? 'selected' : ''}>U-8 (Grassroots Fun)</option>
                  <option value="U-10" ${preselectedAge === 'U-10' ? 'selected' : ''}>U-10 (Ball Mastery)</option>
                  <option value="U-12" ${preselectedAge === 'U-12' ? 'selected' : ''}>U-12 (Skill Builders)</option>
                  <option value="U-14" ${preselectedAge === 'U-14' ? 'selected' : ''}>U-14 (Tactical Squad)</option>
                  <option value="U-16" ${preselectedAge === 'U-16' ? 'selected' : ''}>U-16 (Youth Elite)</option>
                  <option value="U-18" ${preselectedAge === 'U-18' ? 'selected' : ''}>U-18 (Pro Pathway)</option>
                </select>
              </div>
              <div>
                <label class="block text-zinc-300 font-semibold mb-1">Posisi Minat *</label>
                <select id="m-reg-pos" class="w-full glass rounded-xl px-3 py-2 bg-zinc-900 text-white border border-white/10">
                  <option value="Gelandang Serang (CAM)">Gelandang Serang (CAM)</option>
                  <option value="Penyerang Tengah (CF)">Penyerang Tengah (CF)</option>
                  <option value="Penyerang Sayap (LW/RW)">Penyerang Sayap (LW/RW)</option>
                  <option value="Gelandang Bertahan (CDM)">Gelandang Bertahan (CDM)</option>
                  <option value="Bek Tengah (CB)">Bek Tengah (CB)</option>
                  <option value="Kiper Utama (GK)">Kiper (Goalkeeper)</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Section 2: Data Orang Tua / Wali -->
          <div class="p-3 bg-zinc-900/60 rounded-2xl border border-white/5 space-y-2.5">
            <div class="text-[11px] font-bold text-sky-400 uppercase tracking-wider">2. Data Orang Tua / Wali</div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-zinc-300 font-semibold mb-1">Nama Orang Tua / Wali *</label>
                <input required type="text" id="m-reg-guardian" placeholder="Nama ayah / ibu / wali"
                  class="w-full glass rounded-xl px-3 py-2 text-white border border-white/10"/>
              </div>
              <div>
                <label class="block text-zinc-300 font-semibold mb-1">No. WhatsApp Wali *</label>
                <input required type="tel" id="m-reg-phone" placeholder="08xxxxxxxxxx"
                  class="w-full glass rounded-xl px-3 py-2 text-white border border-white/10"/>
              </div>
            </div>

            <div>
              <label class="block text-zinc-300 font-semibold mb-1">Alamat Domisili *</label>
              <input required type="text" id="m-reg-address" placeholder="Kota / Wilayah tempat tinggal"
                class="w-full glass rounded-xl px-3 py-2 text-white border border-white/10"/>
            </div>
          </div>

          <!-- Section 3: Informasi Kesehatan -->
          <div class="p-3 bg-zinc-900/60 rounded-2xl border border-white/5 space-y-2">
            <div class="text-[11px] font-bold text-amber-400 uppercase tracking-wider">3. Informasi Medis &amp; Kesehatan</div>
            <input type="text" id="m-reg-health" placeholder="Riwayat cedera, asma, alergi (kosongkan jika sehat total)"
              class="w-full glass rounded-xl px-3 py-2 text-white border border-white/10"/>
          </div>

          <!-- Section 4: Persetujuan Regulasi -->
          <div class="flex items-start gap-2 pt-1 text-[11px] text-zinc-400">
            <input required type="checkbox" id="m-reg-agree" class="mt-0.5 rounded border-zinc-700 text-lime-400 focus:ring-lime-400"/>
            <label for="m-reg-agree">
              Saya selaku orang tua/wali menyatakan data di atas benar dan menyetujui protokol seleksi serta tata tertib YouthTrigger Arena.
            </label>
          </div>

          <div class="flex items-center justify-end gap-2.5 pt-2 border-t border-white/10">
            <button type="button" onclick="Utils.closeModal()" class="px-4 py-2.5 rounded-xl glass text-zinc-400 hover:text-white font-semibold">Batal</button>
            <button type="submit" id="modal-submit-btn" class="btn-lime-glow px-6 py-2.5 rounded-xl text-zinc-950 font-black shadow-lg">Kirim Pendaftaran Resmi</button>
          </div>

        </form>

      </div>
    `);
  }

  async function submitRegistration(e) {
    e.preventDefault();
    const btn = document.getElementById('modal-submit-btn');
    if (btn) { btn.disabled = true; btn.textContent = 'Memproses...'; }

    const name = (document.getElementById('m-reg-name')?.value || '').trim() || 'Calon Siswa';
    const nick = (document.getElementById('m-reg-nick')?.value || '').trim() || name.split(' ')[0];
    const dob = document.getElementById('m-reg-dob')?.value || '2012-05-15';
    const gender = document.getElementById('m-reg-gender')?.value || 'L';
    const foot = document.getElementById('m-reg-foot')?.value || 'Kanan';
    const age = document.getElementById('m-reg-age')?.value || 'U-16';
    const pos = document.getElementById('m-reg-pos')?.value || 'Gelandang';
    const guardian = (document.getElementById('m-reg-guardian')?.value || '').trim() || 'Wali Siswa';
    const phone = (document.getElementById('m-reg-phone')?.value || '').trim() || '08xxxxxxxxxx';
    const address = (document.getElementById('m-reg-address')?.value || '').trim() || 'Bekasi';
    const health = (document.getElementById('m-reg-health')?.value || '').trim() || 'Sehat bebas riwayat cedera berat.';

    const newReg = KSA_STORE.addRegistration({
      name,
      nickname: nick,
      dob,
      gender,
      preferredFoot: foot,
      ageGroup: age,
      position: pos,
      guardianName: guardian,
      guardianPhone: phone,
      address,
      healthNotes: health,
      program: age === 'U-16' || age === 'U-18' ? 'Elite Development Academy' : 'Grassroots Foundation'
    });

    Utils.closeModal();
    Utils.showToast(`Pendaftaran ${name} berhasil dicatat! No. Registrasi: ${newReg.id} ⚽`, 'success');

    // Show Confirmation Modal
    Utils.openModal(`
      <div class="text-center space-y-4 py-2">
        <div class="w-16 h-16 rounded-full gradient-lime text-zinc-950 flex items-center justify-center text-3xl mx-auto shadow-xl">✓</div>
        <div>
          <h3 class="text-xl font-black text-white">Pendaftaran Resmi Diterima!</h3>
          <div class="text-sm font-mono font-black text-lime-400 mt-1">${newReg.id}</div>
          <div class="text-xs text-zinc-400 mt-0.5">Kelompok: ${age} · ${pos}</div>
        </div>
        <div class="glass p-3 rounded-2xl text-xs text-zinc-300 text-left space-y-1 border border-white/5 max-w-sm mx-auto">
          <div><strong>Nama Siswa:</strong> ${name}</div>
          <div><strong>Orang Tua/Wali:</strong> ${guardian} (${phone})</div>
          <div><strong>Status Pendaftaran:</strong> <span class="text-violet-400 font-bold">Pending (Menunggu Seleksi)</span></div>
        </div>
        <p class="text-xs text-zinc-400 max-w-sm mx-auto">
          Data pendaftaran telah terkirim ke panel Admin YouthTrigger Arena. Jadwal uji coba lapangan akan dikirimkan melalui WhatsApp.
        </p>
        <button onclick="Utils.closeModal()" class="w-full btn-lime-glow py-3 rounded-xl font-bold text-zinc-950 text-xs shadow-lg">
          Tutup &amp; Kembali ke Halaman Utama
        </button>
      </div>
    `);
  }

  function openAgendaModal() {
    const items = CONFIG.agenda.map((a) => `
      <div class="glass rounded-xl p-3 border-l-2 border-lime-400">
        <div class="flex items-center justify-between gap-2">
          <span class="text-lime-400 font-bold">${esc(a.title)}</span>
          <span class="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-bold text-white">${esc(a.dateLabel)}</span>
        </div>
        <div class="text-xs text-zinc-400 mt-0.5">📍 ${esc(a.venue)}</div>
        <p class="text-zinc-300 mt-1.5 text-xs">${esc(a.desc)}</p>
      </div>`).join('');

    Utils.openModal(`
      <div class="space-y-4 max-w-md text-left">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl gradient-lime flex items-center justify-center text-xl text-zinc-950 font-black">📅</div>
          <div>
            <h3 class="text-lg font-bold text-white">Agenda &amp; Kegiatan Terbuka</h3>
            <p class="text-xs text-zinc-400">Jadwal Seleksi &amp; Kompetisi YouthTrigger Arena</p>
          </div>
        </div>
        <div class="space-y-2.5 text-xs">${items}</div>
        <button onclick="Utils.closeModal()" class="w-full btn-lime-glow py-2.5 rounded-xl font-bold text-zinc-950 text-xs">Tutup Agenda</button>
      </div>
    `);
  }

  return {
    render,
    openRegistrationModal,
    submitRegistration,
    submitOnpageRegistration,
    openAgendaModal,
  };
})();
