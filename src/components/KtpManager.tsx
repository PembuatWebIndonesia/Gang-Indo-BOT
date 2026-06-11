import React, { useState, useEffect } from 'react';
import { KtpRecord } from '../types';
import KtpCard from './KtpCard';
import { Search, Plus, Trash2, Download, Eye, MapPin, Sparkles, Check, FileDown, PlusCircle, ShieldAlert, UserX, Ban, RotateCcw } from 'lucide-react';

interface KtpManagerProps {
  citizens: KtpRecord[];
  addCitizen: (rec: KtpRecord) => void;
  deleteCitizen: (id: string) => void;
}

interface BlacklistRecord {
  id: string;
  username: string;
  fullname: string;
  warnings: number;
  reason: string;
  dateAdded: string;
}

export default function KtpManager({ citizens, addCitizen, deleteCitizen }: KtpManagerProps) {
  const [activeSubTab, setActiveSubTab] = useState<'active' | 'blacklist'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCitizen, setSelectedCitizen] = useState<KtpRecord | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Blacklist state
  const [blacklist, setBlacklist] = useState<BlacklistRecord[]>(() => {
    const cached = localStorage.getItem('blacklist_db');
    return cached ? JSON.parse(cached) : [
      { id: 'bl_1', username: 'kyle_toxic', fullname: 'Kyle Pembuat Onar', warnings: 2, reason: 'Melakukan spamming server referral link judi di chat umum.', dateAdded: '10 - 06 - 2026' },
      { id: 'bl_2', username: 'bowo_cheater', fullname: 'Bowo Cheater ML', warnings: 3, reason: 'Menggunakan cheat map hack saat sparring antar wilayah Gang Indo.', dateAdded: '11 - 06 - 2026' }
    ];
  });

  // Blacklist Form States
  const [blUsernameInput, setBlUsernameInput] = useState('');
  const [blFullnameInput, setBlFullnameInput] = useState('');
  const [blReasonInput, setBlReasonInput] = useState('Mengganggu ketertiban umum');
  const [blWarningsInput, setBlWarningsInput] = useState(1);

  // Citizens Form States
  const [form, setForm] = useState({
    fullname: '',
    gender: 'Laki-laki' as 'Laki-laki' | 'Perempuan',
    address: 'Bandung',
    religion: 'Islam',
    hobby: 'Gaming',
    username: 'warga_gang',
  });

  useEffect(() => {
    localStorage.setItem('blacklist_db', JSON.stringify(blacklist));
  }, [blacklist]);

  const filtered = citizens.filter(citizen => {
    const q = searchQuery.toLowerCase();
    return (
      citizen.fullname.toLowerCase().includes(q) ||
      citizen.id.includes(q) ||
      citizen.address.toLowerCase().includes(q) ||
      citizen.username.toLowerCase().includes(q)
    );
  });

  const handleManualCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedId = '670402' + Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const today = new Date();
    const formattedDate = today.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, ' - ');

    const newRec: KtpRecord = {
      id: generatedId,
      userId: '1423' + Math.floor(100000000 + Math.random() * 900000000).toString(),
      username: form.username.toLowerCase().replace(/\s/g, '_'),
      fullname: form.fullname,
      gender: form.gender,
      address: form.address,
      religion: form.religion,
      hobby: form.hobby,
      avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${form.fullname}`,
      createdAt: formattedDate,
    };

    addCitizen(newRec);
    setShowCreateForm(false);
    // Reset Form
    setForm({
      fullname: '',
      gender: 'Laki-laki',
      address: 'Bandung',
      religion: 'Islam',
      hobby: 'Gaming',
      username: 'warga_gang',
    });
  };

  const handleAddBlacklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blUsernameInput.trim() || !blFullnameInput.trim()) return;

    const newBl: BlacklistRecord = {
      id: 'bl_' + Math.random().toString(36).substring(2, 9),
      username: blUsernameInput.trim().toLowerCase().replace(/\s/g, '_'),
      fullname: blFullnameInput.trim(),
      warnings: blWarningsInput,
      reason: blReasonInput.trim(),
      dateAdded: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, ' - ')
    };

    setBlacklist([newBl, ...blacklist]);
    setBlUsernameInput('');
    setBlFullnameInput('');
    setBlReasonInput('Mengganggu ketertiban umum');
    setBlWarningsInput(1);
  };

  const handleIncrementWarning = (id: string) => {
    setBlacklist(prev => prev.map(item => {
      if (item.id === id) {
        const nextW = Math.min(3, item.warnings + 1);
        return { ...item, warnings: nextW };
      }
      return item;
    }));
  };

  const handlePemberianAmpunan = (id: string) => {
    // Decrement warning or delete if 0
    setBlacklist(prev => {
      const target = prev.find(item => item.id === id);
      if (target && target.warnings > 1) {
        return prev.map(item => item.id === id ? { ...item, warnings: item.warnings - 1 } : item);
      }
      return prev.filter(item => item.id !== id);
    });
  };

  const handleExportSVG = (record: KtpRecord) => {
    const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 312" width="500" height="312">
      <defs>
        <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#2a4521" />
          <stop offset="50%" stop-color="#1d2f17" />
          <stop offset="100%" stop-color="#121c0e" />
        </linearGradient>
      </defs>
      <rect width="496" height="308" x="2" y="2" rx="12" fill="url(#cardGrad)" stroke="#d4af37" stroke-width="4" />
      <path d="M 0 0 L 250 312 L 500 312 L 500 0 Z" fill="#d4af37" opacity="0.03" />
      
      <!-- Header -->
      <text x="250" y="32" font-family="'Space Grotesk', Inter, sans-serif" font-weight="950" font-size="14" fill="#e5c158" text-anchor="middle" letter-spacing="3.5">KARTU TANDA PENDUDUK</text>
      <text x="250" y="48" font-family="'Space Grotesk', Inter, sans-serif" font-weight="bold" font-size="10" fill="#86efac" text-anchor="middle" letter-spacing="1.5">GANG DISCORD INDONESIA</text>
      <line x1="20" y1="58" x2="480" y2="58" stroke="#d4af37" opacity="0.4" stroke-width="1.5" />
      
      <!-- Body details -->
      <g fill="#9fe870" font-family="monospace" font-size="11" font-weight="bold">
        <text x="32" y="85">No KTP</text>
        <text x="120" y="85">:</text>
        <text x="132" y="85" fill="#fde047">${record.id}</text>
      </g>

      <g fill="#93c5fd" font-family="sans-serif" font-size="11" font-weight="bold">
        <text x="32" y="112">Nama</text>
        <text x="120" y="112">:</text>
        <text x="132" y="112" fill="#ffffff">${record.fullname}</text>

        <text x="32" y="139">Jenis Kelamin</text>
        <text x="120" y="139">:</text>
        <text x="132" y="139" fill="#ffffff">${record.gender}</text>

        <text x="32" y="166">Domisili</text>
        <text x="120" y="166">:</text>
        <text x="132" y="166" fill="#ffffff">${record.address}</text>

        <text x="32" y="193">Agama</text>
        <text x="120" y="193">:</text>
        <text x="132" y="193" fill="#ffffff">${record.religion}</text>

        <text x="32" y="220">Hobi</text>
        <text x="120" y="220">:</text>
        <text x="132" y="220" fill="#ffffff">${record.hobby}</text>
      </g>

      <!-- Avatar Photo -->
      <rect x="360" y="75" width="100" height="120" rx="3" fill="#152311" stroke="#d4af37" stroke-width="2" />
      <circle cx="410" cy="135" r="30" fill="#9fe870" opacity="0.1" />
      <text x="410" y="140" font-family="sans-serif" font-size="15" fill="#9fe870" text-anchor="middle">@</text>

      <line x1="20" y1="270" x2="480" y2="270" stroke="#d4af37" opacity="0.25" stroke-width="1" />
      <text x="32" y="288" font-family="sans-serif" font-size="10" font-style="italic" fill="#a1a1aa">@${record.username}</text>
      <text x="468" y="288" font-family="monospace" font-size="10" font-weight="bold" fill="#f59e0b" text-anchor="end">Tanggal Pembuatan: ${record.createdAt}</text>
    </svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KTP_${record.fullname.replace(/\s+/g, '_')}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 p-6 md:p-8 space-y-6 text-gray-100 overflow-y-auto" id="ktp-manager-panel">
      
      {/* Top Banner & Switch Panel tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2d4026] pb-5">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            📇 Pencatatan Sipil & Penertiban Server
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Klaim KTP Virtual resmi warga, unduh vektor, atau kelola sanksi warga nakal di database blacklist server terpadu.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            onClick={() => setActiveSubTab('active')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
              activeSubTab === 'active'
                ? 'bg-[#9fe870] text-black'
                : 'bg-black/30 border border-[#2d4026] text-gray-300 hover:text-white'
            }`}
          >
            Arsip KTP Aktif ({citizens.length})
          </button>

          <button
            onClick={() => setActiveSubTab('blacklist')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-1 ${
              activeSubTab === 'blacklist'
                ? 'bg-red-600 text-white shadow-lg'
                : 'bg-black/30 border border-[#2d4026] text-red-400 hover:text-red-300'
            }`}
          >
            <ShieldAlert size={13} />
            <span>Blacklist Sanksi ({blacklist.length})</span>
          </button>

          <button
            id="btn-create-ktp-panel"
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-gradient-to-r from-green-700 to-emerald-700 hover:bg-green-600 text-white font-bold rounded-lg cursor-pointer text-xs uppercase tracking-wider"
          >
            <Plus size={13} />
            <span>Manual KTP</span>
          </button>
        </div>
      </div>

      {/* SUB TAB A: ACTIVE CITIZENS */}
      {activeSubTab === 'active' && (
        <div className="space-y-6" id="ktp-subtab-active">
          {/* Database Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="ktp-quick-stats">
            <div className="bg-[#141b11] border border-[#2d4026]/85 rounded-xl p-4 flex items-center space-x-4">
              <div className="p-3 bg-[#9fe870]/10 text-[#9fe870] rounded-lg border border-[#9fe870]/20">
                <Check size={22} id="stat-active" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-mono block uppercase">Total Warga Resmi</span>
                <span className="text-xl font-bold text-white font-mono">{citizens.length} Pembuat</span>
              </div>
            </div>
            <div className="bg-[#141b11] border border-[#2d4026]/85 rounded-xl p-4 flex items-center space-x-4">
              <div className="p-3 bg-blue-900/10 text-blue-400 rounded-lg border border-blue-900/20">
                <MapPin size={22} id="stat-region" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-mono block uppercase">Domisili Terdaftar</span>
                <span className="text-xl font-bold text-white font-mono">
                  {Array.from(new Set(citizens.map(c => c.address))).length} Hub Wilayah
                </span>
              </div>
            </div>
            <div className="bg-[#141b11] border border-[#2d4026]/85 rounded-xl p-4 flex items-center space-x-4">
              <div className="p-3 bg-yellow-900/10 text-yellow-400 rounded-lg border border-yellow-900/20">
                <Sparkles size={22} id="stat-percentage" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-mono block uppercase">Status Integritas Bot</span>
                <span className="text-xl font-bold text-[#9fe870] font-mono">Arsip Stabil</span>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex items-center bg-[#1b2019] border border-[#2d4026] rounded-xl px-4 py-3 group">
            <Search className="text-gray-400 group-focus-within:text-[#9fe870] mr-3" size={18} />
            <input
              type="text"
              id="search-citizen-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari warga berdasarkan Nama Lengkap, Nomor KTP, Domisili, atau Username..."
              className="bg-transparent flex-1 outline-none text-zinc-100 text-xs md:text-sm font-sans placeholder-gray-600"
            />
          </div>

          {/* Citizens Grid */}
          {filtered.length === 0 ? (
            <div className="bg-black/25 rounded-2xl border border-dashed border-zinc-700/60 p-12 text-center text-zinc-500 font-sans" id="empty-citizens-alert">
              <Eye size={36} className="mx-auto text-zinc-650 mb-3" />
              <p className="font-semibold text-zinc-400">Belum Ada Warga Terdaftar</p>
              <p className="text-xs text-zinc-500 mt-1">Gunakan tombol 'Simulasi KTP' di Playground atau 'Manual KTP' di pojok kanan atas!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="citizens-archive-grid">
              {filtered.map((citizen) => (
                <div
                  key={citizen.id}
                  id={`citizen-box-${citizen.id}`}
                  className="bg-[#141b11] border border-[#2d4026] hover:border-[#9fe870]/40 rounded-2xl p-4 flex flex-col justify-between transition-all group shadow-lg hover:-translate-y-0.5"
                >
                  <div className="flex gap-4">
                    <img
                      src={citizen.avatarUrl}
                      alt=""
                      className="w-16 h-16 rounded-xl bg-black/40 border border-zinc-700 shrink-0 object-cover"
                    />
                    <div className="overflow-hidden space-y-1">
                      <h4 className="font-bold text-white text-base truncate">{citizen.fullname}</h4>
                      <p className="text-xs text-[#9fe870] font-mono tracking-wider font-semibold">{citizen.id}</p>
                      <p className="text-xs text-zinc-400 truncate font-medium">🇮🇩 Domisili: {citizen.address} | Hobi: {citizen.hobby}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end border-t border-zinc-800/60 mt-4 pt-3 gap-2">
                    <button
                      id={`view-ktp-zoom-${citizen.id}`}
                      onClick={() => setSelectedCitizen(citizen)}
                      className="p-2 hover:bg-[#2d4026] text-blue-400 hover:text-white rounded-lg transition-all cursor-pointer"
                      title="Lihat KTP"
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      id={`export-ktp-btn-${citizen.id}`}
                      onClick={() => handleExportSVG(citizen)}
                      className="p-2 hover:bg-[#2d4026] text-green-400 hover:text-white rounded-lg transition-all cursor-pointer"
                      title="Unduh Vector SVG"
                    >
                      <Download size={15} />
                    </button>
                    <button
                      id={`delete-citizen-btn-${citizen.id}`}
                      onClick={() => deleteCitizen(citizen.id)}
                      className="p-2 hover:bg-red-950/40 text-red-500 hover:text-red-300 rounded-lg transition-all cursor-pointer"
                      title="Hapus Warga"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB TAB B: BLACKLISTED USERS */}
      {activeSubTab === 'blacklist' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="ktp-subtab-blacklist">
          
          {/* Blacklist Entry Form (4 Columns) */}
          <div className="lg:col-span-4 bg-[#141b11] border border-[#2d4026] p-6 rounded-2xl space-y-4 shadow-xl">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-red-400 font-bold block uppercase tracking-wider">TIDAK TERTIB</span>
              <h3 className="font-bold text-white text-base">Registrasi Kasus Warga</h3>
              <p className="text-xs text-gray-400">Laporkan pelanggaran aturan chat general server.</p>
            </div>

            <form onSubmit={handleAddBlacklist} className="space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <label className="text-xs text-gray-300 font-semibold uppercase">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={blFullnameInput}
                  onChange={(e) => setBlFullnameInput(e.target.value)}
                  placeholder="Contoh: Deni Begal Rusuh"
                  className="w-full bg-black/40 border border-[#2d4026] px-3.5 py-2.5 rounded text-zinc-100 placeholder-zinc-700 outline-none text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-300 font-semibold uppercase">Discord Username</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-zinc-650 font-bold">@</span>
                  <input
                    type="text"
                    required
                    value={blUsernameInput}
                    onChange={(e) => setBlUsernameInput(e.target.value)}
                    placeholder="deni_rusak"
                    className="w-full bg-black/40 border border-[#2d4026] pl-7 pr-3.5 py-2.5 rounded text-zinc-100 placeholder-zinc-700 outline-none text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-350 font-bold uppercase tracking-wider">Pelanggaran Yang Dilakukan</label>
                <textarea
                  rows={3}
                  required
                  value={blReasonInput}
                  onChange={(e) => setBlReasonInput(e.target.value)}
                  placeholder="Sebeutkan alasan pembatasan..."
                  className="w-full bg-black/40 border border-[#2d4026] px-3.5 py-2.5 rounded text-zinc-100 placeholder-zinc-700 outline-none text-xs leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-300 font-semibold uppercase">Jumlah Warning Default</label>
                <select
                  value={blWarningsInput}
                  onChange={(e) => setBlWarningsInput(parseInt(e.target.value))}
                  className="w-full bg-black/40 border border-[#2d4026] p-2 rounded text-zinc-100 text-xs outline-none"
                >
                  <option value={1}>1x Peringatan (Teguran Ringan)</option>
                  <option value={2}>2x Peringatan (Batas Akhir)</option>
                  <option value={3}>3x Peringatan (DEPORTASI / BANNED)</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-red-700 to-amber-700 hover:from-red-650 hover:to-amber-650 text-white font-extrabold rounded-lg text-xs uppercase tracking-wider duration-150 transform hover:scale-102 flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <UserX size={14} />
                  <span>Keluarkan Surat Cekal</span>
                </button>
              </div>
            </form>
          </div>

          {/* Blacklist List Ledger (8 Columns) */}
          <div className="lg:col-span-8 space-y-4">
            <h4 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest">Daftar Cekal & Blacklisted Warga</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {blacklist.length === 0 ? (
                <p className="md:col-span-2 text-zinc-650 text-center py-12 italic text-xs bg-black/20 rounded-xl border border-dashed border-zinc-850">
                  Kampung aman terkendali! Tidak ada warga yang masuk daftar cekal blacklist hari ini.
                </p>
              ) : (
                blacklist.map((item) => {
                  const isBanned = item.warnings >= 3;
                  return (
                    <div 
                      key={item.id} 
                      className={`relative overflow-hidden p-5 rounded-2xl border transition-all ${
                        isBanned 
                          ? 'bg-red-950/15 border-red-800/40 text-red-200' 
                          : 'bg-[#141b11] border-zinc-800 text-gray-300'
                      }`}
                    >
                      {/* Banned rubber stamp */}
                      {isBanned && (
                        <div className="absolute top-2 right-2 transform rotate-12 bg-red-600 text-white font-black px-3 py-1 text-[10px] uppercase tracking-widest rounded border-2 border-red-400 select-none shadow animate-pulse">
                          🚨 BANNED
                        </div>
                      )}

                      <div className="space-y-3 font-sans">
                        <div>
                          <h4 className="font-bold text-white text-base">{item.fullname}</h4>
                          <span className="text-xs text-red-400 font-mono font-bold">@{item.username}</span>
                        </div>

                        <p className="text-xs italic text-zinc-400 line-clamp-2">
                          "{item.reason}"
                        </p>

                        {/* Warnings Gauge */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[10px] font-mono leading-none">
                            <span className="text-zinc-500 uppercase font-semibold">Tingkat Pelanggaran</span>
                            <span className="font-bold text-red-400">{item.warnings} / 3 Warning</span>
                          </div>
                          
                          {/* Meter bar */}
                          <div className="h-2 bg-black/60 rounded-full overflow-hidden flex gap-0.5 p-0.5">
                            <div className="h-full rounded-full transition-all duration-300 flex-1 bg-yellow-500" />
                            <div className={`h-full rounded-full transition-all duration-300 flex-1 ${item.warnings >= 2 ? 'bg-amber-500' : 'bg-transparent'}`} />
                            <div className={`h-full rounded-full transition-all duration-300 flex-1 ${item.warnings >= 3 ? 'bg-red-500' : 'bg-transparent'}`} />
                          </div>
                        </div>

                        {/* Date info & fast actions */}
                        <div className="flex justify-between items-center pt-2.5 border-t border-zinc-800/50 text-[10px] text-zinc-500">
                          <span>Dilaporkan: {item.dateAdded}</span>
                          <div className="flex gap-1">
                            {!isBanned && (
                              <button
                                onClick={() => handleIncrementWarning(item.id)}
                                className="px-2 py-1 bg-red-900/20 hover:bg-red-900/40 text-red-400 font-bold rounded cursor-pointer border border-red-800/20"
                                title="Tambah Peringatan"
                              >
                                +1 Warning
                              </button>
                            )}
                            <button
                              onClick={() => handlePemberianAmpunan(item.id)}
                              className="px-2 py-1 bg-green-950/40 hover:bg-green-900/40 text-green-400 font-bold rounded cursor-pointer border border-green-800/10 flex items-center gap-0.5"
                              title="Kurangi atau Ampuni"
                            >
                              <RotateCcw size={10} />
                              <span>{item.warnings > 1 ? 'Kurangi' : 'Ampuni'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      )}

      {/* Manual Creation Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-[#121c0e] border-[2px] border-[#9fe870] w-full max-w-md rounded-xl p-6 text-white space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#2d4026] pb-3">
              <h3 className="font-bold text-base text-[#9fe870] font-sans flex items-center gap-2">
                <PlusCircle size={18} />
                Mendaftar Warga Manual (Admin)
              </h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-zinc-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleManualCreate} className="space-y-4 font-sans text-sm">
              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-semibold uppercase">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  id="admin-form-fullname"
                  value={form.fullname}
                  onChange={(e) => setForm({ ...form, fullname: e.target.value })}
                  placeholder="Contoh: Bowo Made In China"
                  className="w-full bg-black/40 border border-[#2d4026] px-4 py-2 rounded text-zinc-100 focus:border-[#9fe870] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-semibold uppercase">Jenis Kelamin</label>
                  <select
                    id="admin-form-gender"
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value as 'Laki-laki' | 'Perempuan' })}
                    className="w-full bg-black/40 border border-[#2d4026] px-3 py-2 rounded text-zinc-100 focus:border-[#9fe870] focus:outline-none"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-semibold uppercase">Discord Username</label>
                  <input
                    type="text"
                    required
                    id="admin-form-username"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    placeholder="bowo_321"
                    className="w-full bg-black/40 border border-[#2d4026] px-3 py-2 rounded text-zinc-100 focus:border-[#9fe870] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-semibold uppercase">Domisili Provinsi / Kota</label>
                <input
                  type="text"
                  required
                  id="admin-form-address"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Padang, Sumatera Barat"
                  className="w-full bg-black/40 border border-[#2d4026] px-4 py-2 rounded text-zinc-100 focus:border-[#9fe870] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-semibold uppercase">Agama</label>
                <select
                  id="admin-form-religion"
                  value={form.religion}
                  onChange={(e) => setForm({ ...form, religion: e.target.value })}
                  className="w-full bg-black/40 border border-[#2d4026] px-3 py-2 rounded text-zinc-100 focus:border-[#9fe870] focus:outline-none"
                >
                  <option value="Islam">Islam</option>
                  <option value="Kristen Protestan">Kristen Protestan</option>
                  <option value="Katolik">Katolik</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Buddha">Buddha</option>
                  <option value="Khonghucu">Khonghucu</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-semibold uppercase">Hobi / Minat</label>
                <input
                  type="text"
                  required
                  id="admin-form-hobby"
                  value={form.hobby}
                  onChange={(e) => setForm({ ...form, hobby: e.target.value })}
                  placeholder="MANCING, main game, baca buku"
                  className="w-full bg-black/40 border border-[#2d4026] px-4 py-2 rounded text-zinc-100 focus:border-[#9fe870] focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  id="admin-form-submit"
                  className="w-full py-2.5 bg-[#9fe870] hover:bg-green-400 text-black font-bold rounded-lg transition-all"
                >
                  Cetak KTP & Simpan ke Arsip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Viewer Modal zoom */}
      {selectedCitizen && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="w-full max-w-lg space-y-4 animate-scale-in">
            <KtpCard record={selectedCitizen} />
            <div className="flex justify-center space-x-3">
              <button
                id="close-zoom-btn"
                onClick={() => setSelectedCitizen(null)}
                className="px-6 py-2 bg-zinc-800 text-zinc-100 hover:bg-zinc-700 font-bold rounded-lg cursor-pointer transition-all text-xs uppercase tracking-wider"
              >
                Tutup Review
              </button>
              <button
                id="svg-download-zoom-btn"
                onClick={() => {
                  handleExportSVG(selectedCitizen);
                }}
                className="px-6 py-2 bg-[#9fe870] text-black hover:bg-green-400 font-bold rounded-lg cursor-pointer transition-all text-xs uppercase tracking-wider flex items-center space-x-1"
              >
                <FileDown size={14} />
                <span>Unduh SVG</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
