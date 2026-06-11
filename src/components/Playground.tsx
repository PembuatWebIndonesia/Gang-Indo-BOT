import React, { useState, useRef, useEffect } from 'react';
import { COMMANDS_DATA } from '../data/commands';
import { KtpRecord, GachaRole, NicknameDecoration } from '../types';
import KtpCard from './KtpCard';
import { Send, Hash, CornerDownLeft, Bot, AlertCircle, Sparkles, Check, ChevronUp, RefreshCw, LogIn } from 'lucide-react';

interface PlaygroundProps {
  citizens: KtpRecord[];
  addCitizen: (rec: KtpRecord) => void;
  gachaRoles: GachaRole[];
  botToken: string;
  nicknameDecorations?: NicknameDecoration[];
}

interface ChatMessage {
  id: string;
  author: {
    name: string;
    avatar: string;
    isBot: boolean;
    roleColor?: string;
  };
  content?: string;
  timestamp: string;
  embeds?: {
    title?: string;
    description?: string;
    color?: string;
    fields?: { name: string; value: string; inline?: boolean }[];
    ktpRecord?: KtpRecord;
    gachaWinner?: { role: string; rarity: string; color: string; description: string };
  }[];
  interactiveButtons?: {
    label: string;
    style: 'primary' | 'secondary' | 'success' | 'danger';
    onClick: () => void;
  }[];
}

