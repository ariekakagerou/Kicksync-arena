/* ============================================================
   YouthTrigger Arena — Global State & Utilities
   File: js/state.js
   ============================================================ */

const State = (() => {
  let _role = 'visitor';
  let _playerTab = 'locker'; // 'locker', 'stats', 'schedule', 'badges'
  let _coachTab = 'squad';   // 'squad', 'training', 'lineup', 'analytics'
  let _activeChannel = 'u16-tactics';
  const _listeners = {};

  return {
    get role()          { return _role; },
    get roleData()      { return ROLES[_role]; },
    get playerTab()     { return _playerTab; },
    get coachTab()      { return _coachTab; },
    get activeChannel() { return _activeChannel; },

    setRole(id) {
      _role = id;
      this._emit('role', id);
    },
    setPlayerTab(tab) {
      _playerTab = tab;
      this._emit('playerTab', tab);
    },
    setCoachTab(tab) {
      _coachTab = tab;
      this._emit('coachTab', tab);
    },
    setChannel(ch) {
      _activeChannel = ch;
      this._emit('channel', ch);
    },

    on(event, fn) {
      if (!_listeners[event]) _listeners[event] = [];
      _listeners[event].push(fn);
    },
    _emit(event, data) {
      (_listeners[event] || []).forEach(fn => fn(data));
    }
  };
})();

