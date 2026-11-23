/* ============================================================
   YouthTrigger Arena — Chat Component
   File: js/components/chat.js
   ============================================================ */

const Chat = (() => {

  /* ---- Tactical Board SVG ---- */
  const TACTICAL_BOARD_HTML = `
    <div class="attachment-preview mt-2 rounded-xl p-4 max-w-xs">
      <div class="flex items-center gap-2 mb-3">
        <span class="text-emerald-400">📋</span>
        <span class="text-xs text-emerald-400 font-semibold">Tactical Board — 4-3-3 Formation</span>
      </div>
      <div class="relative bg-green-900/40 rounded-lg border border-green-700/30 overflow-hidden" style="aspect-ratio:3/2;">
        <svg viewBox="0 0 300 200" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="200" fill="rgba(16,100,40,0.5)"/>
          <line x1="150" y1="0" x2="150" y2="200" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
          <circle cx="150" cy="100" r="30" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
          <rect x="20" y="60" width="50" height="80" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
          <rect x="230" y="60" width="50" height="80" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
          <!-- GK -->
          <circle cx="30" cy="100" r="8" fill="#f59e0b"/>
          <text x="30" y="104" text-anchor="middle" fill="white" font-size="7" font-weight="bold">GK</text>
          <!-- DEF 4 -->
          <circle cx="80" cy="45" r="7" fill="#3b82f6"/>
          <text x="80" y="49" text-anchor="middle" fill="white" font-size="6.5">LB</text>
          <circle cx="80" cy="80" r="7" fill="#3b82f6"/>
          <text x="80" y="84" text-anchor="middle" fill="white" font-size="6.5">CB</text>
          <circle cx="80" cy="120" r="7" fill="#3b82f6"/>
          <text x="80" y="124" text-anchor="middle" fill="white" font-size="6.5">CB</text>
          <circle cx="80" cy="155" r="7" fill="#3b82f6"/>
          <text x="80" y="159" text-anchor="middle" fill="white" font-size="6.5">RB</text>
          <!-- MID 3 -->
          <circle cx="140" cy="65" r="7" fill="#10b981"/>
          <text x="140" y="69" text-anchor="middle" fill="white" font-size="6.5">CM</text>
          <circle cx="140" cy="100" r="9" fill="#34d399" stroke="#fff" stroke-width="1.5"/>
          <text x="140" y="104" text-anchor="middle" fill="#052e16" font-size="7" font-weight="bold">#10</text>
          <circle cx="140" cy="135" r="7" fill="#10b981"/>
          <text x="140" y="139" text-anchor="middle" fill="white" font-size="6.5">CM</text>
          <!-- FWD 3 -->
          <circle cx="210" cy="55" r="7" fill="#f97316"/>
          <text x="210" y="59" text-anchor="middle" fill="white" font-size="6.5">LW</text>
          <circle cx="222" cy="100" r="7" fill="#f97316"/>
          <text x="222" y="104" text-anchor="middle" fill="white" font-size="6.5">ST</text>
          <circle cx="210" cy="145" r="7" fill="#f97316"/>
          <text x="210" y="149" text-anchor="middle" fill="white" font-size="6.5">RW</text>
          <!-- Arrows -->
          <path d="M148,97 L160,97" stroke="#34d399" stroke-width="1.5" marker-end="url(#arr)" opacity="0.7"/>
          <path d="M148,103 L160,103" stroke="#34d399" stroke-width="1.5" marker-end="url(#arr)" opacity="0.5"/>
          <defs>
            <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
              <path d="M0 0 L10 5 L0 10z" fill="#34d399"/>
            </marker>
          </defs>
        </svg>
      </div>
      <div class="mt-2 flex items-center justify-between text-xs text-zinc-500">
        <span>Formation_443_vs_GarudaMuda.png</span>
        <button class="text-emerald-400 hover:text-emerald-300 transition-colors font-medium">↓ Save</button>
      </div>
    </div>`;

  /* ---- Build a message bubble HTML ---- */
  function buildBubble(msg, delivered = false) {
    const quote = msg.quoteFrom
      ? `<div class="mt-1 border-l-2 border-zinc-600 pl-2 py-0.5 mb-1">
           <span class="text-xs text-zinc-500">↩ ${msg.quoteFrom}</span>
           <div class="text-xs text-zinc-400 truncate">${msg.quoteText}</div>
         </div>` : '';
    const attachment = msg.attachment === 'tactical-board' ? TACTICAL_BOARD_HTML : '';
    const reactions = msg.reactions?.length
      ? `<div class="mt-1.5 flex items-center gap-1.5">
          ${msg.reactions.map(r => `
            <div class="glass rounded-full px-2 py-0.5 flex items-center gap-1 reaction-chip">
              <span class="text-xs">${r.emoji}</span>
              <span class="text-xs text-zinc-400">${r.count}</span>
            </div>`).join('')}
         </div>` : '';
    const deliveredBadge = delivered
      ? `<span class="text-xs bg-emerald-400/10 text-emerald-400 rounded px-1 py-0.5">✓✓</span>` : '';

    return `
      <div class="msg-anim msg-row flex gap-3 py-2 rounded-xl px-2 -mx-2 group">
        <div class="w-8 h-8 rounded-full ${msg.avatarBg} ${msg.avatarText} flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5 select-none">
          ${msg.initials}
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="font-bold text-white text-sm">${msg.name}</span>
            <span class="text-xs rounded-md px-1.5 py-0.5 font-bold ${msg.badgeCls}">${msg.badgeText}</span>
            <span class="text-xs text-zinc-500">${msg.time}</span>
            ${deliveredBadge}
          </div>
          ${quote}
          <div class="mt-1 text-sm text-zinc-200 leading-relaxed">${msg.text}</div>
          ${attachment}
          ${reactions}
        </div>
      </div>`;
  }

  /* ---- Render full chat panel ---- */
  function render() {
    document.getElementById('app-chat').innerHTML = `

      <!-- CHAT HEADER -->
      <div class="glass border-b border-white/5 px-4 py-3 flex items-center justify-between gap-3 flex-shrink-0">
        <div class="flex items-center gap-3 min-w-0">
          <div class="text-emerald-400 font-mono text-lg font-bold">#</div>
          <div class="min-w-0">
            <div class="font-bold text-white text-sm flex items-center gap-2 flex-wrap">
              u16-tactics-room
              <span class="text-xs bg-emerald-400/15 text-emerald-400 rounded-full px-2 py-0.5 font-semibold border border-emerald-400/20">🔒 Private</span>
            </div>
            <div class="flex items-center gap-1.5 mt-0.5">
              <div class="flex -space-x-1">
                <div class="w-3 h-3 rounded-full bg-emerald-400 border border-zinc-900"></div>
                <div class="w-3 h-3 rounded-full bg-sky-400 border border-zinc-900"></div>
                <div class="w-3 h-3 rounded-full bg-amber-400 border border-zinc-900"></div>
              </div>
              <span class="text-xs text-zinc-400">14 online dari 22 pemain</span>
            </div>
          </div>
        </div>

        <!-- PINNED -->
        <div class="hidden md:flex items-center gap-2 glass rounded-xl px-3 py-1.5 max-w-xs cursor-pointer hover:bg-white/5 transition-all flex-shrink-0">
          <span class="text-amber-400 text-sm">📌</span>
          <div class="min-w-0">
            <div class="text-xs text-zinc-400">Pinned</div>
            <div class="text-xs font-semibold text-white truncate">MATCH Sabtu 16:00 WIB — Patriot Stadium</div>
          </div>
        </div>

        <!-- ACTIONS -->
        <div class="flex items-center gap-1.5 flex-shrink-0">
          <button class="w-8 h-8 glass rounded-lg flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </button>
          <button onclick="Chat.toggleRightPanel()"
            class="w-8 h-8 glass rounded-lg flex items-center justify-center text-zinc-400 hover:text-emerald-400 transition-colors lg:hidden">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- MESSAGE STREAM -->
      <div id="message-stream" class="flex-1 overflow-y-auto p-4 space-y-0.5">

        <!-- Date divider -->
        <div class="flex items-center gap-3 py-3">
          <div class="flex-1 border-t border-white/5"></div>
          <span class="text-xs text-zinc-500 font-medium whitespace-nowrap">Hari Ini — Sabtu, 15 Nov 2026</span>
          <div class="flex-1 border-t border-white/5"></div>
        </div>

        <!-- Initial messages -->
        ${INITIAL_MESSAGES.map((m, i) => buildBubble(m, m.delivered)).join('')}

        <!-- Typing indicator -->
        <div id="typing-indicator" class="hidden flex gap-3 py-2 px-2">
          <div class="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">FR</div>
          <div class="glass rounded-xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
            <div class="typing-dot w-1.5 h-1.5 rounded-full bg-zinc-400"></div>
            <div class="typing-dot w-1.5 h-1.5 rounded-full bg-zinc-400"></div>
            <div class="typing-dot w-1.5 h-1.5 rounded-full bg-zinc-400"></div>
          </div>
        </div>
      </div>

      <!-- CHAT INPUT BAR -->
      <div class="glass border-t border-white/5 p-3 flex-shrink-0">
        <div class="flex items-end gap-2">

          <!-- Action buttons -->
          <div class="flex items-center gap-1 pb-0.5">
            <button title="Upload gambar/taktik"
              class="w-8 h-8 glass rounded-lg flex items-center justify-center text-zinc-400 hover:text-emerald-400 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </button>
            <button title="Emoji" class="w-8 h-8 glass rounded-lg flex items-center justify-center text-zinc-400 hover:text-emerald-400 transition-colors">
              <span class="text-sm leading-none">😊</span>
            </button>
          </div>

          <!-- Input -->
          <div class="flex-1 glass rounded-xl flex items-end gap-2 px-3 py-2">
            <textarea id="message-input" rows="1"
              placeholder="Kirim pesan taktik atau diskusi ke skuad..."
              class="flex-1 bg-transparent text-sm text-zinc-200 placeholder-zinc-500 resize-none focus:outline-none max-h-24 leading-relaxed"
              onkeydown="Chat.handleKeyDown(event)"
              oninput="Chat.autoResize(this)">
            </textarea>
            <button title="Mention"
              class="w-7 h-7 glass rounded-lg flex items-center justify-center text-zinc-500 hover:text-emerald-400 transition-colors flex-shrink-0">
              <span class="text-xs font-bold">@</span>
            </button>
          </div>

          <!-- SEND -->
          <button onclick="Chat.send()" id="send-btn"
            class="send-btn w-10 h-10 rounded-xl flex items-center justify-center text-zinc-900 flex-shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
            </svg>
          </button>
        </div>

        <!-- Status bar -->
        <div class="flex items-center justify-between mt-2 px-1">
          <div class="flex items-center gap-1.5">
            <div class="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot"></div>
            <span class="text-xs text-zinc-500">Real-time · 14 online</span>
          </div>
          <span class="text-xs text-zinc-600 hidden sm:block">Enter kirim · Shift+Enter baris baru</span>
        </div>
      </div>
    `;

    scrollToBottom();
  }

  /* ---- Send a message ---- */
  function send() {
    const input = document.getElementById('message-input');
    const text = input.value.trim();
    if (!text) return;

    const p = State.profileData;
    const stream = document.getElementById('message-stream');
    const typing = document.getElementById('typing-indicator');

    // Build user msg object
    const msgObj = {
      name: p.name,
      initials: p.initials,
      avatarBg: p.avatarBg,
      avatarText: p.avatarText,
      badgeText: p.badge,
      badgeCls: p.badgeCls,
      time: Utils.currentTime(),
      text: Utils.escapeHtml(text),
      reactions: [],
      attachment: null,
      delivered: true,
    };

    const el = document.createElement('div');
    el.innerHTML = buildBubble(msgObj, true);
    stream.insertBefore(el.firstElementChild, typing);
    scrollToBottom();

    input.value = '';
    input.style.height = 'auto';

    // Show typing indicator then auto-reply
    setTimeout(() => {
      typing.classList.remove('hidden');
      scrollToBottom();
    }, 700);
    setTimeout(() => {
      typing.classList.add('hidden');
      addAutoReply(stream, typing);
      scrollToBottom();
    }, 3000);
  }

  function addAutoReply(stream, typing) {
    const sender = Utils.randomItem(AUTO_REPLIES);
    const text   = Utils.randomItem(sender.messages);
    const msgObj = {
      name: sender.name,
      initials: sender.initials,
      avatarBg: sender.avatarBg,
      avatarText: sender.avatarText,
      badgeText: sender.badgeText,
      badgeCls: sender.badgeCls,
      time: Utils.currentTime(),
      text: Utils.escapeHtml(text),
      reactions: [],
      attachment: null,
    };
    const el = document.createElement('div');
    el.innerHTML = buildBubble(msgObj, false);
    stream.insertBefore(el.firstElementChild, typing);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  function autoResize(el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 96) + 'px';
  }

  function scrollToBottom() {
    const s = document.getElementById('message-stream');
    if (s) s.scrollTop = s.scrollHeight;
  }

  /* React to profile change — update placeholder */
  State.on('profile', () => {
    const inp = document.getElementById('message-input');
    if (inp) inp.placeholder = State.profileData.inputPlaceholder;
  });

  function toggleRightPanel() {
    const rp = document.getElementById('app-right');
    if (!rp) return;
    if (rp.classList.contains('hidden')) {
      rp.classList.remove('hidden');
      rp.classList.add('flex');
    } else {
      rp.classList.add('hidden');
      rp.classList.remove('flex');
    }
  }

  return { render, send, handleKeyDown, autoResize, toggleRightPanel };
})();