export default function Playground({ citizens, addCitizen, gachaRoles, botToken, nicknameDecorations = [] }: PlaygroundProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showAutoComplete, setShowAutoComplete] = useState(false);
  const [activeCommandIndex, setActiveCommandIndex] = useState(0);
  const [showKtpModal, setShowKtpModal] = useState(false);
  const [isLoadingGemini, setIsLoadingGemini] = useState(false);

  // KTP Modal Form States
  const [ktpForm, setKtpForm] = useState({
    fullname: '',
    gender: 'Laki-laki' as 'Laki-laki' | 'Perempuan',
    address: '',
    religion: 'Islam',
    hobby: '',
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Helper to append a message safely
  const appendMessage = (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const fresh: ChatMessage = {
      ...msg,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, fresh]);
  };

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      appendMessage({
        author: {
          name: 'Gang Indo Bot',
          avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=gangbot',
          isBot: true,
          roleColor: '#9fe870',
        },
        content: 'Halo kawan! Selamat datang di **Konsol Gang Indo Bot Playground**.\nKetikkan `/` di kolom chat di bawah untuk mencari atau mencoba salah satu dari **70+ Perintah Canggih** milik bot profesional ini!\n\nUntuk memulai membuat KTP Virtual server, jalankan perintah `/setup-ktp` atau `/setup-gachanasib` untuk memasang instrumen gokil!',
      });
    }
  }, []);

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Command list filtered by input matching (excluding the starting slash)
  const query = inputValue.startsWith('/') ? inputValue.slice(1) : '';
  const filteredCommands = COMMANDS_DATA.filter(cmd =>
    cmd.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 7);

  // Handle keyboard interaction for autocomplete
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showAutoComplete && filteredCommands.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveCommandIndex((prev) => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveCommandIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        selectCommand(filteredCommands[activeCommandIndex]);
      } else if (e.key === 'Escape') {
        setShowAutoComplete(false);
      }
    }
  };

  const selectCommand = (cmd: typeof COMMANDS_DATA[0]) => {
    setInputValue(`/${cmd.name}`);
    setShowAutoComplete(false);
  };

  // Run the commands logic
  const handleSendCommand = async () => {
    if (!inputValue.trim()) return;
    const currentInput = inputValue.trim();
    setInputValue('');
    setShowAutoComplete(false);

    // 1. Post User message
    appendMessage({
      author: {
        name: 'Kamu (Administrator)',
        avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=novi',
        isBot: false,
      },
      content: currentInput,
    });

    // 2. Identify if it's a Slash Command
    if (currentInput.startsWith('/')) {
      const parts = currentInput.slice(1).split(' ');
      const cmdName = parts[0].toLowerCase();
      const argsStr = parts.slice(1).join(' ');

      // Find command definition
      const cmdDef = COMMANDS_DATA.find(c => c.name === cmdName);

      if (!cmdDef) {
        setTimeout(() => {
          appendMessage({
            author: {
              name: 'Sistem Bot',
              avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=gangbot',
              isBot: true,
              roleColor: '#ff4d4d',
            },
            content: `❌ Perintah \`/${cmdName}\` tidak dikenali oleh Gang Indo Bot. Ketik \`/help\` untuk panduan lengkap.`,
          });
        }, 600);
        return;
      }

      // Action Handlers
      if (cmdName === 'setup-ktp') {
        setTimeout(() => {
          appendMessage({
            author: {
              name: 'Gang Indo Bot',
              avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=gangbot',
              isBot: true,
              roleColor: '#9fe870',
            },
            embeds: [{
              title: '📇 Buat KTP Virtual Kamu!',
              description: 'Klik tombol di bawah untuk membuat **Kartu Tanda Penduduk** virtualmu di server ini.\n\n**KTP berisi:**\n• 👤 Nama Lengkap\n• ⚧️ Jenis Kelamin\n• 🏡 Domisili / Alamat\n• 🕌 Agama\n• 🎯 Hobi\n\n✅ Setelah membuat KTP, kamu akan otomatis diberi role **Warga**!\n\n*Data yang kamu masukkan bukan data asli diri Anda, melainkan hanya untuk kebutuhan server saja!*',
              color: '#d4af37',
            }],
            interactiveButtons: [{
              label: '📝 Buat KTP Saya',
              style: 'primary',
              onClick: () => setShowKtpModal(true),
            }]
          });
        }, 700);
      } 
      else if (cmdName === 'setup-gachanasib') {
        setTimeout(() => {
          appendMessage({
            author: {
              name: 'Gang Indo Bot',
              avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=gangbot',
              isBot: true,
              roleColor: '#9fe870',
            },
            embeds: [
              {
                title: '🔮 GACHAROLE NASIB SERVER!',
                description: 'Coba peruntungan nasib kamu di server ini! Klik tombol gacha di bawah untuk mendapatkan role prestisius secara acak berbasis rincian Rarity.\n\n**Rincian Keberuntungan:**\n• ⚪ **Common Role (Kepala Keluarga / Sipil):** 60% probability\n• 🟢 **Rare Role (Begal Senior / Intel):** 30% probability\n• 🔵 **Epic Role (Hacker Kampung / Lurah):** 8% probability\n• 🟣 **Legendary Role (Bandar Judi / Sultan):** 1.9% probability\n• 🟡 **Divine Role (Dewa Angit / Admin Ganteng):** 0.1% probability\n\n*Gacha role nasib ini menggunakan status role discord.*',
                color: '#a855f7',
              }
            ],
            interactiveButtons: [
              {
                label: '🎲 Gacha Nasib Saya Sekarang',
                style: 'secondary',
                onClick: triggerGachaRoll,
              }
            ]
          });
        }, 700);
      }
      else if (cmdName === 'setup-ticket') {
        setTimeout(() => {
          appendMessage({
            author: {
              name: 'Gang Indo Bot',
              avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=gangbot',
              isBot: true,
              roleColor: '#9fe870',
            },
            embeds: [{
              title: '🎟️ Loket Layanan & Kemitraan (Ticket Center)',
              description: 'Butuh bantuan? Ingin mengajukan kemitraan (partnership) dengan Geng Indo, melaporkan warga nakal, atau menanyakan perihal donasi premium?\n\nSilakan klik tombol di bawah untuk membuat saluran bantuan khusus obrolan bersama staff kami.',
              color: '#3b82f6',
            }],
            interactiveButtons: [{
              label: '🎫 Buka Bantuan Sekarang',
              style: 'primary',
              onClick: () => {
                const updatedLogsMsg = "Memicu simulasi support tiket dari playground!";
                console.log(updatedLogsMsg);
              }
            }]
          });
        }, 600);
      }
      else if (cmdName === 'play') {
        const songName = argsStr || 'Kopi Dangdut';
        setTimeout(() => {
          appendMessage({
            author: { name: 'Gang Indo Bot', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=gangbot', isBot: true, roleColor: '#9fe870' },
            content: `🔊 **Memutar trek musik:** \`${songName}\` 🎵 di saluran suara virtual Anda!\n\n*Gunakan tab **Musik DJ Otomatis** di menu dashboard untuk manajemen antrian & kontrol volume yang komplit.*`,
          });
        }, 600);
      }
      else if (cmdName === 'playlist') {
        setTimeout(() => {
          appendMessage({
            author: { name: 'Gang Indo Bot', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=gangbot', isBot: true, roleColor: '#9fe870' },
            embeds: [{
              title: '🎵 Diskografi DJ Server Aktif',
              description: `1. ☕ **Kopi Dangdut** - Fahmi Shahab (04:12)\n2. 🐦 **Blue Bird (Naruto)** - Ikimonogakari (03:36)\n3. 🇮🇩 **Indonesia Pusaka (Lofi)** - DJ Nusantara (03:15)\n\n*Untuk mengedit atau menambah lagu kustom, kunjungi tab **Musik DJ Otomatis**.*`,
              color: '#10b981'
            }]
          });
        }, 600);
      }
      else if (cmdName === 'tanya-ai') {
        if (!argsStr) {
          setTimeout(() => {
            appendMessage({
              author: { name: 'Gang Indo Bot', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=gangbot', isBot: true, roleColor: '#9fe870' },
              content: '⚠️ Harap sertakan pertanyaan Anda! Contoh: `/tanya-ai Tolong buatkan visi misi untuk geng server kita`',
            });
          }, 300);
          return;
        }

        setIsLoadingGemini(true);
        // Call backend server express route which proxies to Gemini
        try {
          const res = await fetch('/api/gemini/tanya-ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: argsStr, token: botToken }),
          });
          const data = await res.json();
          setIsLoadingGemini(false);

          appendMessage({
            author: {
              name: 'Gang Indo Bot [AI-Pro]',
              avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=gangbot',
              isBot: true,
              roleColor: '#3b82f6',
            },
            content: `🤖 **Hasil Analisis Gemini AI:**\n\n${data.response}`,
          });
        } catch (error) {
          setIsLoadingGemini(false);
          appendMessage({
            author: { name: 'Gang Indo Bot', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=gangbot', isBot: true, roleColor: '#9fe870' },
            content: `🤖 **Model Gemini Assistant:**\n\nMenjawab secara lokal: Sangat menarik! Pertanyaan Anda tentang "${argsStr}" menunjukkan kemajuan pesat. Silakan hubungkan Kunci API Gemini Anda di server panel untuk kualitas optimal!`,
          });
        }
      }
      else {
        // Simple mock trigger for other 70+ commands
        setTimeout(() => {
          const rawResp = cmdDef.exampleResponse;
          const resp = Array.isArray(rawResp) ? rawResp.join('\n') : rawResp;
          appendMessage({
            author: {
              name: 'Gang Indo Bot',
              avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=gangbot',
              isBot: true,
              roleColor: '#9fe870',
            },
            content: resp,
          });
        }, 600);
      }
    }
  };

  const submitKtpModal = (e: React.FormEvent) => {
    e.preventDefault();
    setShowKtpModal(false);

    const generatedId = '670402' + Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const today = new Date();
    const formattedDate = today.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, ' - ');

    const newRec: KtpRecord = {
      id: generatedId,
      userId: '1423089077' + Math.floor(Math.random() * 1000),
      username: 'novirahmiati_warga',
      fullname: ktpForm.fullname,
      gender: ktpForm.gender,
      address: ktpForm.address,
      religion: ktpForm.religion,
      hobby: ktpForm.hobby,
      avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${ktpForm.fullname}`,
      createdAt: formattedDate,
    };

    // Store in citizens hook
    addCitizen(newRec);

    // Append announcement in simulated discord
    appendMessage({
      author: {
        name: 'Sistem Server',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=system',
        isBot: true,
      },
      content: `🎉 **Selamat!** <@1423089077032> baru saja resmi mendaftar sebagai **Warga** server kita! KTP Virtual Anda telah terarsip otomatis di channel #arsip-ktp.`,
    });

    // Share KTP card itself in embed
    appendMessage({
      author: {
        name: 'Gang Indo Bot',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=gangbot',
        isBot: true,
        roleColor: '#9fe870',
      },
      embeds: [{
        title: '📇 Kartu Tanda Penduduk Tercetak!',
        description: `Berikut KTP Virtual resmi milik **${ktpForm.fullname}** yang tersimpan aman di database server:`,
        ktpRecord: newRec,
        color: '#10b981',
      }]
    });
  };

  // Role Gacha roll mechanism
  const triggerGachaRoll = () => {
    // Standard weighted choice
    const rollValue = Math.random() * 100;
    let selected: GachaRole;

    if (rollValue < 0.1) {
      selected = gachaRoles.find(r => r.rarity === 'Divine') || gachaRoles[4];
    } else if (rollValue < 2.0) {
      selected = gachaRoles.find(r => r.rarity === 'Legendary') || gachaRoles[3];
    } else if (rollValue < 10.0) {
      selected = gachaRoles.find(r => r.rarity === 'Epic') || gachaRoles[2];
    } else if (rollValue < 40.0) {
      selected = gachaRoles.find(r => r.rarity === 'Rare') || gachaRoles[1];
    } else {
      selected = gachaRoles.find(r => r.rarity === 'Common') || gachaRoles[0];
    }

    appendMessage({
      author: { name: 'Gang Indo Bot', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=gangbot', isBot: true, roleColor: '#9fe870' },
      content: '🎲 *Memutar roda takdir nasib... Mengocok database role server...*'
    });

    setTimeout(() => {
      // Find matching decoration for winner rarity limit
      const matchingDec = nicknameDecorations.find(d => d.active && d.rarityNeeded === selected.rarity);
      const testName = 'kicau';
      const decoratedPrefix = matchingDec ? `${matchingDec.prefix}${testName}${matchingDec.suffix}` : testName;

      appendMessage({
        author: {
          name: 'Gang Indo Bot',
          avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=gangbot',
          isBot: true,
          roleColor: '#9fe870',
        },
        embeds: [{
          title: '🔮 Hasil Gacha Nasib Server!',
          description: `Gacha sukses dilakukan oleh **<@1423089077032>**!\n\nNama panggilan server diubah menjadi kustom:\n🔖 **\`${decoratedPrefix}\`**\n\nAnda mendapat Keberuntungan Rarity **[${selected.rarity}]** dan resmi diberikan role:`,
          gachaWinner: {
            role: selected.roleName,
            rarity: selected.rarity,
            color: selected.color,
            description: selected.rarity === 'Divine' ? 'Menakjubkan! Anda mendapat status dewa pelindung bumi!' : 
                         selected.rarity === 'Legendary' ? 'Fantastis! Role kelas berat nan mahal harganya.' : 'Rakyat biasa, bersyukurlah atas jatah rezeki hari ini kawan.'
          },
          color: selected.rarity === 'Divine' ? '#eab308' : selected.rarity === 'Legendary' ? '#a855f7' : selected.rarity === 'Epic' ? '#3b82f6' : '#10b981',
        }]
      });
    }, 1500);
  };

  useEffect(() => {
    if (inputValue.startsWith('/')) {
      setShowAutoComplete(true);
    } else {
      setShowAutoComplete(false);
    }
  }, [inputValue]);

  return (
    <div className="flex-1 flex flex-col bg-[#313338] overflow-hidden" id="playground-panel">
      {/* Target channel header bar */}
      <div className="h-14 border-b border-[#1f2023] px-6 flex items-center justify-between bg-[#313338] relative z-10 shrink-0 shadow">
        <div className="flex items-center space-x-3">
          <Hash className="text-gray-400" size={20} />
          <span className="font-bold text-white text-sm">konsol-gang-bot</span>
          <span className="text-xs text-gray-400 border-l border-zinc-700 pl-3 hidden md:inline">
            Sandbox Simulator Perintah Instan & Interaktif
          </span>
        </div>
        <div className="bg-black/40 border border-[#2d4026] text-[10px] text-[#9fe870] font-mono px-2 py-1 rounded hidden lg:block">
          MOD DEBUGER LIVE
        </div>
      </div>

      {/* Message space */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ background: '#313338' }}>
        {messages.map((msg) => (
          <div key={msg.id} className="flex items-start space-x-4 hover:bg-[#2e3035]/40 p-1.5 -mx-3 px-3 rounded-lg group transition-colors">
            <img
              src={msg.author.avatar}
              alt=""
              className="w-10 h-10 rounded-full bg-[#1e1f22] border border-zinc-700 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 space-y-1 overflow-hidden">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-white text-sm hover:underline cursor-pointer" style={{ color: msg.author.roleColor }}>
                  {msg.author.name}
                </span>
                {msg.author.isBot && (
                  <span className="bg-[#5865f2] text-white text-[9px] font-bold px-1 py-0.5 rounded uppercase font-sans tracking-wide">
                    APP
                  </span>
                )}
                <span className="text-xs text-zinc-400 font-medium">Hari ini pukul {msg.timestamp}</span>
              </div>
              
              {msg.content && (
                <p className="text-zinc-200 text-sm leading-relaxed whitespace-pre-wrap break-words border-l-2 border-transparent pl-1 font-sans">
                  {msg.content}
                </p>
              )}

              {/* Message embeds (discord typical) */}
              {msg.embeds && msg.embeds.map((emb, eIdx) => (
                <div
                  key={eIdx}
                  className="max-w-xl bg-[#2b2d31] rounded border-l-4 p-4 mt-2 shadow-md space-y-2 relative"
                  style={{ borderColor: emb.color || '#9fe870' }}
                >
                  {emb.title && <h5 className="font-bold text-white text-base font-sans">{emb.title}</h5>}
                  {emb.description && <p className="text-zinc-300 text-sm whitespace-pre-line leading-relaxed font-sans">{emb.description}</p>}
                  
                  {/* Embedded Rich structures */}
                  {emb.ktpRecord && (
                    <div className="mt-4 border border-[#d4af37]/40 rounded-lg overflow-hidden max-w-sm">
                      <KtpCard record={emb.ktpRecord} />
                    </div>
                  )}

                  {emb.gachaWinner && (
                    <div className="p-3 bg-black/30 border border-zinc-750 rounded-md flex items-center space-x-4 mt-2">
                      <div className="p-3 rounded-full animate-bounce" style={{ backgroundColor: `${emb.gachaWinner.color}20` }}>
                        <Sparkles style={{ color: emb.gachaWinner.color }} size={24} />
                      </div>
                      <div>
                        <h6 className="text-[15px] font-bold" style={{ color: emb.gachaWinner.color }}>
                          ⭐ {emb.gachaWinner.role}
                        </h6>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: `${emb.gachaWinner.color}30`, color: emb.gachaWinner.color }}>
                          {emb.gachaWinner.rarity}
                        </span>
                        <p className="text-xs text-zinc-400 mt-1">{emb.gachaWinner.description}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Simulated active buttons */}
              {msg.interactiveButtons && (
                <div className="flex gap-2 mt-2 pt-1">
                  {msg.interactiveButtons.map((btn, bIdx) => (
                    <button
                      key={bIdx}
                      id={`playbtn-${bIdx}`}
                      onClick={btn.onClick}
                      className={`px-4 py-2 text-xs font-semibold rounded text-white items-center space-x-2 transition-all cursor-pointer shadow hover:scale-[1.02] active:scale-[0.98] ${
                        btn.style === 'primary' ? 'bg-[#5865f2] hover:bg-[#4752c4]' :
                        btn.style === 'secondary' ? 'bg-[#248046] hover:bg-[#1a6535]' :
                        btn.style === 'success' ? 'bg-[#23a55a] hover:bg-[#1a7e43]' : 'bg-[#da373c] hover:bg-[#a92b2f]'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoadingGemini && (
          <div className="flex items-center space-x-3 text-zinc-400 text-xs py-2 animate-pulse">
            <RefreshCw className="animate-spin" size={14} />
            <span>Menganalisis dengan Gemini AI Engine...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Command AutoComplete popup */}
      {showAutoComplete && filteredCommands.length > 0 && (
        <div className="mx-6 mb-1 bg-[#2b2d31] border border-[#1f2023] rounded-lg shadow-2xl relative z-20 max-h-60 overflow-y-auto">
          <div className="p-2 border-b border-zinc-700/60 bg-black/25 flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold text-[#9fe870]">Saran Perintah Gang Bot</span>
            <span className="text-[9px] text-zinc-500 font-mono">Gunakan ↑ ↓ Enter untuk Pilih</span>
          </div>
          {filteredCommands.map((cmd, index) => (
            <div
              key={cmd.name}
              id={`cmd-suggest-${cmd.name}`}
              onClick={() => selectCommand(cmd)}
              className={`flex items-center justify-between p-3 cursor-pointer border-b border-zinc-800/40 last:border-b-0 transition-colors ${
                index === activeCommandIndex ? 'bg-[#35373c] text-[#9fe870]' : 'text-zinc-300 hover:bg-[#35373c]/60'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <span className="text-zinc-500 font-mono font-bold">/</span>
                <span className="font-semibold text-sm">{cmd.name}</span>
                <span className="text-xs text-zinc-400 italic line-clamp-1">— {cmd.description}</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500 bg-[#313338] px-1.5 py-0.5 rounded capitalize">
                {cmd.category}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Input zone */}
      <div className="p-6 bg-[#313338] shrink-0 border-t border-[#1f2023]">
        <div className="relative bg-[#383a40] rounded-lg p-1.5 flex items-center group">
          <input
            type="text"
            id="chat-command-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ketikkan perintah di sini (Gunakan '/' untuk autocomplete)"
            className="flex-1 bg-transparent px-4 py-2 text-zinc-100 text-sm outline-none placeholder-zinc-500 font-sans"
          />
          <button
            id="send-chat-btn"
            onClick={handleSendCommand}
            className="p-2.5 bg-[#4e5058] text-white hover:bg-[#9fe870] hover:text-black rounded-lg transition-all"
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* KTP Modal Form popup */}
      {showKtpModal && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50 animate-fade-in backdrop-blur-sm">
          <div className="bg-[#313338] border-[2px] border-[#d4af37] w-full max-w-md rounded-xl shadow-2xl p-6 text-white space-y-4">
            <div className="flex items-center justify-between border-b border-[#2d4026] pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="text-yellow-500" size={20} />
                <h3 className="font-bold text-base text-white font-sans">PENDAFTARAN KTP VIRTUAL</h3>
              </div>
              <button
                onClick={() => setShowKtpModal(false)}
                className="text-zinc-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={submitKtpModal} className="space-y-4 font-sans text-sm">
              <div className="space-y-1">
                <label className="text-xs text-gray-400 uppercase font-semibold">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  id="form-fullname"
                  value={ktpForm.fullname}
                  onChange={(e) => setKtpForm({ ...ktpForm, fullname: e.target.value })}
                  placeholder="Contoh: Rahmad / Jiyaaa"
                  className="w-full bg-[#1e1f22] border border-[#2d4026]/80 px-3.5 py-2 rounded text-zinc-100 focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-400 uppercase font-semibold">Jenis Kelamin</label>
                <select
                  id="form-gender"
                  value={ktpForm.gender}
                  onChange={(e) => setKtpForm({ ...ktpForm, gender: e.target.value as 'Laki-laki' | 'Perempuan' })}
                  className="w-full bg-[#1e1f22] border border-[#2d4026]/80 px-3 py-2 rounded text-zinc-100 focus:border-[#d4af37] focus:outline-none"
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-400 uppercase font-semibold">Domisili / Kota Asal</label>
                <input
                  type="text"
                  required
                  id="form-address"
                  value={ktpForm.address}
                  onChange={(e) => setKtpForm({ ...ktpForm, address: e.target.value })}
                  placeholder="Contoh: Padang, Bandung, Surabaya"
                  className="w-full bg-[#1e1f22] border border-[#2d4026]/80 px-3.5 py-2 rounded text-zinc-100 focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-400 uppercase font-semibold">Agama</label>
                <select
                  id="form-religion"
                  value={ktpForm.religion}
                  onChange={(e) => setKtpForm({ ...ktpForm, religion: e.target.value })}
                  className="w-full bg-[#1e1f22] border border-[#2d4026]/80 px-3 py-2 rounded text-zinc-100 focus:border-[#d4af37] focus:outline-none"
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
                <label className="text-xs text-gray-400 uppercase font-semibold">Hobi / Aktivitas</label>
                <input
                  type="text"
                  required
                  id="form-hobby"
                  value={ktpForm.hobby}
                  onChange={(e) => setKtpForm({ ...ktpForm, hobby: e.target.value })}
                  placeholder="Contoh: Mancing, Gaming, Ngoding"
                  className="w-full bg-[#1e1f22] border border-[#2d4026]/80 px-3.5 py-2 rounded text-zinc-100 focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  id="form-submit-ktp"
                  className="w-full py-2.5 bg-gradient-to-r from-[#d4af37] to-[#e5c158] hover:scale-[1.01] active:scale-[0.99] text-black font-bold rounded-lg transition-all"
                >
                  Cetak KTP & Cari Role Warga
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
