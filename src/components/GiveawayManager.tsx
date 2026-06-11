import React, { useState, useEffect } from 'react';
import { Gift, Trophy, Clock, Users, Flame, Plus, Check, Trash, Sparkles } from 'lucide-react';
import { KtpRecord } from '../types';

interface Giveaway {
  id: string;
  prize: string;
  winnersCount: number;
  duration: number; // in seconds
  timeLeft: number; // in seconds
  status: 'RUNNING' | 'ENDED';
  winners: string[];
  entrantsCount: number;
}

interface GiveawayManagerProps {
  citizens: KtpRecord[];
  addLog: (type: 'info' | 'success' | 'warn' | 'error', source: 'Server' | 'Bot', message: string) => void;
}

export default function GiveawayManager({ citizens, addLog }: GiveawayManagerProps) {
  const [giveaways, setGiveaways] = useState<Giveaway[]>(() => {
    const cached = localStorage.getItem('giveaway_db');
    return cached ? JSON.parse(cached) : [
      {
        id: 'g_1',
        prize: '🎁 Nitrose Premium (1 Bulan)',
        winnersCount: 1,
        duration: 0,
        timeLeft: 0,
        status: 'ENDED',
        winners: ['kyle_3214'],
        entrantsCount: 12
      }
    ];
  });

  const [prizeName, setPrizeName] = useState('🎁 Saldo Gopay Rp 150.000');
  const [winnersCountInput, setWinnersCountInput] = useState(1);
  const [durationInput, setDurationInput] = useState(30); // default 30s for quick sandbox demonstration
  const [triggerConfetti, setTriggerConfetti] = useState(false);
  const [lastWinGroup, setLastWinGroup] = useState<string[]>([]);

  useEffect(() => {
    localStorage.setItem('giveaway_db', JSON.stringify(giveaways));
  }, [giveaways]);

  // Real-time ticking down giveaways timeLeft
  useEffect(() => {
    const timer = setInterval(() => {
      let changed = false;
      const updated = giveaways.map(gw => {
        if (gw.status === 'RUNNING' && gw.timeLeft > 0) {
          changed = true;
          const nextTime = gw.timeLeft - 1;
          if (nextTime === 0) {
            // End the giveaway & draw winners!
            const finalGw = { ...gw, timeLeft: 0, status: 'ENDED' as const };
            drawWinnersForGiveaway(finalGw);
            return finalGw;
          }
          return { ...gw, timeLeft: nextTime };
        }
        return gw;
      });

      if (changed) {
        setGiveaways(updated);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [giveaways]);

  const drawWinnersForGiveaway = (gw: Giveaway) => {
    // Collect candidate pool
    const candidates = citizens.length > 0 
      ? citizens.map(c => c.username) 
      : ['vallensr1204', 'kyle_3214', 'rizky_bandung', 'lia_gaming', 'deni_intel', 'indra_lurah'];

    if (candidates.length === 0) return;

    // Draw random winners
    const shuffled = [...candidates].sort(() => 0.5 - Math.random());
    const luckyWinners = shuffled.slice(0, Math.min(gw.winnersCount, candidates.length));

    // Update giveaways array
    setGiveaways(prev => prev.map(g => {
      if (g.id === gw.id) {
        return { ...g, status: 'ENDED', winners: luckyWinners, entrantsCount: candidates.length };
      }
      return g;
    }));

    setLastWinGroup(luckyWinners);
    setTriggerConfetti(true);
    addLog('success', 'Bot', `🎉 GIVEAWAY SELESAI! "${gw.prize}" dimenangkan oleh: ${luckyWinners.map(w => '@' + w).join(', ')}!`);
    
    // Auto clear confetti status after 7 seconds
    setTimeout(() => {
      setTriggerConfetti(false);
    }, 7000);
  };

  const handleStartGiveaway = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prizeName.trim()) return;

    const newGw: Giveaway = {
      id: 'g_' + Math.random().toString(36).substring(2, 9),
      prize: prizeName,
      winnersCount: Math.max(1, winnersCountInput),
      duration: durationInput,
      timeLeft: durationInput,
      status: 'RUNNING',
      winners: [],
      entrantsCount: citizens.length || 6
    };

    setGiveaways([newGw, ...giveaways]);
    addLog('warn', 'Bot', `📢 GIVEAWAY DIKIRIM! Memulai pembagian hadiah "${prizeName}" untuk ${newGw.winnersCount} pemenang selama ${durationInput} detik!`);
    setPrizeName('');
  };

  const handleDeleteCompleted = (id: string) => {
    setGiveaways(prev => prev.filter(g => g.id !== id));
    addLog('info', 'Server', 'Data riwayat giveaway berhasil ditiadakan.');
  };

  return (
    <div className="flex-1 p-6 md:p-8 space-y-6 text-gray-100 overflow-y-auto" id="giveaway-manager-panel">
      {/* Page Header */}
      <div className="border-b border-[#2d4026] pb-5">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          🎁 Penjadwal Acara & Undian Server (Giveaway Center)
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Gelar event mabar, giveaway Nitrose premium, saldo e-money, atau role kehormatan. Sistem undian bekerja 100% adil berlandaskan data warga asli.
        </p>
      </div>

      {/* Confetti Simulated Visual Pop-Up */}
      {triggerConfetti && (
        <div className="relative p-6 bg-gradient-to-r from-amber-900/30 to-yellow-900/30 border-2 border-yellow-500/80 rounded-2xl animate-bounce space-y-3 shadow-2xl text-center" id="giveaway-celebrate-box">
          <div className="absolute top-2 left-2 text-xl">🎉</div>
          <div className="absolute top-2 right-2 text-xl">✨</div>
          <div className="absolute bottom-2 left-10 text-xl">🎈</div>
          <span className="text-xs uppercase font-extrabold text-yellow-400 tracking-widest font-mono block">SELESAI & DIUNDI!</span>
          <h3 className="text-xl font-bold text-white">Selamat Kepada Pemenang Terpilih!</h3>
          <div className="flex flex-wrap gap-2 justify-center items-center">
            {lastWinGroup.map((w, idx) => (
              <span key={idx} className="bg-yellow-500 text-black font-extrabold px-3 py-1.5 rounded-full text-sm shadow-md font-mono">
                👑 @{w}
              </span>
            ))}
          </div>
          <p className="text-xs text-zinc-300">Hubungi moderator admin di loket bantuan untuk melakukan proses klaim hadiah!</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Setup Form */}
        <div className="lg:col-span-4 bg-[#141b11] border border-[#2d4026] p-6 rounded-2xl space-y-4 shadow-xl">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-[#9fe870] font-bold block uppercase tracking-wider">FORMULIR PENYIAPAN</span>
            <h3 className="font-bold text-white text-base">Buat Giveaway Baru</h3>
            <p className="text-xs text-gray-400">Tentukan hadiah dan biarkan sistem bot melakukan undian.</p>
          </div>

          <form onSubmit={handleStartGiveaway} className="space-y-4 text-xs font-sans">
            <div className="space-y-1">
              <label className="text-xs text-gray-300 font-semibold uppercase">Nama Hadiah / Role Hadiah</label>
              <input
                type="text"
                required
                value={prizeName}
                onChange={(e) => setPrizeName(e.target.value)}
                placeholder="Contoh: 🎁 Akun Premium Geng 1 Bulan"
                className="w-full bg-black/40 border border-[#2d4026] px-3 py-2.5 rounded text-zinc-100 placeholder-zinc-700 outline-none text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-zinc-400 uppercase font-bold font-mono text-[9px]">Jumlah Pemenang</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  required
                  value={winnersCountInput}
                  onChange={(e) => setWinnersCountInput(parseInt(e.target.value) || 1)}
                  className="w-full bg-black/40 border border-[#2d4026] px-3.5 py-2 rounded text-zinc-100 font-mono text-xs focus:border-[#9fe870] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-zinc-400 uppercase font-bold font-mono text-[9px]">Durasi Ambil (Detik)</label>
                <input
                  type="number"
                  min={10}
                  required
                  value={durationInput}
                  onChange={(e) => setDurationInput(parseInt(e.target.value) || 10)}
                  className="w-full bg-black/40 border border-[#2d4026] px-3.5 py-2 rounded text-zinc-100 font-mono text-xs focus:border-[#9fe870] outline-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-black font-extrabold rounded-lg text-xs uppercase tracking-wider duration-150 transform hover:scale-102 flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
              >
                <Plus size={14} />
                <span>Mulai Giveaway Sekarang</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right column: Running & Completed Giveaways lists */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="bg-[#141b11] border border-[#2d4026] rounded-2xl overflow-hidden shadow-xl font-sans text-sm">
            <div className="p-4 bg-black/20 border-b border-[#2d4026] flex items-center justify-between">
              <h4 className="font-bold text-white text-sm">Daftar Undian & Event Terbuka</h4>
              <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
            </div>

            {/* List */}
            <div className="p-4 space-y-4">
              {giveaways.length === 0 ? (
                <p className="text-zinc-650 text-center py-6 italic text-xs">Belum ada rincian giveaway aktif. Buat di sebelah kiri!</p>
              ) : (
                giveaways.map((gw) => (
                  <div 
                    key={gw.id} 
                    className={`p-5 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all ${
                      gw.status === 'RUNNING'
                        ? 'bg-gradient-to-r from-[#172513] to-black/30 border-[#9fe870]/30 shadow-md'
                        : 'bg-black/30 border-[#2d4026]/40 text-gray-300'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-mono tracking-wider font-extrabold ${
                          gw.status === 'RUNNING' 
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                            : 'bg-zinc-800 text-zinc-500 border border-zinc-750'
                        }`}>
                          {gw.status === 'RUNNING' ? '🔥 Berjalan' : '✅ Selesai'}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">ID: {gw.id}</span>
                      </div>

                      <h4 className="text-sm md:text-base font-extrabold text-white">{gw.prize}</h4>
                      
                      {gw.status === 'RUNNING' ? (
                        <div className="flex flex-wrap gap-4 text-xs font-semibold text-zinc-400">
                          <span className="flex items-center gap-1"><Users size={12} className="text-zinc-500" /> {gw.entrantsCount} Calon Peserta</span>
                          <span className="flex items-center gap-1"><Trophy size={12} className="text-yellow-500/80" /> {gw.winnersCount} Pemenang</span>
                        </div>
                      ) : (
                        <div className="text-xs">
                          <span className="text-zinc-500 block uppercase font-mono text-[9px] font-bold">Pemenang Resmi:</span>
                          <div className="flex flex-wrap gap-1 px-1.5 py-1 bg-black/40 rounded mt-1 border border-zinc-900 font-mono text-[#9fe870] font-bold">
                            {gw.winners.length > 0 ? gw.winners.map(w => '@' + w).join(', ') : 'Tidak ada peserta'}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto font-mono">
                      {gw.status === 'RUNNING' ? (
                        <div className="bg-black/50 border border-[#9fe870]/20 rounded-lg px-4 py-2 text-center text-[#9fe870]">
                          <span className="text-[9px] text-zinc-500 uppercase block font-semibold">Tersisa</span>
                          <span className="text-lg font-black animate-pulse">{gw.timeLeft} Detik</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleDeleteCompleted(gw.id)}
                          className="p-2 text-zinc-650 hover:text-red-400 transition-colors"
                        >
                          <Trash size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-yellow-950/20 border border-yellow-800/20 rounded-2xl p-5 flex gap-3 text-xs text-amber-300/80 font-sans shadow">
            <Flame className="text-amber-400 shrink-0" size={16} />
            <p className="leading-relaxed">
              *Ingat: sistem Gacha dan Giveaway ini dirancang multi-fungsi. Jika Anda menggunakan website ini secara mandiri, data tersinkron lokal. Jika dihubungkan ke Express server (PM2/Render), bot akan otomatis mengumumkan hasil pemenang ke Discord channel yang dipilih!
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
