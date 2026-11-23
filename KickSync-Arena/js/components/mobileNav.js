/* ============================================================
   YouthTrigger Arena — Mobile Nav Component
   File: js/components/mobileNav.js
   ============================================================ */

const MobileNav = (() => {

  const NAV_ITEMS = [
    { id: 'dashboard', icon: '📊', label: 'Home',   active: true },
    { id: 'squad',     icon: '⚽', label: 'Squad' },
    { id: 'locker',    icon: '💬', label: 'Chat',  badge: 3 },
    { id: 'training',  icon: '📅', label: 'Jadwal' },
  ];

  function render() {
    document.getElementById('app-mobile-nav').innerHTML = `
      <div class="glass-stronger border-t border-white/5 w-full flex items-center justify-around px-4 py-2">
        ${NAV_ITEMS.map(item => `
          <button onclick="MobileNav.select('${item.id}', this)"
            class="mobile-nav-btn flex flex-col items-center gap-1 p-2 relative ${item.active ? 'active' : 'text-zinc-500'}">
            <span class="text-xl leading-none">${item.icon}</span>
            ${item.badge ? `<div class="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white font-bold" style="font-size:9px">${item.badge}</div>` : ''}
            <span class="text-xs font-medium">${item.label}</span>
          </button>
        `).join('')}
      </div>
    `;
  }

  function select(id, el) {
    State.setNav(id);
    document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
      btn.classList.remove('active');
      btn.classList.add('text-zinc-500');
    });
    el.classList.add('active');
    el.classList.remove('text-zinc-500');
  }

  return { render, select };
})();
