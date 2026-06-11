import React, { useState } from 'react';
import { TicketCategory, TicketRecord } from '../types';
import { Ticket, Plus, Trash2, HeartHandshake, ShieldAlert, Coins, HelpCircle, Save, LifeBuoy, ToggleLeft, ToggleRight, Check, CheckCircle, Clock } from 'lucide-react';

interface TicketManagerProps {
  ticketEnabled: boolean;
  ticketChannelId: string;
  ticketStaffRoleId: string;
  ticketCategories: TicketCategory[];
  tickets: TicketRecord[];
  updateTicketConfig: (config: {
    ticketEnabled: boolean;
    ticketChannelId: string;
    ticketStaffRoleId: string;
    ticketCategories: TicketCategory[];
  }) => void;
  updateTickets: (tickets: TicketRecord[]) => void;
}

export default function TicketManager({
  ticketEnabled,
  ticketChannelId,
  ticketStaffRoleId,
  ticketCategories,
  tickets,
  updateTicketConfig,
  updateTickets
}: TicketManagerProps) {
  const [enabled, setEnabled] = useState(ticketEnabled);
  const [channelId, setChannelId] = useState(ticketChannelId);
  const [staffRoleId, setStaffRoleId] = useState(ticketStaffRoleId);
  const [categories, setCategories] = useState<TicketCategory[]>(ticketCategories);

  // New Category states
  const [catName, setCatName] = useState('');
  const [catValue, setCatValue] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catEmoji, setCatEmoji] = useState('🤝');

  // New Ticket Simulation Template
  const [simReason, setSimReason] = useState('Ingin mengajukan kemitraan / partnership server komunitas.');
  const [simCategory, setSimCategory] = useState('partnership');
  const [simUser, setSimUser] = useState('Vallens#1204');

  const emojiOptions = ['🤝', '⚠️', '💎', '❓', '📦', '🔥', '🛡️', '⚙️'];

  const handleUpdateConfig = () => {
    updateTicketConfig({
      ticketEnabled: enabled,
      ticketChannelId: channelId,
      ticketStaffRoleId: staffRoleId,
      ticketCategories: categories
    });
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim() || !catValue.trim()) return;

    const freshCat: TicketCategory = {
      id: 'cat_' + Math.random().toString(36).substring(2, 9),
      name: catName,
      value: catValue.toLowerCase(),
      description: catDesc,
      emoji: catEmoji
    };

    const updated = [...categories, freshCat];
    setCategories(updated);
    updateTicketConfig({
      ticketEnabled: enabled,
      ticketChannelId: channelId,
      ticketStaffRoleId: staffRoleId,
      ticketCategories: updated
    });

    // Reset Form
    setCatName('');
    setCatValue('');
    setCatDesc('');
    setCatEmoji('🤝');
  };

  const handleDeleteCategory = (id: string) => {
    const updated = categories.filter(c => c.id !== id);
    setCategories(updated);
    updateTicketConfig({
      ticketEnabled: enabled,
      ticketChannelId: channelId,
      ticketStaffRoleId: staffRoleId,
      ticketCategories: updated
    });
  };

  const handleSimulateTicket = () => {
    const matchedCategory = categories.find(c => c.value === simCategory) || categories[0];
    const categoryName = matchedCategory ? `${matchedCategory.emoji} ${matchedCategory.name}` : '⚙️ Custom Support';

    const freshTicket: TicketRecord = {
      id: 'TKT-' + Math.floor(1000 + Math.random() * 9000),
      userId: 'user_' + Math.random().toString(36).substring(2, 9),
      username: simUser || 'WargaMisterius',
      category: categoryName,
      reason: simReason,
      status: 'OPEN',
      createdAt: new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      messagesCount: 1
    };

    updateTickets([freshTicket, ...tickets]);
  };

  const handleToggleTicketStatus = (id: string) => {
    const updated = tickets.map(t => {
      if (t.id === id) {
        const nextStatus: TicketRecord['status'] = t.status === 'OPEN' ? 'CLOSED' : 'OPEN';
        return { ...t, status: nextStatus };
      }
      return t;
    });
    updateTickets(updated);
  };

  const handleDeleteTicket = (id: string) => {
    const updated = tickets.filter(t => t.id !== id);
    updateTickets(updated);
  };

  return (
    <div className="flex-1 p-6 md:p-8 space-y-6 text-gray-100 overflow-y-auto" id="ticket-manager-panel">
      {/* Banner */}
      <div className="border-b border-[#2d4026] pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            🎟️ Tiket Layanan & Kemitraan (Support Ticket Setup)
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Konfigurasikan sistem loket bantuan dan pengajuan kemitraan otomatis. Dukung transaksi member, pelaporan, dan kerja sama server dalam satu klik.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-semibold font-mono uppercase">Status Loket:</span>
          <button
            onClick={() => {
              setEnabled(!enabled);
              updateTicketConfig({
                ticketEnabled: !enabled,
                ticketChannelId: channelId,
                ticketStaffRoleId: staffRoleId,
                ticketCategories: categories
              });
            }}
            className="focus:outline-none"
          >
            {enabled ? (
              <span className="bg-[#9fe870]/10 border border-[#9fe870]/30 text-[#9fe870] font-bold text-xs uppercase px-3 py-1 rounded-full flex items-center gap-1">
                ● Layanan Aktif
              </span>
            ) : (
              <span className="bg-red-950/20 border border-red-800/40 text-red-400 font-bold text-xs uppercase px-3 py-1 rounded-full flex items-center gap-1">
                ○ Layanan Tutup
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: General settings & New Category creation (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          
          {/* Channel Integration config */}
          <div className="bg-[#141b11] border border-[#2d4026] p-6 rounded-2xl space-y-4 shadow-xl font-sans">
            <span className="text-[10px] font-mono text-[#9fe870] font-bold block uppercase tracking-wider">INTEGRASI SALURAN</span>
            <h3 className="font-bold text-white text-base">Saluran Loket & Peran Staff</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs md:text-sm">
              <div className="space-y-1">
                <label className="text-xs text-gray-450 font-semibold uppercase">Channel Pemicu Tiket</label>
                <input
                  type="text"
                  value={channelId}
                  onChange={(e) => setChannelId(e.target.value)}
                  placeholder="ID Channel Telegram / Discord"
                  className="w-full bg-black/40 border border-[#2d4026] px-3.5 py-2 rounded text-zinc-100 placeholder-zinc-700 font-mono text-xs focus:border-[#9fe870] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-450 font-semibold uppercase">Peran Staff Penanggung Jawab (Role ID)</label>
                <input
                  type="text"
                  value={staffRoleId}
                  onChange={(e) => setStaffRoleId(e.target.value)}
                  placeholder="ID Peran Moderator / Admin"
                  className="w-full bg-black/40 border border-[#2d4026] px-3.5 py-2 rounded text-zinc-100 placeholder-zinc-700 font-mono text-xs focus:border-[#9fe870] outline-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleUpdateConfig}
                className="px-4 py-2 bg-[#9fe870] text-black font-extrabold rounded-lg hover:bg-green-400 active:scale-95 transition-all text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow"
              >
                <Save size={13} />
                <span>Simpan Setelan Integrasi</span>
              </button>
            </div>
          </div>

          {/* Categories Creator */}
          <div className="bg-[#1c231a] border border-[#2d4026]/80 p-6 rounded-2xl space-y-4 shadow-xl font-sans">
            <span className="text-[10px] font-mono text-yellow-400 font-bold block uppercase tracking-wider">PRESET LAYANAN</span>
            <h3 className="font-bold text-white text-base">Buat Kategori Tiket Pilihan</h3>

            <form onSubmit={handleAddCategory} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs md:text-sm">
              <div className="space-y-1">
                <label className="text-xs text-gray-300 font-semibold uppercase">Nama Kategori</label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => {
                    setCatName(e.target.value);
                    if (!catValue) {
                      setCatValue(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''));
                    }
                  }}
                  placeholder="Kemitraan (Partnership)"
                  className="w-full bg-black/40 border border-[#2d4026] px-3 py-2 rounded text-zinc-100 placeholder-zinc-600 focus:border-[#9fe870] outline-none text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-300 font-semibold uppercase">Value Code (Kekunci)</label>
                <input
                  type="text"
                  required
                  value={catValue}
                  onChange={(e) => setCatValue(e.target.value)}
                  placeholder="partnership"
                  className="w-full bg-black/40 border border-[#2d4026] px-3 py-2 rounded text-zinc-100 placeholder-zinc-600 font-mono focus:border-[#9fe870] outline-none text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-300 font-semibold uppercase">Pilih Lambang (Emoji)</label>
                <div className="flex gap-1.5 flex-wrap pt-0.5">
                  {emojiOptions.map(em => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setCatEmoji(em)}
                      className={`w-7 h-7 rounded border flex items-center justify-center text-xs cursor-pointer select-none transition-all ${
                        catEmoji === em ? 'border-[#9fe870] bg-[#9fe870]/10 scale-110 font-bold' : 'border-zinc-805 bg-black/20 hover:border-zinc-500'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs text-gray-300 font-semibold uppercase">Deskripsi / Penjelasan Singkat</label>
                <input
                  type="text"
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  placeholder="Gunakan kategori ini jika ingin mendiskusikan penawaran kemitraan dengan admin."
                  className="w-full bg-black/40 border border-[#2d4026] px-3 py-2 rounded text-zinc-100 placeholder-zinc-600 focus:border-[#9fe870] outline-none text-xs"
                />
              </div>

              <div className="sm:col-span-2 pt-2">
                <button
                  type="submit"
                  className="w-full py-2 bg-gradient-to-r from-teal-700 to-indigo-700 text-white hover:from-teal-650 hover:to-indigo-650 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 shadow-md"
                >
                  <Plus size={14} />
                  <span>Tambahkan Kategori Menu Tiket</span>
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Right: Simulated Event Simulator (5 cols) */}
        <div className="lg:col-span-5 bg-[#141b11] border border-[#2d4026] p-6 rounded-2xl flex flex-col justify-between space-y-4 shadow-xl font-sans">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-yellow-400 font-bold block uppercase tracking-wider">SIMULATION DRIVER</span>
            <h3 className="font-bold text-white text-base">Uji Kirim Tiket Baru</h3>
            <p className="text-xs text-gray-400">Mensimulasi pengiriman support ticket kustom dari pengguna Discord.</p>
          </div>

          <div className="space-y-3 text-xs md:text-sm pt-2">
            <div className="space-y-1">
              <label className="text-xs text-gray-300 font-semibold uppercase">Nama Anggota Pengirim</label>
              <input
                type="text"
                value={simUser}
                onChange={(e) => setSimUser(e.target.value)}
                placeholder="Vallens#1204"
                className="w-full bg-black/40 border border-[#2d4026] px-3 py-2 rounded text-zinc-100 focus:border-[#9fe870] outline-none text-xs font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-300 font-semibold uppercase">Kategori Layanan</label>
              <select
                value={simCategory}
                onChange={(e) => setSimCategory(e.target.value)}
                className="w-full bg-black/40 border border-[#2d4026] px-2 py-2 rounded text-zinc-100 text-xs focus:border-[#9fe870] outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.value}>
                    {c.emoji} {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-300 font-semibold uppercase">Deskripsi / Alasan Tiket</label>
              <textarea
                value={simReason}
                onChange={(e) => setSimReason(e.target.value)}
                rows={3}
                placeholder="Deskripsi..."
                className="w-full bg-black/40 border border-[#2d4026] p-3 rounded text-zinc-100 text-xs focus:border-[#9fe870] outline-none resize-none"
              />
            </div>

            <button
              onClick={handleSimulateTicket}
              className="w-full py-2.5 bg-indigo-700 text-white font-bold hover:bg-indigo-600 rounded-lg text-xs uppercase tracking-wider active:scale-[0.99] transition-all cursor-pointer shadow-lg"
            >
              📥 Simulasi Pengajuan Tiket
            </button>
          </div>
        </div>
      </div>

      {/* Categories table */}
      <div className="bg-[#141b11] border border-[#2d4026] rounded-2xl overflow-hidden shadow-xl font-sans">
        <div className="p-4 bg-black/20 border-b border-[#2d4026] flex items-center justify-between">
          <h4 className="font-bold text-white text-sm">Opsi Pilihan Jenis Penawaran / Partnership Terpasang ({categories.length})</h4>
          <span className="text-[10px] text-yellow-500 font-mono">Dukungan Transaksi & Kolaborasi</span>
        </div>
        <div className="overflow-x-auto">
          {categories.length === 0 ? (
            <p className="text-xs text-zinc-500 italic p-6 text-center">Belum ada pilihan kategori tiket terdaftar. Gunakan formulir di atas untuk mendaftarkannya.</p>
          ) : (
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-black/40 text-gray-400 border-b border-zinc-800 font-medium">
                  <th className="p-4">Emoji</th>
                  <th className="p-4">Nama Pilihan</th>
                  <th className="p-4">Value Code</th>
                  <th className="p-4">Deskripsi / Penjelasan</th>
                  <th className="p-4 text-right">Opsi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/40">
                {categories.map((c) => (
                  <tr key={c.id} className="hover:bg-zinc-850/10 transition-colors">
                    <td className="p-4 font-bold text-lg select-none">{c.emoji}</td>
                    <td className="p-4 font-bold text-white">{c.name}</td>
                    <td className="p-4 font-mono text-zinc-400 select-all">{c.value}</td>
                    <td className="p-4 text-zinc-300 max-w-[250px] truncate">{c.description || <span className="text-zinc-650 font-mono text-xs italic">tidak ada</span>}</td>
                    <td className="p-4 text-right">
                      {['partnership', 'laporan', 'bantuan', 'donasi'].includes(c.value) ? (
                        <span className="text-[10px] text-zinc-500 font-mono bg-zinc-850 px-2 py-1 rounded select-none">Bawaan</span>
                      ) : (
                        <button
                          onClick={() => handleDeleteCategory(c.id)}
                          className="p-1 hover:bg-red-950/45 text-red-400 hover:text-red-300 rounded cursor-pointer transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Ticket Logs / Active Tickets Directory */}
      <div className="bg-[#141b11] border border-[#2d4026] rounded-2xl overflow-hidden shadow-xl font-sans" id="tickets-logs-section">
        <div className="p-4 bg-black/20 border-b border-[#2d4026] flex items-center justify-between">
          <h4 className="font-bold text-white text-sm">Arsip Transkrip & Tiket Aktif ({tickets.length})</h4>
          <span className="text-[10px] text-zinc-500 font-mono">Daftar keluhan & kemitraan terkirim</span>
        </div>

        <div className="p-4">
          {tickets.length === 0 ? (
            <div className="text-center p-8 space-y-2">
              <LifeBuoy className="text-zinc-600 mx-auto" size={32} />
              <p className="text-xs text-zinc-500 italic">Belum ada transkrip tiket masuk di simulator. Gunakan widget "Simulasi Pengajuan" untuk mengetes respon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tickets.map((t) => (
                <div
                  key={t.id}
                  className={`border rounded-xl p-4 flex flex-col justify-between space-y-4 shadow ${
                    t.status === 'OPEN'
                      ? 'bg-[#182315] border-[#2d4026]'
                      : 'bg-zinc-900/40 border-zinc-900 text-zinc-400'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-yellow-400">
                        {t.id}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-zinc-400">
                          {t.createdAt}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wide ${
                          t.status === 'OPEN' ? 'bg-green-950 text-green-300' : 'bg-zinc-800 text-zinc-500'
                        }`}>
                          {t.status}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h5 className="font-bold text-white text-sm">
                        {t.category}
                      </h5>
                      <p className="text-xs text-zinc-300 leading-relaxed font-sans block pr-1 max-h-16 overflow-y-auto">
                        {t.reason}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-sans">
                    <div>
                      <span className="text-[10px] text-zinc-500 block">DITUGASKAN OLEH</span>
                      <span className="font-mono text-white text-[11px] font-semibold">{t.username}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleTicketStatus(t.id)}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                          t.status === 'OPEN' ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-green-900/30 text-green-400 hover:bg-green-900/50'
                        }`}
                      >
                        {t.status === 'OPEN' ? 'Tutup Tiket' : 'Buka Kembali'}
                      </button>

                      <button
                        onClick={() => handleDeleteTicket(t.id)}
                        className="p-1 hover:bg-red-950/45 text-red-405 hover:text-red-300 rounded cursor-pointer transition-colors"
                        title="Hapus Arsip"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
