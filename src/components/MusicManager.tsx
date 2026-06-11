import React, { useState, useEffect } from 'react';
import { MusicTrack } from '../types';
import { Music, Play, Pause, SkipForward, Square, Volume2, Plus, Trash2, ListMusic, Save, Radio, Disc, Disc3, ShieldAlert } from 'lucide-react';

interface MusicManagerProps {
  musicEnabled: boolean;
  musicChannelId: string;
  playlist: MusicTrack[];
  updateMusicConfig: (config: {
    musicEnabled: boolean;
    musicChannelId: string;
    playlist: MusicTrack[];
  }) => void;
}

export default function MusicManager({
  musicEnabled,
  musicChannelId,
  playlist,
  updateMusicConfig
}: MusicManagerProps) {
  const [enabled, setEnabled] = useState(musicEnabled);
  const [channelId, setChannelId] = useState(musicChannelId);
  const [tracks, setTracks] = useState<MusicTrack[]>(playlist);

  // New Track Template State
  const [trackTitle, setTrackTitle] = useState('');
  const [trackArtist, setTrackArtist] = useState('');
  const [trackDuration, setTrackDuration] = useState('03:45');
  const [trackUrl, setTrackUrl] = useState('');

  // Audio Node Simulation States
  const [nowPlayingIdx, setNowPlayingIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [progress, setProgress] = useState(30);

  // Mock progress simulation when playing
  useEffect(() => {
    let interval: any;
    if (isPlaying && tracks.length > 0) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            // Auto skip to next track
            handleSkip();
            return 0;
          }
          return prev + 1.5;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, nowPlayingIdx, tracks]);

  const handleUpdateConfig = () => {
    updateMusicConfig({
      musicEnabled: enabled,
      musicChannelId: channelId,
      playlist: tracks
    });
  };

  const handleAddTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackTitle.trim()) return;

    const freshTrack: MusicTrack = {
      id: 'track_' + Math.random().toString(36).substring(2, 9),
      title: trackTitle,
      artist: trackArtist || 'Artis Lokal',
      duration: trackDuration,
      url: trackUrl || 'https://www.youtube.com/',
      thumbnailUrl: `https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=80&auto=format&fit=crop&q=60`
    };

    const updated = [...tracks, freshTrack];
    setTracks(updated);
    updateMusicConfig({
      musicEnabled: enabled,
      musicChannelId: channelId,
      playlist: updated
    });

    // Reset Form
    setTrackTitle('');
    setTrackArtist('');
    setTrackDuration('03:45');
    setTrackUrl('');
  };

  const handleDeleteTrack = (id: string, index: number) => {
    const updated = tracks.filter(t => t.id !== id);
    setTracks(updated);
    updateMusicConfig({
      musicEnabled: enabled,
      musicChannelId: channelId,
      playlist: updated
    });

    if (nowPlayingIdx >= updated.length) {
      setNowPlayingIdx(Math.max(0, updated.length - 1));
    }
  };

  const handlePlayToggle = () => {
    if (tracks.length === 0) return;
    setIsPlaying(!isPlaying);
  };

  const handleSkip = () => {
    if (tracks.length === 0) return;
    setNowPlayingIdx((prev) => (prev + 1) % tracks.length);
    setProgress(0);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  const currentTrack = tracks[nowPlayingIdx] || null;

  return (
    <div className="flex-1 p-6 md:p-8 space-y-6 text-gray-100 overflow-y-auto" id="music-manager-panel">
      {/* Banner */}
      <div className="border-b border-[#2d4026] pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            🎵 Musik DJ Otomatis (Auto DJ Music System)
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Konfigurasikan lagu-lagu hits buatan Anda sendiri, kelola antrean musik bot, dan uji pemutar audio virtual langsung dari panel kontrol.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-semibold font-mono uppercase">Status DJ:</span>
          <button
            onClick={() => {
              setEnabled(!enabled);
              updateMusicConfig({
                musicEnabled: !enabled,
                musicChannelId: channelId,
                playlist: tracks
              });
            }}
            className="focus:outline-none"
          >
            {enabled ? (
              <span className="bg-[#9fe870]/10 border border-[#9fe870]/30 text-[#9fe870] font-bold text-xs uppercase px-3 py-1 rounded-full flex items-center gap-1">
                ● DJ Mengudara
              </span>
            ) : (
              <span className="bg-red-950/20 border border-red-800/40 text-red-400 font-bold text-xs uppercase px-3 py-1 rounded-full flex items-center gap-1">
                ○ DJ Istirahat
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Modern simulated Music Dashboard Audio Player Widget (5 cols) */}
        <div className="lg:col-span-5 bg-[#141b11] border border-[#2d4026] p-6 rounded-2xl flex flex-col justify-between items-center text-center space-y-5 shadow-xl relative overflow-hidden">
          {/* Subtle Ambient Background Flare */}
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#9fe870]/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="w-full text-left">
            <span className="text-[10px] font-mono text-[#9fe870] font-bold block uppercase tracking-wider">LIVE DJ ENGINE</span>
            <h3 className="font-bold text-white text-base">Media Player Simulator</h3>
          </div>

          {/* Disc Rotator Visualization */}
          <div className="relative music-disc-container my-3 select-none">
            <div className={`w-36 h-36 rounded-full bg-zinc-900 border-4 border-zinc-800 flex items-center justify-center shadow-2xl relative ${
              isPlaying ? 'animate-spin' : ''
            }`} style={{ animationDuration: '6s' }}>
              <div className="absolute inset-0 border-4 border-dashed border-zinc-700/30 rounded-full" />
              <div className="w-14 h-14 rounded-full bg-[#1c231a] border-4 border-zinc-950 flex items-center justify-center select-none text-zinc-650">
                <Disc size={20} className="text-[#9fe870]/40" />
              </div>
            </div>
            
            {/* Visual Equalizer Bars Overlay */}
            {isPlaying && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-end gap-0.5 h-6 select-none bg-black/40 px-2 rounded-full border border-white/5">
                <span className="w-1 bg-[#9fe870] animate-bounce" style={{ height: '70%', animationDelay: '0.1s' }} />
                <span className="w-1 bg-green-400 animate-bounce" style={{ height: '50%', animationDelay: '0.3s' }} />
                <span className="w-1 bg-emerald-400 animate-bounce" style={{ height: '90%', animationDelay: '0.2s' }} />
                <span className="w-1 bg-[#9fe870] animate-bounce" style={{ height: '40%', animationDelay: '0.4s' }} />
              </div>
            )}
          </div>

          {/* Current track Meta */}
          <div className="w-full text-center space-y-1">
            {currentTrack ? (
              <>
                <h4 className="font-extrabold text-white text-base truncate px-4">
                  {currentTrack.title}
                </h4>
                <p className="text-zinc-400 text-xs truncate">
                  {currentTrack.artist}
                </p>
                <span className="inline-block px-1.5 py-0.5 bg-black/30 text-[10px] text-zinc-500 font-mono rounded mt-1 select-none">
                  Lagu {nowPlayingIdx + 1} dari {tracks.length}
                </span>
              </>
            ) : (
              <>
                <h4 className="font-semibold text-zinc-500 text-sm">
                  Playlist Kosong
                </h4>
                <p className="text-xs text-zinc-650">
                  Daftarkan trek Anda di sebelah kanan
                </p>
              </>
            )}
          </div>

          {/* Progress slider bar */}
          <div className="w-full space-y-1.5 font-mono text-[10px] text-zinc-400">
            <div className="w-full bg-black/50 h-1.5 rounded-full overflow-hidden relative cursor-pointer" onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickedX = e.clientX - rect.left;
              setProgress((clickedX / rect.width) * 100);
            }}>
              <div className="bg-[#9fe870] h-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex justify-between items-center px-1">
              <span>{currentTrack ? `Played: ${Math.floor((progress/100)*4)} min` : '00:00'}</span>
              <span>{currentTrack ? currentTrack.duration : '00:00'}</span>
            </div>
          </div>

          {/* Controls button deck */}
          <div className="flex items-center gap-4 py-2">
            <button
              onClick={handleStop}
              disabled={tracks.length === 0}
              className="p-2.5 rounded-full bg-zinc-850 hover:bg-zinc-800 hover:text-red-400 text-zinc-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="Stop"
            >
              <Square size={16} />
            </button>

            <button
              onClick={handlePlayToggle}
              disabled={tracks.length === 0}
              className={`p-4 rounded-full transition-transform active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                isPlaying ? 'bg-[#9fe870] text-black hover:bg-green-400' : 'bg-white text-black hover:bg-zinc-200'
              }`}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
            </button>

            <button
              onClick={handleSkip}
              disabled={tracks.length === 0}
              className="p-2.5 rounded-full bg-zinc-850 hover:bg-zinc-800 text-zinc-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="Skip"
            >
              <SkipForward size={16} />
            </button>
          </div>

          {/* Volume controls */}
          <div className="flex items-center gap-2.5 w-full px-4 text-xs font-mono font-bold text-gray-400 select-none">
            <Volume2 size={14} className="text-zinc-500" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(parseInt(e.target.value))}
              className="w-full accent-[#9fe870] h-1 bg-black/40 rounded-lg appearance-none cursor-pointer"
            />
            <span className="w-8 text-right select-none">{volume}%</span>
          </div>
        </div>

        {/* Right: Sound integration config & playlist builder (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          
          {/* Bound integrating channels */}
          <div className="bg-[#141b11] border border-[#2d4026] p-6 rounded-2xl space-y-4 shadow-xl font-sans text-sm">
            <span className="text-[10px] font-mono text-[#9fe870] font-bold block uppercase tracking-wider">SALURAN DJ REKREASIONAL</span>
            <h3 className="font-bold text-white text-base">Saluran Komunikasi DJ</h3>
            
            <div className="space-y-4 text-xs md:text-sm">
              <div className="space-y-1">
                <label className="text-xs text-gray-450 font-semibold uppercase">Channel Teks Pemicu Musik</label>
                <input
                  type="text"
                  value={channelId}
                  onChange={(e) => setChannelId(e.target.value)}
                  placeholder="ID Saluran Obrolan Musik"
                  className="w-full bg-black/40 border border-[#2d4026] px-3.5 py-2 rounded text-zinc-100 placeholder-zinc-700 font-mono text-xs focus:border-[#9fe870] outline-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleUpdateConfig}
                  className="px-4 py-2 bg-[#9fe870] text-black font-extrabold rounded-lg hover:bg-green-400 active:scale-95 transition-all text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <Save size={13} />
                  <span>Simpan Saluran DJ</span>
                </button>
              </div>
            </div>
          </div>

          {/* New song registraton Form */}
          <div className="bg-[#1c231a] border border-[#2d4026]/80 p-6 rounded-2xl space-y-4 shadow-xl font-sans text-sm">
            <span className="text-[10px] font-mono text-yellow-400 font-bold block uppercase tracking-wider">TREK BARU</span>
            <h3 className="font-bold text-white text-base">Daftarkan Lagu ke Diskografi Server</h3>

            <form onSubmit={handleAddTrack} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs md:text-sm">
              <div className="space-y-1">
                <label className="text-xs text-gray-300 font-semibold uppercase">Judul Lagu</label>
                <input
                  type="text"
                  required
                  value={trackTitle}
                  onChange={(e) => setTrackTitle(e.target.value)}
                  placeholder="Contoh: Kopi Dangdut / Blue Bird"
                  className="w-full bg-black/40 border border-[#2d4026] px-3 py-2 rounded text-zinc-100 placeholder-zinc-650 focus:border-[#9fe870] outline-none text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-300 font-semibold uppercase">Artis / Penyanyi</label>
                <input
                  type="text"
                  value={trackArtist}
                  onChange={(e) => setTrackArtist(e.target.value)}
                  placeholder="Contoh: Fahmi Shahab / Ikimonogakari"
                  className="w-full bg-black/40 border border-[#2d4026] px-3 py-2 rounded text-zinc-100 placeholder-zinc-650 focus:border-[#9fe870] outline-none text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-300 font-semibold uppercase">Durasi Trek</label>
                <input
                  type="text"
                  required
                  value={trackDuration}
                  onChange={(e) => setTrackDuration(e.target.value)}
                  placeholder="Contoh: 04:12"
                  className="w-full bg-black/40 border border-[#2d4026] px-3 py-2 rounded text-zinc-100 placeholder-zinc-650 focus:border-[#9fe870] outline-none text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-300 font-semibold uppercase">Tautan Youtube / MP3 (Opsional)</label>
                <input
                  type="url"
                  value={trackUrl}
                  onChange={(e) => setTrackUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full bg-black/40 border border-[#2d4026] px-3 py-2 rounded text-zinc-100 placeholder-zinc-650 focus:border-[#9fe870] outline-none text-xs font-mono"
                />
              </div>

              <div className="sm:col-span-2 pt-1">
                <button
                  type="submit"
                  className="w-full py-2 bg-gradient-to-r from-green-700 to-emerald-700 text-white hover:from-green-650 hover:to-emerald-650 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 shadow-md"
                >
                  <Plus size={14} />
                  <span>Sematkan ke Diskografi DJ</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Playlist tracks table */}
      <div className="bg-[#141b11] border border-[#2d4026] rounded-2xl overflow-hidden shadow-xl font-sans">
        <div className="p-4 bg-black/20 border-b border-[#2d4026] flex items-center justify-between">
          <h4 className="font-bold text-white text-sm">Daftar Antrean & Diskografi Server ({tracks.length})</h4>
          <span className="text-[10px] text-[#9fe870] font-mono">Sinkronisasi Pemutaran DJ</span>
        </div>

        <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
          {tracks.length === 0 ? (
            <div className="text-center p-8 space-y-1 italic text-zinc-550 text-xs">
              <ListMusic size={26} className="mx-auto text-zinc-600 block mb-1" />
              Trek lagu kosong. Daftarkan lagu di panel atas untuk mendengarkan!
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-black/40 text-gray-400 border-b border-zinc-800 font-medium">
                  <th className="p-4">Track Status</th>
                  <th className="p-4">Judul Lagu</th>
                  <th className="p-4">Artis / Penyanyi</th>
                  <th className="p-4">Durasi</th>
                  <th className="p-4 text-right">Opsi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/40">
                {tracks.map((t, idx) => (
                  <tr
                    key={t.id}
                    className={`transition-colors cursor-pointer ${
                      nowPlayingIdx === idx
                        ? 'bg-[#182315] hover:bg-[#1f2e1a] font-bold text-white'
                        : 'hover:bg-zinc-850/15 text-zinc-350'
                    }`}
                    onClick={() => {
                      setNowPlayingIdx(idx);
                      setProgress(0);
                    }}
                  >
                    <td className="p-4">
                      {nowPlayingIdx === idx ? (
                        <span className="text-xs text-[#9fe870] font-mono animate-pulse uppercase">
                          ▶ Now Playing
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-500 font-mono">
                          Trek #{idx + 1}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`${nowPlayingIdx === idx ? 'text-white' : 'text-zinc-200'}`}>{t.title}</span>
                    </td>
                    <td className="p-4 text-zinc-400">{t.artist}</td>
                    <td className="p-4 font-mono text-zinc-300 font-semibold">{t.duration}</td>
                    <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleDeleteTrack(t.id, idx)}
                        className="p-1 hover:bg-red-950/45 text-red-400 hover:text-red-300 rounded cursor-pointer transition-colors"
                        title="Hapus Lagu"
                      >
                        <Trash2 size={13} />
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
