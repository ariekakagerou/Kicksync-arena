/* ============================================================
   YouthTrigger Arena — Right Panel Component
   File: js/components/rightPanel.js
   ============================================================ */

const RightPanel = (() => {

  /* ---- Countdown state ---- */
  let _countdownInterval = null;

  function render() {
    const p = State.profileData;
    const el = document.getElementById('app-right');
    el.className = 'hidden lg:flex flex-col w-72 flex-shrink-0 glass border-l border-white/5 overflow-y-auto';
    el.innerHTML = `

      <!-- UPCOMING MATCH FIXTURE -->
      <div class="p-4">
        <div class="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-3">📅 Upcoming Match</div>
        <div class="fixture-card-bg rounded-2xl p-4">

          <!-- Teams row -->
          <div class="flex items-center justify-between gap-2 mb-4">
            <div class="text-center flex-1">
              <div class="w-10 h-10 rounded-full gradient-emerald mx-auto mb-1.5 flex items-center justify-center neon-glow">
                <span class="text-zinc-900 text-lg">⚽</span>
              </div>
              <div class="text-xs font-bold text-white leading-tight">YouthTrigger</div>
              <div class="text-xs text-emerald-400 font-medium">Academy</div>
            </div>
            <div class="text-center flex-shrink-0">
              <div class="text-base font-black text-white">VS</div>
              <div class="text-xs text-zinc-500 mt-0.5">Friendly</div>
            </div>
            <div class="text-center flex-1">
              <div class="w-10 h-10 rounded-full bg-red-500/20 border border-red-500/30 mx-auto mb-1.5 flex items-center justify-center">
                <span class="text-red-400 text-lg">🦅</span>
              </div>
              <div class="text-xs font-bold text-white leading-tight">Garuda</div>
              <div class="text-xs text-red-400 font-medium">Muda FC</div>
            </div>
          </div>

          <!-- Match info -->
          <div class="glass rounded-xl px-3 py-2 mb-4 space-y-1">
            <div class="flex items-center gap-2 text-xs text-zinc-400">
              <span>📍</span><span>Stadion Patriot, Bekasi</span>
            </div>
            <div class="flex items-center gap-2 text-xs text-zinc-400">
              <span>🗓️</span><span>Sabtu, 15 Nov 2026 · 16:00 WIB</span>
            </div>
          </div>

          <!-- Countdown -->
          <div class="text-center">
            <div class="text-xs text-zinc-500 mb-2">Kickoff dalam:</div>
            <div class="flex items-center justify-center gap-1.5">
              <div class="cd-digit rounded-lg px-2.5 py-2 min-w-10 text-center">
                <div class="text-xl font-black text-white font-mono" id="cd-h">--</div>
                <div class="text-xs text-zinc-500 mt-0.5">JAM</div>
              </div>
              <div class="text-white font-bold text-xl pb-4">:</div>
              <div class="cd-digit rounded-lg px-2.5 py-2 min-w-10 text-center">
                <div class="text-xl font-black text-white font-mono" id="cd-m">--</div>
                <div class="text-xs text-zinc-500 mt-0.5">MENIT</div>
              </div>
              <div class="text-white font-bold text-xl pb-4">:</div>
              <div class="cd-digit rounded-lg px-2.5 py-2 min-w-10 text-center">
                <div class="text-xl font-black text-emerald-400 font-mono" id="cd-s">--</div>
                <div class="text-xs text-zinc-500 mt-0.5">DETIK</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TODAY'S TRAINING -->
      <div class="px-4 pb-4">
        <div class="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-3">🏃 Today's Training</div>
        <div class="glass rounded-2xl p-4">
          <div class="flex items-start justify-between mb-3">
            <div>
              <div class="text-sm font-bold text-white">High Pressing &</div>
              <div class="text-sm font-bold text-emerald-400">Transition Drills</div>
            </div>
            <span class="text-xs bg-emerald-400/20 text-emerald-400 rounded-lg px-2 py-1 font-semibold border border-emerald-400/20">ACTIVE</span>
          </div>

          <div class="text-xs text-zinc-500 mb-2">Kehadiran Pemain</div>
          <div class="flex items-center gap-2 mb-3">
            <div class="flex-1 bg-zinc-800 rounded-full h-2 overflow-hidden">
              <div class="h-full gradient-emerald rounded-full stat-bar-fill" style="width:81.8%"></div>
            </div>
            <span class="text-sm font-bold text-white whitespace-nowrap">18/22</span>
          </div>

          <div class="flex flex-wrap gap-1 mb-3">
            <span class="text-xs bg-emerald-400/10 text-emerald-400 rounded-md px-1.5 py-0.5 border border-emerald-400/15">✓ Farhan</span>
            <span class="text-xs bg-emerald-400/10 text-emerald-400 rounded-md px-1.5 py-0.5 border border-emerald-400/15">✓ Azzam</span>
            <span class="text-xs bg-emerald-400/10 text-emerald-400 rounded-md px-1.5 py-0.5 border border-emerald-400/15">✓ Raffi</span>
            <span class="text-xs bg-zinc-700/40 text-zinc-500 rounded-md px-1.5 py-0.5 border border-zinc-700/30">✗ Bagas</span>
            <span class="text-xs bg-zinc-700/40 text-zinc-500 rounded-md px-1.5 py-0.5 border border-zinc-700/30">✗ Dimas</span>
            <span class="text-xs bg-emerald-400/10 text-emerald-400 rounded-md px-1.5 py-0.5 border border-emerald-400/15">+13 hadir</span>
          </div>

          <div class="space-y-1 text-xs text-zinc-500">
            <div class="flex items-center gap-2"><span>⏱️</span><span>Sesi dimulai: 06:30 WIB</span></div>
            <div class="flex items-center gap-2"><span>📍</span><span>Lapangan Utama – YouthTrigger Center</span></div>
          </div>
        </div>
      </div>

      <!-- QUICK PLAYER PROFILE -->
      <div class="px-4 pb-4">
        <div class="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-3">👤 Active Profile</div>
        <div class="glass rounded-2xl p-4">
          <!-- Avatar -->
          <div class="flex items-center gap-3 mb-4">
            <div class="relative flex-shrink-0">
              <div id="rp-avatar" class="w-14 h-14 rounded-2xl ${p.avatarBg} ${p.avatarText} flex items-center justify-center font-black text-xl online-ring select-none">
                ${p.initials}
              </div>
              <div id="rp-number" class="absolute -bottom-1 -right-1 w-7 h-7 glass rounded-lg flex items-center justify-center text-xs font-black border ${p.numberColor}">
                #${p.number}
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <div id="rp-name" class="font-bold text-white text-sm leading-tight">${p.name}</div>
              <div id="rp-badge" class="text-xs rounded-md px-1.5 py-0.5 font-bold inline-block mt-1 ${p.badgeCls}">${p.badge}</div>
              <div id="rp-team" class="text-xs text-zinc-500 mt-1">${p.team}</div>
            </div>
          </div>

          <!-- Stats grid -->
          <div class="grid grid-cols-3 gap-2 mb-4">
            <div class="glass rounded-xl p-2 text-center">
              <div id="rp-fitness" class="text-base font-black text-emerald-400">${p.fitness}%</div>
              <div class="text-xs text-zinc-500 mt-0.5">Fitness</div>
            </div>
            <div class="glass rounded-xl p-2 text-center">
              <div id="rp-attendance" class="text-base font-black text-sky-400">${p.attendance}</div>
              <div class="text-xs text-zinc-500 mt-0.5">Hadir</div>
            </div>
            <div class="glass rounded-xl p-2 text-center">
              <div id="rp-sessions" class="text-base font-black text-lime-400">${p.sessions}</div>
              <div class="text-xs text-zinc-500 mt-0.5">Sesi</div>
            </div>
          </div>

          <!-- Fitness bar -->
          <div class="mb-3">
            <div class="flex justify-between text-xs mb-1">
              <span class="text-zinc-500">Kebugaran Fisik</span>
              <span id="rp-fitness-label" class="text-emerald-400 font-semibold">${p.fitnessLabel}</span>
            </div>
            <div class="bg-zinc-800 rounded-full h-1.5 overflow-hidden">
              <div id="rp-fitness-bar" class="h-full gradient-emerald rounded-full stat-bar-fill" style="width:${p.fitness}%"></div>
            </div>
          </div>

          <!-- Status -->
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-emerald-400 pulse-dot flex-shrink-0"></div>
            <span id="rp-status" class="text-xs text-zinc-400">${p.status}</span>
          </div>
        </div>
      </div>

      <!-- QUICK STATS -->
      <div class="px-4 pb-6">
        <div class="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-3">📊 Quick Stats</div>
        <div class="glass rounded-2xl p-4 space-y-3">
          ${renderStatRow('Total Pemain Aktif', '58', 'text-white', '92%', 'bg-emerald-400')}
          ${renderStatRow('Win Rate Musim Ini', '73%', 'text-lime-400', '73%', 'bg-lime-400')}
          ${renderStatRow('Match Played', '15/20', 'text-sky-400', '75%', 'bg-sky-400')}
          ${renderStatRow('Goal This Season', '38', 'text-amber-400', '80%', 'bg-amber-400')}
        </div>
      </div>
    `;

    startCountdown();
  }

  function renderStatRow(label, value, valueCls, barW, barBg) {
    return `
      <div>
        <div class="flex items-center justify-between mb-1">
          <span class="text-xs text-zinc-400">${label}</span>
          <span class="text-sm font-bold ${valueCls}">${value}</span>
        </div>
        <div class="w-full bg-zinc-800 rounded-full h-1 overflow-hidden">
          <div class="${barBg} h-1 rounded-full stat-bar-fill" style="width:${barW}"></div>
        </div>
      </div>`;
  }

  function startCountdown() {
    if (_countdownInterval) clearInterval(_countdownInterval);
    tick();
    _countdownInterval = setInterval(tick, 1000);
  }

  function tick() {
    const now   = new Date();
    const match = new Date(now);
    match.setHours(16, 0, 0, 0);
    if (now >= match) match.setDate(match.getDate() + 1);
    const diff = match - now;
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const hEl = document.getElementById('cd-h');
    const mEl = document.getElementById('cd-m');
    const sEl = document.getElementById('cd-s');
    if (hEl) hEl.textContent = Utils.pad(h);
    if (mEl) mEl.textContent = Utils.pad(m);
    if (sEl) sEl.textContent = Utils.pad(s);
  }

  /* React to profile change */
  State.on('profile', () => {
    const p = State.profileData;
    const fields = {
      'rp-avatar':        { text: p.initials, cls: `w-14 h-14 rounded-2xl ${p.avatarBg} ${p.avatarText} flex items-center justify-center font-black text-xl online-ring select-none` },
      'rp-number':        { text: `#${p.number}`, cls: `absolute -bottom-1 -right-1 w-7 h-7 glass rounded-lg flex items-center justify-center text-xs font-black border ${p.numberColor}` },
      'rp-name':          { text: p.name },
      'rp-badge':         { text: p.badge, cls: `text-xs rounded-md px-1.5 py-0.5 font-bold inline-block mt-1 ${p.badgeCls}` },
      'rp-team':          { text: p.team },
      'rp-fitness':       { text: p.fitness + '%' },
      'rp-attendance':    { text: p.attendance },
      'rp-sessions':      { text: p.sessions },
      'rp-fitness-label': { text: p.fitnessLabel },
      'rp-status':        { text: p.status },
    };
    for (const [id, cfg] of Object.entries(fields)) {
      const el = document.getElementById(id);
      if (!el) continue;
      el.textContent = cfg.text;
      if (cfg.cls) el.className = cfg.cls;
    }
    const bar = document.getElementById('rp-fitness-bar');
    if (bar) bar.style.width = p.fitness + '%';
  });

  return { render };
})();
