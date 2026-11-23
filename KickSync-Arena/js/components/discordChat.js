/* ============================================================
   YouthTrigger Arena — Discord-Style Locker Room & Messaging
   File: js/components/discordChat.js
   Supports: Player & Coach Portals, Direct Messages (Pesan Khusus),
             Text Channels, Voice Room Simulation, & Tactical Attachments
   ============================================================ */

const DiscordChat = (() => {

  const STORAGE_KEY = 'YTA_DISCORD_MESSAGES_V2';

  // State
  let _activeRole = 'player'; // 'player' | 'coach'
  let _activeChannelId = 'dm-coach-hendra'; // default to private DM between Player & Coach
  let _replyingTo = null;
  let _voiceConnected = false;
  let _voiceChannel = 'Briefing Matchday U-16';
  let _isMuted = false;
  let _isDeafened = false;
  let _showMemberList = true;
  let _showEmojiPicker = false;
  let _searchQuery = '';
  let _memberSearch = '';

  /* Tactical Board SVG Template */
  function getTacticalBoardHtml(id = 'tactics-433') {
    return `
      <div class="mt-2.5 rounded-2xl p-4 max-w-md border border-emerald-500/30 shadow-xl"
        style="background: linear-gradient(135deg, rgba(6,30,18,0.92) 0%, rgba(13,24,33,0.95) 100%);">
        <div class="flex items-center justify-between mb-2.5">
          <div class="flex items-center gap-2">
            <span class="text-base">📋</span>
            <div>
              <div class="text-xs font-black text-emerald-400 uppercase tracking-wider">Tactical Board · Matchday U-16</div>
              <div class="text-[11px] text-zinc-400">Formasi 4-3-3 Attacking Possession vs Garuda Muda</div>
            </div>
          </div>
          <span class="text-[10px] px-2 py-0.5 rounded-md bg-emerald-400/20 text-emerald-300 font-bold border border-emerald-400/30">FIFA Pitch</span>
        </div>
        <div class="relative rounded-xl border border-emerald-500/20 overflow-hidden shadow-inner" style="aspect-ratio:16/10; background:#0b3b1e;">
          <svg viewBox="0 0 320 200" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <!-- Pitch lines -->
            <rect width="320" height="200" fill="#0d4722" />
            <!-- Grass stripes -->
            <rect x="0" y="0" width="320" height="40" fill="#0f5227" opacity="0.4"/>
            <rect x="0" y="80" width="320" height="40" fill="#0f5227" opacity="0.4"/>
            <rect x="0" y="160" width="320" height="40" fill="#0f5227" opacity="0.4"/>
            <!-- Outer Line -->
            <rect x="10" y="10" width="300" height="180" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" />
            <!-- Center Line & Circle -->
            <line x1="160" y1="10" x2="160" y2="190" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" />
            <circle cx="160" cy="100" r="32" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" />
            <circle cx="160" cy="100" r="2.5" fill="rgba(255,255,255,0.7)" />
            <!-- Left Penalty Area -->
            <rect x="10" y="50" width="55" height="100" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" />
            <rect x="10" y="75" width="22" height="50" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" />
            <!-- Right Penalty Area -->
            <rect x="255" y="50" width="55" height="100" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" />
            <rect x="288" y="75" width="22" height="50" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" />
            <!-- GK -->
            <circle cx="24" cy="100" r="9" fill="#f59e0b" stroke="#fff" stroke-width="1.5" />
            <text x="24" y="103" text-anchor="middle" fill="#000" font-size="7.5" font-weight="900">#1</text>
            <!-- DEFENDERS -->
            <circle cx="75" cy="40" r="8" fill="#3b82f6" stroke="#fff" stroke-width="1" />
            <text x="75" y="43" text-anchor="middle" fill="#fff" font-size="7" font-weight="bold">#3</text>
            <circle cx="68" cy="80" r="8" fill="#3b82f6" stroke="#fff" stroke-width="1" />
            <text x="68" y="83" text-anchor="middle" fill="#fff" font-size="7" font-weight="bold">#4</text>
            <circle cx="68" cy="120" r="8" fill="#3b82f6" stroke="#fff" stroke-width="1" />
            <text x="68" y="123" text-anchor="middle" fill="#fff" font-size="7" font-weight="bold">#5</text>
            <circle cx="75" cy="160" r="8" fill="#3b82f6" stroke="#fff" stroke-width="1" />
            <text x="75" y="163" text-anchor="middle" fill="#fff" font-size="7" font-weight="bold">#2</text>
            <!-- MIDFIELDERS -->
            <circle cx="120" cy="100" r="8.5" fill="#10b981" stroke="#fff" stroke-width="1" />
            <text x="120" y="103" text-anchor="middle" fill="#fff" font-size="7" font-weight="bold">#6</text>
            <circle cx="150" cy="65" r="8.5" fill="#10b981" stroke="#fff" stroke-width="1" />
            <text x="150" y="68" text-anchor="middle" fill="#fff" font-size="7" font-weight="bold">#8</text>
            <!-- FARHAN #10 PLAYMAKER HIGHLIGHTED -->
            <circle cx="170" cy="105" r="11" fill="#a3e635" stroke="#ffffff" stroke-width="2.5" />
            <text x="170" y="109" text-anchor="middle" fill="#090d16" font-size="9" font-weight="900">#10</text>
            <!-- FORWARDS -->
            <circle cx="230" cy="48" r="8.5" fill="#f97316" stroke="#fff" stroke-width="1" />
            <text x="230" y="51" text-anchor="middle" fill="#fff" font-size="7" font-weight="bold">#11</text>
            <circle cx="250" cy="100" r="9" fill="#ef4444" stroke="#fff" stroke-width="1.5" />
            <text x="250" y="103" text-anchor="middle" fill="#fff" font-size="7.5" font-weight="bold">#9</text>
            <circle cx="230" cy="152" r="8.5" fill="#f97316" stroke="#fff" stroke-width="1" />
            <text x="230" y="155" text-anchor="middle" fill="#fff" font-size="7" font-weight="bold">#7</text>
            <!-- Tactical passing arrows from Farhan #10 -->
            <path d="M182,102 Q205,80 220,55" fill="none" stroke="#a3e635" stroke-width="2" stroke-dasharray="3,2" marker-end="url(#arr-volt)" />
            <path d="M182,105 L238,102" fill="none" stroke="#a3e635" stroke-width="2" stroke-dasharray="3,2" marker-end="url(#arr-volt)" />
            <path d="M182,108 Q205,128 220,145" fill="none" stroke="#a3e635" stroke-width="2" stroke-dasharray="3,2" marker-end="url(#arr-volt)" />
            <defs>
              <marker id="arr-volt" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#a3e635"/>
              </marker>
            </defs>
          </svg>
        </div>
        <div class="mt-2.5 flex items-center justify-between text-xs">
          <div class="flex items-center gap-1.5 text-zinc-300">
            <span class="w-2.5 h-2.5 rounded-full bg-lime-400 inline-block"></span>
            <span>Focus: Farhan #10 Playmaker Pivot</span>
          </div>
          <button onclick="DiscordChat.inspectTactics()" class="text-lime-400 hover:text-lime-300 font-bold flex items-center gap-1 transition-colors">
            <span>🔍 Zoom &amp; Analisis</span>
          </button>
        </div>
      </div>
    `;
  }

  /* Drill Card Template */
  function getDrillCardHtml(title = 'High Pressing & Rondo 5v2') {
    return `
      <div class="mt-2.5 rounded-2xl p-4 max-w-sm border border-sky-500/30 shadow-xl"
        style="background: linear-gradient(135deg, rgba(8,25,45,0.92) 0%, rgba(13,18,30,0.95) 100%);">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-lg">🎯</span>
          <div class="flex-1">
            <div class="text-xs font-bold text-sky-400 uppercase tracking-wide">Drill Program Resmi</div>
            <div class="text-sm font-black text-white leading-tight">${title}</div>
          </div>
        </div>
        <p class="text-xs text-zinc-300 leading-relaxed">
          Durasi: <strong>45 Menit</strong> • Intensitas: <strong class="text-emerald-400">Tinggi</strong> • Fokus: <em>First-touch passing, pressing 5 detik pertama setelah kehilangan bola</em>.
        </p>
        <div class="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs">
          <span class="text-zinc-400">Instruktur: Coach Hendra</span>
          <span class="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/30">Target: U-16</span>
        </div>
      </div>
    `;
  }

  /* Initial Channels & Direct Messages Seed */
  function getInitialStore() {
    return {
      channels: [
        // ── Direct Messages (Pesan Khusus) ─────────────────────────
        {
          id: 'dm-coach-hendra',
          type: 'dm',
          name: 'Coach Hendra Saputra',
          role: 'Head Coach U-16',
          status: 'online',
          avatarText: 'CH',
          avatarBg: 'bg-amber-500',
          badge: '👑 HEAD COACH',
          badgeCls: 'bg-amber-400/20 text-amber-300 border border-amber-400/30',
          topic: '🔒 Pesan Khusus 1-on-1: Konsultasi Taktik, Evaluasi Khusus, & Bimbingan Atlet',
          pinned: '📌 Catatan Coach Hendra: Farhan, pastikan istirahat cukup & pelajari eksekusi free kick sisi kiri untuk laga Sabtu.',
          unread: 0,
          messages: [
            {
              id: 'm-dm-1',
              sender: 'Coach Hendra',
              avatarText: 'CH',
              avatarBg: 'bg-amber-500',
              badge: '👑 HEAD COACH',
              badgeCls: 'bg-amber-400/20 text-amber-300 border border-amber-400/30',
              time: 'Kemarin pukul 16:40',
              text: 'Halo Farhan! Selamat atas capaianmu di latihan crossing kemarin sore. Ada evaluasi penting: perhatikan timing first-touch saat transisi cepat, buka sudut badan lebih awal agar ruang tembak terbuka maksimal ⚽',
              reactions: [{ emoji: '👍', count: 1, reacted: true }, { emoji: '⚽', count: 1, reacted: true }],
              attachment: null
            },
            {
              id: 'm-dm-2',
              sender: 'Farhan Ramadhan',
              avatarText: 'FR',
              avatarBg: 'bg-sky-500',
              badge: '⚽ SISWA · #10',
              badgeCls: 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30',
              time: 'Kemarin pukul 17:05',
              text: 'Siap Coach Hendra! Terima kasih banyak masukannya. Saya sudah catat dan akan terapkan saat drill rondo besok pagi. Oiya Coach, untuk matchday Sabtu vs Garuda Muda FC, apakah saya tetap mengambil set-piece tendangan bebas langsung dari sisi kiri?',
              reactions: [],
              attachment: null
            },
            {
              id: 'm-dm-3',
              sender: 'Coach Hendra',
              avatarText: 'CH',
              avatarBg: 'bg-amber-500',
              badge: '👑 HEAD COACH',
              badgeCls: 'bg-amber-400/20 text-amber-300 border border-amber-400/30',
              time: 'Kemarin pukul 17:15',
              text: 'Tepat sekali Farhan. Kamu eksekutor utama di area final third sebelah kiri. Saya ingin kamu coba variasi melengkung ke tiang jauh karena kiper Garuda Muda sering maju mendahului bola. Ini papan instruksinya 👇',
              reactions: [{ emoji: '🔥', count: 2, reacted: true }],
              attachment: 'tactical-board'
            },
            {
              id: 'm-dm-4',
              sender: 'Farhan Ramadhan',
              avatarText: 'FR',
              avatarBg: 'bg-sky-500',
              badge: '⚽ SISWA · #10',
              badgeCls: 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30',
              time: 'Hari ini pukul 07:10',
              text: 'Paham Coach! Saya siap 100%. Fisik dan stamina saya sudah di angka prima (fitness 94%). Target saya Sabtu: assist dan kontrol tempo lini tengah! 💪🔥',
              reactions: [{ emoji: '💪', count: 1, reacted: true }, { emoji: '🏆', count: 1, reacted: false }],
              attachment: null
            },
            {
              id: 'm-dm-5',
              sender: 'Coach Hendra',
              avatarText: 'CH',
              avatarBg: 'bg-amber-500',
              badge: '👑 HEAD COACH',
              badgeCls: 'bg-amber-400/20 text-amber-300 border border-amber-400/30',
              time: 'Hari ini pukul 07:25',
              text: 'Mantap Farhan! Itulah mentalitas calon kapten akademi kita. Sampai jumpa di briefing taktik siang ini pukul 14:00 WIB di Ruang Teori ya.',
              reactions: [{ emoji: '❤️', count: 1, reacted: true }],
              attachment: null
            }
          ]
        },
        {
          id: 'dm-coach-budi',
          type: 'dm',
          name: 'Coach Budi Santoso',
          role: 'Youth Development U-14',
          status: 'idle',
          avatarText: 'CB',
          avatarBg: 'bg-emerald-600',
          badge: '🏃 COACH FISIK',
          badgeCls: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
          topic: '🔒 Pesan Khusus: Program Kebugaran, Nutrisi Atlet, & Endurance',
          pinned: null,
          unread: 0,
          messages: [
            {
              id: 'm-dmb-1',
              sender: 'Coach Budi Santoso',
              avatarText: 'CB',
              avatarBg: 'bg-emerald-600',
              badge: '🏃 COACH FISIK',
              badgeCls: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
              time: '2 hari lalu',
              text: 'Halo Farhan, hasil tes VO2Max kamu kemarin tembus 58.5 ml/kg/min! Sangat impresif untuk kategori U-16. Tetap jaga pola makan rendah minyak & tidur minimal 8 jam ya 🥗💧',
              reactions: [{ emoji: '👏', count: 2, reacted: false }],
              attachment: null
            },
            {
              id: 'm-dmb-2',
              sender: 'Farhan Ramadhan',
              avatarText: 'FR',
              avatarBg: 'bg-sky-500',
              badge: '⚽ SISWA · #10',
              badgeCls: 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30',
              time: '2 hari lalu',
              text: 'Terima kasih banyak Coach Budi! Menu karbohidrat kompleks & hidrasi sebelum latihan sangat membantu recovery saya.',
              reactions: [],
              attachment: null
            }
          ]
        },
        {
          id: 'dm-azzam',
          type: 'dm',
          name: 'Azzam Zaky #7',
          role: 'Right Winger U-16',
          status: 'online',
          avatarText: 'AZ',
          avatarBg: 'bg-purple-500',
          badge: '⚡ WINGER · #7',
          badgeCls: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
          topic: '🔒 Pesan Khusus Antar Pemain: Koordinasi Serangan Sisi Sayap & Lini Tengah',
          pinned: null,
          unread: 0,
          messages: [
            {
              id: 'm-dma-1',
              sender: 'Azzam Zaky',
              avatarText: 'AZ',
              avatarBg: 'bg-purple-500',
              badge: '⚡ WINGER · #7',
              badgeCls: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
              time: '08:10 WIB',
              text: 'Han, pas match Sabtu nanti kalau lo pegang bola di lini tengah, langsung terobos bola melambung ke belakang bek kiri mereka ya. Gue bakal sprint cut-in!',
              reactions: [{ emoji: '🔥', count: 1, reacted: true }],
              attachment: null
            },
            {
              id: 'm-dma-2',
              sender: 'Farhan Ramadhan',
              avatarText: 'FR',
              avatarBg: 'bg-sky-500',
              badge: '⚽ SISWA · #10',
              badgeCls: 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30',
              time: '08:14 WIB',
              text: 'Aman Zam! Gue udah hapal kecepatan sprint lo. Pokoknya timing lari pas gue angkat kepala, bola langsung mendarat di depan kaki lo 🎯',
              reactions: [{ emoji: '🤝', count: 2, reacted: true }],
              attachment: null
            }
          ]
        },

        // ── Text Channels (Ruang Diskusi Tim) ──────────────────────
        {
          id: 'u16-tactics-room',
          type: 'channel',
          name: 'u16-tactics-room',
          topic: 'Diskusi taktik resmi squad U-16 YouthTrigger Arena • Formasi & Match Plan',
          pinned: '📌 Formasi 4-3-3 High Pressing & Kickoff vs Garuda Muda FC Sabtu 16:00 WIB',
          unread: 1,
          messages: [
            {
              id: 'm-ch-1',
              sender: 'Coach Hendra',
              avatarText: 'CH',
              avatarBg: 'bg-amber-500',
              badge: '👑 HEAD COACH',
              badgeCls: 'bg-amber-400/20 text-amber-300 border border-amber-400/30',
              time: '08:15 WIB',
              text: 'Selamat pagi seluruh skuad U-16! 🌅 Hari ini kita masuk fase akhir persiapan taktik matchday. Formasi yang kita turunkan adalah <strong>4-3-3 Attacking Possession</strong>. Simak skema posisi kalian berikut ini 👇',
              reactions: [{ emoji: '💪', count: 6, reacted: true }, { emoji: '⚽', count: 8, reacted: true }],
              attachment: 'tactical-board'
            },
            {
              id: 'm-ch-2',
              sender: 'Farhan Ramadhan',
              avatarText: 'FR',
              avatarBg: 'bg-sky-500',
              badge: '⚽ SISWA · #10',
              badgeCls: 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30',
              time: '08:22 WIB',
              text: 'Siap Coach! Sebagai #10 di central pocket, saya pastikan sirkulasi bola cepat, kombinasi satu-dua sentuhan dengan winger, dan pressing tinggi saat lawan build-up! 🔥',
              reactions: [{ emoji: '👍', count: 4, reacted: false }, { emoji: '🔥', count: 5, reacted: true }],
              attachment: null
            },
            {
              id: 'm-ch-3',
              sender: 'Azzam Zaky',
              avatarText: 'AZ',
              avatarBg: 'bg-purple-500',
              badge: '⚡ WINGER · #7',
              badgeCls: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
              time: '08:30 WIB',
              text: 'Coach, untuk transisi bertahan apakah winger kanan dan kiri langsung drop membentuk 4-5-1 saat bola dipegang bek tengah lawan?',
              reactions: [],
              attachment: null
            },
            {
              id: 'm-ch-4',
              sender: 'Coach Hendra',
              avatarText: 'CH',
              avatarBg: 'bg-amber-500',
              badge: '👑 HEAD COACH',
              badgeCls: 'bg-amber-400/20 text-amber-300 border border-amber-400/30',
              time: '08:34 WIB',
              quoteFrom: 'Azzam Zaky',
              quoteText: 'apakah winger kanan dan kiri langsung drop membentuk 4-5-1...',
              text: 'Betul Azzam! Langsung tutup jalur passing horizontal lawan. Begitu bola terebut kembali, kamu dan Dimas langsung sprint melebar untuk counter attack kilat ⚡',
              reactions: [{ emoji: '🎯', count: 5, reacted: true }],
              attachment: null
            },
            {
              id: 'm-ch-5',
              sender: 'Raffi Dinata',
              avatarText: 'RD',
              avatarBg: 'bg-lime-500',
              badge: '🛡️ BEK KIRI · #3',
              badgeCls: 'bg-lime-500/20 text-lime-300 border border-lime-500/30',
              time: '08:42 WIB',
              text: 'Lini pertahanan sudah rapat Coach! Kami siap jaga clean sheet untuk pertandingan besok! 💪⚽ <span class="text-lime-400 font-bold">#YouthTriggerArena</span>',
              reactions: [{ emoji: '🛡️', count: 7, reacted: true }],
              attachment: null
            }
          ]
        },
        {
          id: 'instruksi-resmi',
          type: 'channel',
          name: 'instruksi-resmi',
          topic: 'Instruksi resmi pelatih & jadwal briefing pertandingan (Read-Only)',
          pinned: '📌 Wajib hadir di Stadion Patriot pukul 14:00 WIB',
          unread: 0,
          messages: [
            {
              id: 'm-ir-1',
              sender: 'Coach Hendra',
              avatarText: 'CH',
              avatarBg: 'bg-amber-500',
              badge: '👑 HEAD COACH',
              badgeCls: 'bg-amber-400/20 text-amber-300 border border-amber-400/30',
              time: 'Kemarin pukul 18:00',
              text: '📢 <strong>PENGUMUMAN RESMI PERTANDINGAN SABTU:</strong><br/>1. Kumpul di Stadion Patriot Candrabhaga pukul 14:00 WIB.<br/>2. Seragam Home: Jersey Hijau Volt - Putih.<br/>3. Bawa deker resmi, sepatu pull karet/FG, dan botol minum pribadi.<br/>4. Dilarang konsumsi gorengan & makanan pedas mulai malam ini.',
              reactions: [{ emoji: '✅', count: 18, reacted: true }, { emoji: '⚽', count: 14, reacted: true }],
              attachment: null
            }
          ]
        },
        {
          id: 'evaluasi-pertandingan',
          type: 'channel',
          name: 'evaluasi-pertandingan',
          topic: 'Analisis performa laga sebelumnya & catatan statistik tim',
          pinned: null,
          unread: 0,
          messages: [
            {
              id: 'm-ev-1',
              sender: 'Coach Hendra',
              avatarText: 'CH',
              avatarBg: 'bg-amber-500',
              badge: '👑 HEAD COACH',
              badgeCls: 'bg-amber-400/20 text-amber-300 border border-amber-400/30',
              time: '3 hari lalu',
              text: 'Rekap Laga Pekan Lalu: YouthTrigger Arena 3 - 1 Bintang Muda FC.<br/>Positif: Penguasaan bola 64%, 18 peluang tembakan.<br/>Catatan: Kurangi pelanggaran tidak perlu di area sepertiga pertahanan sendiri.',
              reactions: [{ emoji: '📊', count: 9, reacted: true }],
              attachment: null
            }
          ]
        },
        {
          id: 'locker-room-santai',
          type: 'channel',
          name: 'locker-room-santai',
          topic: 'Ruang ganti santai skuad • Semangat, motivasi, & obrolan santai antar pemain',
          pinned: null,
          unread: 0,
          messages: [
            {
              id: 'm-lr-1',
              sender: 'Dimas Aditya',
              avatarText: 'DA',
              avatarBg: 'bg-orange-500',
              badge: '⚡ WINGER · #11',
              badgeCls: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
              time: '09:00 WIB',
              text: 'Siapa yang bawa speaker bluetooth buat lagu pemanasan besok di ruang ganti? 🔥🎧',
              reactions: [{ emoji: '🙋‍♂️', count: 4, reacted: false }],
              attachment: null
            },
            {
              id: 'm-lr-2',
              sender: 'Farhan Ramadhan',
              avatarText: 'FR',
              avatarBg: 'bg-sky-500',
              badge: '⚽ SISWA · #10',
              badgeCls: 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30',
              time: '09:04 WIB',
              text: 'Gue bawa Dim! Playlist hype matchday udah gue siapin, dari beat cepat sampai rock semangat biar fokus tempur!',
              reactions: [{ emoji: '🔥', count: 8, reacted: true }, { emoji: '🎧', count: 6, reacted: true }],
              attachment: null
            }
          ]
        }
      ]
    };
  }

  /* Load or Initialize Store */
  function getStore() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (_e) {}
    const initial = getInitialStore();
    saveStore(initial);
    return initial;
  }

  function saveStore(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (_e) {}
  }

  function getActiveChannel() {
    const store = getStore();
    return store.channels.find(c => c.id === _activeChannelId) || store.channels[0];
  }

  /* ---- Render Discord Container ---- */
  function render(role = 'player', channelId = null) {
    _activeRole = role;
    if (channelId) _activeChannelId = channelId;

    const store = getStore();
    const activeChan = getActiveChannel();

    // Current user identity based on active role
    const currentUser = role === 'player'
      ? { name: 'Farhan Ramadhan', tag: '#10 · Playmaker', initials: 'FR', bg: 'bg-sky-500', badge: '⚽ SISWA · #10', badgeCls: 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30' }
      : { name: 'Coach Hendra Saputra', tag: '👑 Head Coach U-16', initials: 'CH', bg: 'bg-amber-500', badge: '👑 HEAD COACH', badgeCls: 'bg-amber-400/20 text-amber-300 border border-amber-400/30' };

    return `
      <div id="discord-app-wrapper" class="relative h-full flex overflow-hidden select-text text-zinc-200" style="background:#313338; font-family:'Plus Jakarta Sans',sans-serif;">

        <!-- Mobile Backdrop Overlay -->
        <div id="discord-mobile-overlay" onclick="DiscordChat.closeMobileSidebar()" class="discord-mobile-overlay md:hidden"></div>

        <!-- 1. LEFT RAIL (Discord Server Bar) -->
        <div class="hidden sm:flex flex-col items-center py-3 w-[72px] flex-shrink-0 discord-server-rail border-r border-[#1a1b1e] space-y-2">
          <!-- Server Icon: YouthTrigger Arena -->
          <div class="relative group cursor-pointer" onclick="DiscordChat.switchChannel('u16-tactics-room')" title="YouthTrigger Arena Server">
            <div class="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-10 rounded-r-full bg-white transition-all group-hover:h-8"></div>
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-zinc-950 text-xl shadow-lg transition-all duration-200 hover:rounded-xl group-hover:scale-105"
              style="background: linear-gradient(135deg, #a3e635, #34d399);">
              ⚽
            </div>
          </div>

          <div class="w-8 h-[2px] bg-white/10 rounded-full my-1"></div>

          <!-- Direct Messages Pill Icon -->
          <div class="relative group cursor-pointer" onclick="DiscordChat.switchChannel('dm-coach-hendra')" title="Pesan Khusus (Direct Messages)">
            <div class="w-12 h-12 rounded-2xl ${activeChan.type === 'dm' ? 'bg-[#5865F2] text-white rounded-xl' : 'bg-[#2b2d31] text-zinc-300 hover:bg-[#5865F2] hover:text-white'} flex items-center justify-center text-xl shadow transition-all duration-200 hover:rounded-xl">
              💬
            </div>
            <span class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center">2</span>
          </div>

          <!-- Tactics Room Icon -->
          <div class="relative group cursor-pointer" onclick="DiscordChat.switchChannel('u16-tactics-room')" title="Ruang Taktik U-16">
            <div class="w-12 h-12 rounded-2xl ${activeChan.id === 'u16-tactics-room' ? 'bg-[#5865F2] text-white rounded-xl' : 'bg-[#2b2d31] text-zinc-300 hover:bg-[#5865F2] hover:text-white'} flex items-center justify-center text-xl shadow transition-all duration-200 hover:rounded-xl">
              📋
            </div>
          </div>

          <!-- Quick Add / Explore -->
          <div class="relative group cursor-pointer mt-auto" onclick="Utils.showToast('YouthTrigger Discord Server Terverifikasi FIFA & PSSI ✅','success')" title="Server Terverifikasi">
            <div class="w-12 h-12 rounded-2xl bg-[#23a55a]/20 text-[#23a55a] border border-[#23a55a]/30 hover:bg-[#23a55a] hover:text-white flex items-center justify-center text-lg shadow transition-all duration-200 hover:rounded-xl">
              ✓
            </div>
          </div>
        </div>

        <!-- 2. CHANNEL / DM SIDEBAR (Responsive Mobile Drawer + Desktop Fixed) -->
        <div id="discord-channel-sidebar" class="discord-sidebar discord-mobile-drawer md:static md:w-64 md:transform-none md:shadow-none flex-shrink-0 border-r border-[#232428] flex flex-col justify-between">
          
          <!-- Top Server Title Bar -->
          <div>
            <div class="h-12 px-4 border-b border-[#1f2023] flex items-center justify-between shadow-sm cursor-pointer hover:bg-white/5 transition-colors">
              <div class="flex items-center gap-2 min-w-0">
                <span class="text-sm font-black text-white truncate">YouthTrigger Arena</span>
                <span class="text-xs text-lime-400 font-bold" title="Terverifikasi">🛡️</span>
              </div>
              <div class="flex items-center gap-1">
                <span class="text-zinc-400 text-xs hidden md:inline">▾</span>
                <button onclick="DiscordChat.closeMobileSidebar()" class="md:hidden w-7 h-7 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center text-sm font-bold" title="Tutup menu">✕</button>
              </div>
            </div>

            <!-- Channels & DM Nav List -->
            <div class="p-2 space-y-4 overflow-y-auto max-h-[calc(100vh-190px)] discord-scroll text-sm">
              
              <!-- CATEGORY 1: PESAN KHUSUS (DIRECT MESSAGES) -->
              <div>
                <div class="flex items-center justify-between px-2 mb-1 text-[11px] font-black uppercase tracking-wider text-zinc-400">
                  <span class="flex items-center gap-1.5 text-lime-400">
                    <span>🔒</span> Pesan Khusus (DM)
                  </span>
                  <span class="text-[10px] text-zinc-500 font-normal">1-on-1</span>
                </div>
                <div class="space-y-0.5">
                  ${store.channels.filter(c => c.type === 'dm').map(dm => {
                    const isActive = dm.id === _activeChannelId;
                    return `
                      <button onclick="DiscordChat.switchChannel('${dm.id}')"
                        class="discord-channel ${isActive ? 'active' : ''} w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left group">
                        <div class="relative flex-shrink-0">
                          <div class="w-7 h-7 rounded-full ${dm.avatarBg} text-white flex items-center justify-center font-bold text-xs select-none">
                            ${dm.avatarText}
                          </div>
                          <span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#2b2d31] ${dm.status === 'online' ? 'bg-[#23a55a]' : 'bg-[#f0b232]'}"></span>
                        </div>
                        <div class="flex-1 min-w-0">
                          <div class="text-xs font-bold ${isActive ? 'text-white' : 'text-zinc-300 group-hover:text-white'} truncate">
                            ${dm.name}
                          </div>
                          <div class="text-[10px] text-zinc-400 truncate">${dm.role}</div>
                        </div>
                        ${dm.unread > 0 ? `<span class="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center">${dm.unread}</span>` : ''}
                      </button>
                    `;
                  }).join('')}
                </div>
              </div>

              <!-- CATEGORY 2: TEXT CHANNELS -->
              <div>
                <div class="flex items-center justify-between px-2 mb-1 text-[11px] font-black uppercase tracking-wider text-zinc-400">
                  <span class="flex items-center gap-1.5">
                    <span>💬</span> Ruang Taktik &amp; Tim
                  </span>
                  <span class="text-[10px] text-zinc-500 font-normal">U-16</span>
                </div>
                <div class="space-y-0.5">
                  ${store.channels.filter(c => c.type === 'channel').map(ch => {
                    const isActive = ch.id === _activeChannelId;
                    return `
                      <button onclick="DiscordChat.switchChannel('${ch.id}')"
                        class="discord-channel ${isActive ? 'active' : ''} w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left group">
                        <span class="text-zinc-400 font-mono text-base ${isActive ? 'text-white' : 'group-hover:text-zinc-200'}">#</span>
                        <span class="text-xs font-semibold ${isActive ? 'text-white font-bold' : 'text-zinc-300 group-hover:text-white'} truncate flex-1">
                          ${ch.name}
                        </span>
                        ${ch.unread > 0 ? `<span class="w-2 h-2 rounded-full bg-white"></span>` : ''}
                      </button>
                    `;
                  }).join('')}
                </div>
              </div>

              <!-- CATEGORY 3: VOICE CHANNELS (Discord Simulation) -->
              <div>
                <div class="flex items-center justify-between px-2 mb-1 text-[11px] font-black uppercase tracking-wider text-zinc-400">
                  <span class="flex items-center gap-1.5">
                    <span>🔊</span> Ruang Suara (Voice)
                  </span>
                </div>
                <div class="space-y-0.5">
                  <button onclick="DiscordChat.toggleVoice('Briefing Matchday U-16')"
                    class="discord-channel ${_voiceConnected ? 'bg-emerald-500/15 text-emerald-300 active' : ''} w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left group">
                    <span class="text-sm ${_voiceConnected ? 'text-emerald-400 animate-pulse' : 'text-zinc-400'}">🔊</span>
                    <span class="text-xs font-semibold truncate flex-1">Briefing Matchday U-16</span>
                    <span class="text-[10px] text-zinc-400 px-1.5 py-0.5 rounded bg-zinc-800/80 font-mono">2/11</span>
                  </button>
                  <button onclick="DiscordChat.toggleVoice('Diskusi 1-on-1 Privat')"
                    class="discord-channel w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left group">
                    <span class="text-sm text-zinc-400">🔒</span>
                    <span class="text-xs font-semibold truncate flex-1">Konsultasi Privat Pelatih</span>
                    <span class="text-[10px] text-zinc-400 px-1.5 py-0.5 rounded bg-zinc-800/80 font-mono">1/2</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

          <!-- Bottom: Voice Connected Bar (If active) & Current User Discord Profile -->
          <div>
            ${_voiceConnected ? `
              <div class="p-2.5 bg-[#232428] border-t border-[#1f2023] flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <div>
                    <div class="text-[11px] font-bold text-emerald-400">Suara Terhubung (24ms)</div>
                    <div class="text-[10px] text-zinc-400 truncate max-w-[120px]">${_voiceChannel}</div>
                  </div>
                </div>
                <button onclick="DiscordChat.toggleVoice('')" title="Putuskan Suara"
                  class="w-7 h-7 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors text-xs font-bold">
                  📞
                </button>
              </div>
            ` : ''}

            <!-- Discord User Profile Footer Bar -->
            <div class="h-14 px-3 bg-[#232428] flex items-center justify-between border-t border-[#1f2023]">
              <div class="flex items-center gap-2.5 min-w-0">
                <div class="relative flex-shrink-0">
                  <div class="w-8 h-8 rounded-full ${currentUser.bg} text-white flex items-center justify-center font-bold text-xs select-none">
                    ${currentUser.initials}
                  </div>
                  <span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#23a55a] border-2 border-[#232428]"></span>
                </div>
                <div class="min-w-0">
                  <div class="text-xs font-bold text-white truncate">${currentUser.name}</div>
                  <div class="text-[10px] text-emerald-400 font-semibold truncate">${currentUser.tag}</div>
                </div>
              </div>

              <!-- Mute, Deafen, Settings icons -->
              <div class="flex items-center gap-1 text-zinc-400">
                <button onclick="DiscordChat.toggleMute()" class="w-7 h-7 rounded hover:bg-white/10 hover:text-white flex items-center justify-center text-xs" title="${_isMuted ? 'Unmute' : 'Mute'}">
                  ${_isMuted ? '🔇' : '🎙️'}
                </button>
                <button onclick="DiscordChat.toggleDeafen()" class="w-7 h-7 rounded hover:bg-white/10 hover:text-white flex items-center justify-center text-xs" title="${_isDeafened ? 'Undeafen' : 'Deafen'}">
                  ${_isDeafened ? '🔕' : '🎧'}
                </button>
                <button onclick="Utils.showToast('Pengaturan Akun Discord YouthTrigger','info')" class="w-7 h-7 rounded hover:bg-white/10 hover:text-white flex items-center justify-center text-xs" title="Pengaturan">
                  ⚙️
                </button>
              </div>
            </div>

          </div>

        </div>

        <!-- 3. MAIN CHAT AREA (Flex-1) -->
        <div class="flex-1 flex flex-col discord-bg min-w-0 overflow-hidden">
          
          <!-- Top Chat Header -->
          <div class="h-12 px-2.5 sm:px-4 discord-header flex items-center justify-between gap-2 sm:gap-3 flex-shrink-0 shadow-sm">
            <div class="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
              <!-- Mobile Channel Drawer Toggle Button -->
              <button onclick="DiscordChat.toggleMobileSidebar()" class="md:hidden w-8 h-8 rounded-lg bg-[#2b2d31] hover:bg-[#35373c] text-zinc-300 hover:text-white flex items-center justify-center flex-shrink-0 transition-colors" title="Buka Menu Channel & DM">
                <span class="text-sm leading-none">☰</span>
              </button>
              ${activeChan.type === 'dm' ? `
                <div class="relative flex-shrink-0">
                  <span class="text-emerald-400 font-bold text-base">@</span>
                </div>
                <div class="min-w-0">
                  <div class="text-xs sm:text-sm font-black text-white flex items-center gap-1.5 sm:gap-2">
                    <span class="truncate">${activeChan.name}</span>
                    <span class="text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 rounded ${activeChan.badgeCls || 'bg-amber-400/20 text-amber-300'} font-bold">${activeChan.role || 'DM'}</span>
                    <span class="text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 rounded bg-emerald-400/15 text-emerald-300 font-bold hidden xs:inline">🔒 Pesan Khusus</span>
                  </div>
                  <div class="text-[10px] text-zinc-400 truncate hidden md:block">${activeChan.topic}</div>
                </div>
              ` : `
                <span class="text-zinc-400 font-mono text-base sm:text-lg font-bold">#</span>
                <div class="min-w-0">
                  <div class="text-xs sm:text-sm font-black text-white truncate">${activeChan.name}</div>
                  <div class="text-[10px] text-zinc-400 truncate hidden md:block">${activeChan.topic}</div>
                </div>
              `}
            </div>

            <!-- Top Action Buttons -->
            <div class="flex items-center gap-2 flex-shrink-0">
              <!-- Quick Call button in DM -->
              ${activeChan.type === 'dm' ? `
                <button onclick="DiscordChat.startDirectCall('${activeChan.name}')" title="Mulai Panggilan Suara Privat"
                  class="w-8 h-8 rounded-lg hover:bg-white/10 text-zinc-300 hover:text-emerald-400 flex items-center justify-center transition-colors">
                  📞
                </button>
              ` : ''}

              <!-- Pinned Messages Toggle -->
              <button onclick="DiscordChat.showPinnedModal()" title="Pesan Tersemat (Pinned)"
                class="w-8 h-8 rounded-lg hover:bg-white/10 text-zinc-300 hover:text-amber-400 flex items-center justify-center transition-colors">
                📌
              </button>

              <!-- Member List Toggle -->
              <button onclick="DiscordChat.toggleMemberList()" title="Daftar Anggota Tim"
                class="w-8 h-8 rounded-lg hover:bg-white/10 ${_showMemberList ? 'text-emerald-400 bg-white/5' : 'text-zinc-400'} flex items-center justify-center transition-colors">
                👥
              </button>

              <!-- Search -->
              <div class="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#1e1f22] border border-white/5 text-xs text-zinc-400">
                <span>🔍</span>
                <input type="text" placeholder="Cari percakapan..." oninput="DiscordChat.handleSearch(this.value)"
                  class="bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none w-28 focus:w-40 transition-all"/>
              </div>
            </div>
          </div>

          <!-- Pinned Banner (If available) -->
          ${activeChan.pinned ? `
            <div class="px-4 py-1.5 bg-[#232428]/90 border-b border-[#1f2023] flex items-center justify-between text-xs text-zinc-300">
              <div class="flex items-center gap-2 truncate">
                <span class="text-amber-400">📌</span>
                <span class="truncate font-medium">${activeChan.pinned}</span>
              </div>
              <button onclick="DiscordChat.showPinnedModal()" class="text-emerald-400 hover:underline text-[11px] font-bold flex-shrink-0 ml-2">Detail</button>
            </div>
          ` : ''}

          <!-- Message Stream -->
          <div id="discord-message-stream" class="flex-1 overflow-y-auto px-4 py-3 space-y-3 discord-scroll">
            
            <!-- Date Separator -->
            <div class="flex items-center gap-3 py-2">
              <div class="flex-1 border-t border-[#3f4147]"></div>
              <span class="text-[11px] text-zinc-400 font-bold px-2 py-0.5 rounded-full bg-[#2b2d31]">Hari Ini — ${new Date().toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'short',year:'numeric'})}</span>
              <div class="flex-1 border-t border-[#3f4147]"></div>
            </div>

            <!-- Messages List -->
            ${(activeChan.messages || []).map((m, idx) => renderMessageRow(m, idx)).join('')}

            <!-- Typing Indicator -->
            <div id="discord-typing-indicator" class="hidden flex items-center gap-2 py-1 px-2 text-xs text-zinc-400">
              <div class="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px]">
                💬
              </div>
              <span id="discord-typing-text" class="italic">Sedang mengetik balasan...</span>
              <div class="flex gap-1 ml-1">
                <span class="w-1.5 h-1.5 rounded-full bg-zinc-400 typing-dot"></span>
                <span class="w-1.5 h-1.5 rounded-full bg-zinc-400 typing-dot"></span>
                <span class="w-1.5 h-1.5 rounded-full bg-zinc-400 typing-dot"></span>
              </div>
            </div>

          </div>

          <!-- Bottom: Replying Banner (if set) -->
          <div id="discord-reply-banner" class="${_replyingTo ? 'flex' : 'hidden'} px-4 py-2 bg-[#2b2d31] border-t border-[#232428] items-center justify-between text-xs">
            <div class="flex items-center gap-2 truncate">
              <span class="text-zinc-400">↩ Membalas</span>
              <span class="font-bold text-emerald-400 truncate" id="discord-reply-sender">${_replyingTo ? _replyingTo.sender : ''}</span>
              <span class="text-zinc-400 truncate italic" id="discord-reply-text">"${_replyingTo ? _replyingTo.text.replace(/<[^>]*>?/gm, '').slice(0, 45) : ''}..."</span>
            </div>
            <button onclick="DiscordChat.cancelReply()" class="text-zinc-400 hover:text-white text-sm font-black ml-2">✕</button>
          </div>

          <!-- Message Input Bar -->
          <div class="p-4 pt-1 flex-shrink-0">
            <div class="rounded-xl discord-input-container p-2.5 shadow-lg border border-white/5">
              
              <!-- Attachment & Emoji row -->
              <div class="flex items-center gap-1.5 mb-1.5 pb-1 border-b border-white/5 overflow-x-auto scrollbar-none">
                <!-- Tactical Board Attachment Shortcut -->
                <button onclick="DiscordChat.sendTacticalBoard()" title="Kirim Formasi Taktik 4-3-3"
                  class="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs font-bold border border-emerald-500/20 flex items-center gap-1.5 transition-colors flex-shrink-0">
                  <span>📋</span>
                  <span>Formasi 4-3-3</span>
                </button>
                <!-- Drill Card Shortcut -->
                <button onclick="DiscordChat.sendDrillCard()" title="Kirim Target Drill Latihan"
                  class="px-2.5 py-1 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 text-xs font-bold border border-sky-500/20 flex items-center gap-1.5 transition-colors flex-shrink-0">
                  <span>🎯</span>
                  <span>Drill Passing</span>
                </button>
                <!-- Quick Consultation Template -->
                ${activeChan.type === 'dm' ? `
                  <button onclick="DiscordChat.insertQuickTemplate()" title="Templat Konsultasi"
                    class="px-2 py-1 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 text-xs font-bold border border-purple-500/20 hidden sm:flex items-center gap-1 transition-colors flex-shrink-0">
                    <span>💡</span>
                    <span>Format Konsultasi</span>
                  </button>
                ` : ''}
              </div>

              <!-- Textarea and Buttons -->
              <div class="flex items-end gap-2">
                <button onclick="DiscordChat.openAttachmentMenu()" title="Lampirkan Dokumen / Gambar"
                  class="w-8 h-8 rounded-full bg-zinc-700/60 hover:bg-zinc-600 text-zinc-300 flex items-center justify-center font-black text-sm flex-shrink-0 transition-colors">
                  +
                </button>
                <textarea id="discord-message-input" rows="1"
                  placeholder="${activeChan.type === 'dm' ? `Kirim pesan khusus ke @${activeChan.name}...` : `Kirim pesan ke #${activeChan.name}...`}"
                  class="flex-1 bg-transparent text-sm text-zinc-100 placeholder-zinc-500 resize-none focus:outline-none max-h-32 leading-relaxed discord-scroll"
                  onkeydown="DiscordChat.handleKeyDown(event)"
                  oninput="DiscordChat.autoResize(this)"></textarea>
                
                <!-- Emoji Picker Toggle -->
                <button onclick="DiscordChat.toggleEmojiPicker()" title="Pilih Emoji"
                  class="w-8 h-8 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-amber-400 flex items-center justify-center text-base flex-shrink-0 transition-colors">
                  😊
                </button>

                <!-- Send Button (Discord Blurple) -->
                <button onclick="DiscordChat.sendMessage()" title="Kirim Pesan (Enter)"
                  class="w-9 h-9 rounded-xl discord-blurple-bg text-white flex items-center justify-center font-bold text-sm shadow flex-shrink-0 transition-transform active:scale-95">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                  </svg>
                </button>
              </div>

              <!-- Emoji Picker Popup -->
              <div id="discord-emoji-picker" class="${_showEmojiPicker ? 'grid' : 'hidden'} grid-cols-8 gap-1.5 p-2.5 mt-2 bg-[#2b2d31] rounded-xl border border-white/10 text-lg">
                ${['⚽','🥅','🏆','🔥','💪','🎯','📋','👑','🏃‍♂️','👍','❤️','⚡','🤝','🥇','👟','👏'].map(em => `
                  <button onclick="DiscordChat.insertEmoji('${em}')" class="p-1 rounded hover:bg-white/15 text-center transition-colors">
                    ${em}
                  </button>
                `).join('')}
              </div>

            </div>

            <!-- Footer micro-hint -->
            <div class="mt-1.5 px-2 flex items-center justify-between text-[11px] text-zinc-500">
              <div class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Terhubung ke Locker Room Discord YouthTrigger</span>
              </div>
              <span class="hidden sm:inline">Tekan <strong>Enter</strong> kirim • <strong>Shift+Enter</strong> baris baru</span>
            </div>

          </div>

        </div>

        <!-- 4. RIGHT MEMBER SIDEBAR (Collapsible) -->
        ${_showMemberList ? `
          <div class="hidden xl:flex flex-col w-60 discord-sidebar border-l border-[#232428] flex-shrink-0">
            <!-- Search Members -->
            <div class="p-3 border-b border-[#1f2023]">
              <input type="text" placeholder="Cari anggota tim..." oninput="DiscordChat.handleMemberSearch(this.value)"
                class="w-full bg-[#1e1f22] text-xs text-white placeholder-zinc-500 px-3 py-1.5 rounded-lg border border-white/5 focus:outline-none focus:border-emerald-400/50" />
            </div>

            <div class="p-3 space-y-4 overflow-y-auto flex-1 discord-scroll text-xs">
              
              <!-- STAFF KEPELATIHAN -->
              <div>
                <div class="text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-2 px-1">
                  Staff Kepelatihan — 2
                </div>
                <div class="space-y-1">
                  <!-- Coach Hendra -->
                  <div onclick="DiscordChat.switchChannel('dm-coach-hendra')" class="p-2 rounded-xl hover:bg-white/5 cursor-pointer flex items-center gap-2.5 group transition-colors">
                    <div class="relative flex-shrink-0">
                      <div class="w-8 h-8 rounded-full bg-amber-500 text-zinc-950 font-black text-xs flex items-center justify-center">CH</div>
                      <span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#23a55a] border-2 border-[#2b2d31]"></span>
                    </div>
                    <div class="min-w-0">
                      <div class="font-bold text-amber-300 truncate text-xs flex items-center gap-1">
                        Coach Hendra
                        <span class="text-[9px] px-1 py-0.2 rounded bg-amber-400/20 text-amber-300 font-black">COACH</span>
                      </div>
                      <div class="text-[10px] text-zinc-400 truncate">Menyiapkan taktik vs Garuda</div>
                    </div>
                  </div>

                  <!-- Coach Budi -->
                  <div onclick="DiscordChat.switchChannel('dm-coach-budi')" class="p-2 rounded-xl hover:bg-white/5 cursor-pointer flex items-center gap-2.5 group transition-colors">
                    <div class="relative flex-shrink-0">
                      <div class="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">CB</div>
                      <span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#f0b232] border-2 border-[#2b2d31]"></span>
                    </div>
                    <div class="min-w-0">
                      <div class="font-bold text-emerald-300 truncate text-xs">Coach Budi Santoso</div>
                      <div class="text-[10px] text-zinc-400 truncate">Sesi Lapangan B</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- PEMAIN U-16 ONLINE -->
              <div>
                <div class="text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-2 px-1">
                  Pemain U-16 Online — 5
                </div>
                <div class="space-y-1">
                  
                  <!-- Farhan #10 -->
                  <div onclick="DiscordChat.switchChannel('dm-coach-hendra')" class="p-2 rounded-xl hover:bg-white/5 cursor-pointer flex items-center gap-2.5 group transition-colors">
                    <div class="relative flex-shrink-0">
                      <div class="w-8 h-8 rounded-full bg-sky-500 text-white font-black text-xs flex items-center justify-center">FR</div>
                      <span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#23a55a] border-2 border-[#2b2d31]"></span>
                    </div>
                    <div class="min-w-0">
                      <div class="font-bold text-emerald-300 truncate text-xs flex items-center gap-1">
                        Farhan #10
                        <span class="text-[9px] px-1 py-0.2 rounded bg-emerald-400/20 text-emerald-300 font-black">#10</span>
                      </div>
                      <div class="text-[10px] text-zinc-400 truncate">Menganalisis video taktik</div>
                    </div>
                  </div>

                  <!-- Azzam #7 -->
                  <div onclick="DiscordChat.switchChannel('dm-azzam')" class="p-2 rounded-xl hover:bg-white/5 cursor-pointer flex items-center gap-2.5 group transition-colors">
                    <div class="relative flex-shrink-0">
                      <div class="w-8 h-8 rounded-full bg-purple-500 text-white font-bold text-xs flex items-center justify-center">AZ</div>
                      <span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#23a55a] border-2 border-[#2b2d31]"></span>
                    </div>
                    <div class="min-w-0">
                      <div class="font-bold text-white truncate text-xs">Azzam Zaky #7</div>
                      <div class="text-[10px] text-zinc-400 truncate">Right Winger</div>
                    </div>
                  </div>

                  <!-- Raffi #3 -->
                  <div class="p-2 rounded-xl hover:bg-white/5 cursor-pointer flex items-center gap-2.5 group transition-colors">
                    <div class="relative flex-shrink-0">
                      <div class="w-8 h-8 rounded-full bg-lime-500 text-zinc-950 font-bold text-xs flex items-center justify-center">RD</div>
                      <span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#23a55a] border-2 border-[#2b2d31]"></span>
                    </div>
                    <div class="min-w-0">
                      <div class="font-bold text-white truncate text-xs">Raffi Dinata #3</div>
                      <div class="text-[10px] text-zinc-400 truncate">Left Back</div>
                    </div>
                  </div>

                  <!-- Dimas #11 -->
                  <div class="p-2 rounded-xl hover:bg-white/5 cursor-pointer flex items-center gap-2.5 group transition-colors">
                    <div class="relative flex-shrink-0">
                      <div class="w-8 h-8 rounded-full bg-orange-500 text-white font-bold text-xs flex items-center justify-center">DA</div>
                      <span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#23a55a] border-2 border-[#2b2d31]"></span>
                    </div>
                    <div class="min-w-0">
                      <div class="font-bold text-white truncate text-xs">Dimas Aditya #11</div>
                      <div class="text-[10px] text-zinc-400 truncate">Left Winger</div>
                    </div>
                  </div>

                  <!-- Rizki #1 -->
                  <div class="p-2 rounded-xl hover:bg-white/5 cursor-pointer flex items-center gap-2.5 group transition-colors">
                    <div class="relative flex-shrink-0">
                      <div class="w-8 h-8 rounded-full bg-zinc-600 text-white font-bold text-xs flex items-center justify-center">RP</div>
                      <span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#23a55a] border-2 border-[#2b2d31]"></span>
                    </div>
                    <div class="min-w-0">
                      <div class="font-bold text-white truncate text-xs">Rizki Pratama #1</div>
                      <div class="text-[10px] text-zinc-400 truncate">Goalkeeper</div>
                    </div>
                  </div>

                </div>
              </div>

              <!-- PEMAIN OFFLINE -->
              <div>
                <div class="text-[10px] font-black uppercase tracking-wider text-zinc-500 mb-2 px-1">
                  Offline — 3
                </div>
                <div class="space-y-1 opacity-60">
                  <div class="p-1.5 flex items-center gap-2">
                    <div class="w-7 h-7 rounded-full bg-red-900/60 text-white font-bold text-xs flex items-center justify-center">BK</div>
                    <div>
                      <div class="text-xs text-zinc-300 font-medium">Bagas Kurniawan #9</div>
                      <div class="text-[10px] text-zinc-500">Pemulihan Cedera</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        ` : ''}

      </div>
    `;
  }

  /* ---- Render a single Discord message row ---- */
  function renderMessageRow(msg, idx) {
    const quoteHtml = msg.quoteFrom ? `
      <div class="flex items-center gap-2 mb-1 pl-3 text-xs text-zinc-400 border-l-2 border-zinc-600">
        <span class="text-zinc-500">↩</span>
        <span class="font-bold text-emerald-400">@${msg.quoteFrom}</span>
        <span class="truncate italic text-zinc-400">"${msg.quoteText || ''}"</span>
      </div>
    ` : '';

    let attachmentHtml = '';
    if (msg.attachment === 'tactical-board') {
      attachmentHtml = getTacticalBoardHtml('tactics-' + idx);
    } else if (msg.attachment === 'drill-card') {
      attachmentHtml = getDrillCardHtml(msg.attachmentTitle || 'High Pressing & Rondo 5v2');
    }

    const reactionsHtml = (msg.reactions && msg.reactions.length > 0) ? `
      <div class="flex items-center gap-1.5 mt-2 flex-wrap">
        ${msg.reactions.map(r => `
          <button onclick="DiscordChat.toggleReaction('${msg.id}', '${r.emoji}')"
            class="discord-reaction ${r.reacted ? 'reacted' : ''} px-2 py-0.5 rounded-lg flex items-center gap-1 text-xs select-none">
            <span>${r.emoji}</span>
            <span class="font-bold text-[11px]">${r.count}</span>
          </button>
        `).join('')}
        <button onclick="DiscordChat.addReactionPrompt('${msg.id}')" title="Tambah Reaksi"
          class="discord-reaction px-1.5 py-0.5 rounded-lg text-zinc-400 hover:text-white text-xs">
          +😊
        </button>
      </div>
    ` : '';

    return `
      <div id="${msg.id}" class="discord-msg-row relative flex gap-3 py-1.5 px-2 rounded-xl group">
        
        <!-- Hover Quick Actions Toolbar -->
        <div class="discord-msg-actions absolute right-3 -top-3.5 bg-[#2b2d31] border border-[#3b3e45] rounded-lg shadow-xl flex items-center gap-0.5 p-0.5 z-10 text-xs">
          <button onclick="DiscordChat.toggleReaction('${msg.id}', '⚽')" title="Reaksi ⚽" class="p-1 rounded hover:bg-white/10">⚽</button>
          <button onclick="DiscordChat.toggleReaction('${msg.id}', '🔥')" title="Reaksi 🔥" class="p-1 rounded hover:bg-white/10">🔥</button>
          <button onclick="DiscordChat.toggleReaction('${msg.id}', '💪')" title="Reaksi 💪" class="p-1 rounded hover:bg-white/10">💪</button>
          <button onclick="DiscordChat.setReply('${msg.id}')" title="Balas Pesan" class="p-1 rounded hover:bg-white/10 text-zinc-300 hover:text-white font-bold">↩</button>
          <button onclick="DiscordChat.pinMessage('${msg.id}')" title="Sematkan Pesan" class="p-1 rounded hover:bg-white/10 text-zinc-300 hover:text-amber-400">📌</button>
        </div>

        <!-- Sender Avatar -->
        <div class="relative flex-shrink-0 mt-0.5">
          <div class="w-10 h-10 rounded-full ${msg.avatarBg || 'bg-sky-500'} text-white flex items-center justify-center font-black text-sm select-none shadow">
            ${msg.avatarText || 'FR'}
          </div>
        </div>

        <!-- Body -->
        <div class="flex-1 min-w-0">
          ${quoteHtml}
          <div class="flex items-center gap-2 flex-wrap leading-tight mb-1">
            <span class="font-black text-white text-sm hover:underline cursor-pointer">${msg.sender}</span>
            <span class="text-[10px] px-1.5 py-0.5 rounded font-black ${msg.badgeCls || 'bg-emerald-400/20 text-emerald-300'}">${msg.badge || 'ANGGOTA'}</span>
            <span class="text-[11px] text-zinc-400 font-medium">${msg.time}</span>
          </div>
          <div class="text-sm text-zinc-200 leading-relaxed font-normal">${msg.text}</div>
          ${attachmentHtml}
          ${reactionsHtml}
        </div>

      </div>
    `;
  }

  /* ---- Message Actions & Logic ---- */
  function toggleMobileSidebar() {
    const sb = document.getElementById('discord-channel-sidebar');
    const ov = document.getElementById('discord-mobile-overlay');
    if (!sb) return;
    const isOpen = sb.classList.contains('open');
    if (isOpen) {
      sb.classList.remove('open');
      if (ov) ov.classList.remove('show');
    } else {
      sb.classList.add('open');
      if (ov) ov.classList.add('show');
    }
  }

  function closeMobileSidebar() {
    const sb = document.getElementById('discord-channel-sidebar');
    const ov = document.getElementById('discord-mobile-overlay');
    if (sb) sb.classList.remove('open');
    if (ov) ov.classList.remove('show');
  }

  function switchChannel(channelId) {
    _activeChannelId = channelId;
    _replyingTo = null;
    closeMobileSidebar();
    refreshView();
    setTimeout(scrollToBottom, 60);
  }

  function sendMessage() {
    const input = document.getElementById('discord-message-input');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    const store = getStore();
    const chan = store.channels.find(c => c.id === _activeChannelId);
    if (!chan) return;

    // Sender details
    const isPlayer = _activeRole === 'player';
    const senderName = isPlayer ? 'Farhan Ramadhan' : 'Coach Hendra';
    const initials = isPlayer ? 'FR' : 'CH';
    const avatarBg = isPlayer ? 'bg-sky-500' : 'bg-amber-500';
    const badge = isPlayer ? '⚽ SISWA · #10' : '👑 HEAD COACH';
    const badgeCls = isPlayer ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30' : 'bg-amber-400/20 text-amber-300 border border-amber-400/30';

    const newMsg = {
      id: 'm-' + Date.now(),
      sender: senderName,
      avatarText: initials,
      avatarBg: avatarBg,
      badge: badge,
      badgeCls: badgeCls,
      time: new Date().toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' }) + ' WIB',
      text: Utils.escapeHtml(text),
      quoteFrom: _replyingTo ? _replyingTo.sender : null,
      quoteText: _replyingTo ? _replyingTo.text.replace(/<[^>]*>?/gm, '').slice(0, 50) : null,
      reactions: [],
      attachment: null
    };

    chan.messages.push(newMsg);
    saveStore(store);

    input.value = '';
    input.style.height = 'auto';
    _replyingTo = null;

    refreshView();
    scrollToBottom();

    // Trigger realistic AI coach or player reply simulation
    triggerAutoReply(chan.id, text, isPlayer);
  }

  /* Auto-Reply Simulation with Realistic Soccer Knowledge */
  function triggerAutoReply(channelId, userText, sentByPlayer) {
    const indicator = document.getElementById('discord-typing-indicator');
    const indicatorText = document.getElementById('discord-typing-text');
    if (indicator) {
      if (indicatorText) {
        indicatorText.textContent = sentByPlayer
          ? 'Coach Hendra sedang mengetik balasan instruksi...'
          : 'Farhan Ramadhan sedang mengetik respons...';
      }
      indicator.classList.remove('hidden');
      scrollToBottom();
    }

    const delay = Math.floor(Math.random() * 800) + 1400; // 1.4s - 2.2s

    setTimeout(() => {
      const store = getStore();
      const chan = store.channels.find(c => c.id === channelId);
      if (!chan) return;

      let replyMsg = null;
      const lower = userText.toLowerCase();

      if (sentByPlayer) {
        // Player spoke to Coach Hendra (DM) or Squad
        let replyText = 'Bagus Farhan! Terus pertahankan fokus dan konsistensi latihanmu. Setiap instruksi taktik akan kita sempurnakan bersama di lapangan ⚽💪';

        if (lower.includes('taktik') || lower.includes('formasi') || lower.includes('posisi')) {
          replyText = 'Tepat sekali Farhan. Posisi playmaker #10 membutuhkan visi 360 derajat. Saat lawan menekan, cari Azzam di sisi sayap atau lepaskan through-pass cepat ke striker 🎯';
        } else if (lower.includes('free kick') || lower.includes('tendangan') || lower.includes('corner') || lower.includes('set piece')) {
          replyText = 'Siap! Untuk free kick dari jarak 20-25 meter, ambil sudut melengkung melewati pagar betis. Kamu punya akurasi terbaik di tim musim ini 👑';
        } else if (lower.includes('cedera') || lower.includes('sakit') || lower.includes('istirahat') || lower.includes('capek')) {
          replyText = 'Kesehatan dan keselamatan atlet adalah nomor satu. Laporkan ke tim medis akademi dan Coach Budi untuk program peregangan ringan dan kompres es 🧊';
        } else if (lower.includes('terima kasih') || lower.includes('makasih') || lower.includes('siap')) {
          replyText = 'Sama-sama Farhan! Tetap rendah hati, disiplin, dan buktikan kemampuanmu di pertandingan Sabtu besok! 🏆';
        }

        replyMsg = {
          id: 'm-reply-' + Date.now(),
          sender: 'Coach Hendra',
          avatarText: 'CH',
          avatarBg: 'bg-amber-500',
          badge: '👑 HEAD COACH',
          badgeCls: 'bg-amber-400/20 text-amber-300 border border-amber-400/30',
          time: new Date().toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' }) + ' WIB',
          text: replyText,
          reactions: [{ emoji: '👍', count: 1, reacted: true }, { emoji: '🔥', count: 1, reacted: false }],
          attachment: null
        };
      } else {
        // Coach spoke to Player or Squad
        replyMsg = {
          id: 'm-reply-' + Date.now(),
          sender: 'Farhan Ramadhan',
          avatarText: 'FR',
          avatarBg: 'bg-sky-500',
          badge: '⚽ SISWA · #10',
          badgeCls: 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30',
          time: new Date().toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' }) + ' WIB',
          text: 'Siap Coach Hendra! Saya catat instruksinya dengan teliti. Saya dan seluruh skuad siap jalankan skema terbaik di lapangan besok! 💪⚽',
          reactions: [{ emoji: '💪', count: 2, reacted: true }],
          attachment: null
        };
      }

      chan.messages.push(replyMsg);
      saveStore(store);

      if (indicator) indicator.classList.add('hidden');
      refreshView();
      scrollToBottom();
      Utils.showToast(`Pesan baru dari ${replyMsg.sender} 💬`, 'info');
    }, delay);
  }

  function sendTacticalBoard() {
    const store = getStore();
    const chan = store.channels.find(c => c.id === _activeChannelId);
    if (!chan) return;

    const isPlayer = _activeRole === 'player';
    const newMsg = {
      id: 'm-' + Date.now(),
      sender: isPlayer ? 'Farhan Ramadhan' : 'Coach Hendra',
      avatarText: isPlayer ? 'FR' : 'CH',
      avatarBg: isPlayer ? 'bg-sky-500' : 'bg-amber-500',
      badge: isPlayer ? '⚽ SISWA · #10' : '👑 HEAD COACH',
      badgeCls: isPlayer ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30' : 'bg-amber-400/20 text-amber-300 border border-amber-400/30',
      time: new Date().toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' }) + ' WIB',
      text: 'Berikut lampiran <strong>Papan Taktik Formasi 4-3-3 Attacking</strong> untuk sesi briefing pertandingan kita.',
      attachment: 'tactical-board',
      reactions: [{ emoji: '📋', count: 1, reacted: true }]
    };

    chan.messages.push(newMsg);
    saveStore(store);
    refreshView();
    scrollToBottom();
    Utils.showToast('Tactical Board terkirim ke Discord! 📋', 'success');
  }

  function sendDrillCard() {
    const store = getStore();
    const chan = store.channels.find(c => c.id === _activeChannelId);
    if (!chan) return;

    const isPlayer = _activeRole === 'player';
    const newMsg = {
      id: 'm-' + Date.now(),
      sender: isPlayer ? 'Farhan Ramadhan' : 'Coach Hendra',
      avatarText: isPlayer ? 'FR' : 'CH',
      avatarBg: isPlayer ? 'bg-sky-500' : 'bg-amber-500',
      badge: isPlayer ? '⚽ SISWA · #10' : '👑 HEAD COACH',
      badgeCls: isPlayer ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30' : 'bg-amber-400/20 text-amber-300 border border-amber-400/30',
      time: new Date().toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' }) + ' WIB',
      text: 'Target menu drill khusus yang harus diselesaikan pada sesi latihan berikutnya.',
      attachment: 'drill-card',
      attachmentTitle: 'High Pressing & Rondo 5v2 (Target First-Touch)',
      reactions: [{ emoji: '🎯', count: 1, reacted: true }]
    };

    chan.messages.push(newMsg);
    saveStore(store);
    refreshView();
    scrollToBottom();
    Utils.showToast('Menu drill latihan terkirim ke Discord! 🎯', 'success');
  }

  function setReply(msgId) {
    const store = getStore();
    const chan = store.channels.find(c => c.id === _activeChannelId);
    if (!chan) return;
    const msg = chan.messages.find(m => m.id === msgId);
    if (!msg) return;

    _replyingTo = msg;
    const banner = document.getElementById('discord-reply-banner');
    const senderEl = document.getElementById('discord-reply-sender');
    const textEl = document.getElementById('discord-reply-text');
    if (banner && senderEl && textEl) {
      senderEl.textContent = msg.sender;
      textEl.textContent = `"${msg.text.replace(/<[^>]*>?/gm, '').slice(0, 45)}..."`;
      banner.classList.remove('hidden');
      banner.classList.add('flex');
    }
    const input = document.getElementById('discord-message-input');
    if (input) input.focus();
  }

  function cancelReply() {
    _replyingTo = null;
    const banner = document.getElementById('discord-reply-banner');
    if (banner) {
      banner.classList.add('hidden');
      banner.classList.remove('flex');
    }
  }

  function toggleReaction(msgId, emoji) {
    const store = getStore();
    const chan = store.channels.find(c => c.id === _activeChannelId);
    if (!chan) return;
    const msg = chan.messages.find(m => m.id === msgId);
    if (!msg) return;

    if (!msg.reactions) msg.reactions = [];
    const r = msg.reactions.find(x => x.emoji === emoji);
    if (r) {
      if (r.reacted) {
        r.count = Math.max(0, r.count - 1);
        r.reacted = false;
        if (r.count === 0) {
          msg.reactions = msg.reactions.filter(x => x.emoji !== emoji);
        }
      } else {
        r.count++;
        r.reacted = true;
      }
    } else {
      msg.reactions.push({ emoji: emoji, count: 1, reacted: true });
    }

    saveStore(store);
    refreshView();
  }

  function addReactionPrompt(msgId) {
    toggleReaction(msgId, '🔥');
  }

  function pinMessage(msgId) {
    const store = getStore();
    const chan = store.channels.find(c => c.id === _activeChannelId);
    if (!chan) return;
    const msg = chan.messages.find(m => m.id === msgId);
    if (!msg) return;

    chan.pinned = `📌 ${msg.sender}: "${msg.text.replace(/<[^>]*>?/gm, '').slice(0, 60)}..."`;
    saveStore(store);
    refreshView();
    Utils.showToast('Pesan berhasil disematkan di header channel! 📌', 'success');
  }

  function toggleVoice(chName) {
    if (_voiceConnected) {
      _voiceConnected = false;
      Utils.showToast('Terputus dari Ruang Suara Discord 🔇', 'info');
    } else {
      _voiceConnected = true;
      _voiceChannel = chName || 'Briefing Matchday U-16';
      Utils.showToast(`Bergabung ke Ruang Suara Discord: ${_voiceChannel} 🔊`, 'success');
    }
    refreshView();
  }

  function toggleMute() {
    _isMuted = !_isMuted;
    Utils.showToast(_isMuted ? 'Mikrofon Discord Dibisukan (Muted) 🔇' : 'Mikrofon Aktif 🎙️', 'info');
    refreshView();
  }

  function toggleDeafen() {
    _isDeafened = !_isDeafened;
    Utils.showToast(_isDeafened ? 'Audio Discord Dimatikan (Deafened) 🔕' : 'Audio Aktif 🎧', 'info');
    refreshView();
  }

  function toggleMemberList() {
    _showMemberList = !_showMemberList;
    refreshView();
  }

  function toggleEmojiPicker() {
    _showEmojiPicker = !_showEmojiPicker;
    const el = document.getElementById('discord-emoji-picker');
    if (el) el.classList.toggle('hidden', !_showEmojiPicker);
  }

  function insertEmoji(em) {
    const inp = document.getElementById('discord-message-input');
    if (inp) {
      inp.value += ' ' + em + ' ';
      inp.focus();
    }
    toggleEmojiPicker();
  }

  function insertQuickTemplate() {
    const inp = document.getElementById('discord-message-input');
    if (inp) {
      inp.value = 'Coach Hendra, saya ingin konsultasi mengenai taktik pertandingan & kondisi fisik saya jelang matchday Sabtu...';
      inp.focus();
      autoResize(inp);
    }
  }

  function openAttachmentMenu() {
    Utils.showToast('Pilih pintasan "Formasi 4-3-3" atau "Drill Passing" di atas kolom chat 📋🎯', 'info');
  }

  function startDirectCall(name) {
    toggleVoice(`Panggilan Suara 1-on-1: ${name}`);
  }

  function inspectTactics() {
    Utils.openModal(`
      <div class="p-6 text-white max-w-xl">
        <div class="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
          <div class="flex items-center gap-2">
            <span class="text-xl">📋</span>
            <h3 class="text-lg font-black text-white">Tactical Board Breakdown — 4-3-3 Attacking</h3>
          </div>
          <button onclick="Utils.closeModal()" class="text-zinc-400 hover:text-white font-bold text-lg">✕</button>
        </div>
        ${getTacticalBoardHtml('tactics-zoom')}
        <div class="mt-4 p-4 rounded-2xl bg-zinc-900/90 border border-white/10 text-xs space-y-2">
          <div class="font-bold text-emerald-400">Instruksi Khusus Head Coach:</div>
          <p class="text-zinc-300 leading-relaxed">• <strong>Farhan Ramadhan (#10)</strong> bergerak di half-space antara lini tengah dan pertahanan lawan untuk menarik bek tengah.</p>
          <p class="text-zinc-300 leading-relaxed">• <strong>Azzam Zaky (#7) & Dimas Aditya (#11)</strong> overlap melebar menciptakan ruang crossing matang ke Striker (#9).</p>
          <p class="text-zinc-300 leading-relaxed">• <strong>Gegenpressing 5 Detik:</strong> Segera lakukan pressing berkelompok begitu kehilangan bola di sepertiga akhir.</p>
        </div>
        <div class="mt-4 flex justify-end">
          <button onclick="Utils.closeModal()" class="px-5 py-2.5 rounded-xl btn-lime-glow text-zinc-950 font-bold text-xs">
            Tutup &amp; Siap Laksanakan
          </button>
        </div>
      </div>
    `);
  }

  function showPinnedModal() {
    const chan = getActiveChannel();
    Utils.openModal(`
      <div class="p-6 text-white max-w-md">
        <div class="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
          <div class="flex items-center gap-2">
            <span class="text-amber-400 text-xl">📌</span>
            <h3 class="text-base font-black text-white">Pesan Tersemat di #${chan.name}</h3>
          </div>
          <button onclick="Utils.closeModal()" class="text-zinc-400 hover:text-white font-bold">✕</button>
        </div>
        <div class="p-4 rounded-2xl bg-zinc-900 border border-white/10 text-sm leading-relaxed text-zinc-200">
          ${chan.pinned || 'Belum ada pesan yang disematkan di channel ini.'}
        </div>
        <div class="mt-4 flex justify-end">
          <button onclick="Utils.closeModal()" class="px-4 py-2 rounded-xl glass text-xs font-bold text-white">Tutup</button>
        </div>
      </div>
    `);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function autoResize(el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 128) + 'px';
  }

  function scrollToBottom() {
    const s = document.getElementById('discord-message-stream');
    if (s) s.scrollTop = s.scrollHeight;
  }

  function handleSearch(q) {
    _searchQuery = q.toLowerCase();
    const rows = document.querySelectorAll('.discord-msg-row');
    rows.forEach(r => {
      if (!_searchQuery) {
        r.style.display = '';
        return;
      }
      const text = r.textContent.toLowerCase();
      r.style.display = text.includes(_searchQuery) ? '' : 'none';
    });
  }

  function handleMemberSearch(q) {
    _memberSearch = q.toLowerCase();
  }

  /* Re-render into current parent */
  function refreshView() {
    const target = document.getElementById('discord-app-wrapper');
    if (!target) return;
    const parent = target.parentElement;
    if (!parent) return;

    // Preserve scroll position or update
    parent.innerHTML = render(_activeRole, _activeChannelId);
    setTimeout(scrollToBottom, 20);
  }

  return {
    render,
    switchChannel,
    toggleMobileSidebar,
    closeMobileSidebar,
    sendMessage,
    setReply,
    cancelReply,
    toggleReaction,
    addReactionPrompt,
    pinMessage,
    sendTacticalBoard,
    sendDrillCard,
    toggleVoice,
    toggleMute,
    toggleDeafen,
    toggleMemberList,
    toggleEmojiPicker,
    insertEmoji,
    insertQuickTemplate,
    openAttachmentMenu,
    startDirectCall,
    inspectTactics,
    showPinnedModal,
    handleKeyDown,
    autoResize,
    handleSearch,
    handleMemberSearch
  };

})();
