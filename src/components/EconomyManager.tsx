import React, { useState, useEffect } from 'react';
import { Coins, Trophy, Zap, MessageSquare, ArrowUpRight, TrendingUp, Users, RefreshCw, Sparkles, AlertCircle } from 'lucide-react';
import { KtpRecord } from '../types';

interface EconomyConfig {
  startingBalance: number;
  xpPerMessage: number;
  coinsPerMessage: number;
  dailyStreakReward: number;
}

interface EconomyManagerProps {
  citizens: KtpRecord[];
  addLog: (type: 'info' | 'success' | 'warn' | 'error', source: 'Server' | 'Bot', message: string) => void;
}

interface EcoUser {
  userId: string;
  username: string;
  fullname: string;
  coins: number;
  xp: number;
  level: number;
  lastActive: string;
}

export default function EconomyManager({ citizens, addLog }: EconomyManagerProps) {
  // Config
  const [config, setConfig] = useState<EconomyConfig>(() => {
    const cached = localStorage.getItem('eco_config_db');
    return cached ? JSON.parse(cached) : {
      startingBalance: 1000,
      xpPerMessage: 15,
      coinsPerMessage: 10,
      dailyStreakReward: 250
    };
  });

  // User list persistence
  const [ecoUsers, setEcoUsers] = useState<EcoUser[]>(() => {
    const cached = localStorage.getItem('eco_users_db');
    if (cached) return JSON.parse(cached);

    // Initial seed from citizens list or default
    return citizens.map((c, idx) => ({
      userId: c.userId || 'user_' + idx,
      username: c.username,
      fullname: c.fullname,
      coins: 1250 + (idx * 450),
      xp: 240 + (idx * 312),
      level: Math.floor((240 + (idx * 312)) / 100) + 1,
      lastActive: c.createdAt || 'Baru Saja'
    }));
  });

  // Double XP booster states
  const [isBoosterActive, setIsBoosterActive] = useState(false);
  const [boosterTime, setBoosterTime] = useState(300); // 5 minutes in sec

  // Chat simulator state
  const [selectedUser, setSelectedUser] = useState(ecoUsers[0]?.userId || '');
  const [chatMessage, setChatMessage] = useState('');
  const [simulationFeed, setSimulationFeed] = useState<{ id: string; user: string; text: string; coins: number; xp: number }[]>([]);

  useEffect(() => {
    localStorage.setItem('eco_config_db', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('eco_users_db', JSON.stringify(ecoUsers));
  }, [ecoUsers]);

  // Booster timer tick
  useEffect(() => {
    let timer: any;
    if (isBoosterActive && boosterTime > 0) {
      timer = setInterval(() => {
        setBoosterTime(prev => {
          if (prev <= 1) {
            setIsBoosterActive(false);
            addLog('warn', 'Bot', 'Event Double XP Server Booster telah berakhir.');
            return 300;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isBoosterActive, boosterTime]);

  const handleToggleBooster = () => {
    const nextState = !isBoosterActive;
    setIsBoosterActive(nextState);
    if (nextState) {
      setBoosterTime(300); // refuel 5 minutes
      addLog('success', 'Bot', 'Server Booster AKTIF! Seluruh member mendapatkan 2.0x XP dan multiplier Koin tambahan.');
    } else {
      addLog('warn', 'Bot', 'Server Booster dimatikan secara manual.');
    }
  };

  const handleSimulateChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !chatMessage.trim()) return;

    const user = ecoUsers.find(u => u.userId === selectedUser);
    if (!user) return;

    // Calculations
    const multiplier = isBoosterActive ? 2 : 1;
    const gainedXp = config.xpPerMessage * multiplier;
    const gainedCoins = config.coinsPerMessage * multiplier;

    const updatedUsers = ecoUsers.map(u => {
      if (u.userId === selectedUser) {
        const nextXp = u.xp + gainedXp;
        const nextLevel = Math.floor(nextXp / 150) + 1; // 150 XP per level-up
        if (nextLevel > u.level) {
          addLog('success', 'Bot', `🎉 LEVEL UP! @${u.username} berhasil naik ke Level ${nextLevel}!`);
        }
        return {
          ...u,
          xp: nextXp,
          coins: u.coins + gainedCoins,
          level: nextLevel,
          lastActive: 'Baru saja mengetik'
        };
      }
      return u;
    });

    setEcoUsers(updatedUsers);

    // Append to live feed
    const freshFeed = {
      id: 'feed_' + Math.random().toString(36).substring(2, 9),
      user: user.username,
      text: chatMessage,
      coins: gainedCoins,
      xp: gainedXp
    };

    setSimulationFeed([freshFeed, ...simulationFeed].slice(0, 10));
    setChatMessage('');
  };

  const handleResetEco = () => {
    const confirmed = window.confirm('Apakah Anda yakin ingin mematikan reset sirkulasi ekonomi? Semua saldo koin dan XP warga akan kembali ke awal.');
    if (!confirmed) return;

    const resetUsers = ecoUsers.map(u => ({
      ...u,
      coins: config.startingBalance,
      xp: 0,
      level: 1,
      lastActive: 'Telah Direset'
    }));

    setEcoUsers(resetUsers);
    addLog('warn', 'Server', 'Seluruh database ekonomi warga berhasil diset ulang!');
  };

  // Quick stats
  const totalSupply = ecoUsers.reduce((sum, u) => sum + u.coins, 0);
  const averageLevel = ecoUsers.length ? (ecoUsers.reduce((sum, u) => sum + u.level, 0) / ecoUsers.length).toFixed(1) : 1;
  const boosterFormattedTime = `${Math.floor(boosterTime / 60)}m ${boosterTime % 60}s`;

  return (
    <div className="flex-1 p-6 md:p-8 space-y-6 text-gray-100 overflow-y-auto" id="economy-manager-panel">
      
      {/* Page Banner Header */}
      <div className="border-b border-[#2d4026] pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            🪙 Sistem Ekonomi & Leveling Server (Economy ledger)
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Pantau perputaran uang server, atur batas klaim harian, serta gedor keaktifan warga melalui sistem simulasi XP chat dan Booster interaktif.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleBooster}
            className={`px-3.5 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer border ${
              isBoosterActive
                ? 'bg-amber-500/10 border-amber-500 text-amber-400 animate-pulse'
                : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Zap size={13} className={isBoosterActive ? 'fill-current' : ''} />
            <span>{isBoosterActive ? `Double-XP: ${boosterFormattedTime}` : 'Nyalakan Booster'}</span>
          </button>
        </div>
      </div>

      {/* Grid Bento Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="economy-overview-stats">
        <div className="bg-[#141b11] border border-[#2d4026] p-4 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-400 shrink-0">
            <Coins size={22} />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-zinc-400 tracking-wider uppercase block font-mono">Sirkulasi Koin Server</span>
            <span className="text-xl font-bold font-mono text-white">Rp {totalSupply.toLocaleString('id-ID')}.-</span>
          </div>
        </div>

        <div className="bg-[#141b11] border border-[#2d4026] p-4 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 shrink-0">
            <Trophy size={22} />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-zinc-400 tracking-wider uppercase block font-mono">Rata-Rata Level Warga</span>
            <span className="text-xl font-bold font-mono text-white">Level {averageLevel}</span>
          </div>
        </div>

        <div className="bg-[#141b11] border border-[#2d4026] p-4 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 shrink-0">
            <Users size={22} />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-zinc-400 tracking-wider uppercase block font-mono">Warga Kaya Aktif</span>
            <span className="text-xl font-bold font-mono text-white">{ecoUsers.length} Pemain</span>
          </div>
        </div>
      </div>

      {/* Main interactive panel row split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Card: Chat simulator & Feed tracker */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          
          {/* Chat Simulator component */}
          <div className="bg-[#141b11] border border-[#2d4026] p-6 rounded-2xl space-y-4 shadow-xl">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] font-mono text-[#9fe870] font-bold block uppercase tracking-wider">PREVIEW SIMULATOR</span>
                <h3 className="font-bold text-white text-base">Simulasi Generator Keaktifan Chat</h3>
              </div>
              {isBoosterActive && (
                <span className="text-[10px] bg-amber-500/10 border border-amber-500/30 text-amber-400 font-extrabold px-2 py-0.5 rounded font-mono uppercase tracking-widest animate-pulse">
                  ⚡ 2.0X ACTIVE
                </span>
              )}
            </div>

            <form onSubmit={handleSimulateChat} className="space-y-4 text-xs md:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-300 font-semibold uppercase">Pilih Warga Yang Berbicara</label>
                  <select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className="w-full bg-black/40 border border-[#2d4026] p-2.5 rounded text-zinc-100 text-xs focus:border-[#9fe870] outline-none"
                  >
                    {ecoUsers.map(user => (
                      <option key={user.userId} value={user.userId}>
                        {user.username} (Lvl {user.level})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gray-300 font-semibold uppercase">Isi Pesan Obrolan</label>
                  <input
                    type="text"
                    required
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Contoh: halo semua ip server berapa ya?"
                    className="w-full bg-black/40 border border-[#2d4026] px-3 py-2.5 rounded text-zinc-100 placeholder-zinc-650 focus:border-[#9fe870] outline-none text-xs"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-between items-center">
                <span className="text-[11px] text-zinc-500 font-mono italic">
                  *Pemberian Koin default: Rp {config.coinsPerMessage} & {config.xpPerMessage} XP per chat.
                </span>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-green-700 to-emerald-700 hover:from-green-650 hover:to-emerald-650 text-white font-bold rounded-lg text-xs uppercase tracking-wider active:scale-95 transition-all cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <MessageSquare size={13} />
                  <span>Kirim & Simulasi Chat</span>
                </button>
              </div>
            </form>
          </div>

          {/* Simulated Chat Feed */}
          <div className="bg-black/30 border border-[#2d4026]/60 rounded-2xl p-5 space-y-3 shadow-inner">
            <h4 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <RefreshCw size={12} className="animate-spin text-[#9fe870]" />
              Sirkulasi Chat Feed Telegram / Discord Simulator
            </h4>

            <div className="space-y-2.5 max-h-56 overflow-y-auto font-mono text-[11px] text-zinc-300">
              {simulationFeed.length === 0 ? (
                <p className="text-zinc-650 text-center py-4 italic">Belum ada obrolan terbaru. Kirim chat di atas untuk mensimulasikan sistem XP koin.</p>
              ) : (
                simulationFeed.map((feed) => (
                  <div key={feed.id} className="flex flex-col sm:flex-row justify-between items-start gap-1 p-2 rounded bg-black/40 hover:bg-[#152011]/30 transition-colors border border-white/5">
                    <div>
                      <span className="text-[#a855f7] font-bold">@{feed.user}:</span>{' '}
                      <span className="text-zinc-300">"{feed.text}"</span>
                    </div>
                    <div className="flex gap-1.5 text-[10px] font-bold font-mono tracking-wider">
                      <span className="text-[#9fe870] bg-[#9fe870]/10 px-1.5 py-0.5 rounded">+{feed.coins} Koin</span>
                      <span className="text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">+{feed.xp} XP</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right Settings Grid configs */}
        <div className="lg:col-span-5 bg-[#141b11] border border-[#2d4026] p-6 rounded-2xl flex flex-col justify-between space-y-4 shadow-xl font-sans text-sm">
          
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-yellow-400 font-bold block uppercase tracking-wider">CONFIG ADJUSTMENTS</span>
            <h3 className="font-bold text-white text-base">Modifikasi Aturan Kredit & Leveling</h3>
            <p className="text-xs text-gray-400">Atur takaran sistem perekonomian bot discord Anda sesuka hati.</p>
          </div>

          <div className="space-y-4 text-xs md:text-sm pt-2">
            <div className="space-y-1">
              <label className="text-xs text-gray-300 font-semibold uppercase">Saldo Awal Pemain KTP Baru</label>
              <input
                type="number"
                value={config.startingBalance}
                onChange={(e) => setConfig({ ...config, startingBalance: parseInt(e.target.value) || 0 })}
                className="w-full bg-black/40 border border-[#2d4026] px-3 py-2 rounded text-zinc-100 font-mono text-xs focus:border-[#9fe870] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-zinc-400 uppercase font-bold font-mono text-[9px]">XP Per Pesan</label>
                <input
                  type="number"
                  value={config.xpPerMessage}
                  onChange={(e) => setConfig({ ...config, xpPerMessage: parseInt(e.target.value) || 0 })}
                  className="w-full bg-black/40 border border-[#2d4026] px-2.5 py-2 rounded text-zinc-100 font-mono text-xs focus:border-[#9fe870] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-zinc-400 uppercase font-bold font-mono text-[9px]">Koin Per Pesan</label>
                <input
                  type="number"
                  value={config.coinsPerMessage}
                  onChange={(e) => setConfig({ ...config, coinsPerMessage: parseInt(e.target.value) || 0 })}
                  className="w-full bg-black/40 border border-[#2d4026] px-2.5 py-2 rounded text-zinc-100 font-mono text-xs focus:border-[#9fe870] outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-300 font-semibold uppercase">Bonus Beruntun Harian (Daily Claim)</label>
              <input
                type="number"
                value={config.dailyStreakReward}
                onChange={(e) => setConfig({ ...config, dailyStreakReward: parseInt(e.target.value) || 0 })}
                className="w-full bg-black/40 border border-[#2d4026] px-3 py-2 rounded text-zinc-100 font-mono text-xs focus:border-[#9fe870] outline-none"
              />
            </div>

            <div className="pt-3 border-t border-zinc-800 space-y-2">
              <button
                onClick={() => {
                  setConfig({
                    startingBalance: 1000,
                    xpPerMessage: 15,
                    coinsPerMessage: 10,
                    dailyStreakReward: 250
                  });
                  addLog('info', 'Server', 'Konfigurasi ekonomi di-reset ke pengaturan standar.');
                }}
                className="w-full py-2 bg-zinc-800 text-zinc-300 font-bold hover:bg-zinc-700 rounded-lg text-xs uppercase tracking-wider transition-all cursor-pointer shadow"
              >
                Atur Ke Standar Bawaan
              </button>

              <button
                onClick={handleResetEco}
                className="w-full py-2 bg-red-950/40 border border-red-800/40 text-red-300 font-bold hover:bg-red-900/40 rounded-lg text-xs uppercase tracking-wider transition-all cursor-pointer shadow"
              >
                Setel Ulang (Reset) Semua Saldo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-[#141b11] border border-[#2d4026] rounded-2xl overflow-hidden shadow-xl font-sans" id="economy-ledger-table-section">
        <div className="p-4 bg-black/20 border-b border-[#2d4026] flex items-center justify-between">
          <h4 className="font-bold text-white text-sm font-sans">Buku Kas & Peringkat Leveling Global ({ecoUsers.length} Waga)</h4>
          <span className="text-[10px] text-[#9fe870] font-mono">Diperbarui Secara Otomatis</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="bg-black/40 text-gray-400 border-b border-zinc-800 font-medium">
                <th className="p-4">Urutan Rank</th>
                <th className="p-4">Nama Panggilan</th>
                <th className="p-4 font-mono">Nominal Saldo Koin</th>
                <th className="p-4 font-mono">Timbunan XP</th>
                <th className="p-4">Level</th>
                <th className="p-4 text-center">Tindakan Cepat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40">
              {ecoUsers
                .sort((a, b) => b.xp - a.xp)
                .map((u, idx) => (
                  <tr key={u.userId} className="hover:bg-zinc-850/10 transition-colors">
                    <td className="p-4 font-mono font-bold text-zinc-400">
                      {idx === 0 ? '🏆 #1' : idx === 1 ? '🥈 #2' : idx === 2 ? '🥉 #3' : `#${idx + 1}`}
                    </td>
                    <td className="p-4 font-bold text-white">
                      <div>
                        <span>{u.fullname}</span>
                        <span className="text-[10px] text-zinc-500 font-normal block">@{u.username}</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-zinc-300">Rp {u.coins.toLocaleString('id-ID')}</td>
                    <td className="p-4 font-mono text-zinc-300">{u.xp} XP</td>
                    <td className="p-4 font-bold">
                      <span className="px-2 py-0.5 bg-[#9fe870]/10 border border-[#9fe870]/30 text-[#9fe870] rounded-full text-[10px]">
                        Lvl {u.level}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-1.5">
                        <button
                          onClick={() => {
                            const updated = ecoUsers.map(user => {
                              if (user.userId === u.userId) {
                                return { ...user, coins: user.coins + 1000 };
                              }
                              return user;
                            });
                            setEcoUsers(updated);
                            addLog('success', 'Server', `Top-up Koin Rp 1.000 berhasil ditambahkan ke @${u.username}`);
                          }}
                          className="px-2 py-1 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 rounded text-[10px] font-bold cursor-pointer transition-all border border-yellow-500/10"
                        >
                          +Rp1k
                        </button>
                        <button
                          onClick={() => {
                            const updated = ecoUsers.map(user => {
                              if (user.userId === u.userId) {
                                const nextXp = user.xp + 100;
                                return { ...user, xp: nextXp, level: Math.floor(nextXp / 150) + 1 };
                              }
                              return user;
                            });
                            setEcoUsers(updated);
                            addLog('success', 'Server', `Bonus 100 XP berhasil ditanamkan ke @${u.username}`);
                          }}
                          className="px-2 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded text-[10px] font-bold cursor-pointer transition-all border border-blue-500/10"
                        >
                          +100XP
                        </button>
                      </div>
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