const Utils = {
  escapeHtml(str) {
    if (!str) return '';
    const d = document.createElement('div');
    d.appendChild(document.createTextNode(str));
    return d.innerHTML;
  },
  currentTime() {
    return new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  },
  randomItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; },
  pad(n) { return String(n).padStart(2, '0'); },

  countdown(matchHour = 16) {
    const now = new Date();
    const t = new Date(now);
    t.setHours(matchHour, 0, 0, 0);
    if (now >= t) t.setDate(t.getDate() + 1);
    const diff = t - now;
    return {
      h: Utils.pad(Math.floor(diff / 3600000)),
      m: Utils.pad(Math.floor((diff % 3600000) / 60000)),
      s: Utils.pad(Math.floor((diff % 60000) / 1000)),
    };
  },

  showToast(msg, type = 'success') {
    const c = document.getElementById('toast-container');
    if (!c) return;
    const colors = {
      success: 'border-emerald-400/40 text-emerald-200 bg-zinc-900/90',
      info:    'border-sky-400/40 text-sky-200 bg-zinc-900/90',
      warning: 'border-amber-400/40 text-amber-200 bg-zinc-900/90',
      error:   'border-red-400/40 text-red-200 bg-zinc-900/90'
    };
    const dots = {
      success: 'bg-emerald-400',
      info:    'bg-sky-400',
      warning: 'bg-amber-400',
      error:   'bg-red-400'
    };
    const el = document.createElement('div');
    el.className = `pointer-events-auto glass-stronger rounded-xl px-4 py-2.5 flex items-center gap-2.5 text-sm font-medium shadow-2xl border ${colors[type] || colors.info} toast-anim backdrop-blur-md`;
    el.innerHTML = `<div class="w-2.5 h-2.5 rounded-full pulse-dot ${dots[type] || dots.info} flex-shrink-0"></div><span class="flex-1">${msg}</span>`;
    c.appendChild(el);
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(-8px)';
      el.style.transition = 'all 0.3s ease';
      setTimeout(() => el.remove(), 300);
    }, 3200);
  },

  /* Modal Helper */
  openModal(htmlContent, containerClass = 'max-w-lg') {
    const existing = document.getElementById('global-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'global-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm toast-anim';
    modal.onclick = (e) => {
      if (e.target === modal) Utils.closeModal();
    };
    modal.innerHTML = `
      <div class="relative glass-stronger rounded-2xl border border-white/10 ${containerClass} w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl text-left" onclick="event.stopPropagation()">
        <button onclick="Utils.closeModal()" class="absolute top-4 right-4 w-8 h-8 rounded-full glass flex items-center justify-center text-zinc-400 hover:text-white transition-colors z-20">✕</button>
        ${htmlContent}
      </div>
    `;
    document.body.appendChild(modal);
  },

  closeModal() {
    const modal = document.getElementById('global-modal');
    if (modal) {
      modal.style.opacity = '0';
      modal.style.transition = 'opacity 0.2s ease';
      setTimeout(() => modal.remove(), 200);
    }
  },

  /* Shared tactical board SVG */
  tacticalBoard() {
    return `<div class="attachment-preview mt-2 rounded-xl p-4 max-w-xs sm:max-w-sm">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <span class="text-emerald-400">📋</span>
          <span class="text-xs text-emerald-400 font-semibold">Tactical Board — 4-3-3 Formation</span>
        </div>
        <button onclick="Utils.openTacticalDetailModal()" class="text-xs text-emerald-400 hover:underline">Perbesar 🔍</button>
      </div>
      <div class="relative bg-green-950/70 rounded-lg border border-green-700/40 overflow-hidden cursor-pointer" style="aspect-ratio:3/2" onclick="Utils.openTacticalDetailModal()">
        <svg viewBox="0 0 300 200" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="200" fill="rgba(16,100,40,0.5)"/>
          <line x1="150" y1="0" x2="150" y2="200" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
          <circle cx="150" cy="100" r="30" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
          <rect x="20" y="60" width="50" height="80" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
          <rect x="230" y="60" width="50" height="80" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
          <!-- Players -->
          <circle cx="35" cy="100" r="8" fill="#f59e0b"/><text x="35" y="104" text-anchor="middle" fill="white" font-size="7" font-weight="bold">GK</text>
          <circle cx="85" cy="45" r="7" fill="#3b82f6"/><text x="85" y="49" text-anchor="middle" fill="white" font-size="6.5">LB</text>
          <circle cx="85" cy="80" r="7" fill="#3b82f6"/><text x="85" y="84" text-anchor="middle" fill="white" font-size="6.5">CB</text>
          <circle cx="85" cy="120" r="7" fill="#3b82f6"/><text x="85" y="124" text-anchor="middle" fill="white" font-size="6.5">CB</text>
          <circle cx="85" cy="155" r="7" fill="#3b82f6"/><text x="85" y="159" text-anchor="middle" fill="white" font-size="6.5">RB</text>
          <circle cx="145" cy="65" r="7" fill="#10b981"/><text x="145" y="69" text-anchor="middle" fill="white" font-size="6.5">CM</text>
          <circle cx="145" cy="100" r="9" fill="#34d399" stroke="#fff" stroke-width="1.5"/><text x="145" y="104" text-anchor="middle" fill="#052e16" font-size="7" font-weight="bold">#10</text>
          <circle cx="145" cy="135" r="7" fill="#10b981"/><text x="145" y="139" text-anchor="middle" fill="white" font-size="6.5">CM</text>
          <circle cx="215" cy="55" r="7" fill="#f97316"/><text x="215" y="59" text-anchor="middle" fill="white" font-size="6.5">LW</text>
          <circle cx="225" cy="100" r="7" fill="#f97316"/><text x="225" y="104" text-anchor="middle" fill="white" font-size="6.5">ST</text>
          <circle cx="215" cy="145" r="7" fill="#f97316"/><text x="215" y="149" text-anchor="middle" fill="white" font-size="6.5">RW</text>
          <defs><marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="#34d399"/></marker></defs>
          <path d="M155,95 L175,95" stroke="#34d399" stroke-width="1.8" marker-end="url(#arr)" stroke-dasharray="3,2"/>
        </svg>
      </div>
      <div class="mt-2.5 flex items-center justify-between text-xs text-zinc-400">
        <span class="truncate">Formation_443_vs_GarudaMuda.png</span>
        <button onclick="Utils.showToast('Gambar taktik tersimpan ke perangkat 📥','success')" class="text-emerald-400 font-semibold hover:text-emerald-300 ml-2">↓ Simpan</button>
      </div>
    </div>`;
  },

  openTacticalDetailModal() {
    Utils.openModal(`
      <div class="space-y-4">
        <div class="flex items-center gap-2">
          <span class="text-2xl">📋</span>
          <div>
            <h3 class="text-lg font-bold text-white">Papan Taktik Interaktif: Formasi 4-3-3</h3>
            <p class="text-xs text-emerald-400">Strategi Utama: High Pressing & Fast Counter Attack</p>
          </div>
        </div>
        <div class="relative bg-green-950/90 rounded-xl p-3 border border-green-700/50">
          <svg viewBox="0 0 300 200" class="w-full h-auto rounded-lg" xmlns="http://www.w3.org/2000/svg">
            <rect width="300" height="200" fill="rgba(16,100,40,0.6)"/>
            <line x1="150" y1="0" x2="150" y2="200" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
            <circle cx="150" cy="100" r="30" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
            <rect x="15" y="55" width="55" height="90" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
            <rect x="230" y="55" width="55" height="90" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
            <!-- Players with names -->
            <circle cx="35" cy="100" r="9" fill="#f59e0b"/><text x="35" y="103" text-anchor="middle" fill="white" font-size="7" font-weight="bold">Rizki</text>
            <circle cx="85" cy="45" r="9" fill="#3b82f6"/><text x="85" y="48" text-anchor="middle" fill="white" font-size="6.5">Raffi (LB)</text>
            <circle cx="85" cy="80" r="9" fill="#3b82f6"/><text x="85" y="83" text-anchor="middle" fill="white" font-size="6.5">Dani (CB)</text>
            <circle cx="85" cy="120" r="9" fill="#3b82f6"/><text x="85" y="123" text-anchor="middle" fill="white" font-size="6.5">Alif (CB)</text>
            <circle cx="85" cy="155" r="9" fill="#3b82f6"/><text x="85" y="158" text-anchor="middle" fill="white" font-size="6.5">Budi (RB)</text>
            <circle cx="145" cy="65" r="9" fill="#10b981"/><text x="145" y="68" text-anchor="middle" fill="white" font-size="6.5">Fikri</text>
            <circle cx="145" cy="100" r="11" fill="#34d399" stroke="#fff" stroke-width="2"/><text x="145" y="103" text-anchor="middle" fill="#052e16" font-size="7" font-weight="bold">Farhan #10</text>
            <circle cx="145" cy="135" r="9" fill="#10b981"/><text x="145" y="138" text-anchor="middle" fill="white" font-size="6.5">Ilham</text>
            <circle cx="215" cy="55" r="9" fill="#f97316"/><text x="215" y="58" text-anchor="middle" fill="white" font-size="6.5">Dimas (LW)</text>
            <circle cx="230" cy="100" r="9" fill="#f97316"/><text x="230" y="103" text-anchor="middle" fill="white" font-size="6.5">Bagas (ST)</text>
            <circle cx="215" cy="145" r="9" fill="#f97316"/><text x="215" y="148" text-anchor="middle" fill="white" font-size="6.5">Azzam (RW)</text>
          </svg>
        </div>
        <div class="glass rounded-xl p-3 text-xs text-zinc-300 space-y-2">
          <div class="flex items-start gap-2">
            <span class="text-emerald-400 font-bold">•</span>
            <span><strong>Peran #10 (Farhan):</strong> Distribusi bola cepat ke sektor sayap dan aktif melakukan pressing agresif dalam kurun waktu 5 detik transisi.</span>
          </div>
          <div class="flex items-start gap-2">
            <span class="text-sky-400 font-bold">•</span>
            <span><strong>Fullbacks (LB & RB):</strong> Support overlap saat possession bola di sepertiga akhir lawan.</span>
          </div>
        </div>
        <button onclick="Utils.closeModal()" class="w-full send-btn py-2.5 rounded-xl font-bold text-zinc-950 text-sm">Mengerti & Tutup</button>
      </div>
    `);
  },

  /* Shared chat bubble builder */
  buildBubble(msg, delivered = false) {
    const quote = msg.quoteFrom
      ? `<div class="mt-1 border-l-2 border-emerald-500/50 pl-2 py-0.5 mb-1 bg-white/2 rounded-r">
           <span class="text-xs text-zinc-400 font-medium">↩ ${msg.quoteFrom}</span>
           <div class="text-xs text-zinc-300 truncate">${msg.quoteText}</div>
         </div>` : '';
    const attachment = msg.attachment === 'tactical-board' ? Utils.tacticalBoard() : '';
    const reactions = msg.reactions?.length
      ? `<div class="mt-1.5 flex items-center gap-1.5 flex-wrap">
          ${msg.reactions.map(r => `<div onclick="Utils.showToast('Reaksi ${r.emoji} ditambahkan!','info')" class="glass rounded-full px-2 py-0.5 flex items-center gap-1 cursor-pointer hover:bg-emerald-400/20 transition-all border border-white/5 hover:border-emerald-400/30"><span class="text-xs">${r.emoji}</span><span class="text-xs text-zinc-300 font-semibold">${r.count}</span></div>`).join('')}
         </div>` : '';
    const ann = msg.isAnnouncement
      ? `<div class="mb-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-400/15 border border-amber-400/30 text-xs text-amber-300 font-bold"><span>📢</span><span>PENGUMUMAN RESMI</span></div>` : '';
    const del = delivered ? `<span class="text-xs text-emerald-400 ml-auto flex items-center">✓✓</span>` : '';

    return `<div class="msg-anim msg-row flex gap-3 py-2.5 rounded-xl px-2.5 -mx-2 transition-colors">
      <div class="w-8 h-8 rounded-full ${msg.avatarBg} ${msg.avatarText} flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5 select-none shadow-md">${msg.initials}</div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 flex-wrap mb-0.5">
          <span class="font-bold text-white text-sm">${msg.name}</span>
          <span class="text-xs rounded-md px-1.5 py-0.5 font-bold ${msg.badgeCls}">${msg.badgeText}</span>
          <span class="text-xs text-zinc-500">${msg.time}</span>
          ${del}
        </div>
        ${ann}${quote}
        <div class="text-sm text-zinc-200 leading-relaxed">${msg.text}</div>
        ${attachment}${reactions}
      </div>
    </div>`;
  }
};
