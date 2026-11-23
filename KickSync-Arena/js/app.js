/* ============================================================
   YouthTrigger Arena v3.5 — App Entry Point (3-Role Router)
   File: js/app.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Render persistent header ---- */
  Header.render();

  /* ---- View router ---- */
  function renderView(role) {
    const container = document.getElementById('app-view');
    const headerEl = document.getElementById('app-header');
    if (!container) return;

    // Scroll to top on every role switch
    container.scrollTop = 0;

    // Header visibility: HANYA tampil untuk pengunjung ('visitor'), sembunyikan untuk 3 role (admin, coach, player)
    const isVisitor = (role === 'visitor');
    if (headerEl) {
      headerEl.style.display = isVisitor ? 'block' : 'none';
    }

    switch (role) {
      case 'visitor':
        container.className = 'overflow-y-auto overflow-x-hidden';
        container.style.height = 'calc(100vh - 64px)';
        container.style.height = 'calc(100dvh - 64px)';
        VisitorView.render(container);
        break;
      case 'player':
        container.className = 'overflow-hidden';
        container.style.height = '100vh';
        container.style.height = '100dvh';
        PlayerView.render(container);
        break;
      case 'coach':
        container.className = 'overflow-hidden';
        container.style.height = '100vh';
        container.style.height = '100dvh';
        CoachView.render(container);
        break;
      case 'admin':
        container.className = 'overflow-hidden';
        container.style.height = '100vh';
        container.style.height = '100dvh';
        if (typeof AdminView !== 'undefined') {
          AdminView.render(container);
        }
        break;
    }

    if (typeof Header !== 'undefined' && typeof Header.syncHeaderForRole === 'function') {
      Header.syncHeaderForRole(role);
    }
  }

  /* ---- Listen to role changes ---- */
  State.on('role', (role) => {
    renderView(role);
    const names = {
      visitor: 'Beranda Pengunjung 👁️',
      player:  'Dashboard Siswa — Farhan #10 ⚽',
      coach:   'Dashboard Pelatih — Coach Hendra 👨‍💼',
      admin:   'Admin Management Portal ⚡',
    };
    Utils.showToast(`Beralih ke ${names[role] || role}`, 'info');
  });

  /* ---- Initial render: Visitor landing ---- */
  renderView('visitor');

  console.log(
    '%c⚽ YouthTrigger Arena v3.5 — Athletic Tech UI Initialized',
    'color:#a3e635;font-weight:bold;font-size:14px;background:#09090b;padding:4px 8px;border-radius:4px'
  );
});
