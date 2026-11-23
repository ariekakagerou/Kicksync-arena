/* ============================================================
   YouthTrigger Arena — Sidebar Component
   File: js/components/sidebar.js
   ============================================================ */

const Sidebar = (() => {

  function render() {
    const p = State.profileData;
    document.getElementById('app-sidebar').innerHTML = `
      <div id="sidebar-inner"
        class="hidden lg:flex flex-col w-64 flex-shrink-0 glass border-r border-white/5 overflow-y-auto h-full">

        <!-- NAV MENU -->
        <div class="p-3 space-y-0.5 pt-4">
          <div class="text-xs text-zinc-500 font-bold uppercase tracking-widest px-3 py-2">Main Menu</div>

          ${renderNavItem('dashboard', '📊', 'Dashboard & Overview', true)}
          ${renderNavItem('squad',     '⚽', 'Squad Roster', false, '58')}
          ${renderNavItem('training',  '📅', 'Training & Fixtures')}
          ${renderNavItem('locker',    '💬', 'Locker Room', false, '3', 'badge-red')}
        </div>

        <div class="mx-4 border-t border-white/5 my-1"></div>

        <!-- LOCKER ROOM CHANNELS -->
        <div class="p-3 space-y-0.5">
          <div class="text-xs text-zinc-500 font-bold uppercase tracking-widest px-3 py-2">Locker Room</div>
          ${CHANNELS.map(ch => renderChannel(ch)).join('')}

          <!-- SQUADS -->
          <div class="text-xs text-zinc-500 font-bold uppercase tracking-widest px-3 pt-3 pb-1">Squads</div>
          ${SQUADS.map(sq => renderSquadItem(sq)).join('')}
        </div>

        <!-- SPACER -->
        <div class="flex-1"></div>

        <!-- USER FOOTER -->
        <div class="p-3 border-t border-white/5">
          <div class="flex items-center gap-3 px-3 py-2.5 glass rounded-xl cursor-pointer hover:bg-white/5 transition-all">
            <div id="sidebar-avatar"
              class="w-8 h-8 rounded-full ${p.avatarBg} ${p.avatarText} flex items-center justify-center font-bold text-xs online-ring flex-shrink-0">
              ${p.initials}
            </div>
            <div class="flex-1 min-w-0">
              <div id="sidebar-name" class="text-sm font-semibold text-white truncate">${p.name}</div>
              <div id="sidebar-role" class="text-xs ${p.roleColor} truncate">${p.role} · Online</div>
            </div>
            <svg class="w-4 h-4 text-zinc-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </div>
        </div>
      </div>
    `;
  }

  function renderNavItem(id, icon, label, active = false, badge = null, badgeType = 'badge-green') {
    const activeCls = active ? 'active bg-emerald-400/10 text-emerald-300 border-emerald-400' : 'text-zinc-400 border-transparent';
    const badgeHtml = badge
      ? (badgeType === 'badge-red'
          ? `<span class="text-xs bg-red-400/20 text-red-400 rounded-full px-1.5 py-0.5 font-semibold">${badge}</span>`
          : `<span class="text-xs bg-emerald-400/20 text-emerald-400 rounded-full px-1.5 py-0.5 font-semibold">${badge}</span>`)
      : '';
    return `
      <button onclick="Sidebar.setNav('${id}', this)"
        class="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${activeCls} transition-all">
        <span class="text-base">${icon}</span>
        <div class="flex-1 flex items-center justify-between min-w-0">
          <span class="truncate">${label}</span>${badgeHtml}
        </div>
      </button>`;
  }

  function renderChannel(ch) {
    const activeCls = ch.active ? 'active bg-white/6 text-zinc-200' : 'text-zinc-400';
    const dot = ch.dotColor ? `<div class="w-1.5 h-1.5 rounded-full ${ch.dotColor} flex-shrink-0"></div>` : '';
    const badge = ch.badge ? `<span class="text-xs bg-red-500/20 text-red-400 rounded-full px-1.5 py-0.5 font-semibold">${ch.badge}</span>` : dot;
    return `
      <button onclick="Sidebar.setChannel('${ch.id}', this)"
        class="channel-item w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all text-left ${activeCls}">
        <span class="${ch.color} font-mono">#</span>
        <span class="flex-1 truncate">${ch.label}</span>
        ${badge}
      </button>`;
  }

  function renderSquadItem(sq) {
    const activeCls = sq.active ? 'bg-white/6 text-zinc-200' : 'text-zinc-400';
    return `
      <div class="channel-item w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all cursor-pointer text-left ${activeCls}">
        <div class="w-2 h-2 rounded-full ${sq.dot} flex-shrink-0"></div>
        <span class="flex-1">${sq.label}</span>
        <span class="text-xs text-zinc-600">${sq.count} players</span>
      </div>`;
  }

  function setNav(id, el) {
    State.setNav(id);
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.classList.remove('active', 'bg-emerald-400/10', 'text-emerald-300', 'border-emerald-400');
      btn.classList.add('text-zinc-400', 'border-transparent');
    });
    el.classList.add('active', 'bg-emerald-400/10', 'text-emerald-300', 'border-emerald-400');
    el.classList.remove('text-zinc-400', 'border-transparent');
  }

  function setChannel(id, el) {
    State.setChannel(id);
    document.querySelectorAll('.channel-item').forEach(btn => {
      btn.classList.remove('active', 'bg-white/6', 'text-zinc-200');
      btn.classList.add('text-zinc-400');
    });
    el.classList.add('active', 'bg-white/6', 'text-zinc-200');
    el.classList.remove('text-zinc-400');
  }

  function openMobile() {
    const inner = document.getElementById('sidebar-inner');
    const overlay = document.getElementById('mobile-overlay');
    if (!inner) return;
    inner.classList.remove('hidden');
    inner.classList.add('fixed', 'inset-y-0', 'left-0', 'z-50', 'shadow-2xl');
    overlay.classList.remove('hidden');
    overlay.onclick = closeMobile;
  }

  function closeMobile() {
    const inner = document.getElementById('sidebar-inner');
    const overlay = document.getElementById('mobile-overlay');
    if (!inner) return;
    inner.classList.add('hidden');
    inner.classList.remove('fixed', 'inset-y-0', 'left-0', 'z-50', 'shadow-2xl');
    overlay.classList.add('hidden');
  }

  /* React to profile changes */
  State.on('profile', () => {
    const p = State.profileData;
    const av = document.getElementById('sidebar-avatar');
    if (av) {
      av.textContent = p.initials;
      av.className = `w-8 h-8 rounded-full ${p.avatarBg} ${p.avatarText} flex items-center justify-center font-bold text-xs online-ring flex-shrink-0`;
    }
    const nm = document.getElementById('sidebar-name');
    if (nm) nm.textContent = p.name;
    const rl = document.getElementById('sidebar-role');
    if (rl) { rl.textContent = `${p.role} · Online`; rl.className = `text-xs ${p.roleColor} truncate`; }
  });

  return { render, setNav, setChannel, openMobile, closeMobile };
})();
