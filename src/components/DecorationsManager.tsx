import React, { useState } from 'react';
import { NicknameDecoration } from '../types';
import { Tag, Plus, Trash2, Check, ShieldAlert, Sparkles, User, BadgeAlert, ToggleLeft, ToggleRight } from 'lucide-react';

interface DecorationsManagerProps {
  decorations: NicknameDecoration[];
  saveDecorations: (decs: NicknameDecoration[]) => void;
}

export default function DecorationsManager({ decorations, saveDecorations }: DecorationsManagerProps) {
  const [nameInput, setNameInput] = useState('');
  const [prefixInput, setPrefixInput] = useState('[⚔️ ELITE] ');
  const [suffixInput, setSuffixInput] = useState(' [⚔️]');
  const [labelInput, setLabelInput] = useState('Elite Gangster');
  const [rarityInput, setRarityInput] = useState<NicknameDecoration['rarityNeeded']>('Any');
  
  // Local simulator name state
  const [simName, setSimName] = useState('kicau');
  const [selectedSimDec, setSelectedSimDec] = useState<string>(decorations[0]?.id || '');

  const handleAddDecoration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!labelInput.trim()) return;

    const newDec: NicknameDecoration = {
      id: 'dec_' + Math.random().toString(36).substring(2, 9),
      name: labelInput,
      prefix: prefixInput,
      suffix: suffixInput,
      rarityNeeded: rarityInput,
      active: true
    };

    const updated = [...decorations, newDec];
    saveDecorations(updated);

    // Reset fields
    setLabelInput('');
    setPrefixInput('');
    setSuffixInput('');
    setRarityInput('Any');
  };

  const handleDeleteDecoration = (id: string) => {
    const updated = decorations.filter(d => d.id !== id);
    saveDecorations(updated);
    if (selectedSimDec === id) {
      setSelectedSimDec(updated[0]?.id || '');
    }
  };

  const handleToggleActive = (id: string) => {
    const updated = decorations.map(d => {
      if (d.id === id) {
        return { ...d, active: !d.active };
      }
      return d;
    });
    saveDecorations(updated);
  };

  const getSimulatedName = () => {
    const activeDec = decorations.find(d => d.id === selectedSimDec);
    if (!activeDec || !activeDec.active) return simName;
    return `${activeDec.prefix}${simName}${activeDec.suffix}`;
  };

  return (
    <div className="flex-1 p-6 md:p-8 space-y-6 text-gray-100 overflow-y-auto" id="decorations-manager-panel">
      {/* Banner */}
      <div className="border-b border-[#2d4026] pb-5">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          🏷️ Hiasan Nickname Custom (Auto-Nickname Decorator)
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Hadirkan aura premium untuk warga berprestasi atau sultan donatur! Desain prefix dan suffix nama kustom bergaya RPG yang otomatis sinkron dengan nama warga di Discord.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Nickname Simulator (5 cols) */}
        <div className="lg:col-span-5 bg-[#141b11] border border-[#2d4026] p-6 rounded-2xl flex flex-col justify-between space-y-5 shadow-xl">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-[#9fe870] font-bold block uppercase tracking-wider">LIVE NICKNAME PREVIEW</span>
            <h3 className="font-bold text-white text-base">Uji Simulator Nama Warga</h3>
            <p className="text-xs text-gray-450">Tulis nama kawan Anda dan lihat hiasan premiumnya langsung!</p>
          </div>

          <div className="space-y-4 font-sans text-sm">
            <div className="space-y-1.5">
              <label className="text-xs text-gray-300 font-semibold uppercase">Nama Anggota (Polos)</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 text-zinc-500" size={16} />
                <input
                  type="text"
                  value={simName}
                  onChange={(e) => setSimName(e.target.value)}
                  placeholder="Ketik nama (contoh: kicau)"
                  className="w-full bg-black/40 border border-[#2d4026] pl-9 pr-4 py-2 rounded text-zinc-100 text-xs focus:border-[#9fe870] outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-gray-300 font-semibold uppercase">Pilih Hiasan Aktif</label>
              <select
                value={selectedSimDec}
                onChange={(e) => setSelectedSimDec(e.target.value)}
                className="w-full bg-black/40 border border-[#2d4026] px-2.5 py-2 rounded text-zinc-100 text-xs focus:border-[#9fe870] outline-none"
              >
                <option value="">-- Tanpa Hiasan --</option>
                {decorations.map((dec) => (
                  <option key={dec.id} value={dec.id}>
                    {dec.name} {!dec.active ? '(Nonaktif)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Display Simulator */}
            <div className="bg-[#121611] rounded-xl border border-[#2d4026]/60 p-5 mt-4 space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Sparkles size={60} className="text-[#9fe870]" />
              </div>
              <span className="text-[9px] font-mono text-zinc-500 uppercase block tracking-widest">Tampilan Akhir di Discord Server:</span>
              
              {/* Fake discord message */}
              <div className="flex items-center space-x-3 bg-[#1c231a] p-3 rounded-lg border border-white/5 shadow-inner">
                <div className="w-9 h-9 rounded-full bg-indigo-700 font-bold flex items-center justify-center text-xs text-white uppercase shrink-0">
                  {simName.substring(0, 2)}
                </div>
                <div>
                  <span className="font-bold text-white text-sm hover:underline cursor-pointer block truncate max-w-[200px]">
                    {getSimulatedName()}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-semibold block">Kemarin pukul 18.00</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-[11px] text-zinc-500 italic leading-relaxed">
            💡 Prefiks/Sufiks ini secara cerdas merekayasa nama panggilan discord (Server Nickname) member saat mereka mendaftar KTP atau memenangkan Gacha spesifik!
          </div>
        </div>

        {/* Right: Creator Template Form (7 cols) */}
        <div className="lg:col-span-7 bg-[#1c231a] border border-[#2d4026]/80 p-6 rounded-2xl flex flex-col justify-between shadow-xl">
          <div className="space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Tag size={18} className="text-[#9fe870]" />
              Formulir Hiasan Custom Baru
            </h3>

            <form onSubmit={handleAddDecoration} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-sans">
              
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs text-gray-300 font-medium uppercase">Label Hiasan (Kegunaan)</label>
                <input
                  type="text"
                  required
                  value={labelInput}
                  onChange={(e) => setLabelInput(e.target.value)}
                  placeholder="Contoh: Sultan Donatur, Warga Sepuh, Admin Divine"
                  className="w-full bg-black/40 border border-[#2d4026] px-3.5 py-2 rounded text-zinc-100 focus:border-[#9fe870] outline-none text-xs md:text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-300 font-semibold uppercase">Text Awalan (Prefix)</label>
                <input
                  type="text"
                  value={prefixInput}
                  onChange={(e) => setPrefixInput(e.target.value)}
                  placeholder="Contoh: [👑 SULTAN] "
                  className="w-full bg-black/40 border border-[#2d4026] px-3.5 py-2 rounded text-zinc-100 focus:border-[#9fe870] outline-none text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-300 font-semibold uppercase">Text Akhiran (Suffix)</label>
                <input
                  type="text"
                  value={suffixInput}
                  onChange={(e) => setSuffixInput(e.target.value)}
                  placeholder="Contoh:  [👑]"
                  className="w-full bg-black/40 border border-[#2d4026] px-3.5 py-2 rounded text-zinc-100 focus:border-[#9fe870] outline-none text-xs font-mono"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs text-gray-300 font-semibold uppercase">Syarat Rarity Gacha (Opsional)</label>
                <select
                  value={rarityInput}
                  onChange={(e) => setRarityInput(e.target.value as NicknameDecoration['rarityNeeded'])}
                  className="w-full bg-black/40 border border-[#2d4026] px-3 py-2 rounded text-zinc-100 text-xs focus:border-[#9fe870] outline-none"
                >
                  <option value="Any">Bebas / Siapa Saja Bisa Pakai</option>
                  <option value="Common">Hanya Rarity Common</option>
                  <option value="Rare">Hanya Rarity Rare</option>
                  <option value="Epic">Hanya Rarity Epic</option>
                  <option value="Legendary">Hanya Rarity Legendary</option>
                  <option value="Divine">Hanya Rarity Divine (Dewa Sangat Langka)</option>
                </select>
                <span className="text-[10px] text-zinc-500 font-mono block">Jika diisi, hiasan nama ini hanya ditugaskan jika warga memenangkan rarity tersebut.</span>
              </div>

              <div className="sm:col-span-2 pt-2">
                <button
                  type="submit"
                  className="w-full py-2 bg-gradient-to-r from-emerald-700 to-green-700 text-white hover:from-emerald-600 hover:to-green-650 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 shadow-md"
                >
                  <Plus size={14} />
                  <span>Daftarkan Format Hiasan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Decorations List Table */}
      <div className="bg-[#141b11] border border-[#2d4026] rounded-2xl overflow-hidden shadow-xl font-sans" id="decorations-table">
        <div className="p-4 bg-black/20 border-b border-[#2d4026] flex items-center justify-between">
          <h4 className="font-bold text-white text-sm">Daftar Setelan Hiasan Nickname Terdaftar ({decorations.length})</h4>
          <span className="text-[10px] text-[#9fe870] font-mono">Status Sinkronisasi: AKTIF REAL-TIME</span>
        </div>

        <div className="overflow-x-auto">
          {decorations.length === 0 ? (
            <p className="text-xs text-zinc-500 italic p-6 text-center">Belum ada hiasan terdaftar. Daftarkan di atas!</p>
          ) : (
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-black/40 text-gray-400 border-b border-zinc-800 font-medium">
                  <th className="p-4">Nama Hiasan</th>
                  <th className="p-4">Prefix</th>
                  <th className="p-4">Suffix</th>
                  <th className="p-4">Syarat Gacha</th>
                  <th className="p-4 text-center">Aktif</th>
                  <th className="p-4 text-right">Opsi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/40">
                {decorations.map((dec) => (
                  <tr key={dec.id} id={`dec-row-${dec.id}`} className="hover:bg-zinc-850/10 transition-colors">
                    <td className="p-4">
                      <span className="font-semibold text-white">{dec.name}</span>
                    </td>
                    <td className="p-4 font-mono text-zinc-300">{dec.prefix || <span className="text-zinc-600">kosong</span>}</td>
                    <td className="p-4 font-mono text-zinc-300">{dec.suffix || <span className="text-zinc-600">kosong</span>}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        dec.rarityNeeded === 'Any' || !dec.rarityNeeded ? 'bg-zinc-800 text-zinc-400' : 'bg-purple-950 text-purple-300 font-semibold'
                      }`}>
                        {dec.rarityNeeded || 'Bebas'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleToggleActive(dec.id)}
                        className="focus:outline-none inline-flex items-center"
                      >
                        {dec.active ? (
                          <ToggleRight className="text-[#9fe870]" size={25} />
                        ) : (
                          <ToggleLeft className="text-zinc-600" size={25} />
                        )}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteDecoration(dec.id)}
                        className="p-1 hover:bg-red-950/45 text-red-400 hover:text-red-300 rounded cursor-pointer transition-colors"
                        title="Hapus Hiasan"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
