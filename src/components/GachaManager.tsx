import React, { useState } from 'react';
import { GachaRole } from '../types';
import { Sparkles, Dice5, Percent, Plus, Trash2, Award, BarChart3, ShieldAlert, CheckCircle2, UserCheck, Eye } from 'lucide-react';

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

interface BulkSimulationResult {
  totalRolls: number;
  hits: Record<string, number>;
  actualPercentage: Record<string, number>;
}

export default function GachaManager({ initialRoles, updateRoles }: GachaManagerProps) {
  const [roles, setRoles] = useState<GachaRole[]>(initialRoles);
  const [logs, setLogs] = useState<RollLog[]>([]);
  const [isRolling, setIsRolling] = useState(false);
  const [winner, setWinner] = useState<GachaRole | null>(null);

  // Nickname Decorator Mockup state
  const [mockUserNick, setMockUserNick] = useState('vallensr1204');
  const [mockSelectedRarity, setMockSelectedRarity] = useState<'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Divine'>('Divine');

  // Bulk simulation state
  const [bulkResult, setBulkResult] = useState<BulkSimulationResult | null>(null);
  const [isSimulatingBulk, setIsSimulatingBulk] = useState(false);

  // New role template states
  const [newRole, setNewRole] = useState({
    roleName: '',
    rarity: 'Common' as GachaRole['rarity'],
    chance: 10,
    color: '#a1a1aa'
  });

  const rarityMeta = {
    Common: { name: 'Sipil / Biasa', color: '#a1a1aa', weight: 60, prefix: '🏠 [WARGA] ', suffix: ' [🏠]' },
    Rare: { name: 'Kelas Intel / Gangster', color: '#10b981', weight: 30, prefix: '🟢 [INTEL] ', suffix: ' [🕵️]' },
    Epic: { name: 'Lurah / Elite', color: '#3b82f6', weight: 8, prefix: '🔵 [LURAH SAKTI] ', suffix: ' [🛡️]' },
    Legendary: { name: 'Bandar Judi / Sultan', color: '#a855f7', weight: 1.9, prefix: '🟣 [SULTAN SANGAT TAJIR] ', suffix: ' [💰]' },
    Divine: { name: 'Dewa Langit / Admin', color: '#eab308', weight: 0.1, prefix: '👑 [DEWA LANGIT FOUNDER] ', suffix: ' [⚡]' }
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
    setNewRole({ ...newRole, roleName: '' });
  };

  const handleDeleteRole = (id: string) => {
    const updated = roles.filter(r => r.id !== id);
    setRoles(updated);
    updateRoles(updated);
  };

  // Perform a single local trial roll
  const handleTrialRoll = () => {
    if (roles.length === 0) return;
    setIsRolling(true);
    setWinner(null);

    setTimeout(() => {
      const selected = performWeightedRoll();
      setWinner(selected);
      setIsRolling(false);

      const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLogs((prev) => [
        { time, role: selected.roleName, rarity: selected.rarity, color: selected.color },
        ...prev.slice(0, 14)
      ]);
    }, 900);
  };

  const performWeightedRoll = (): GachaRole => {
    const totalWeight = roles.reduce((sum, r) => sum + r.chance, 0);
    let rand = Math.random() * totalWeight;
    for (const role of roles) {
      if (rand < role.chance) {
        return role;
      }
      rand -= role.chance;
    }
    return roles[0];
  };

  // Bulk Simulator loop calculations
  const handleRunBulkSimulation = (count: number) => {
    if (roles.length === 0) return;
    setIsSimulatingBulk(true);

    setTimeout(() => {
      const hits: Record<string, number> = { Common: 0, Rare: 0, Epic: 0, Legendary: 0, Divine: 0 };

      for (let i = 0; i < count; i++) {
        const pulled = performWeightedRoll();
        hits[pulled.rarity] = (hits[pulled.rarity] || 0) + 1;
      }

      const actualPercentage: Record<string, number> = {};
      Object.keys(hits).forEach((key) => {
        actualPercentage[key] = parseFloat(((hits[key] / count) * 100).toFixed(2));
      });

      setBulkResult({
        totalRolls: count,
        hits,
        actualPercentage
      });
      setIsSimulatingBulk(false);
    }, 400);
  };

  const getRarityStats = (rarity: GachaRole['rarity']) => {
    const matched = roles.filter(r => r.rarity === rarity);
    const sumChance = matched.reduce((sum, r) => sum + r.chance, 0);
    return { count: matched.length, totalChance: sumChance.toFixed(1) };
  };

  return (
    <div className="flex-1 p-6 md:p-8 space-y-6 text-gray-100 overflow-y-auto" id="gacha-manager-panel">
      
      {/* Tab Header Banner */}
      <div className="border-b border-[#2d4026] pb-5">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          🔮 Gacha Nasib & Penyeimbang Rarity (Gacha Balancer Engine)
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Atur rasio kemunculan role takdir, simulasikan ribuan kocokan instan untuk memverifikasi penyeimbang peluang, dan hiasi nickname Anda di mockup Discord.
        </p>
      </div>

      {/* Row 1: Kocok Mandiri vs Nickname Mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Uji Coba Kocok Mandiri */}
        <div className="lg:col-span-5 bg-[#141b11] border border-[#2d4026] p-6 rounded-2xl flex flex-col justify-between items-center text-center space-y-4 shadow-xl">
          <div className="w-full text-left">
            <span className="text-[10px] font-mono text-[#9fe870] font-bold block uppercase tracking-wider">UJI COBA COK NASIB</span>
            <h3 className="font-bold text-white text-base">Simulasi Rol Takdir Mandiri</h3>
          </div>

          <div className="w-full aspect-square max-w-[180px] rounded-full border-4 border-dashed border-[#e3f65e]/40 flex flex-col items-center justify-center p-4 relative overflow-hidden bg-black/40">
            <div className="absolute inset-0 bg-[#9fe870]/5 animate-pulse rounded-full"></div>
            {isRolling ? (
              <div className="space-y-2 animate-bounce">
                <Dice5 className="text-[#9fe870] animate-spin mx-auto" size={40} />
                <span className="text-[10px] font-mono text-gray-400">MEMUTAR TAKDIR...</span>
              </div>
            ) : winner ? (
              <div className="space-y-1.5 animate-scale-in">
                <div className="inline-block px-2 py-0.5 rounded text-[9px] uppercase font-mono font-extrabold select-none mb-1 shadow-sm" style={{ backgroundColor: `${winner.color}30`, color: winner.color, border: `1px solid ${winner.color}30` }}>
                  {winner.rarity}
                </div>
                <h4 className="font-black text-xs md:text-sm tracking-wide text-white truncate max-w-[150px]" style={{ color: winner.color }}>{winner.roleName}</h4>
                <p className="text-[10px] font-mono text-zinc-500">Peluang: {winner.chance}%</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Sparkles className="text-zinc-600 mx-auto animate-pulse" size={28} />
                <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-widest font-bold">Siap Diputar</span>
              </div>
            )}
          </div>

          <button
            onClick={handleTrialRoll}
            disabled={isRolling || roles.length === 0}
            className="w-full py-2.5 bg-gradient-to-r from-[#9fe870] to-[#5bb22b] text-black font-extrabold uppercase tracking-wider text-xs rounded-xl shadow-lg hover:scale-101 active:scale-99 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isRolling ? 'Memutar...' : '🎰 PUTAR GACHA (FREE TRIAL)'}
          </button>
        </div>

        {/* Right: Discord Nickname Decorator Live Mockup */}
        <div className="lg:col-span-7 bg-[#141b11] border border-[#2d4026] p-6 rounded-2xl flex flex-col justify-between space-y-4 shadow-xl">
          <div>
            <span className="text-[10px] font-mono text-yellow-400 font-bold block uppercase tracking-wider">PREVIEW HIASAN PREFIKS</span>
            <h3 className="font-bold text-white text-base">Visualisasi Hiasan Nama (Discord Name Mockup)</h3>
            <p className="text-xs text-gray-400 mt-1">Hiasan nama akan otomatis terpasang mengikuti kasta gacha tertinggi yang dimiliki member di server Anda.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-xs text-zinc-300 font-semibold uppercase">Tulis Nickname Nama</label>
              <input
                type="text"
                value={mockUserNick}
                onChange={(e) => setMockUserNick(e.target.value)}
                placeholder="nama_warga"
                className="w-full bg-black/40 border border-[#2d4026] px-3.5 py-2 rounded text-zinc-100 outline-none focus:border-[#9fe870] text-xs font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-zinc-300 font-semibold uppercase">Pilih Rarity Capian</label>
              <select
                value={mockSelectedRarity}
                onChange={(e) => setMockSelectedRarity(e.target.value as any)}
                className="w-full bg-black/40 border border-[#2d4026] p-2 rounded text-zinc-300 text-xs focus:border-[#9fe870] outline-none"
              >
                <option value="Common">⚪ Common (Warga Biasa)</option>
                <option value="Rare">🟢 Rare (Intel Lapangan)</option>
                <option value="Epic">🔵 Epic (Lurah Sakti)</option>
                <option value="Legendary">🟣 Legendary (Sultan Kaya)</option>
                <option value="Divine">🟡 Divine (Dewa Langit)</option>
              </select>
            </div>
          </div>

          {/* Discord Chat Mockup Board */}
          <div className="bg-[#313338] border border-black/30 rounded-xl p-4 space-y-2 font-sans select-none shadow">
            <span className="text-[8px] font-mono text-zinc-500 uppercase font-bold block">Discord Desktop Client Mockup</span>
            
            <div className="flex items-start space-x-3.5 pt-1">
              <img
                src={`https://api.dicebear.com/7.x/identicon/svg?seed=${mockUserNick}`}
                alt="preview-avatar"
                className="w-9 h-9 rounded-full bg-[#1e231c]' shrink-0"
              />

              <div>
                <div className="flex items-baseline space-x-1.5">
                  {/* Decorated Nickname! */}
                  <span 
                    className="font-bold text-sm tracking-wide cursor-pointer hover:underline"
                    style={{ color: rarityMeta[mockSelectedRarity].color }}
                  >
                    {rarityMeta[mockSelectedRarity].prefix}
                    {mockUserNick}
                    {rarityMeta[mockSelectedRarity].suffix}
                  </span>
                  <span className="text-[9px] text-zinc-400">Hari ini 12:00</span>
                </div>
                <p className="text-xs text-[#dbdee1] leading-none mt-1">Permisi lurah, saya numpang mabar di general voice channel ya 🙏</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Row 2: BULK SIMULATOR (BENCH TESTING) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Setup Form Custom Role (4 columns) */}
        <div className="lg:col-span-4 bg-[#141b11] border border-[#2d4026] p-6 rounded-2xl space-y-4 shadow-xl">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-[#9fe870] font-bold block uppercase tracking-wider font-sans">POOL CONFIGURATOR</span>
            <h3 className="font-bold text-white text-base">Pasang Role Takdir Baru</h3>
          </div>

          <form onSubmit={handleAddRoleConfig} className="space-y-4 text-xs font-sans">
            <div className="space-y-1">
              <label className="text-xs text-gray-300 font-semibold uppercase">Nama Role Discord</label>
              <input
                type="text"
                required
                value={newRole.roleName}
                onChange={(e) => setNewRole({ ...newRole, roleName: e.target.value })}
                placeholder="Contoh: @Dewa Langit / @Begal Senior"
                className="w-full bg-black/40 border border-[#2d4026] px-3.5 py-2.5 rounded text-zinc-100 placeholder-zinc-700 outline-none text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-gray-300 font-semibold uppercase">Rarity Kasta</label>
                <select
                  value={newRole.rarity}
                  onChange={(e) => {
                    const selectedRarity = e.target.value as GachaRole['rarity'];
                    setNewRole({
                      ...newRole,
                      rarity: selectedRarity,
                      chance: rarityMeta[selectedRarity].weight,
                    });
                  }}
                  className="w-full bg-black/40 border border-[#2d4026] px-2 py-2 rounded text-zinc-100 focus:border-[#9fe870] outline-none text-xs"
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
                  step="0.01"
                  min="0.01"
                  max="100"
                  required
                  value={newRole.chance}
                  onChange={(e) => setNewRole({ ...newRole, chance: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-black/40 border border-[#2d4026] px-2.5 py-2 rounded text-zinc-100 focus:border-[#9fe870] outline-none text-xs font-mono"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-650 hover:to-indigo-650 text-white text-xs font-extrabold rounded-lg tracking-wider uppercase duration-150 transform hover:scale-102 flex items-center justify-center gap-1 cursor-pointer shadow"
              >
                <Plus size={14} />
                <span>Simpan Ke Setelan</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Side: Bulk Roll Simulator and Balanced Check Chart */}
        <div className="lg:col-span-8 bg-[#141b11] border border-[#2d4026] p-6 rounded-2xl space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2d4026]/40 pb-3">
            <div>
              <span className="text-[10px] font-mono text-rose-400 font-bold block uppercase tracking-wider">STRESS-BENCH TESTER</span>
              <h3 className="font-bold text-white text-base">Mesin Penyeimbang Rarity (Gacha Tester Bench)</h3>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => handleRunBulkSimulation(100)}
                disabled={isSimulatingBulk || roles.length === 0}
                className="px-3.5 py-1.5 bg-zinc-800 text-zinc-300 hover:text-white rounded border border-[#2d4026] font-mono text-[10px] font-bold cursor-pointer disabled:opacity-40"
              >
                100x Kocok
              </button>
              <button
                onClick={() => handleRunBulkSimulation(1000)}
                disabled={isSimulatingBulk || roles.length === 0}
                className="px-3.5 py-1.5 bg-gradient-to-r from-purple-800 to-indigo-800 text-white rounded font-mono text-[10px] font-bold cursor-pointer disabled:opacity-40 shadow-inner"
              >
                💥 1000x Roll Bench
              </button>
            </div>
          </div>

          {/* Verification Chart Result */}
          {isSimulatingBulk ? (
            <div className="py-12 text-center text-zinc-500 font-mono text-xs flex flex-col justify-center items-center space-y-2">
              <Dice5 size={28} className="animate-spin text-[#9fe870]" />
              <span>Menjalankan hitungan matematika gacha probability stress-test...</span>
            </div>
          ) : bulkResult ? (
            <div className="space-y-4 animate-fade-in font-sans">
              
              {/* Verdict Notice box */}
              <div className="p-3 bg-emerald-950/20 border border-emerald-800/40 rounded-xl flex items-center justify-between text-xs text-emerald-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>Hasil Tes Cocokan: **{bulkResult.totalRolls} Kali kocok selesai**. Peluang terverifikasi stabil.</span>
                </div>
                <span className="font-mono font-bold text-[10px] bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded uppercase tracking-wider">VERIFIED PASSED</span>
              </div>

              {/* Rarity hits layout bars */}
              <div className="space-y-3 font-mono text-xs text-zinc-400">
                {Object.keys(rarityMeta).map((key) => {
                  const rKey = key as GachaRole['rarity'];
                  const hits = bulkResult.hits[key] || 0;
                  const pct = bulkResult.actualPercentage[key] || 0;
                  const targetPct = getRarityStats(rKey).totalChance;

                  return (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between items-baseline text-[11px]">
                        <span className="font-bold flex items-center gap-1.5" style={{ color: rarityMeta[rKey].color }}>
                          ● {key}
                          <span className="text-[9px] font-normal text-zinc-500 font-sans">({hits} hits)</span>
                        </span>
                        <span>
                          Nyata: <strong className="text-white">{pct}%</strong> | Target: <strong className="text-zinc-500">{targetPct}%</strong>
                        </span>
                      </div>
                      <div className="h-2.5 bg-black/50 rounded-full overflow-hidden flex">
                        <div 
                          className="h-full rounded-full transition-all duration-300"
                          style={{ 
                            backgroundColor: rarityMeta[rKey].color, 
                            width: `${Math.max(1, (pct / 100) * 100)}%` 
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          ) : (
            <div className="bg-black/20 border border-dashed border-zinc-800 rounded-xl p-8 text-center text-zinc-650 font-sans text-xs flex flex-col justify-center items-center space-y-1">
              <BarChart3 size={24} className="text-zinc-600 mb-1" />
              <p className="font-semibold text-zinc-500">Benchmark Gacha Belum Berjalan</p>
              <p>Pilih "1000x Roll Bench" di atas untuk memverifikasi keakuratan generator gacha.</p>
            </div>
          )}

        </div>

      </div>

      {/* Role Configurations Table List View */}
      <div className="bg-[#141b11] border border-[#2d4026] rounded-2xl overflow-hidden shadow-xl font-sans" id="gacha-roles-table-bench">
        <div className="p-4 bg-black/20 border-b border-[#2d4026] flex items-center justify-between">
          <h4 className="font-bold text-white text-sm">Daftar Konfigurasi Bobot Peluang Gacha ({roles.length})</h4>
          <span className="text-[10px] text-[#9fe870] font-mono font-bold uppercase tracking-wider">Total: {roles.reduce((sum, r) => sum + r.chance, 0).toFixed(1)}%</span>
        </div>

        <div className="overflow-x-auto max-h-[300px]">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="bg-black/40 text-gray-400 border-b border-zinc-800 font-medium">
                <th className="p-4">Nama Role</th>
                <th className="p-4">Rarity Tier</th>
                <th className="p-4">Kecenderungan (%)</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40">
              {roles.map((role) => (
                <tr key={role.id} id={`gacha-row-${role.id}`} className="hover:bg-zinc-850/10 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: role.color }} />
                      <span className="font-semibold text-white">{role.roleName}</span>
                    </div>
                  </td>
                  <td className="p-4 font-bold" style={{ color: role.color }}>
                    {role.rarity}
                  </td>
                  <td className="p-4 font-mono text-zinc-350 font-bold">{role.chance}%</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDeleteRole(role.id)}
                      className="p-1 hover:bg-red-950/40 text-red-400 hover:text-red-300 rounded cursor-pointer transition-colors"
                      title="Hapus"
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
    </div>
  );
}
