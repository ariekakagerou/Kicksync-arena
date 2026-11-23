/* ============================================================
   YouthTrigger Arena — Billing & Payment Management Module
   File: js/components/paymentModule.js
   Supports: Player Portal (SPP & Tagihan), Admin Portal (Keuangan),
             Virtual Account, QRIS, Transfer Bank, & E-Receipt Resmi
   ============================================================ */

const PaymentModule = (() => {

  const STORAGE_KEY = 'YTA_PAYMENTS_STORE_V1';

  const DEFAULT_INVOICES = [
    // ── Farhan Ramadhan (Current Player) ─────────────────────
    {
      id: 'INV-202612-010',
      studentName: 'Farhan Ramadhan',
      studentId: 'KSA-16-010',
      squad: 'U-16',
      title: 'Iuran Pembinaan (SPP) — Desember 2026',
      type: 'spp',
      period: 'Desember 2026',
      amount: 500000,
      discount: 100000, // Diskon 20% Beasiswa Prestasi
      finalAmount: 400000,
      dueDate: '10 Desember 2026',
      status: 'pending', // 'paid' | 'pending' | 'overdue'
      paidDate: null,
      method: null,
      vaNumber: '8277 0812 3456 7890',
      bankName: 'BCA Virtual Account',
      notes: 'Iuran bulanan mencakup 3x sesi lapangan, analisa video, dan suplemen tanding.'
    },
    {
      id: 'INV-202611-010',
      studentName: 'Farhan Ramadhan',
      studentId: 'KSA-16-010',
      squad: 'U-16',
      title: 'Iuran Pembinaan (SPP) — November 2026',
      type: 'spp',
      period: 'November 2026',
      amount: 500000,
      discount: 100000,
      finalAmount: 400000,
      dueDate: '10 November 2026',
      status: 'paid',
      paidDate: '05 Nov 2026 · 10:15 WIB',
      method: 'BCA Virtual Account',
      vaNumber: '8277 0812 3456 7890',
      bankName: 'BCA Virtual Account',
      receiptNo: 'REC-YTA-202611-8841',
      notes: 'Pembayaran terverifikasi otomatis oleh sistem perbankan.'
    },
    {
      id: 'INV-TRN-202611',
      studentName: 'Farhan Ramadhan',
      studentId: 'KSA-16-010',
      squad: 'U-16',
      title: 'Registrasi Turnamen Junior Jawa Barat 2026',
      type: 'tournament',
      period: 'Turnamen 2026',
      amount: 250000,
      discount: 0,
      finalAmount: 250000,
      dueDate: '20 November 2026',
      status: 'paid',
      paidDate: '12 Nov 2026 · 14:22 WIB',
      method: 'QRIS Gopay/OVO',
      vaNumber: '8277 0812 3456 7890',
      bankName: 'QRIS Merchant',
      receiptNo: 'REC-YTA-TRN-3301',
      notes: 'Biaya pendaftaran tim, id card turnamen, dan transportasi laga tandang.'
    },
    {
      id: 'INV-202610-010',
      studentName: 'Farhan Ramadhan',
      studentId: 'KSA-16-010',
      squad: 'U-16',
      title: 'Iuran Pembinaan (SPP) — Oktober 2026',
      type: 'spp',
      period: 'Oktober 2026',
      amount: 500000,
      discount: 100000,
      finalAmount: 400000,
      dueDate: '10 Oktober 2026',
      status: 'paid',
      paidDate: '03 Okt 2026 · 09:12 WIB',
      method: 'Bank Mandiri Transfer',
      vaNumber: '156-00-1234567-8',
      bankName: 'Bank Mandiri',
      receiptNo: 'REC-YTA-202610-1290',
      notes: 'Pembayaran terverifikasi via slip transfer.'
    },
    {
      id: 'INV-REG-2022',
      studentName: 'Farhan Ramadhan',
      studentId: 'KSA-16-010',
      squad: 'U-16',
      title: 'Paket Masuk Akademi & 2 Set Jersey Resmi',
      type: 'registration',
      period: 'Januari 2022',
      amount: 1250000,
      discount: 0,
      finalAmount: 1250000,
      dueDate: '10 Januari 2022',
      status: 'paid',
      paidDate: '05 Jan 2022 · 11:30 WIB',
      method: 'BCA Transfer',
      vaNumber: '8277 0812 3456 7890',
      bankName: 'Bank Central Asia',
      receiptNo: 'REC-YTA-REG-0012',
      notes: 'Lengkap dengan jersey Home Hijau Volt, Away Putih, tas ransel, dan asuransi atlet.'
    },

    // ── Siswa Lainnya (Untuk Admin Portal) ─────────────────────
    {
      id: 'INV-202612-007',
      studentName: 'Azzam Zaky',
      studentId: 'KSA-16-007',
      squad: 'U-16',
      title: 'Iuran Pembinaan (SPP) — Desember 2026',
      type: 'spp',
      period: 'Desember 2026',
      amount: 500000,
      discount: 0,
      finalAmount: 500000,
      dueDate: '10 Desember 2026',
      status: 'pending',
      paidDate: null,
      method: null,
      vaNumber: '8277 0812 3456 7891',
      bankName: 'BCA Virtual Account'
    },
    {
      id: 'INV-202612-003',
      studentName: 'Raffi Dinata',
      studentId: 'KSA-16-003',
      squad: 'U-16',
      title: 'Iuran Pembinaan (SPP) — Desember 2026',
      type: 'spp',
      period: 'Desember 2026',
      amount: 500000,
      discount: 0,
      finalAmount: 500000,
      dueDate: '10 Desember 2026',
      status: 'paid',
      paidDate: '18 Nov 2026 · 13:40 WIB',
      method: 'BCA Virtual Account',
      vaNumber: '8277 0812 3456 7892',
      bankName: 'BCA Virtual Account',
      receiptNo: 'REC-YTA-202612-0031'
    },
    {
      id: 'INV-202612-009',
      studentName: 'Bagas Kurniawan',
      studentId: 'KSA-16-009',
      squad: 'U-16',
      title: 'Iuran Pembinaan (SPP) — Desember 2026',
      type: 'spp',
      period: 'Desember 2026',
      amount: 500000,
      discount: 250000, // Keringanan cedera
      finalAmount: 250000,
      dueDate: '10 Desember 2026',
      status: 'pending',
      paidDate: null,
      method: null,
      vaNumber: '8277 0812 3456 7893',
      bankName: 'BCA Virtual Account'
    },
    {
      id: 'INV-202612-011',
      studentName: 'Dimas Aditya',
      studentId: 'KSA-16-011',
      squad: 'U-16',
      title: 'Iuran Pembinaan (SPP) — Desember 2026',
      type: 'spp',
      period: 'Desember 2026',
      amount: 500000,
      discount: 0,
      finalAmount: 500000,
      dueDate: '10 Desember 2026',
      status: 'pending',
      paidDate: null,
      method: null,
      vaNumber: '8277 0812 3456 7894',
      bankName: 'BCA Virtual Account'
    },
    {
      id: 'INV-202612-001',
      studentName: 'Rizki Pratama',
      studentId: 'KSA-16-001',
      squad: 'U-16',
      title: 'Iuran Pembinaan (SPP) — Desember 2026',
      type: 'spp',
      period: 'Desember 2026',
      amount: 500000,
      discount: 0,
      finalAmount: 500000,
      dueDate: '10 Desember 2026',
      status: 'paid',
      paidDate: '15 Nov 2026 · 08:30 WIB',
      method: 'QRIS Bank Mandiri',
      vaNumber: '8277 0812 3456 7895',
      bankName: 'QRIS',
      receiptNo: 'REC-YTA-202612-0019'
    }
  ];

  function getStore() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (_e) {}
    const initial = { invoices: DEFAULT_INVOICES };
    saveStore(initial);
    return initial;
  }

  function saveStore(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (_e) {}
  }

  function formatRupiah(num) {
    return 'Rp ' + Number(num || 0).toLocaleString('id-ID');
  }

  /* ---- Player View: Render Billing Page ---- */
  function renderPlayerBilling() {
    const store = getStore();
    const myInvoices = store.invoices.filter(i => i.studentName === 'Farhan Ramadhan');
    const pendingInv = myInvoices.find(i => i.status === 'pending');
    const paidInvoices = myInvoices.filter(i => i.status === 'paid');

    const totalPaid = paidInvoices.reduce((acc, curr) => acc + curr.finalAmount, 0);

    return `
      <div class="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto">
        
        <!-- Header Page Title -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/8">
          <div>
            <h2 class="text-xl font-black text-white flex items-center gap-2">
              <span>💳</span> Status Tagihan &amp; Pembayaran SPP
            </h2>
            <p class="text-xs text-zinc-400 mt-0.5">Pantau status iuran bulanan, riwayat pembayaran, dan unduh kwitansi resmi.</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs px-3 py-1 rounded-full bg-emerald-400/15 text-emerald-300 border border-emerald-400/30 font-bold flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Siswa Binaan Aktif #10
            </span>
          </div>
        </div>

        <!-- KPI Summary Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          
          <div class="glass rounded-3xl p-4 border border-white/10 relative overflow-hidden">
            <div class="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Tagihan Aktif</div>
            <div class="text-xl sm:text-2xl font-black ${pendingInv ? 'text-amber-400' : 'text-emerald-400'} mt-1">
              ${pendingInv ? formatRupiah(pendingInv.finalAmount) : 'Rp 0'}
            </div>
            <div class="text-[11px] text-zinc-400 mt-1">
              ${pendingInv ? 'Jatuh tempo: ' + pendingInv.dueDate : 'Semua tagihan lunas! ✅'}
            </div>
          </div>

          <div class="glass rounded-3xl p-4 border border-white/10 relative overflow-hidden">
            <div class="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Total Terbayar</div>
            <div class="text-xl sm:text-2xl font-black text-emerald-400 mt-1">
              ${formatRupiah(totalPaid)}
            </div>
            <div class="text-[11px] text-zinc-400 mt-1">
              ${paidInvoices.length} transaksi terverifikasi
            </div>
          </div>

          <div class="glass rounded-3xl p-4 border border-white/10 relative overflow-hidden">
            <div class="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Beasiswa Prestasi</div>
            <div class="text-xl sm:text-2xl font-black text-lime-400 mt-1">
              Diskon 20%
            </div>
            <div class="text-[11px] text-emerald-300 mt-1">
              ⭐ Kategori: Atlet Starter U-16
            </div>
          </div>

          <div class="glass rounded-3xl p-4 border border-white/10 relative overflow-hidden">
            <div class="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Metode Utama</div>
            <div class="text-lg font-black text-white mt-1">
              BCA Virtual Account
            </div>
            <div class="text-[11px] text-zinc-400 mt-1 font-mono">
              8277 0812 3456 7890
            </div>
          </div>

        </div>

        <!-- ACTIVE BILL HIGHLIGHT (If Pending) -->
        ${pendingInv ? `
          <div class="rounded-3xl p-5 sm:p-6 border-2 border-amber-400/40 shadow-2xl relative overflow-hidden"
            style="background: linear-gradient(135deg, rgba(25,20,5,0.92) 0%, rgba(15,18,26,0.95) 100%);">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-5">
              
              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <span class="text-xs px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 font-black border border-amber-400/30">
                    MENUNGGU PEMBAYARAN
                  </span>
                  <span class="text-xs text-zinc-400 font-mono">${pendingInv.id}</span>
                </div>
                <h3 class="text-xl font-black text-white">${pendingInv.title}</h3>
                <p class="text-xs text-zinc-300 max-w-lg leading-relaxed">${pendingInv.notes}</p>
                <div class="flex flex-wrap items-center gap-3 pt-1 text-xs text-zinc-300">
                  <div>Biaya Normal: <span class="line-through text-zinc-500">${formatRupiah(pendingInv.amount)}</span></div>
                  <div>Potongan Beasiswa: <span class="text-lime-400 font-bold">-${formatRupiah(pendingInv.discount)}</span></div>
                  <div>Total Tagihan: <span class="text-lg font-black text-white ml-1">${formatRupiah(pendingInv.finalAmount)}</span></div>
                </div>
              </div>

              <!-- Action & VA Box -->
              <div class="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-3 flex-shrink-0">
                <div class="p-3 bg-zinc-950/80 rounded-2xl border border-white/10 text-right w-full sm:w-auto">
                  <div class="text-[10px] text-zinc-400 uppercase font-semibold">Nomor Virtual Account BCA:</div>
                  <div class="flex items-center justify-end gap-2 mt-0.5">
                    <span class="font-mono text-sm font-black text-lime-400 tracking-wider">${pendingInv.vaNumber}</span>
                    <button onclick="PaymentModule.copyText('${pendingInv.vaNumber}', 'Nomor VA berhasil disalin! 📋')"
                      class="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[10px] font-bold text-white transition-colors">
                      Salin
                    </button>
                  </div>
                </div>
                <button onclick="PaymentModule.openPayModal('${pendingInv.id}')"
                  class="w-full btn-lime-glow py-3 px-6 rounded-2xl font-black text-zinc-950 text-xs shadow-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
                  <span>💳</span> Bayar Sekarang / Konfirmasi
                </button>
              </div>

            </div>
          </div>
        ` : `
          <div class="glass rounded-3xl p-6 border border-emerald-400/30 text-center space-y-2">
            <div class="text-3xl">🎉</div>
            <h3 class="text-base font-black text-white">Semua Iuran dan Tagihan Telah Lunas</h3>
            <p class="text-xs text-zinc-400">Terima kasih telah tertib menyelesaikan pembayaran tepat waktu untuk mendukung fasilitas dan program akademi.</p>
          </div>
        `}

        <!-- PAYMENT HISTORY TABLE -->
        <div class="glass rounded-3xl p-5 border border-white/8 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-black text-white flex items-center gap-2">
              <span>📜</span> Riwayat Pembayaran &amp; Kwitansi Digital
            </h3>
            <span class="text-xs text-zinc-500 font-medium">Musim 2026/2027</span>
          </div>

          <div class="overflow-x-auto table-scroll-x">
            <table class="w-full text-left text-xs min-w-[620px]">
              <thead>
                <tr class="border-b border-white/8 text-zinc-400 font-semibold uppercase text-[10px] tracking-wider">
                  <th class="py-3 px-3">No. Invoice</th>
                  <th class="py-3 px-3">Rincian Pembayaran</th>
                  <th class="py-3 px-3">Nominal</th>
                  <th class="py-3 px-3">Metode Bayar</th>
                  <th class="py-3 px-3">Waktu Transaksi</th>
                  <th class="py-3 px-3">Status</th>
                  <th class="py-3 px-3 text-right">Kwitansi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                ${myInvoices.map(inv => {
                  const isPaid = inv.status === 'paid';
                  return `
                    <tr class="hover:bg-white/4 transition-colors">
                      <td class="py-3 px-3 font-mono text-zinc-300 font-bold">${inv.id}</td>
                      <td class="py-3 px-3">
                        <div class="font-bold text-white">${inv.title}</div>
                        <div class="text-[10px] text-zinc-400">${inv.period}</div>
                      </td>
                      <td class="py-3 px-3 font-bold text-white">
                        ${formatRupiah(inv.finalAmount)}
                        ${inv.discount > 0 ? `<span class="block text-[10px] text-lime-400">Hemat ${formatRupiah(inv.discount)}</span>` : ''}
                      </td>
                      <td class="py-3 px-3 text-zinc-300">
                        ${inv.method || '<span class="text-zinc-500 italic">Belum dibayar</span>'}
                      </td>
                      <td class="py-3 px-3 text-zinc-400">
                        ${inv.paidDate || '<span class="text-amber-400">Menunggu</span>'}
                      </td>
                      <td class="py-3 px-3">
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-black ${isPaid ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30' : 'bg-amber-400/20 text-amber-300 border border-amber-400/30'}">
                          ${isPaid ? 'LUNAS' : 'MENUNGGU'}
                        </span>
                      </td>
                      <td class="py-3 px-3 text-right">
                        ${isPaid ? `
                          <button onclick="PaymentModule.showReceipt('${inv.id}')"
                            class="px-2.5 py-1 rounded-lg glass hover:bg-emerald-400/20 text-emerald-300 font-bold text-[11px] border border-emerald-400/30 transition-all flex items-center gap-1 ml-auto">
                            <span>📄</span> Kwitansi
                          </button>
                        ` : `
                          <button onclick="PaymentModule.openPayModal('${inv.id}')"
                            class="px-2.5 py-1 rounded-lg btn-lime-glow text-zinc-950 font-black text-[11px] shadow transition-all ml-auto">
                            Bayar
                          </button>
                        `}
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;
  }

  /* ---- Admin View: Render Finance Page ---- */
  function renderAdminFinance() {
    const store = getStore();
    const invoices = store.invoices;

    const paidInvoices = invoices.filter(i => i.status === 'paid');
    const pendingInvoices = invoices.filter(i => i.status === 'pending');

    const totalIncome = paidInvoices.reduce((acc, c) => acc + c.finalAmount, 0);
    const totalPending = pendingInvoices.reduce((acc, c) => acc + c.finalAmount, 0);
    const paidRate = Math.round((paidInvoices.length / invoices.length) * 100);

    return `
      <div class="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
        
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/8">
          <div>
            <h2 class="text-xl font-black text-white flex items-center gap-2">
              <span>💰</span> Manajemen Keuangan &amp; SPP Siswa Akademi
            </h2>
            <p class="text-xs text-zinc-400 mt-0.5">Pantau arus kas SPP bulanan, verifikasi pembayaran siswa, dan kelola invoice akademi.</p>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <button onclick="PaymentModule.openNewInvoiceModal()"
              class="px-4 py-2 rounded-xl btn-lime-glow text-xs font-black text-zinc-950 shadow flex items-center gap-1.5">
              <span>➕</span> Terbitkan Tagihan Baru
            </button>
            <button onclick="PaymentModule.exportFinanceReport()"
              class="px-3.5 py-2 rounded-xl glass hover:bg-white/10 text-xs font-bold text-white border border-white/10 transition-colors flex items-center gap-1.5">
              <span>📊</span> Unduh Laporan (Excel)
            </button>
          </div>
        </div>

        <!-- KPI Summary Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          <div class="glass rounded-3xl p-5 border border-emerald-400/20">
            <div class="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Total SPP Masuk</div>
            <div class="text-2xl font-black text-emerald-400 mt-1">${formatRupiah(totalIncome)}</div>
            <div class="text-xs text-zinc-400 mt-1">${paidInvoices.length} transaksi selesai</div>
          </div>

          <div class="glass rounded-3xl p-5 border border-amber-400/20">
            <div class="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Tagihan Tertunda (Pending)</div>
            <div class="text-2xl font-black text-amber-400 mt-1">${formatRupiah(totalPending)}</div>
            <div class="text-xs text-zinc-400 mt-1">${pendingInvoices.length} siswa belum bayar</div>
          </div>

          <div class="glass rounded-3xl p-5 border border-sky-400/20">
            <div class="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Tingkat Kelunasan</div>
            <div class="text-2xl font-black text-sky-400 mt-1">${paidRate}%</div>
            <div class="text-xs text-zinc-400 mt-1">Target bulan ini: 95%</div>
          </div>

          <div class="glass rounded-3xl p-5 border border-purple-400/20">
            <div class="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Dana Beasiswa Disalurkan</div>
            <div class="text-2xl font-black text-purple-400 mt-1">Rp 1.850.000</div>
            <div class="text-xs text-zinc-400 mt-1">Subsidi atlet berprestasi</div>
          </div>

        </div>

        <!-- Filter & Search Bar -->
        <div class="glass rounded-2xl p-3 border border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div class="flex items-center gap-2 w-full sm:w-auto">
            <span class="text-zinc-400">Filter Status:</span>
            <select id="admin-finance-status-filter" onchange="PaymentModule.filterAdminTable()"
              class="glass rounded-xl px-3 py-1.5 text-white bg-zinc-900 border border-white/10 focus:outline-none">
              <option value="all">Semua Status</option>
              <option value="pending">Menunggu Pembayaran</option>
              <option value="paid">Sudah Lunas</option>
            </select>
          </div>
          <div class="flex items-center gap-2 w-full sm:w-auto">
            <button onclick="PaymentModule.sendMassReminder()"
              class="px-3 py-1.5 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 text-amber-300 font-bold border border-amber-400/30 flex items-center gap-1.5 transition-colors">
              <span>📢</span> Kirim Pengingat WhatsApp Massal
            </button>
          </div>
        </div>

        <!-- Data Table -->
        <div class="glass rounded-3xl p-5 border border-white/8 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-black text-white">Daftar Tagihan &amp; Pembayaran Siswa</h3>
            <span class="text-xs text-zinc-400">Menampilkan seluruh data invoice terdaftar</span>
          </div>

          <div class="overflow-x-auto table-scroll-x">
            <table class="w-full text-left text-xs min-w-[700px]" id="admin-finance-table">
              <thead>
                <tr class="border-b border-white/8 text-zinc-400 font-semibold uppercase text-[10px] tracking-wider">
                  <th class="py-3 px-3">No. Tagihan</th>
                  <th class="py-3 px-3">Nama Siswa</th>
                  <th class="py-3 px-3">Kelompok</th>
                  <th class="py-3 px-3">Keterangan</th>
                  <th class="py-3 px-3">Total Tagihan</th>
                  <th class="py-3 px-3">Status</th>
                  <th class="py-3 px-3">Tanggal Lunas</th>
                  <th class="py-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                ${invoices.map(inv => {
                  const isPaid = inv.status === 'paid';
                  return `
                    <tr class="hover:bg-white/4 transition-colors" data-status="${inv.status}">
                      <td class="py-3 px-3 font-mono text-zinc-300 font-bold">${inv.id}</td>
                      <td class="py-3 px-3">
                        <div class="font-bold text-white">${inv.studentName}</div>
                        <div class="text-[10px] text-zinc-400 font-mono">${inv.studentId}</div>
                      </td>
                      <td class="py-3 px-3">
                        <span class="px-2 py-0.5 rounded bg-sky-500/15 text-sky-300 font-bold text-[10px]">${inv.squad}</span>
                      </td>
                      <td class="py-3 px-3 text-zinc-200">${inv.title}</td>
                      <td class="py-3 px-3 font-bold text-white">${formatRupiah(inv.finalAmount)}</td>
                      <td class="py-3 px-3">
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-black ${isPaid ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30' : 'bg-amber-400/20 text-amber-300 border border-amber-400/30'}">
                          ${isPaid ? 'LUNAS' : 'MENUNGGU'}
                        </span>
                      </td>
                      <td class="py-3 px-3 text-zinc-400">${inv.paidDate || '-'}</td>
                      <td class="py-3 px-3 text-right">
                        ${isPaid ? `
                          <button onclick="PaymentModule.showReceipt('${inv.id}')"
                            class="px-2.5 py-1 rounded-lg glass hover:bg-emerald-400/20 text-emerald-300 font-bold text-[10px] border border-emerald-400/30 transition-all">
                            Kwitansi
                          </button>
                        ` : `
                          <button onclick="PaymentModule.adminVerify('${inv.id}')"
                            class="px-2.5 py-1 rounded-lg btn-lime-glow text-zinc-950 font-black text-[10px] shadow transition-all">
                            Verifikasi
                          </button>
                        `}
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;
  }

  /* ---- Interactive Payment Modal ---- */
  function openPayModal(invoiceId) {
    const store = getStore();
    const inv = store.invoices.find(i => i.id === invoiceId);
    if (!inv) return;

    Utils.openModal(`
      <div class="space-y-4 max-w-lg w-full text-left text-xs modal-responsive-card">
        
        <!-- Header -->
        <div class="flex items-center justify-between pb-3 border-b border-white/10">
          <div class="flex items-center gap-2.5">
            <div class="w-10 h-10 rounded-2xl gradient-lime text-zinc-950 font-black flex items-center justify-center text-lg shadow">
              💳
            </div>
            <div>
              <h3 class="text-base font-black text-white">Pembayaran Tagihan Akademi</h3>
              <p class="text-[11px] text-zinc-400 font-mono">${inv.id} · ${inv.studentName}</p>
            </div>
          </div>
          <button onclick="Utils.closeModal()" class="text-zinc-400 hover:text-white font-bold text-lg">✕</button>
        </div>

        <!-- Invoice Detail Card -->
        <div class="p-4 rounded-2xl bg-zinc-900/90 border border-white/10 space-y-2">
          <div class="flex justify-between items-center">
            <span class="text-zinc-400">Rincian:</span>
            <span class="font-bold text-white text-right">${inv.title}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-zinc-400">Batas Waktu:</span>
            <span class="text-amber-400 font-bold">${inv.dueDate}</span>
          </div>
          <div class="pt-2 border-t border-white/5 flex justify-between items-center text-sm">
            <span class="font-bold text-white">Total yang Harus Dibayar:</span>
            <span class="font-black text-lime-400 text-lg">${formatRupiah(inv.finalAmount)}</span>
          </div>
        </div>

        <!-- Payment Channel Options -->
        <div class="space-y-2">
          <div class="text-[11px] font-bold text-lime-400 uppercase tracking-wider">Pilih Metode Pembayaran:</div>
          
          <!-- Option 1: BCA Virtual Account -->
          <div class="p-3 rounded-xl bg-zinc-900 border border-white/10 space-y-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-base">🏦</span>
                <span class="font-bold text-white">BCA Virtual Account (Otomatis)</span>
              </div>
              <span class="text-[10px] px-2 py-0.5 rounded bg-emerald-400/20 text-emerald-300 font-bold">24 Jam</span>
            </div>
            <div class="p-2.5 rounded-lg bg-zinc-950 border border-white/5 flex items-center justify-between">
              <div>
                <div class="text-[10px] text-zinc-400">No. Virtual Account:</div>
                <div class="font-mono text-sm font-black text-lime-400 tracking-wider">${inv.vaNumber}</div>
              </div>
              <button onclick="PaymentModule.copyText('${inv.vaNumber}', 'No. Virtual Account berhasil disalin! 📋')"
                class="px-2.5 py-1 rounded-md glass hover:bg-white/15 text-xs font-bold text-white transition-colors">
                Salin
              </button>
            </div>
          </div>

          <!-- Option 2: Bank Mandiri -->
          <div class="p-3 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-base">🏛️</span>
              <div>
                <div class="font-bold text-white">Bank Mandiri Transfer</div>
                <div class="text-[10px] text-zinc-400 font-mono">156-00-1234567-8 a.n. YouthTrigger Arena</div>
              </div>
            </div>
            <button onclick="PaymentModule.copyText('1560012345678', 'No. Rekening Mandiri disalin! 📋')"
              class="px-2.5 py-1 rounded-md glass hover:bg-white/15 text-xs font-bold text-white transition-colors">
              Salin
            </button>
          </div>

          <!-- Option 3: QRIS -->
          <div class="p-3 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-base">📱</span>
              <div>
                <div class="font-bold text-white">QRIS (Gopay, OVO, Dana, ShopeePay)</div>
                <div class="text-[10px] text-zinc-400">Scan via seluruh m-banking &amp; e-wallet</div>
              </div>
            </div>
            <span class="text-[10px] text-lime-400 font-bold">Instan</span>
          </div>

        </div>

        <!-- Simulated Proof Upload & Submit -->
        <div class="p-3 bg-zinc-900/60 rounded-xl border border-white/5 space-y-2">
          <label class="block text-zinc-300 font-semibold">Konfirmasi Bukti Transfer (Opsional jika via VA):</label>
          <div class="flex items-center gap-2">
            <input type="text" id="pay-proof-note" placeholder="Nama pengirim / Bank asal transfer"
              class="flex-1 glass rounded-xl px-3 py-2 text-white border border-white/10 focus:outline-none focus:border-lime-400"/>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2.5 pt-2 border-t border-white/10">
          <button onclick="Utils.closeModal()" class="px-4 py-2.5 rounded-xl glass text-zinc-400 hover:text-white font-semibold">Batal</button>
          <button onclick="PaymentModule.executePayment('${inv.id}')"
            class="btn-lime-glow px-6 py-2.5 rounded-xl text-zinc-950 font-black shadow-lg flex items-center gap-1.5">
            <span>✓</span> Saya Sudah Bayar
          </button>
        </div>

      </div>
    `);
  }

  function executePayment(invoiceId) {
    const store = getStore();
    const inv = store.invoices.find(i => i.id === invoiceId);
    if (!inv) return;

    inv.status = 'paid';
    inv.paidDate = new Date().toLocaleDateString('id-ID', { day:'2-digit', month:'short', year:'numeric' }) + ' · ' + new Date().toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' }) + ' WIB';
    inv.method = 'BCA Virtual Account';
    inv.receiptNo = 'REC-YTA-' + Date.now().toString().slice(-6);

    saveStore(store);
    Utils.closeModal();
    Utils.showToast(`Pembayaran ${inv.title} berhasil diverifikasi! Kwitansi resmi telah terbit 🧾`, 'success');

    // Automatically open E-Receipt modal
    setTimeout(() => {
      showReceipt(invoiceId);
    }, 400);

    // Refresh view
    if (typeof PlayerView !== 'undefined' && PlayerView.navTo) {
      PlayerView.navTo('billing');
    }
  }

  /* ---- Official E-Receipt Modal ---- */
  function showReceipt(invoiceId) {
    const store = getStore();
    const inv = store.invoices.find(i => i.id === invoiceId);
    if (!inv) return;

    Utils.openModal(`
      <div class="p-4 sm:p-6 max-w-lg w-full text-left text-zinc-200 space-y-4 sm:space-y-5 rounded-3xl relative overflow-hidden modal-responsive-card"
        style="background: linear-gradient(135deg, #0e1524 0%, #090d16 100%); border: 1px solid rgba(163,230,53,0.3);">
        
        <!-- Watermark / Stamp -->
        <div class="absolute right-4 bottom-14 border-4 border-emerald-500/30 text-emerald-500/30 font-black text-3xl sm:text-4xl px-3 sm:px-4 py-1 rounded-2xl rotate-[-12deg] pointer-events-none select-none">
          LUNAS
        </div>

        <!-- Top Header & Logo -->
        <div class="flex items-center justify-between border-b border-white/10 pb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 sm:w-11 h-10 sm:h-11 rounded-2xl gradient-lime text-zinc-950 font-black flex items-center justify-center text-lg sm:text-xl shadow-lg flex-shrink-0">
              ⚽
            </div>
            <div>
              <div class="font-black text-white text-sm sm:text-base leading-tight">YouthTrigger Arena</div>
              <div class="text-[10px] sm:text-[11px] text-lime-400 font-semibold tracking-wider uppercase">Football Academy Official Receipt</div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-[9px] sm:text-[10px] text-zinc-400">NO. KWITANSI:</div>
            <div class="font-mono text-xs font-black text-white">${inv.receiptNo || 'REC-YTA-202611'}</div>
          </div>
        </div>

        <!-- Student & Transaction Info Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs">
          <div>
            <div class="text-[10px] text-zinc-500 uppercase font-semibold">Nama Siswa / Atlet:</div>
            <div class="font-bold text-white text-sm mt-0.5">${inv.studentName}</div>
            <div class="text-zinc-400 text-[11px]">ID Siswa: <span class="font-mono text-lime-400">${inv.studentId}</span> (${inv.squad})</div>
          </div>
          <div class="text-left sm:text-right">
            <div class="text-[10px] text-zinc-500 uppercase font-semibold">Waktu Pembayaran:</div>
            <div class="font-bold text-white mt-0.5">${inv.paidDate || '-'}</div>
            <div class="text-zinc-400 text-[11px]">Metode: <span class="text-white">${inv.method || 'Transfer'}</span></div>
          </div>
        </div>

        <!-- Itemized Table -->
        <div class="rounded-2xl bg-zinc-900/90 border border-white/8 p-4 space-y-2 text-xs">
          <div class="flex justify-between items-center text-zinc-400 text-[11px] pb-1 border-b border-white/5 font-semibold">
            <span>Keterangan Pembayaran</span>
            <span>Jumlah</span>
          </div>
          <div class="flex justify-between items-center pt-1 font-semibold text-white">
            <span>${inv.title}</span>
            <span>${formatRupiah(inv.amount)}</span>
          </div>
          ${inv.discount > 0 ? `
            <div class="flex justify-between items-center text-emerald-400 text-[11px]">
              <span>Subsidi Beasiswa Atlet Berprestasi</span>
              <span>-${formatRupiah(inv.discount)}</span>
            </div>
          ` : ''}
          <div class="pt-2 border-t border-white/10 flex justify-between items-center text-sm font-black">
            <span class="text-white">TOTAL DIBAYAR:</span>
            <span class="text-lime-400 font-mono text-base">${formatRupiah(inv.finalAmount)}</span>
          </div>
        </div>

        <!-- Official Footer Note -->
        <div class="p-3 rounded-xl bg-white/4 text-[10px] text-zinc-400 flex items-start gap-2">
          <span class="text-emerald-400 text-xs">🔒</span>
          <span>Dokumen kwitansi digital ini sah dan diterbitkan resmi oleh sistem YouthTrigger Arena Football Academy terakreditasi PSSI &amp; AFC.</span>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-between pt-2">
          <button onclick="PaymentModule.printReceipt('${inv.id}')"
            class="px-4 py-2 rounded-xl glass hover:bg-white/10 text-zinc-200 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-colors">
            <span>🖨️</span> Cetak / Simpan PDF
          </button>
          <button onclick="Utils.closeModal()"
            class="btn-lime-glow px-6 py-2 rounded-xl text-zinc-950 font-black text-xs shadow-lg">
            Selesai
          </button>
        </div>

      </div>
    `);
  }

  function printReceipt(invoiceId) {
    window.print();
  }

  function adminVerify(invoiceId) {
    const store = getStore();
    const inv = store.invoices.find(i => i.id === invoiceId);
    if (!inv) return;

    inv.status = 'paid';
    inv.paidDate = new Date().toLocaleDateString('id-ID', { day:'2-digit', month:'short', year:'numeric' }) + ' · ' + new Date().toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' }) + ' WIB';
    inv.method = 'BCA Virtual Account';
    inv.receiptNo = 'REC-YTA-' + Date.now().toString().slice(-6);

    saveStore(store);
    Utils.showToast(`Invoice ${inv.id} milik ${inv.studentName} berhasil diverifikasi Lunas! ✅`, 'success');
    
    if (typeof AdminView !== 'undefined' && AdminView.navTo) {
      AdminView.navTo('finance');
    }
  }

  function openNewInvoiceModal() {
    Utils.openModal(`
      <div class="p-4 space-y-4 max-w-md w-full text-left text-xs modal-responsive-card">
        <div class="flex items-center justify-between pb-3 border-b border-white/10">
          <h3 class="text-base font-black text-white">Terbitkan Tagihan Baru</h3>
          <button onclick="Utils.closeModal()" class="text-zinc-400 hover:text-white font-bold">✕</button>
        </div>
        <form onsubmit="PaymentModule.submitNewInvoice(event)" class="space-y-3">
          <div>
            <label class="block text-zinc-300 font-semibold mb-1">Nama Siswa / Atlet:</label>
            <input required id="new-inv-name" type="text" placeholder="Contoh: Farhan Ramadhan"
              class="w-full glass rounded-xl px-3 py-2 text-white border border-white/10"/>
          </div>
          <div>
            <label class="block text-zinc-300 font-semibold mb-1">Judul / Keterangan Tagihan:</label>
            <input required id="new-inv-title" type="text" placeholder="Contoh: SPP Januari 2027"
              class="w-full glass rounded-xl px-3 py-2 text-white border border-white/10"/>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-zinc-300 font-semibold mb-1">Nominal (Rp):</label>
              <input required id="new-inv-amount" type="number" value="500000"
                class="w-full glass rounded-xl px-3 py-2 text-white border border-white/10"/>
            </div>
            <div>
              <label class="block text-zinc-300 font-semibold mb-1">Kelompok Usia:</label>
              <select id="new-inv-squad" class="w-full glass rounded-xl px-3 py-2 bg-zinc-900 text-white border border-white/10">
                <option value="U-16">U-16</option>
                <option value="U-14">U-14</option>
                <option value="U-12">U-12</option>
                <option value="U-10">U-10</option>
                <option value="U-18">U-18</option>
              </select>
            </div>
          </div>
          <div class="flex justify-end gap-2 pt-2 border-t border-white/10">
            <button type="button" onclick="Utils.closeModal()" class="px-4 py-2 rounded-xl glass text-zinc-400">Batal</button>
            <button type="submit" class="btn-lime-glow px-5 py-2 rounded-xl text-zinc-950 font-black">Terbitkan Invoice</button>
          </div>
        </form>
      </div>
    `);
  }

  function submitNewInvoice(e) {
    e.preventDefault();
    const name = document.getElementById('new-inv-name')?.value || 'Siswa';
    const title = document.getElementById('new-inv-title')?.value || 'Iuran Bulanan';
    const amount = Number(document.getElementById('new-inv-amount')?.value || 500000);
    const squad = document.getElementById('new-inv-squad')?.value || 'U-16';

    const store = getStore();
    const newInv = {
      id: 'INV-' + Date.now().toString().slice(-6),
      studentName: name,
      studentId: 'KSA-' + squad.replace('-','') + '-99',
      squad: squad,
      title: title,
      type: 'spp',
      period: 'Bulan Berjalan',
      amount: amount,
      discount: 0,
      finalAmount: amount,
      dueDate: '10 Bulan Depan',
      status: 'pending',
      paidDate: null,
      method: null,
      vaNumber: '8277 0812 9988 ' + Math.floor(1000 + Math.random() * 9000),
      bankName: 'BCA Virtual Account'
    };

    store.invoices.unshift(newInv);
    saveStore(store);

    Utils.closeModal();
    Utils.showToast(`Invoice baru untuk ${name} berhasil diterbitkan! 📄`, 'success');

    if (typeof AdminView !== 'undefined' && AdminView.navTo) {
      AdminView.navTo('finance');
    }
  }

  function sendMassReminder() {
    Utils.showToast('Pesan pengingat tagihan WhatsApp berhasil disiarkan ke 6 wali siswa! 📲', 'info');
  }

  function exportFinanceReport() {
    Utils.showToast('Laporan keuangan & rekapitulasi SPP berhasil diekspor ke Excel! 📊', 'success');
  }

  function filterAdminTable() {
    const sel = document.getElementById('admin-finance-status-filter')?.value || 'all';
    const rows = document.querySelectorAll('#admin-finance-table tbody tr');
    rows.forEach(r => {
      const st = r.getAttribute('data-status');
      if (sel === 'all' || st === sel) {
        r.style.display = '';
      } else {
        r.style.display = 'none';
      }
    });
  }

  function copyText(text, successMsg = 'Teks disalin!') {
    navigator.clipboard.writeText(text).then(() => {
      Utils.showToast(successMsg, 'success');
    }).catch(() => {
      Utils.showToast(text, 'info');
    });
  }

  return {
    renderPlayerBilling,
    renderAdminFinance,
    openPayModal,
    executePayment,
    showReceipt,
    printReceipt,
    adminVerify,
    openNewInvoiceModal,
    submitNewInvoice,
    sendMassReminder,
    exportFinanceReport,
    filterAdminTable,
    copyText
  };

})();
