import React, { useState } from 'react';
import { Send, Copy, Check, Eye, Sliders, AlertTriangle } from 'lucide-react';

interface EmbedData {
  title: string;
  description: string;
  color: string;
  authorName: string;
  authorIcon: string;
  thumbnail: string;
  image: string;
  footer: string;
  footerIcon: string;
}

interface EmbedBuilderProps {
  addLog: (type: 'info' | 'success' | 'warn' | 'error', source: 'Server' | 'Bot', message: string) => void;
}

export default function EmbedBuilder({ addLog }: EmbedBuilderProps) {
  const [embed, setEmbed] = useState<EmbedData>({
    title: '📢 Event Turnamen Geng Indo Ramadan Cup!',
    description: 'Mari daftarkan skuad terbaik warga mabar di turnamen Mobile Legends tahunan server Gang Indo!\n\n🏆 **Hadiah Utama:** Rp 2.500.000 + Rol Istimewa *Sultan Server*!\n📅 **Tanggal Mulai:** 18 Juni 2026\n📝 **Biaya Registrasi:** GRATIS khusus seluruh warga bersertifikat KTP Virtual!\n\nKlik tombol di bawah untuk mengisi formulir pendaftaran di loket.',
    color: '#9fe870',
    authorName: 'Ketua Pengurus Kampung Gang Indo',
    authorIcon: 'https://api.dicebear.com/7.x/bottts/svg?seed=gangbot',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=120&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80',
    footer: 'Dikelola secara aman oleh Gang Indo Staff Engine',
    footerIcon: 'https://api.dicebear.com/7.x/bottts/svg?seed=gangbot'
  });

  const [copiedCode, setCopiedCode] = useState(false);
  const [targetChannel, setTargetChannel] = useState('💬 general-obrolan');

  const jsonCode = JSON.stringify({
    content: null,
    embeds: [{
      title: embed.title,
      description: embed.description,
      color: parseInt(embed.color.replace('#', ''), 16) || 10479728,
      author: embed.authorName ? { name: embed.authorName, icon_url: embed.authorIcon || null } : null,
      thumbnail: embed.thumbnail ? { url: embed.thumbnail } : null,
      image: embed.image ? { url: embed.image } : null,
      footer: embed.footer ? { text: embed.footer, icon_url: embed.footerIcon || null } : null,
      timestamp: new Date().toISOString()
    }],
    attachments: []
  }, null, 2);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(jsonCode);
    setCopiedCode(true);
    addLog('info', 'Server', 'Konfigurasi JSON Embed berhasil disalin ke clipboard Anda!');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSendEmbed = () => {
    addLog('success', 'Bot', `Broadcasting EMBED MESSAGE: "${embed.title}" berhasil terkirim ke saluran ${targetChannel}!`);
    alert(`Sukses! Simulasi siaran pengumuman ke channel "${targetChannel}" berhasil dieksekusi secara instan!`);
  };

  return (
    <div className="flex-1 p-6 md:p-8 space-y-6 text-gray-100 overflow-y-auto" id="embed-builder-panel">
      {/* Page Header */}
      <div className="border-b border-[#2d4026] pb-5">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          📢 Generator Desain visual Embed (Discord Rich Messages)
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Kustomisasi visual pengumuman, poster, partnership banner dengan representasi replika nyata interface Discord di sisi browser secara interaktif.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Inputs Fields Form */}
        <div className="xl:col-span-6 bg-[#141b11] border border-[#2d4026] p-6 rounded-2xl space-y-5 shadow-2xl font-sans text-sm">
          <div className="flex items-center gap-1.5 border-b border-[#2d4026]/40 pb-3">
            <Sliders className="text-[#9fe870]" size={16} />
            <h3 className="font-bold text-white text-base">Konfigurator Layout & Konten</h3>
          </div>

          <div className="space-y-4 text-xs md:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-gray-300 font-semibold uppercase">Nama Penulis (Author)</label>
                <input
                  type="text"
                  value={embed.authorName}
                  onChange={(e) => setEmbed({ ...embed, authorName: e.target.value })}
                  placeholder="Ketua RT Geng Indo"
                  className="w-full bg-black/40 border border-[#2d4026] px-3 py-2 rounded text-zinc-100 focus:border-[#9fe870] outline-none text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-300 font-semibold uppercase">Avatar Penulis URL</label>
                <input
                  type="text"
                  value={embed.authorIcon}
                  onChange={(e) => setEmbed({ ...embed, authorIcon: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-black/40 border border-[#2d4026] px-3 py-2 rounded text-zinc-100 focus:border-[#9fe870] outline-none text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-8 space-y-1">
                <label className="text-xs text-gray-300 font-semibold uppercase">Judul Utama (Title)</label>
                <input
                  type="text"
                  value={embed.title}
                  onChange={(e) => setEmbed({ ...embed, title: e.target.value })}
                  placeholder="Undangan Selamatan Geng"
                  className="w-full bg-black/40 border border-[#2d4026] px-3 py-2 rounded text-zinc-100 focus:border-[#9fe870] outline-none text-xs"
                />
              </div>

              <div className="sm:col-span-4 space-y-1">
                <label className="text-xs text-gray-300 font-semibold uppercase">Warna Strip (Hex Color)</label>
                <div className="flex gap-1">
                  <input
                    type="color"
                    value={embed.color}
                    onChange={(e) => setEmbed({ ...embed, color: e.target.value })}
                    className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={embed.color}
                    onChange={(e) => setEmbed({ ...embed, color: e.target.value })}
                    className="flex-1 bg-black/40 border border-[#2d4026] px-2.5 rounded text-zinc-100 focus:border-[#9fe870] outline-none text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-300 font-semibold uppercase">Isi Pesan Deskripsi (Mendukung Markdown)</label>
              <textarea
                rows={5}
                value={embed.description}
                onChange={(e) => setEmbed({ ...embed, description: e.target.value })}
                placeholder="Tuliskan berita penting..."
                className="w-full bg-black/40 border border-[#2d4026] px-3 py-2 rounded text-zinc-100 focus:border-[#9fe870] outline-none text-xs font-sans leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-gray-300 font-semibold uppercase">Gambar Mini URL (Thumbnail)</label>
                <input
                  type="text"
                  value={embed.thumbnail}
                  onChange={(e) => setEmbed({ ...embed, thumbnail: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-black/40 border border-[#2d4026] px-3 py-2 rounded text-zinc-100 focus:border-[#9fe870] outline-none text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-300 font-semibold uppercase">Gambar Utama URL (Center Image)</label>
                <input
                  type="text"
                  value={embed.image}
                  onChange={(e) => setEmbed({ ...embed, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-black/40 border border-[#2d4026] px-3 py-2 rounded text-zinc-100 focus:border-[#9fe870] outline-none text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-gray-300 font-semibold uppercase">Kaki Embed (Footer Text)</label>
                <input
                  type="text"
                  value={embed.footer}
                  onChange={(e) => setEmbed({ ...embed, footer: e.target.value })}
                  placeholder="Event Selesai 2026"
                  className="w-full bg-black/40 border border-[#2d4026] px-3 py-2 rounded text-zinc-100 focus:border-[#9fe870] outline-none text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-300 font-semibold uppercase">Footer Mini Icon URL</label>
                <input
                  type="text"
                  value={embed.footerIcon}
                  onChange={(e) => setEmbed({ ...embed, footerIcon: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-black/40 border border-[#2d4026] px-3 py-2 rounded text-zinc-100 focus:border-[#9fe870] outline-none text-xs font-mono"
                />
              </div>
            </div>

            {/* Target & Action Panel */}
            <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center gap-3">
              <div className="w-full sm:w-1/2 space-y-1">
                <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Salurkan Ke Channel</label>
                <select
                  value={targetChannel}
                  onChange={(e) => setTargetChannel(e.target.value)}
                  className="w-full bg-black/60 border border-[#2d4026] p-2 rounded text-zinc-300 text-xs focus:border-[#9fe870] outline-none"
                >
                  <option value="💬 general-obrolan">💬 general-obrolan</option>
                  <option value="📢 pengumuman-server">📢 pengumuman-server</option>
                  <option value="🎟️ loket-bantuan">🎟️ loket-bantuan</option>
                  <option value="📂 lobi-ktp">📂 lobi-ktp</option>
                </select>
              </div>

              <div className="w-full sm:w-1/2 flex gap-2 pt-5">
                <button
                  onClick={handleSendEmbed}
                  className="flex-1 py-2 bg-gradient-to-r from-blue-700 to-[#10b981] hover:from-blue-650 hover:to-emerald-500 text-white font-extrabold rounded-lg text-xs uppercase tracking-wider duration-150 transform hover:scale-102 flex items-center justify-center gap-1 cursor-pointer shadow-md"
                >
                  <Send size={12} />
                  <span>Kirim Live</span>
                </button>

                <button
                  onClick={handleCopyCode}
                  className="py-2 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold rounded-lg text-xs uppercase tracking-wider duration-150 flex items-center justify-center gap-1 cursor-pointer border border-[#2d4026]/40"
                >
                  {copiedCode ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                  <span>{copiedCode ? 'Disalin' : 'JSON'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Discord Realistic Chat Mockup Render */}
        <div className="xl:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
              <Eye size={13} className="text-[#9fe870]" />
              Discord Desktop Client Previewer
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">Channel: # {targetChannel.split(' ')[1]}</span>
          </div>

          {/* Realistic Discord UI Panel */}
          <div className="bg-[#313338] border border-black/20 rounded-2xl overflow-hidden shadow-2xl font-sans select-none">
            
            {/* Server Top Header Channel Bar */}
            <div className="h-12 bg-[#313338] border-b border-[#1f2023] px-4 flex items-center justify-between text-zinc-200 font-bold text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-zinc-400 font-light text-xl">#</span>
                <span className="text-white font-semibold font-sans tracking-wide">{targetChannel.split(' ')[1]}</span>
                <span className="h-3 w-[1px] bg-[#3f4147]" />
                <span className="text-xs text-zinc-400 font-normal">Selamat datang di saluran resmi Gang Indo Bot!</span>
              </div>
            </div>

            {/* Chat message flow container */}
            <div className="p-4 md:p-6 space-y-4 min-h-[420px] bg-[#313338]">
              
              {/* Message Entry Block */}
              <div className="flex items-start space-x-4">
                {/* Bot Avatar */}
                <img
                  src={embed.authorIcon || 'https://api.dicebear.com/7.x/bottts/svg?seed=gangbot'}
                  alt="avatar"
                  className="h-10 w-10 rounded-full bg-[#1e231c] shrink-0 object-cover"
                  referrerPolicy="no-referrer"
                />

                {/* Sender Title details */}
                <div className="flex-grow space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-white hover:underline font-semibold font-sans text-sm cursor-pointer">
                      Gang Indo Bot
                    </span>
                    <span className="bg-[#5865f2] text-white font-bold px-1 py-0.5 rounded text-[9px] uppercase tracking-wider scale-90 select-none">
                      BOT
                    </span>
                    <span className="text-[10px] text-zinc-400 font-sans">
                      Hari ini pukul {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* EMBED WRAPPER BODY CARD */}
                  <div 
                    className="rounded bg-[#2b2d31] overflow-hidden border-l-[4px] max-w-lg transition-colors shadow-md"
                    style={{ borderLeftColor: embed.color || '#9fe870' }}
                  >
                    <div className="p-4 space-y-3 font-sans text-zinc-300">
                      
                      {/* Embed Author */}
                      {embed.authorName && (
                        <div className="flex items-center space-x-2 text-xs text-white font-semibold leading-none">
                          {embed.authorIcon && (
                            <img
                              src={embed.authorIcon}
                              alt="author icon"
                              className="h-5 w-5 rounded-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          )}
                          <span className="hover:underline cursor-pointer">{embed.authorName}</span>
                        </div>
                      )}

                      {/* Embed Content Area split (Title + desc + optional thumbnail) */}
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1.5 flex-grow">
                          {embed.title && (
                            <a
                              href="#link"
                              className="text-white text-sm md:text-base font-bold font-sans tracking-wide leading-snug hover:underline block cursor-pointer transition-colors"
                              style={{ color: '#00b0f4' }}
                            >
                              {embed.title}
                            </a>
                          )}

                          {embed.description && (
                            <p className="text-xs text-[#dbdee1] leading-relaxed break-words whitespace-pre-wrap font-sans">
                              {embed.description.split('\n').map((line, lIdx) => {
                                // Bold parsing emulator
                                let processedStr = line;
                                processedStr = processedStr.replace(/\*\*(.*?)\*\*/g, '$1');
                                return <span key={lIdx} className="block mt-1">{processedStr}</span>;
                              })}
                            </p>
                          )}
                        </div>

                        {embed.thumbnail && (
                          <img
                            src={embed.thumbnail}
                            alt="thumbnail image"
                            className="w-16 h-16 md:w-20 md:h-20 rounded-lg shrink-0 object-cover border border-white/5"
                            onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                            referrerPolicy="no-referrer"
                          />
                        )}
                      </div>

                      {/* Main Big Embed Image */}
                      {embed.image && (
                        <div className="mt-2 text-center rounded-lg overflow-hidden border border-white/5">
                          <img
                            src={embed.image}
                            alt="main attachment image"
                            className="max-h-60 w-full object-cover rounded"
                            onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}

                      {/* Embed Footer Row */}
                      {embed.footer && (
                        <div className="flex items-center space-x-1.5 text-[10px] text-[#dbdee1]/70 select-none pt-1">
                          {embed.footerIcon && (
                            <img
                              src={embed.footerIcon}
                              alt="footer logo thumbnail"
                              className="h-4 w-4 rounded-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          )}
                          <span>{embed.footer}</span>
                        </div>
                      )}

                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* Simulated Chat Input Prompt bar Discord */}
            <div className="p-4 bg-[#313338] border-t border-[#3b3e45]/20 flex items-center justify-between text-zinc-500 font-sans text-xs">
              <span className="text-zinc-500">Kirim di # {targetChannel.split(' ')[1]} tidak diizinkan di mode editor.</span>
              <span className="font-mono text-[9px] bg-red-950/40 text-red-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-widest border border-red-800/10">PREVIEW ONLY</span>
            </div>

          </div>

          {/* Warn notice block */}
          <div className="bg-blue-950/20 border border-blue-900/30 rounded-xl p-4 flex gap-3 text-xs text-blue-300 font-sans shadow">
            <AlertTriangle className="text-blue-400 shrink-0" size={16} />
            <p className="leading-relaxed">
              Anda juga dapat menyalin **JSON Config** di card ini dan menempelkannya di bot discord populer lainnya seperti *Carl-Bot*, *YAGPDB*, atau *Dyno-bot* milik server nyata Anda secara gratis!
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
