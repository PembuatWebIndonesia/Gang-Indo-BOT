import React, { useState } from 'react';
import { GachaRole } from '../types';
import { Sparkles, Dice5, Percent, Plus, Trash2, Heart, RotateCcw, Award, CheckCircle, BarChart3 } from 'lucide-react';

interface GachaManagerProps {
  initialRoles: GachaRole[];
  updateRoles: (roles: GachaRole[]) => void;
}

interface RollLog {
  time: string;
  role: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Divine';
  color: string;
}

export default function GachaManager({ initialRoles, updateRoles }: GachaManagerProps) {
  const [roles, setRoles] = useState<GachaRole[]>(initialRoles);
  const [logs, setLogs] = useState<RollLog[]>([]);
  const [isRolling, setIsRolling] = useState(false);
  const [winner, setWinner] = useState<GachaRole | null>(null);

  // New role template states
  const [newRole, setNewRole] = useState({
    roleName: '',
    rarity: 'Common' as GachaRole['rarity'],
    chance: 10,
    color: '#a1a1aa'
  });

  const rarityMeta = {
    Common: { name: 'Sipil / Biasa', color: '#a1a1aa', weight: 60 },
    Rare: { name: 'Kelas Intel / Gangster', color: '#10b981', weight: 30 },
    Epic: { name: 'Lurah / Elite', color: '#3b82f6', weight: 8 },
    Legendary: { name: 'Bandar Judi / Sultan', color: '#a855f7', weight: 1.9 },
    Divine: { name: 'Dewa Langit / Admin', color: '#eab308', weight: 0.1 }
  };

  const handleAddRoleConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRole.roleName.trim()) return;

    const fresh: GachaRole = {
      id: 'role_' + Math.random().toString(36).substring(2, 9),
      roleName: newRole.roleName,
      rarity: newRole.rarity,
      chance: newRole.chance,
      color: rarityMeta[newRole.rarity].color
    };

    const updated = [...roles, fresh];
    setRoles(updated);
    updateRoles(updated);

    // Reset Name input
    setNewRole({ ...newRole, roleName: '' });
  };

  const handleDeleteRole = (id: string) => {
    const updated = roles.filter(r => r.id !== id);
    setRoles(updated);
    updateRoles(updated);
  };

  // Perform a local trial roll
  const handleTrialRoll = () => {
    if (roles.length === 0) return;
    setIsRolling(true);
    setWinner(null);

    // Dynamic slot-machine effect
    setTimeout(() => {
      // Choose based on probability weights
      const totalWeight = roles.reduce((sum, r) => sum + r.chance, 0);
      let rand = Math.random() * totalWeight;
      let selected: GachaRole = roles[0];

      for (const role of roles) {
        if (rand < role.chance) {
          selected = role;
          break;
        }
        rand -= role.chance;
      }

      setWinner(selected);
      setIsRolling(false);

      // Append log
      const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLogs((prev) => [
        { time, role: selected.roleName, rarity: selected.rarity, color: selected.color },
        ...prev.slice(0, 19)
      ]);
    }, 1200);
  };

  const getRarityStats = (rarity: GachaRole['rarity']) => {
    const matched = roles.filter(r => r.rarity === rarity);
    const sumChance = matched.reduce((sum, r) => sum + r.chance, 0);
    return { count: matched.length, totalChance: sumChance.toFixed(1) };
  };

  return (
    <div className="flex-1 p-6 md:p-8 space-y-6 text-gray-100 overflow-y-auto" id="gacha-manager-panel">
      {/* Banner */}
      <div className="border-b border-[#2d4026] pb-5">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          🔮 Gacha Nasib (Gacha Role Setup)
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Konfigurasi role discord, kelola status rarity keberuntungan, dan latih simulasi gacha rol takdir server.
        </p>
      </div>

      {/* Trial Wheel Box & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Interactive Wheel / Roller (45%) */}
        <div className="lg:col-span-5 bg-[#141b11] border border-[#2d4026] p-6 rounded-2xl flex flex-col justify-between items-center text-center space-y-4 shadow-xl">
          <div className="w-full text-left">
            <span className="text-[11px] font-mono text-[#9fe870] font-bold block">UJI COBA COK NASIB</span>
            <h3 className="font-bold text-white text-base">Uji Keberuntungan Gacha</h3>
          </div>

          {/* Rolling Display Animation */}
          <div className="w-full aspect-square max-w-[200px] rounded-full border-4 border-dashed border-[#d4af37] flex flex-col items-center justify-center p-4 relative overflow-hidden bg-black/40">
            <div className="absolute inset-0 bg-[#d4af37]/5 animate-pulse rounded-full"></div>
            {isRolling ? (
              <div className="space-y-2 animate-bounce">
                <Dice5 className="text-[#9fe870] animate-spin mx-auto" size={40} />
                <span className="text-xs font-mono text-gray-400">MEMUTAR NASIB...</span>
              </div>
            ) : winner ? (
              <div className="space-y-1.5 animate-scale-in">
                <Award size={36} style={{ color: winner.color }} className="mx-auto" />
                <h4 className="font-extrabold text-sm tracking-wide text-white truncate max-w-[150px]">{winner.roleName}</h4>
                <div className="inline-block px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold" style={{ backgroundColor: `${winner.color}30`, color: winner.color }}>
                  {winner.rarity}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Sparkles className="text-zinc-600 mx-auto" size={32} />
                <span className="text-xs text-zinc-500 font-sans">Siap Mengocok</span>
              </div>
            )}
          </div>

          <button
            id="btn-trigger-local-gacha"
            onClick={handleTrialRoll}
            disabled={isRolling || roles.length === 0}
            className={`w-full py-3 bg-[#9fe870] text-black font-bold uppercase tracking-wider text-xs rounded-xl shadow-lg transition-transform hover:scale-[1.01] active:translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isRolling ? 'Mengocok...' : '🎰 PUTAR GACHA (FREE TRIAL)'}
          </button>
        </div>

        {/* Right: Pool Configurator (75%) */}
        <div className="lg:col-span-7 bg-[#1c231a] border border-[#2d4026]/80 p-6 rounded-2xl flex flex-col justify-between shadow-xl">
          <div className="space-y-3">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Percent size={18} className="text-[#9fe870]" />
              Formulir Tambah Role Gacha
            </h3>

            <form onSubmit={handleAddRoleConfig} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-sans">
              <div className="space-y-1">
                <label className="text-xs text-gray-300 font-medium uppercase">Nama Role Discord</label>
                <input
                  type="text"
                  required
                  id="gacha-new-role"
                  value={newRole.roleName}
                  onChange={(e) => setNewRole({ ...newRole, roleName: e.target.value })}
                  placeholder="Contoh: @Admin Ganteng / @Begal Senior"
                  className="w-full bg-black/40 border border-[#2d4026] px-3.5 py-2 rounded text-zinc-100 focus:border-[#9fe870] focus:outline-none placeholder-zinc-600 text-xs md:text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-gray-300 font-semibold uppercase">Rarity Pool</label>
                  <select
                    id="gacha-new-rarity"
                    value={newRole.rarity}
                    onChange={(e) => {
                      const selectedRarity = e.target.value as GachaRole['rarity'];
                      setNewRole({
                        ...newRole,
                        rarity: selectedRarity,
                        chance: rarityMeta[selectedRarity].weight,
                      });
                    }}
                    className="w-full bg-black/40 border border-[#2d4026] px-2.5 py-2 rounded text-zinc-100 focus:border-[#9fe870] focus:outline-none text-xs"
                  >
                    <option value="Common">⚪ Common (60%)</option>
                    <option value="Rare">🟢 Rare (30%)</option>
                    <option value="Epic">🔵 Epic (8%)</option>
                    <option value="Legendary">🟣 Legendary (1.9%)</option>
                    <option value="Divine">🟡 Divine (0.1%)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gray-300 font-semibold uppercase">Peluang (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.01"
                    max="100"
                    required
                    id="gacha-new-chance"
                    value={newRole.chance}
                    onChange={(e) => setNewRole({ ...newRole, chance: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-black/40 border border-[#2d4026] px-2 py-2 rounded text-zinc-100 focus:border-[#9fe870] focus:outline-none text-xs font-mono"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 pt-2">
                <button
                  type="submit"
                  id="btn-add-gacha-role"
                  className="w-full py-2 bg-gradient-to-r from-blue-700 to-indigo-700 text-white hover:from-blue-600 hover:to-indigo-600 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <Plus size={14} />
                  <span>Pasang Role ke Mesin Gacha</span>
                </button>
              </div>
            </form>
          </div>

          {/* Quick Probability Check */}
          <div className="mt-4 pt-4 border-t border-zinc-800/60 font-sans">
            <span className="text-[10px] text-zinc-400 font-bold block uppercase tracking-wider mb-2">Sebaran Rincian Rarity Terpasang</span>
            <div className="flex flex-wrap gap-3">
              {Object.keys(rarityMeta).map((key) => {
                const rKey = key as GachaRole['rarity'];
                const stat = getRarityStats(rKey);
                return (
                  <div key={key} className="bg-black/30 border border-zinc-900 rounded-lg p-2 flex-1 min-w-[90px] text-center">
                    <span className="text-[9px] font-mono block" style={{ color: rarityMeta[rKey].color }}>
                      ● {key}
                    </span>
                    <span className="text-xs font-bold text-white block mt-0.5">{stat.count} Role</span>
                    <span className="text-[8px] text-zinc-500 font-mono block">{stat.totalChance}% peluang</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Role configurations Table / List */}
      <div className="bg-[#141b11] border border-[#2d4026] rounded-2xl overflow-hidden shadow-xl font-sans" id="gacha-roles-table">
        <div className="p-4 bg-black/20 border-b border-[#2d4026] flex items-center justify-between">
          <h4 className="font-bold text-white text-sm">Daftar Setelan Role Gacha ({roles.length})</h4>
          <span className="text-[10px] text-yellow-400 font-mono">Total Peluang Terpakai: {roles.reduce((sum, r) => sum + r.chance, 0).toFixed(1)}%</span>
        </div>

        <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="bg-black/40 text-gray-400 border-b border-zinc-800 font-medium">
                <th className="p-4">Nama Role</th>
                <th className="p-4">Rarity Tier</th>
                <th className="p-4">Peluang Keluar</th>
                <th className="p-4 text-right">Opsi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40">
              {roles.map((role) => (
                <tr key={role.id} id={`gacha-row-${role.id}`} className="hover:bg-zinc-800/10 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: role.color }} />
                      <span className="font-semibold text-white">{role.roleName}</span>
                    </div>
                  </td>
                  <td className="p-4 font-bold" style={{ color: role.color }}>
                    {role.rarity}
                  </td>
                  <td className="p-4 font-mono text-zinc-300 font-semibold">{role.chance}%</td>
                  <td className="p-4 text-right">
                    <button
                      id={`delete-gacha-btn-${role.id}`}
                      onClick={() => handleDeleteRole(role.id)}
                      className="p-1 hover:bg-red-950/40 text-red-400 hover:text-red-300 rounded cursor-pointer transition-colors"
                      title="Copot dari Gacha"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trial Logs */}
      <div className="bg-[#1c231a] border border-[#2d4026]/80 p-5 rounded-2xl shadow-xl font-sans" id="gacha-demo-logs">
        <h4 className="font-bold text-white text-sm flex items-center gap-1.5 mb-3">
          <BarChart3 size={16} className="text-[#9fe870]" />
          Arsip Gacha Demo Hasil Uji Coba Terkini
        </h4>
        {logs.length === 0 ? (
          <p className="text-xs text-zinc-500 italic p-4 text-center">Belum ada demo gacha diputar. Klik "🎰 PUTAR GACHA" di atas untuk mengetes.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[150px] overflow-y-auto pr-1">
            {logs.map((log, lIdx) => (
              <div key={lIdx} className="bg-black/30 border border-zinc-900 rounded p-2.5 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold block text-white truncate max-w-[120px]">{log.role}</span>
                  <span className="text-[9px] uppercase font-mono block font-bold" style={{ color: log.color }}>
                    {log.rarity}
                  </span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">{log.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
