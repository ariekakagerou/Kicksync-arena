/* ============================================================
   YouthTrigger Arena — AUTH VIEW (Multi-Role Portal Login)
   Each role has its own unique full-screen auth page.
   File: js/views/auth.js
   ============================================================ */

const AuthView = (() => {

  const esc = (s) => String(s || '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

  /* ================================================================
     STATE
  ================================================================ */
  // screen: 'role-select' | 'login-admin' | 'login-coach' | 'login-player' | 'register'
  let _screen = 'role-select';

  /* ================================================================
     PUBLIC: render()
  ================================================================ */
  function render(options = {}) {
    _screen = options.screen || (options.tab === 'register' ? 'register' : 'role-select');
    _mountRoot();
    _paint();
  }

  /* ================================================================
     MOUNT / UNMOUNT
  ================================================================ */
  function _mountRoot() {
    const header  = document.getElementById('app-header');
    const appView = document.getElementById('app-view');
    if (header)  header.style.display  = 'none';
    if (appView) appView.style.display = 'none';

    let root = document.getElementById('auth-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'auth-root';
      document.body.appendChild(root);
    }
    root.style.cssText = 'display:flex;position:fixed;inset:0;z-index:9999;overflow-y:auto;';
  }

  function _dismiss() {
    const header  = document.getElementById('app-header');
    const appView = document.getElementById('app-view');
    if (header)  header.style.display  = '';
    if (appView) appView.style.display = '';
    const root = document.getElementById('auth-root');
    if (root) root.style.display = 'none';
  }

  /* ================================================================
     PAINT: dispatch to correct screen
  ================================================================ */
  function _paint() {
    const root = document.getElementById('auth-root');
    if (!root) return;
    root.innerHTML = '';
    root.style.background = '#060a12';

    switch (_screen) {
      case 'role-select':  root.innerHTML = _screenRoleSelect(); break;
      case 'login-admin':  root.innerHTML = _screenAdminLogin(); break;
      case 'login-coach':  root.innerHTML = _screenCoachLogin(); break;
      case 'login-player': root.innerHTML = _screenPlayerLogin(); break;
      case 'register':     root.innerHTML = _screenRegister(); break;
      default:             root.innerHTML = _screenRoleSelect();
    }

    _injectBaseStyles();
    _bindRegisterEvents();
  }

  /* ================================================================
     SCREEN 1: ROLE SELECT
  ================================================================ */
  function _screenRoleSelect() {
    return `
    <div class="auth-wrap min-h-screen w-full flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <!-- Background pitch grid -->
      <div class="absolute inset-0 pitch-lines opacity-30 pointer-events-none"></div>
      <div class="absolute inset-0 pointer-events-none" style="background:radial-gradient(ellipse at 50% 0%,rgba(163,230,53,0.08) 0%,transparent 60%);"></div>

      <!-- Back -->
      <button onclick="AuthView.goHome()" class="auth-back absolute top-6 left-6 flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        Beranda
      </button>

      <!-- Logo -->
      <div class="flex items-center gap-3 mb-10">
        <div class="w-12 h-12 rounded-2xl gradient-lime flex items-center justify-center shadow-xl shadow-lime-500/30">
          <svg class="w-7 h-7 text-zinc-950" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm0 3c3.87 0 7 3.13 7 7s-3.13 7-7 7-7-3.13-7-7 3.13-7 7-7zm0 2.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z"/>
            <circle cx="12" cy="12" r="2.5" fill="#09090b"/>
          </svg>
        </div>
        <div>
          <div class="text-xl font-black text-white tracking-tight">YouthTrigger</div>
          <div class="text-[11px] font-extrabold text-lime-400 tracking-widest">ARENA · PORTAL</div>
        </div>
      </div>

      <!-- Headline -->
      <div class="text-center mb-10 space-y-2">
        <h1 class="text-3xl sm:text-4xl font-black text-white">Masuk ke Portal Akademi</h1>
        <p class="text-zinc-500 text-sm">Pilih peran Anda untuk melanjutkan ke portal yang sesuai.</p>
      </div>

      <!-- 3 Role Cards -->
      <div class="grid sm:grid-cols-3 gap-5 w-full max-w-3xl">

        <!-- ADMIN -->
        <button onclick="AuthView.showScreen('login-admin')"
          class="role-select-card group relative overflow-hidden p-6 rounded-3xl text-left transition-all duration-300 hover:scale-[1.03]"
          style="background:linear-gradient(135deg,rgba(109,40,217,0.18) 0%,rgba(109,40,217,0.06) 100%);border:1px solid rgba(139,92,246,0.3);">
          <!-- Glow -->
          <div class="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style="background:radial-gradient(circle,rgba(139,92,246,0.25) 0%,transparent 70%);"></div>
          <!-- Badge -->
          <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-5" style="background:rgba(139,92,246,0.2);color:#c4b5fd;border:1px solid rgba(139,92,246,0.3);">
            <span class="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse"></span> Admin
          </div>
          <!-- Icon -->
          <div class="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-5 shadow-lg" style="background:linear-gradient(135deg,rgba(109,40,217,0.4),rgba(139,92,246,0.3));box-shadow:0 0 25px rgba(139,92,246,0.3);">⚡</div>
          <!-- Text -->
          <h3 class="text-lg font-black text-white mb-1">Super Admin</h3>
          <p class="text-xs text-zinc-500 leading-relaxed mb-5">Pusat kendali manajemen akademi, data siswa, pelatih, dan laporan operasional.</p>
          <!-- Arrow -->
          <div class="flex items-center gap-1.5 text-xs font-bold text-violet-400 group-hover:gap-3 transition-all">
            Masuk ke Admin Portal
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
          </div>
        </button>

        <!-- COACH -->
        <button onclick="AuthView.showScreen('login-coach')"
          class="role-select-card group relative overflow-hidden p-6 rounded-3xl text-left transition-all duration-300 hover:scale-[1.03]"
          style="background:linear-gradient(135deg,rgba(217,119,6,0.18) 0%,rgba(217,119,6,0.06) 100%);border:1px solid rgba(245,158,11,0.3);">
          <div class="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style="background:radial-gradient(circle,rgba(245,158,11,0.25) 0%,transparent 70%);"></div>
          <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-5" style="background:rgba(245,158,11,0.2);color:#fcd34d;border:1px solid rgba(245,158,11,0.3);">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span> Pelatih
          </div>
          <div class="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-5 shadow-lg" style="background:linear-gradient(135deg,rgba(217,119,6,0.4),rgba(245,158,11,0.3));box-shadow:0 0 25px rgba(245,158,11,0.3);">🎯</div>
          <h3 class="text-lg font-black text-white mb-1">Pelatih / Coach</h3>
          <p class="text-xs text-zinc-500 leading-relaxed mb-5">Portal manajemen skuad binaan, input evaluasi, absensi latihan, dan telemetri pemain.</p>
          <div class="flex items-center gap-1.5 text-xs font-bold text-amber-400 group-hover:gap-3 transition-all">
            Masuk ke Coach Portal
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
          </div>
        </button>

        <!-- PLAYER -->
        <button onclick="AuthView.showScreen('login-player')"
          class="role-select-card group relative overflow-hidden p-6 rounded-3xl text-left transition-all duration-300 hover:scale-[1.03]"
          style="background:linear-gradient(135deg,rgba(5,150,105,0.18) 0%,rgba(5,150,105,0.06) 100%);border:1px solid rgba(16,185,129,0.3);">
          <div class="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style="background:radial-gradient(circle,rgba(16,185,129,0.25) 0%,transparent 70%);"></div>
          <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-5" style="background:rgba(16,185,129,0.2);color:#6ee7b7;border:1px solid rgba(16,185,129,0.3);">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Siswa
          </div>
          <div class="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-5 shadow-lg" style="background:linear-gradient(135deg,rgba(5,150,105,0.4),rgba(16,185,129,0.3));box-shadow:0 0 25px rgba(16,185,129,0.3);">⚽</div>
          <h3 class="text-lg font-black text-white mb-1">Siswa / Player</h3>
          <p class="text-xs text-zinc-500 leading-relaxed mb-5">Dashboard performa pribadi, statistik latihan, prestasi, dan Digital Locker Room.</p>
          <div class="flex items-center gap-1.5 text-xs font-bold text-emerald-400 group-hover:gap-3 transition-all">
            Masuk ke Player Portal
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
          </div>
        </button>

      </div>

      <!-- Register link -->
      <div class="mt-10 text-center space-y-1">
        <p class="text-sm text-zinc-600">Belum terdaftar sebagai siswa?</p>
        <button onclick="AuthView.showScreen('register')" class="text-lime-400 font-bold text-sm hover:underline">
          Daftar Siswa Baru Sekarang →
        </button>
      </div>

      <!-- Bottom credit -->
      <p class="absolute bottom-4 text-xs text-zinc-700">© 2026 YouthTrigger Arena · AFC &amp; PSSI Licensed Academy</p>
    </div>`;
  }

  /* ================================================================
     SCREEN 2a: ADMIN LOGIN
  ================================================================ */
  function _screenAdminLogin() {
    return `
    <div class="auth-wrap min-h-screen w-full flex" style="background:linear-gradient(135deg,#06040f 0%,#0d0820 60%,#06040f 100%);">

      <!-- Left: Command Center Branding -->
      <div class="hidden lg:flex flex-col justify-between w-[55%] relative overflow-hidden p-10"
           style="background:linear-gradient(135deg,rgba(109,40,217,0.12) 0%,transparent 70%);border-right:1px solid rgba(139,92,246,0.15);">

        <!-- Animated grid bg -->
        <div class="absolute inset-0 opacity-20 pointer-events-none" style="background-image:linear-gradient(rgba(139,92,246,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,0.15) 1px,transparent 1px);background-size:48px 48px;"></div>
        <!-- Glow blobs -->
        <div class="absolute -top-32 -left-32 w-96 h-96 rounded-full pointer-events-none" style="background:radial-gradient(circle,rgba(139,92,246,0.15) 0%,transparent 70%);"></div>
        <div class="absolute bottom-0 right-0 w-72 h-72 rounded-full pointer-events-none" style="background:radial-gradient(circle,rgba(109,40,217,0.12) 0%,transparent 70%);"></div>

        <!-- Logo -->
        <div class="relative z-10 flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl gradient-lime flex items-center justify-center shadow-lg">
            <svg class="w-6 h-6 text-zinc-950" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm0 3c3.87 0 7 3.13 7 7s-3.13 7-7 7-7-3.13-7-7 3.13-7 7-7zm0 2.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z"/>
              <circle cx="12" cy="12" r="2.5" fill="#09090b"/>
            </svg>
          </div>
          <div>
            <div class="text-sm font-black text-white">YouthTrigger</div>
            <div class="text-[10px] font-extrabold text-lime-400 tracking-widest">ARENA</div>
          </div>
        </div>

        <!-- Center content -->
        <div class="relative z-10 space-y-7">
          <!-- Badge -->
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold text-violet-300" style="background:rgba(139,92,246,0.15);border:1px solid rgba(139,92,246,0.3);">
            <span class="w-2 h-2 rounded-full bg-violet-400 animate-pulse"></span>
            Super Admin · Management Portal
          </div>

          <div>
            <h1 class="text-5xl font-black text-white leading-tight tracking-tight">
              Pusat Kendali<br/><span style="background:linear-gradient(90deg,#c4b5fd,#8b5cf6);-webkit-background-clip:text;background-clip:text;color:transparent;">Akademi</span>
            </h1>
            <p class="text-zinc-500 text-base mt-4 leading-relaxed max-w-sm">
              Akses penuh ke manajemen siswa, pelatih, keuangan, dan laporan operasional YouthTrigger Arena.
            </p>
          </div>

          <!-- Capability list -->
          <ul class="space-y-3">
            ${[
              ['⚡','Approval pendaftaran &amp; seleksi siswa baru'],
              ['📊','Laporan keuangan &amp; pembayaran SPP real-time'],
              ['👥','Manajemen tim, pelatih, dan kurikulum latihan'],
              ['🔒','Audit log &amp; role-based access control penuh'],
            ].map(([icon, text]) => `
              <li class="flex items-center gap-3 text-sm text-zinc-400">
                <span class="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0" style="background:rgba(139,92,246,0.15);">${icon}</span>
                ${text}
              </li>
            `).join('')}
          </ul>
        </div>

        <!-- Bottom stats -->
        <div class="relative z-10 flex gap-6 border-t pt-6" style="border-color:rgba(139,92,246,0.2);">
          <div><div class="text-2xl font-black text-violet-300">58</div><div class="text-xs text-zinc-600">Siswa Aktif</div></div>
          <div><div class="text-2xl font-black text-violet-300">6</div><div class="text-xs text-zinc-600">Pelatih Berlisensi</div></div>
          <div><div class="text-2xl font-black text-violet-300">2</div><div class="text-xs text-zinc-600">Pending Review</div></div>
        </div>
      </div>

      <!-- Right: Login Form -->
      <div class="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-10 relative">

        <!-- Mobile logo -->
        <div class="lg:hidden flex items-center justify-between mb-8">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-xl gradient-lime flex items-center justify-center">
              <svg class="w-5 h-5 text-zinc-950" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z"/></svg>
            </div>
            <div class="text-sm font-black text-white">YouthTrigger <span class="text-lime-400">ARENA</span></div>
          </div>
          <button onclick="AuthView.showScreen('role-select')" class="text-xs text-zinc-500 hover:text-white">← Pilih Role</button>
        </div>

        <div class="max-w-sm w-full mx-auto lg:mx-0">

          <!-- Back (desktop) -->
          <button onclick="AuthView.showScreen('role-select')" class="hidden lg:flex items-center gap-1.5 text-xs text-zinc-600 hover:text-violet-400 transition-colors mb-8">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            Pilih Role Lain
          </button>

          <!-- Role badge -->
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6" style="background:rgba(139,92,246,0.15);color:#c4b5fd;border:1px solid rgba(139,92,246,0.3);">
            <span class="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse"></span> Admin Portal
          </div>

          <!-- Headline -->
          <h2 class="text-3xl font-black text-white mb-1">Halo, Admin!</h2>
          <p class="text-zinc-500 text-sm mb-8">Konfirmasi identitas Anda untuk mengakses pusat kendali.</p>

          <!-- Demo account card -->
          <button onclick="AuthView.loginAs('admin')"
            class="w-full p-5 rounded-2xl text-left mb-6 group transition-all duration-200 relative overflow-hidden"
            style="background:linear-gradient(135deg,rgba(139,92,246,0.15),rgba(109,40,217,0.08));border:1px solid rgba(139,92,246,0.35);">
            <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style="background:linear-gradient(135deg,rgba(139,92,246,0.1),transparent);"></div>
            <div class="relative flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black flex-shrink-0 shadow-lg" style="background:linear-gradient(135deg,rgba(109,40,217,0.5),rgba(139,92,246,0.4));box-shadow:0 0 20px rgba(139,92,246,0.3);">⚡</div>
                <div>
                  <div class="font-black text-white text-base">Super Admin</div>
                  <div class="text-xs text-zinc-400 font-mono mt-0.5">superadmin@youthtrigger.id</div>
                  <div class="text-xs text-violet-400 font-semibold mt-1">Full Access · All Modules</div>
                </div>
              </div>
              <div class="flex flex-col items-end gap-1">
                <span class="text-[10px] font-black px-2 py-0.5 rounded-full" style="background:rgba(139,92,246,0.25);color:#c4b5fd;">ADMIN</span>
                <svg class="w-5 h-5 text-violet-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </div>
            </div>
          </button>

          <!-- CTA -->
          <button onclick="AuthView.loginAs('admin')"
            class="w-full py-4 rounded-2xl font-black text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style="background:linear-gradient(135deg,#8b5cf6,#6d28d9);color:#fff;box-shadow:0 0 25px rgba(139,92,246,0.4);">
            ⚡ Masuk ke Admin Portal
          </button>

          <!-- Divider -->
          <div class="flex items-center gap-3 my-5">
            <div class="flex-1 h-px" style="background:rgba(255,255,255,0.07);"></div>
            <span class="text-xs text-zinc-600">atau</span>
            <div class="flex-1 h-px" style="background:rgba(255,255,255,0.07);"></div>
          </div>

          <!-- RBAC note -->
          <div class="flex items-start gap-2.5 p-3.5 rounded-xl text-xs" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);">
            <span class="text-violet-400 mt-0.5 flex-shrink-0">🔒</span>
            <span class="text-zinc-600 leading-relaxed">Autentikasi admin terproteksi 2FA dan audit log. Setiap aksi terekam di sistem.</span>
          </div>

        </div>

        <!-- Bottom -->
        <p class="absolute bottom-4 left-0 right-0 text-center text-xs text-zinc-700">© 2026 YouthTrigger Arena</p>
      </div>
    </div>`;
  }

  /* ================================================================
     SCREEN 2b: COACH LOGIN
  ================================================================ */
  function _screenCoachLogin() {
    return `
    <div class="auth-wrap min-h-screen w-full flex" style="background:linear-gradient(135deg,#0a0800 0%,#160f00 60%,#0a0800 100%);">

      <!-- Left: Tactical Board Branding -->
      <div class="hidden lg:flex flex-col justify-between w-[55%] relative overflow-hidden p-10"
           style="background:linear-gradient(135deg,rgba(217,119,6,0.10) 0%,transparent 70%);border-right:1px solid rgba(245,158,11,0.15);">

        <div class="absolute inset-0 opacity-15 pointer-events-none" style="background-image:linear-gradient(rgba(245,158,11,0.12) 1px,transparent 1px),linear-gradient(90deg,rgba(245,158,11,0.12) 1px,transparent 1px);background-size:52px 52px;"></div>
        <div class="absolute -top-20 -left-20 w-80 h-80 rounded-full pointer-events-none" style="background:radial-gradient(circle,rgba(245,158,11,0.12) 0%,transparent 70%);"></div>
        <div class="absolute bottom-10 right-0 w-64 h-64 rounded-full pointer-events-none" style="background:radial-gradient(circle,rgba(217,119,6,0.10) 0%,transparent 70%);"></div>

        <!-- Logo -->
        <div class="relative z-10 flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl gradient-lime flex items-center justify-center shadow-lg">
            <svg class="w-6 h-6 text-zinc-950" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z"/>
              <circle cx="12" cy="12" r="3" fill="#09090b"/>
            </svg>
          </div>
          <div>
            <div class="text-sm font-black text-white">YouthTrigger</div>
            <div class="text-[10px] font-extrabold text-lime-400 tracking-widest">ARENA</div>
          </div>
        </div>

        <!-- Tactical formation mini-visual -->
        <div class="relative z-10 space-y-7">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold text-amber-300" style="background:rgba(245,158,11,0.15);border:1px solid rgba(245,158,11,0.3);">
            <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            Pelatih · Coach Portal
          </div>

          <div>
            <h1 class="text-5xl font-black text-white leading-tight tracking-tight">
              Portal<br/><span style="background:linear-gradient(90deg,#fcd34d,#f59e0b);-webkit-background-clip:text;background-clip:text;color:transparent;">Pelatih</span>
            </h1>
            <p class="text-zinc-500 text-base mt-4 leading-relaxed max-w-sm">
              Kelola skuad binaan, pantau performa, input evaluasi teknis, dan jalin komunikasi langsung dengan siswa.
            </p>
          </div>

          <!-- Mini Tactical Board -->
          <div class="relative w-full max-w-xs aspect-[3/2] rounded-2xl overflow-hidden" style="background:linear-gradient(135deg,rgba(16,122,36,0.4),rgba(5,86,22,0.5));border:1px solid rgba(245,158,11,0.2);">
            <!-- Field lines -->
            <div class="absolute inset-2 rounded-xl" style="border:1px solid rgba(255,255,255,0.12);"></div>
            <div class="absolute top-1/2 left-2 right-2 h-px" style="background:rgba(255,255,255,0.1);"></div>
            <div class="absolute top-1/2 left-1/2 w-12 h-12 rounded-full -translate-x-1/2 -translate-y-1/2" style="border:1px solid rgba(255,255,255,0.1);"></div>
            <!-- Player dots -->
            ${[
              [50,15,'lime'],[20,30,'amber'],[50,30,'amber'],[80,30,'amber'],
              [20,55,'amber'],[50,55,'amber'],[80,55,'amber'],
              [30,75,'amber'],[50,75,'amber'],[70,75,'amber'],[50,88,'amber'],
            ].map(([x,y,c]) => `
              <div class="absolute w-2.5 h-2.5 rounded-full" style="left:${x}%;top:${y}%;transform:translate(-50%,-50%);background:${c==='lime'?'rgba(163,230,53,0.9)':'rgba(245,158,11,0.9)'};box-shadow:0 0 6px ${c==='lime'?'rgba(163,230,53,0.6)':'rgba(245,158,11,0.6)'};"></div>
            `).join('')}
            <div class="absolute top-2 right-3 text-[10px] font-bold text-amber-400 font-mono">4-3-3</div>
          </div>

          <ul class="space-y-2.5">
            ${[
              ['🎯','Input evaluasi teknis &amp; tactical feedback'],
              ['📋','Absensi latihan &amp; rekap kehadiran skuad'],
              ['💬','Pesan khusus via Discord Locker Room'],
            ].map(([icon, text]) => `
              <li class="flex items-center gap-3 text-sm text-zinc-400">
                <span class="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0" style="background:rgba(245,158,11,0.15);">${icon}</span>
                ${text}
              </li>
            `).join('')}
          </ul>
        </div>

        <!-- Bottom stats -->
        <div class="relative z-10 flex gap-6 border-t pt-6" style="border-color:rgba(245,158,11,0.2);">
          <div><div class="text-2xl font-black text-amber-300">14</div><div class="text-xs text-zinc-600">Siswa Binaan</div></div>
          <div><div class="text-2xl font-black text-amber-300">2</div><div class="text-xs text-zinc-600">Sesi Hari Ini</div></div>
          <div><div class="text-2xl font-black text-amber-300">93%</div><div class="text-xs text-zinc-600">Avg Kehadiran</div></div>
        </div>
      </div>

      <!-- Right: Coach Login Form -->
      <div class="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-10 relative">

        <!-- Mobile logo -->
        <div class="lg:hidden flex items-center justify-between mb-8">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-xl gradient-lime flex items-center justify-center">
              <svg class="w-5 h-5 text-zinc-950" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z"/></svg>
            </div>
            <div class="text-sm font-black text-white">YouthTrigger <span class="text-lime-400">ARENA</span></div>
          </div>
          <button onclick="AuthView.showScreen('role-select')" class="text-xs text-zinc-500 hover:text-white">← Pilih Role</button>
        </div>

        <div class="max-w-sm w-full mx-auto lg:mx-0">

          <button onclick="AuthView.showScreen('role-select')" class="hidden lg:flex items-center gap-1.5 text-xs text-zinc-600 hover:text-amber-400 transition-colors mb-8">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            Pilih Role Lain
          </button>

          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6" style="background:rgba(245,158,11,0.15);color:#fcd34d;border:1px solid rgba(245,158,11,0.3);">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span> Coach Portal
          </div>

          <h2 class="text-3xl font-black text-white mb-1">Selamat Datang,<br/>Coach! 👋</h2>
          <p class="text-zinc-500 text-sm mb-8">Konfirmasi identitas Anda untuk mengakses data skuad binaan.</p>

          <!-- Coach account card -->
          <button onclick="AuthView.loginAs('coach')"
            class="w-full p-5 rounded-2xl text-left mb-6 group transition-all duration-200 relative overflow-hidden"
            style="background:linear-gradient(135deg,rgba(245,158,11,0.12),rgba(217,119,6,0.06));border:1px solid rgba(245,158,11,0.35);">
            <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style="background:linear-gradient(135deg,rgba(245,158,11,0.08),transparent);"></div>
            <div class="relative flex items-center justify-between">
              <div class="flex items-center gap-4">
                <!-- Avatar initials -->
                <div class="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg flex-shrink-0 shadow-lg" style="background:linear-gradient(135deg,rgba(217,119,6,0.5),rgba(245,158,11,0.4));color:#fcd34d;box-shadow:0 0 20px rgba(245,158,11,0.25);">HS</div>
                <div>
                  <div class="font-black text-white text-base">Hendra Saputra</div>
                  <div class="text-xs text-zinc-400 font-mono mt-0.5">coach.hendra@youthtrigger.id</div>
                  <div class="text-xs text-amber-400 font-semibold mt-1">Head Coach · Lisensi AFC A</div>
                </div>
              </div>
              <div class="flex flex-col items-end gap-1">
                <span class="text-[10px] font-black px-2 py-0.5 rounded-full" style="background:rgba(245,158,11,0.2);color:#fcd34d;">COACH</span>
                <svg class="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </div>
            </div>
          </button>

          <button onclick="AuthView.loginAs('coach')"
            class="w-full py-4 rounded-2xl font-black text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style="background:linear-gradient(135deg,#f59e0b,#d97706);color:#1c0a00;box-shadow:0 0 25px rgba(245,158,11,0.35);">
            🎯 Masuk ke Coach Portal
          </button>

          <div class="flex items-center gap-3 my-5">
            <div class="flex-1 h-px" style="background:rgba(255,255,255,0.07);"></div>
            <span class="text-xs text-zinc-600">info</span>
            <div class="flex-1 h-px" style="background:rgba(255,255,255,0.07);"></div>
          </div>

          <div class="flex items-start gap-2.5 p-3.5 rounded-xl text-xs" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);">
            <span class="text-amber-400 mt-0.5 flex-shrink-0">🔒</span>
            <span class="text-zinc-600 leading-relaxed">Akses pelatih dibatasi sesuai skuad yang ditetapkan oleh Super Admin akademi.</span>
          </div>

        </div>

        <p class="absolute bottom-4 left-0 right-0 text-center text-xs text-zinc-700">© 2026 YouthTrigger Arena</p>
      </div>
    </div>`;
  }

  /* ================================================================
     SCREEN 2c: PLAYER LOGIN (FUT Card style)
  ================================================================ */
  function _screenPlayerLogin() {
    return `
    <div class="auth-wrap min-h-screen w-full flex" style="background:linear-gradient(135deg,#020f07 0%,#041a0a 60%,#020f07 100%);">

      <!-- Left: FUT-style Branding -->
      <div class="hidden lg:flex flex-col justify-between w-[55%] relative overflow-hidden p-10"
           style="background:linear-gradient(135deg,rgba(5,150,105,0.12) 0%,transparent 70%);border-right:1px solid rgba(16,185,129,0.15);">

        <div class="absolute inset-0 opacity-15 pointer-events-none" style="background-image:linear-gradient(rgba(16,185,129,0.12) 1px,transparent 1px),linear-gradient(90deg,rgba(16,185,129,0.12) 1px,transparent 1px);background-size:48px 48px;"></div>
        <div class="absolute -top-24 -left-24 w-80 h-80 rounded-full pointer-events-none" style="background:radial-gradient(circle,rgba(16,185,129,0.12) 0%,transparent 70%);"></div>
        <div class="absolute bottom-0 right-0 w-72 h-72 rounded-full pointer-events-none" style="background:radial-gradient(circle,rgba(5,150,105,0.10) 0%,transparent 70%);"></div>

        <!-- Logo -->
        <div class="relative z-10 flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl gradient-lime flex items-center justify-center shadow-lg">
            <svg class="w-6 h-6 text-zinc-950" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z"/>
              <circle cx="12" cy="12" r="3" fill="#09090b"/>
            </svg>
          </div>
          <div>
            <div class="text-sm font-black text-white">YouthTrigger</div>
            <div class="text-[10px] font-extrabold text-lime-400 tracking-widest">ARENA</div>
          </div>
        </div>

        <!-- Center: FUT Card showcase -->
        <div class="relative z-10 space-y-7">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold text-emerald-300" style="background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.3);">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Player Portal · Digital Locker Room
          </div>

          <div>
            <h1 class="text-5xl font-black text-white leading-tight tracking-tight">
              Portal<br/><span style="background:linear-gradient(90deg,#6ee7b7,#10b981);-webkit-background-clip:text;background-clip:text;color:transparent;">Siswa</span>
            </h1>
            <p class="text-zinc-500 text-base mt-4 leading-relaxed max-w-sm">
              Pantau perkembangan skill, statistik latihan, prestasi kompetisi, dan skor evaluasi pelatih secara real-time.
            </p>
          </div>

          <!-- FUT Card -->
          <div class="fut-card w-52 rounded-2xl p-4 border border-emerald-400/25 relative shadow-2xl" style="background:linear-gradient(145deg,rgba(5,46,22,0.9),rgba(3,30,15,0.95));">
            <div class="absolute top-3 left-3">
              <div class="text-2xl font-black text-lime-400 leading-none">89</div>
              <div class="text-[9px] font-black text-zinc-400 uppercase tracking-widest mt-0.5">OVR</div>
              <div class="text-[10px] font-bold text-white mt-0.5">CAM</div>
              <div class="text-[9px] font-semibold text-emerald-300">🇮🇩 IDN</div>
            </div>
            <div class="w-16 h-16 rounded-full gradient-lime flex items-center justify-center text-zinc-950 font-black text-xl mx-auto mt-1 mb-2 shadow-xl">#10</div>
            <h3 class="text-sm font-black text-white text-center tracking-tight">FARHAN RAMADHAN</h3>
            <div class="text-[10px] text-lime-400 font-bold text-center tracking-wider uppercase mb-3">YouthTrigger U-16</div>
            <div class="grid grid-cols-6 gap-0.5 text-center border-t border-white/10 pt-2 font-mono">
              ${[['88','PAC'],['85','SHO'],['92','PAS'],['89','DRI'],['74','DEF'],['81','PHY']].map(([v,l]) =>
                `<div><div class="text-[11px] font-black text-white">${v}</div><div class="text-[7px] text-zinc-500">${l}</div></div>`
              ).join('')}
            </div>
          </div>

          <ul class="space-y-2.5">
            ${[
              ['📈','Statistik performa &amp; grafik perkembangan skill'],
              ['🏆','Riwayat prestasi &amp; medali kompetisi'],
              ['💬','Pesan dari Coach via Digital Locker Room'],
            ].map(([icon, text]) => `
              <li class="flex items-center gap-3 text-sm text-zinc-400">
                <span class="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0" style="background:rgba(16,185,129,0.15);">${icon}</span>
                ${text}
              </li>
            `).join('')}
          </ul>
        </div>

        <!-- Bottom stats -->
        <div class="relative z-10 flex gap-6 border-t pt-6" style="border-color:rgba(16,185,129,0.2);">
          <div><div class="text-2xl font-black text-emerald-300">48</div><div class="text-xs text-zinc-600">Sesi Latihan</div></div>
          <div><div class="text-2xl font-black text-emerald-300">45%</div><div class="text-xs text-zinc-600">Kehadiran</div></div>
          <div><div class="text-2xl font-black text-emerald-300">8.7</div><div class="text-xs text-zinc-600">Rating</div></div>
        </div>
      </div>

      <!-- Right: Player Login Form -->
      <div class="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-10 relative">

        <!-- Mobile logo -->
        <div class="lg:hidden flex items-center justify-between mb-8">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-xl gradient-lime flex items-center justify-center">
              <svg class="w-5 h-5 text-zinc-950" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z"/></svg>
            </div>
            <div class="text-sm font-black text-white">YouthTrigger <span class="text-lime-400">ARENA</span></div>
          </div>
          <button onclick="AuthView.showScreen('role-select')" class="text-xs text-zinc-500 hover:text-white">← Pilih Role</button>
        </div>

        <div class="max-w-sm w-full mx-auto lg:mx-0">

          <button onclick="AuthView.showScreen('role-select')" class="hidden lg:flex items-center gap-1.5 text-xs text-zinc-600 hover:text-emerald-400 transition-colors mb-8">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            Pilih Role Lain
          </button>

          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6" style="background:rgba(16,185,129,0.15);color:#6ee7b7;border:1px solid rgba(16,185,129,0.3);">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Player Portal
          </div>

          <h2 class="text-3xl font-black text-white mb-1">Halo, Farhan! ⚽</h2>
          <p class="text-zinc-500 text-sm mb-8">Konfirmasi identitas untuk melihat dashboard performa Anda.</p>

          <!-- Player account card -->
          <button onclick="AuthView.loginAs('player')"
            class="w-full p-5 rounded-2xl text-left mb-6 group transition-all duration-200 relative overflow-hidden"
            style="background:linear-gradient(135deg,rgba(16,185,129,0.12),rgba(5,150,105,0.06));border:1px solid rgba(16,185,129,0.35);">
            <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style="background:linear-gradient(135deg,rgba(16,185,129,0.08),transparent);"></div>
            <div class="relative flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg flex-shrink-0 shadow-lg relative" style="background:linear-gradient(135deg,rgba(5,150,105,0.5),rgba(16,185,129,0.4));color:#6ee7b7;box-shadow:0 0 20px rgba(16,185,129,0.25);">
                  FR
                  <span class="absolute -bottom-1 -right-1 w-5 h-5 rounded-full gradient-lime text-zinc-950 text-[9px] font-black flex items-center justify-center shadow">#10</span>
                </div>
                <div>
                  <div class="font-black text-white text-base">Farhan Ramadhan</div>
                  <div class="text-xs text-zinc-400 font-mono mt-0.5">farhan.10@youthtrigger.id</div>
                  <div class="text-xs text-emerald-400 font-semibold mt-1">Attacking Midfielder · U-16 · ⭐ 8.7</div>
                </div>
              </div>
              <div class="flex flex-col items-end gap-1">
                <span class="text-[10px] font-black px-2 py-0.5 rounded-full" style="background:rgba(16,185,129,0.2);color:#6ee7b7;">SISWA</span>
                <svg class="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </div>
            </div>
          </button>

          <button onclick="AuthView.loginAs('player')"
            class="w-full py-4 rounded-2xl font-black text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style="background:linear-gradient(135deg,#10b981,#059669);color:#fff;box-shadow:0 0 25px rgba(16,185,129,0.35);">
            ⚽ Masuk ke Player Portal
          </button>

          <!-- Progress teaser -->
          <div class="mt-5 p-4 rounded-2xl space-y-3" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);">
            <div class="flex justify-between text-xs">
              <span class="text-zinc-500">Progress Musim 2026</span>
              <span class="text-emerald-400 font-bold">72%</span>
            </div>
            <div class="w-full h-1.5 rounded-full" style="background:rgba(255,255,255,0.08);">
              <div class="h-1.5 rounded-full" style="width:72%;background:linear-gradient(90deg,#10b981,#a3e635);"></div>
            </div>
            <div class="text-[11px] text-zinc-600">48 sesi latihan selesai · target 67 sesi</div>
          </div>

          <div class="mt-5 flex items-center gap-3">
            <div class="flex-1 h-px" style="background:rgba(255,255,255,0.07);"></div>
            <span class="text-xs text-zinc-600">belum terdaftar?</span>
            <div class="flex-1 h-px" style="background:rgba(255,255,255,0.07);"></div>
          </div>

          <button onclick="AuthView.showScreen('register')" class="w-full mt-4 py-3 rounded-2xl text-sm font-bold text-emerald-400 transition-all hover:bg-emerald-400/5" style="border:1px solid rgba(16,185,129,0.25);">
            Daftar Siswa Baru →
          </button>

        </div>

        <p class="absolute bottom-4 left-0 right-0 text-center text-xs text-zinc-700">© 2026 YouthTrigger Arena</p>
      </div>
    </div>`;
  }

  /* ================================================================
     SCREEN 3: REGISTER
  ================================================================ */
  function _screenRegister() {
    return `
    <div class="auth-wrap min-h-screen w-full flex" style="background:#060a12;">

      <!-- Left panel: slim branding -->
      <div class="hidden lg:flex flex-col justify-between w-[42%] relative overflow-hidden p-10"
           style="background:linear-gradient(135deg,rgba(163,230,53,0.08) 0%,transparent 70%);border-right:1px solid rgba(163,230,53,0.12);">
        <div class="absolute inset-0 opacity-20 pointer-events-none" style="background-image:linear-gradient(rgba(163,230,53,0.08) 1px,transparent 1px),linear-gradient(90deg,rgba(163,230,53,0.08) 1px,transparent 1px);background-size:44px 44px;"></div>
        <div class="absolute -top-20 -left-20 w-72 h-72 rounded-full pointer-events-none" style="background:radial-gradient(circle,rgba(163,230,53,0.10) 0%,transparent 70%);"></div>

        <!-- Logo -->
        <div class="relative z-10 flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl gradient-lime flex items-center justify-center shadow-lg">
            <svg class="w-6 h-6 text-zinc-950" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z"/>
              <circle cx="12" cy="12" r="3" fill="#09090b"/>
            </svg>
          </div>
          <div>
            <div class="text-sm font-black text-white">YouthTrigger</div>
            <div class="text-[10px] font-extrabold text-lime-400 tracking-widest">ARENA</div>
          </div>
        </div>

        <div class="relative z-10 space-y-6">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold text-lime-300" style="background:rgba(163,230,53,0.12);border:1px solid rgba(163,230,53,0.25);">
            <span class="w-2 h-2 rounded-full bg-lime-400 animate-pulse"></span>
            Pendaftaran Siswa Baru · 2026/2027
          </div>
          <h1 class="text-4xl font-black text-white leading-tight">
            Bergabung<br/><span class="text-gradient">Bersama Kami</span>
          </h1>
          <p class="text-zinc-500 text-sm leading-relaxed">
            Daftarkan diri Anda ke YouthTrigger Arena Football Academy. Setelah seleksi, akun portal akan diaktifkan oleh Admin.
          </p>
          <!-- Steps -->
          <div class="space-y-3">
            ${[
              ['1','Isi formulir pendaftaran online'],
              ['2','Dapat nomor registrasi otomatis'],
              ['3','Ikuti seleksi lapangan (Sabtu 08:00 WIB)'],
              ['4','Admin aktivasi akun portal Anda'],
            ].map(([n,t]) => `
              <div class="flex items-center gap-3 text-sm text-zinc-400">
                <span class="w-6 h-6 rounded-full gradient-lime flex items-center justify-center text-zinc-950 text-[10px] font-black flex-shrink-0">${n}</span>
                ${t}
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Progress indicator (decorative) -->
        <div class="relative z-10 space-y-2">
          <div class="flex items-center justify-between text-xs text-zinc-600 mb-1">
            <span>Kelengkapan Formulir</span>
            <span id="reg-pct" class="text-lime-400 font-bold">0%</span>
          </div>
          <div class="w-full h-1.5 rounded-full" style="background:rgba(255,255,255,0.07);">
            <div id="reg-bar" class="h-1.5 rounded-full transition-all duration-300" style="width:0%;background:linear-gradient(90deg,#a3e635,#4ade80);"></div>
          </div>
        </div>
      </div>

      <!-- Right: Register Form -->
      <div class="flex-1 overflow-y-auto">
        <div class="min-h-full px-6 sm:px-10 lg:px-12 py-8 max-w-lg mx-auto">

          <!-- Mobile logo -->
          <div class="lg:hidden flex items-center justify-between mb-6">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-xl gradient-lime flex items-center justify-center">
                <svg class="w-5 h-5 text-zinc-950" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z"/></svg>
              </div>
              <div class="text-sm font-black text-white">YouthTrigger <span class="text-lime-400">ARENA</span></div>
            </div>
            <button onclick="AuthView.showScreen('role-select')" class="text-xs text-zinc-500 hover:text-white">← Kembali</button>
          </div>

          <button onclick="AuthView.showScreen('role-select')" class="hidden lg:flex items-center gap-1.5 text-xs text-zinc-600 hover:text-lime-400 transition-colors mb-6">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            Kembali
          </button>

          <!-- Mobile progress bar -->
          <div class="lg:hidden mb-5 space-y-1">
            <div class="flex justify-between text-xs text-zinc-600">
              <span>Kelengkapan</span>
              <span id="reg-pct-m" class="text-lime-400 font-bold">0%</span>
            </div>
            <div class="w-full h-1 rounded-full" style="background:rgba(255,255,255,0.07);">
              <div id="reg-bar-m" class="h-1 rounded-full transition-all duration-300" style="width:0%;background:linear-gradient(90deg,#a3e635,#4ade80);"></div>
            </div>
          </div>

          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4" style="background:rgba(163,230,53,0.1);color:#a3e635;border:1px solid rgba(163,230,53,0.25);">
            <span class="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse"></span> Pendaftaran Resmi
          </div>

          <h2 class="text-2xl font-black text-white mb-1">Daftar Siswa Baru ⚽</h2>
          <p class="text-zinc-500 text-xs mb-6">YouthTrigger Arena · Musim 2026/2027</p>

          <form id="auth-reg-form" onsubmit="AuthView.submitRegistration(event)" class="space-y-4" oninput="AuthView._updateProgress()">

            <!-- Section 1 -->
            <div class="p-4 rounded-2xl space-y-3" style="background:rgba(163,230,53,0.04);border:1px solid rgba(163,230,53,0.12);">
              <div class="flex items-center gap-2 text-[11px] font-black text-lime-400 uppercase tracking-wider">
                <span class="w-5 h-5 rounded-full gradient-lime flex items-center justify-center text-zinc-950 text-[9px] font-black">1</span>
                Data Calon Siswa
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div class="col-span-2 sm:col-span-1">
                  <label class="auth-label">Nama Lengkap *</label>
                  <input required type="text" id="ar-name" placeholder="Nama lengkap siswa" class="auth-input w-full" data-track="1"/>
                </div>
                <div class="col-span-2 sm:col-span-1">
                  <label class="auth-label">Nama Panggilan *</label>
                  <input required type="text" id="ar-nick" placeholder="Contoh: Farhan" class="auth-input w-full" data-track="1"/>
                </div>
              </div>
              <div class="grid grid-cols-3 gap-3">
                <div class="col-span-3 sm:col-span-1">
                  <label class="auth-label">Tanggal Lahir *</label>
                  <input required type="date" id="ar-dob" value="2012-05-15" class="auth-input w-full" data-track="1"/>
                </div>
                <div class="col-span-3 sm:col-span-1">
                  <label class="auth-label">Jenis Kelamin *</label>
                  <select id="ar-gender" class="auth-input w-full" data-track="1">
                    <option value="L" selected>Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div class="col-span-3 sm:col-span-1">
                  <label class="auth-label">Kaki Dominan *</label>
                  <select id="ar-foot" class="auth-input w-full" data-track="1">
                    <option value="Kanan" selected>Kanan</option>
                    <option value="Kiri">Kiri</option>
                    <option value="Kedua Kaki">Kedua Kaki</option>
                  </select>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="auth-label">Kelompok Usia *</label>
                  <select id="ar-age" class="auth-input w-full" data-track="1">
                    <option value="U-8">U-8 · Grassroots Fun</option>
                    <option value="U-10">U-10 · Ball Mastery</option>
                    <option value="U-12">U-12 · Skill Builders</option>
                    <option value="U-14">U-14 · Tactical Squad</option>
                    <option value="U-16" selected>U-16 · Youth Elite</option>
                    <option value="U-18">U-18 · Pro Pathway</option>
                  </select>
                </div>
                <div>
                  <label class="auth-label">Posisi Minat *</label>
                  <select id="ar-pos" class="auth-input w-full" data-track="1">
                    <option value="Gelandang Serang (CAM)">Gelandang Serang (CAM)</option>
                    <option value="Penyerang Tengah (CF)">Penyerang (CF)</option>
                    <option value="Penyerang Sayap (LW/RW)">Sayap (LW/RW)</option>
                    <option value="Gelandang Bertahan (CDM)">Gelandang Bertahan (CDM)</option>
                    <option value="Bek Tengah (CB)">Bek Tengah (CB)</option>
                    <option value="Kiper Utama (GK)">Kiper (GK)</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Section 2 -->
            <div class="p-4 rounded-2xl space-y-3" style="background:rgba(56,189,248,0.04);border:1px solid rgba(56,189,248,0.12);">
              <div class="flex items-center gap-2 text-[11px] font-black text-sky-400 uppercase tracking-wider">
                <span class="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-black" style="background:rgba(56,189,248,0.3);">2</span>
                Data Orang Tua / Wali
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div class="col-span-2 sm:col-span-1">
                  <label class="auth-label">Nama Wali *</label>
                  <input required type="text" id="ar-guardian" placeholder="Nama ayah / ibu / wali" class="auth-input w-full" data-track="2"/>
                </div>
                <div class="col-span-2 sm:col-span-1">
                  <label class="auth-label">No. WhatsApp Wali *</label>
                  <input required type="tel" id="ar-phone" placeholder="08xxxxxxxxxx" class="auth-input w-full" data-track="2"/>
                </div>
              </div>
              <div>
                <label class="auth-label">Alamat Domisili *</label>
                <input required type="text" id="ar-address" placeholder="Kota / Wilayah tempat tinggal" class="auth-input w-full" data-track="2"/>
              </div>
            </div>

            <!-- Section 3 -->
            <div class="p-4 rounded-2xl space-y-2" style="background:rgba(245,158,11,0.04);border:1px solid rgba(245,158,11,0.12);">
              <div class="flex items-center gap-2 text-[11px] font-black text-amber-400 uppercase tracking-wider">
                <span class="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-black" style="background:rgba(245,158,11,0.3);">3</span>
                Informasi Medis (Opsional)
              </div>
              <input type="text" id="ar-health" placeholder="Riwayat cedera, asma, alergi (kosongkan jika sehat total)" class="auth-input w-full"/>
            </div>

            <!-- Agree -->
            <label class="flex items-start gap-3 cursor-pointer p-3 rounded-xl transition-colors hover:bg-white/5">
              <div class="relative mt-0.5 flex-shrink-0">
                <input required type="checkbox" id="ar-agree" class="sr-only"/>
                <div id="ar-check-box" class="w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center" style="border-color:rgba(255,255,255,0.2);background:rgba(255,255,255,0.03);">
                  <svg id="ar-check-tick" class="w-3 h-3 hidden" fill="none" stroke="#09090b" viewBox="0 0 24 24" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                </div>
              </div>
              <span class="text-xs text-zinc-500 leading-relaxed">
                Saya selaku orang tua/wali menyatakan data di atas benar dan menyetujui protokol seleksi serta tata tertib <span class="text-white font-semibold">YouthTrigger Arena</span>.
              </span>
            </label>

            <button type="submit" id="auth-reg-submit"
              class="btn-lime-glow w-full py-4 rounded-2xl font-black text-zinc-950 text-sm shadow-xl">
              Kirim Pendaftaran Resmi →
            </button>

          </form>

          <p class="text-center text-xs text-zinc-600 mt-5">
            Sudah punya akun?
            <button onclick="AuthView.showScreen('role-select')" class="text-lime-400 font-bold hover:underline ml-1">Pilih portal →</button>
          </p>

          <p class="text-center text-xs text-zinc-700 mt-6 pb-4">© 2026 YouthTrigger Arena · AFC &amp; PSSI Licensed Academy</p>
        </div>
      </div>
    </div>`;
  }

  /* ================================================================
     BASE STYLES (injected once)
  ================================================================ */
  function _injectBaseStyles() {
    if (document.getElementById('auth-styles')) return;
    const style = document.createElement('style');
    style.id = 'auth-styles';
    style.textContent = `
      #auth-root * { box-sizing: border-box; }
      .auth-label {
        display: block;
        font-size: 11px;
        font-weight: 600;
        color: #a1a1aa;
        margin-bottom: 6px;
      }
      .auth-input {
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.09);
        border-radius: 12px;
        padding: 10px 12px;
        font-size: 13px;
        color: #f4f4f5;
        outline: none;
        transition: border-color .2s, background .2s;
        width: 100%;
        font-family: inherit;
      }
      .auth-input::placeholder { color: #52525b; }
      .auth-input:focus {
        border-color: rgba(163,230,53,0.55);
        background: rgba(163,230,53,0.03);
      }
      .auth-input option { background: #0d1117; color: #f4f4f5; }
      .role-select-card:focus { outline: 2px solid rgba(163,230,53,0.4); outline-offset: 2px; }
    `;
    document.head.appendChild(style);
  }

  /* ================================================================
     BIND REGISTER EVENTS
  ================================================================ */
  function _bindRegisterEvents() {
    setTimeout(() => {
      const cb   = document.getElementById('ar-agree');
      const box  = document.getElementById('ar-check-box');
      const tick = document.getElementById('ar-check-tick');
      if (cb && box && tick) {
        cb.addEventListener('change', () => {
          if (cb.checked) {
            box.style.background = '#a3e635';
            box.style.borderColor = '#a3e635';
            tick.classList.remove('hidden');
          } else {
            box.style.background = 'rgba(255,255,255,0.03)';
            box.style.borderColor = 'rgba(255,255,255,0.2)';
            tick.classList.add('hidden');
          }
          _updateProgress();
        });
      }
    }, 50);
  }

  /* ================================================================
     PROGRESS BAR (register form)
  ================================================================ */
  function _updateProgress() {
    const fields = ['ar-name','ar-nick','ar-dob','ar-gender','ar-foot','ar-age','ar-pos','ar-guardian','ar-phone','ar-address'];
    const cb = document.getElementById('ar-agree');
    let filled = 0;
    fields.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.value && el.value.trim()) filled++;
    });
    if (cb && cb.checked) filled++;
    const pct = Math.round((filled / (fields.length + 1)) * 100);
    const pctStr = pct + '%';
    ['reg-pct','reg-pct-m'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = pctStr; });
    ['reg-bar','reg-bar-m'].forEach(id => { const el = document.getElementById(id); if (el) el.style.width = pctStr; });
  }

  /* ================================================================
     PUBLIC API
  ================================================================ */
  function showScreen(screen) {
    _screen = screen;
    _paint();
  }

  function loginAs(role) {
    const labels = { admin: 'Super Admin ⚡', coach: 'Coach Hendra 👨‍💼', player: 'Farhan Ramadhan #10 ⚽' };
    _dismiss();
    Header.switchRole(role);
    setTimeout(() => {
      if (typeof Utils !== 'undefined') Utils.showToast(`Login berhasil sebagai ${labels[role]}`, 'success');
    }, 150);
  }

  async function submitRegistration(e) {
    e.preventDefault();
    const btn = document.getElementById('auth-reg-submit');
    if (btn) { btn.disabled = true; btn.textContent = 'Memproses Pendaftaran...'; }

    const name     = (document.getElementById('ar-name')?.value     || '').trim() || 'Calon Siswa';
    const nick     = (document.getElementById('ar-nick')?.value     || '').trim() || name.split(' ')[0];
    const dob      = document.getElementById('ar-dob')?.value       || '2012-05-15';
    const gender   = document.getElementById('ar-gender')?.value    || 'L';
    const foot     = document.getElementById('ar-foot')?.value      || 'Kanan';
    const age      = document.getElementById('ar-age')?.value       || 'U-16';
    const pos      = document.getElementById('ar-pos')?.value       || 'Gelandang Serang (CAM)';
    const guardian = (document.getElementById('ar-guardian')?.value || '').trim() || 'Wali Siswa';
    const phone    = (document.getElementById('ar-phone')?.value    || '').trim() || '08xxxxxxxxxx';
    const address  = (document.getElementById('ar-address')?.value  || '').trim() || 'Bekasi';
    const health   = (document.getElementById('ar-health')?.value   || '').trim() || 'Sehat bebas riwayat cedera berat.';

    await new Promise(r => setTimeout(r, 1000));

    const newReg = KSA_STORE.addRegistration({
      name, nickname: nick, dob, gender,
      preferredFoot: foot, ageGroup: age, position: pos,
      guardianName: guardian, guardianPhone: phone,
      address, healthNotes: health,
      program: (age === 'U-16' || age === 'U-18') ? 'Elite Development Academy' : 'Grassroots Foundation'
    });

    // Success screen
    const root = document.getElementById('auth-root');
    if (root) root.innerHTML = `
    <div class="min-h-screen w-full flex items-center justify-center p-6" style="background:#060a12;">
      <div class="max-w-md w-full text-center space-y-7">
        <div class="relative mx-auto w-24 h-24">
          <div class="absolute inset-0 rounded-full gradient-lime opacity-20 animate-ping"></div>
          <div class="relative w-24 h-24 rounded-full gradient-lime flex items-center justify-center text-5xl text-zinc-950 font-black shadow-2xl">✓</div>
        </div>
        <div>
          <h2 class="text-3xl font-black text-white">Pendaftaran Diterima! 🎉</h2>
          <div class="text-lime-400 font-mono font-black text-xl mt-2">${newReg.id}</div>
          <div class="text-zinc-500 text-sm mt-1">${age} · ${pos}</div>
        </div>
        <div class="p-5 rounded-2xl text-sm text-left space-y-2.5" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);">
          <div class="flex justify-between"><span class="text-zinc-500">Nama Siswa</span><span class="text-white font-semibold">${esc(name)}</span></div>
          <div class="flex justify-between"><span class="text-zinc-500">Orang Tua/Wali</span><span class="text-white font-semibold">${esc(guardian)}</span></div>
          <div class="flex justify-between"><span class="text-zinc-500">WhatsApp</span><span class="text-white font-semibold">${esc(phone)}</span></div>
          <div class="flex justify-between"><span class="text-zinc-500">Status</span><span class="text-violet-400 font-bold">Pending Seleksi</span></div>
        </div>
        <p class="text-zinc-500 text-sm max-w-sm mx-auto">Data telah terkirim ke panel Admin. Jadwal uji coba akan dikonfirmasi via WhatsApp dalam 1-3 hari kerja.</p>
        <div class="flex gap-3">
          <button onclick="AuthView.goHome()" class="flex-1 py-3.5 rounded-2xl text-white font-bold text-sm transition-all hover:bg-white/10" style="border:1px solid rgba(255,255,255,0.1);">
            ← Beranda
          </button>
          <button onclick="AuthView.showScreen('login-player')" class="flex-1 py-3.5 rounded-2xl btn-lime-glow font-black text-zinc-950 text-sm shadow-xl">
            Masuk Portal →
          </button>
        </div>
      </div>
    </div>`;

    if (typeof Utils !== 'undefined') Utils.showToast(`Pendaftaran ${name} berhasil! No. ${newReg.id} ⚽`, 'success');
  }

  function goHome() {
    _dismiss();
    if (typeof Header !== 'undefined') Header.switchRole('visitor');
  }

  return {
    render,
    showScreen,
    loginAs,
    submitRegistration,
    goHome,
    dismiss: _dismiss,
    _updateProgress,
  };

})();
