import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Playground from './components/Playground';
import KtpManager from './components/KtpManager';
import GachaManager from './components/GachaManager';
import DecorationsManager from './components/DecorationsManager';
import TicketManager from './components/TicketManager';
import MusicManager from './components/MusicManager';
import { COMMANDS_DATA } from './data/commands';
import { KtpRecord, GachaRole, BotConfig, LogEntry, NicknameDecoration, TicketCategory, TicketRecord, MusicTrack } from './types';
import { Bot, Terminal, LayoutDashboard, Settings, Sparkles, BookOpen, Clock, Activity, MessageSquare, Plus, Save, Copy, Check, ShieldAlert, Sparkle, ExternalLink } from 'lucide-react';

const DEFAULT_DECORATIONS: NicknameDecoration[] = [
  { id: 'dec_1', name: 'Warga Biasa', prefix: '🏠 [WARGA] ', suffix: ' [🏠]', rarityNeeded: 'Any', active: true },
  { id: 'dec_2', name: 'Intel Lapangan', prefix: '🟢 [INTEL] ', suffix: ' [🕵️]', rarityNeeded: 'Rare', active: true },
  { id: 'dec_3', name: 'Lurah Istimewa', prefix: '🔵 [LURAH SAKTI] ', suffix: ' [🛡️]', rarityNeeded: 'Epic', active: true },
  { id: 'dec_4', name: 'Sultan Judi Server', prefix: '🟣 [SULTAN SANGAT TAJIR] ', suffix: ' [💰]', rarityNeeded: 'Legendary', active: true },
  { id: 'dec_5', name: 'Founder Dewa Langit', prefix: '👑 [DEWA LANGIT FOUNDER] ', suffix: ' [⚡]', rarityNeeded: 'Divine', active: true }
];

const DEFAULT_TICKET_CATEGORIES: TicketCategory[] = [
  { id: 'cat_1', name: 'Kemitraan (Partnership)', value: 'partnership', description: 'Gunakan jika ingin bekerja sama atau menjalin kemitraan antar server.', emoji: '🤝' },
  { id: 'cat_2', name: 'Laporan Warga (Report)', value: 'laporan', description: 'Gunakan untuk melaporkan perilaku angkuh warga atau pelanggaran aturan.', emoji: '⚠️' },
  { id: 'cat_3', name: 'Layanan Donasi & Premium', value: 'donasi', description: 'Gunakan jika Anda ingin menanyakan perihal gacha berbayar atau donasi server.', emoji: '💎' },
  { id: 'cat_4', name: 'Bantuan Umum (Support)', value: 'bantuan', description: 'Butuh bantuan seputar fungsionalitas server Discord.', emoji: '❓' }
];

const DEFAULT_PLAYLIST: MusicTrack[] = [
  { id: 'track_1', title: 'Kopi Dangdut', artist: 'Fahmi Shahab', duration: '04:12', url: 'https://www.youtube.com/watch?v=FSmv1O6J-kY', thumbnailUrl: '' },
  { id: 'track_2', title: 'Blue Bird (Naruto)', artist: 'Ikimonogakari', duration: '03:36', url: 'https://www.youtube.com/watch?v=KpsJWNu_5vY', thumbnailUrl: '' },
  { id: 'track_3', title: 'Indonesia Pusaka (Lofi)', artist: 'DJ Nusantara', duration: '03:15', url: 'https://www.youtube.com/watch?v=lofi', thumbnailUrl: '' }
];

const DEFAULT_CONFIG: BotConfig = {
  token: '',
  clientId: '',
  guildId: '',
  prefix: '/',
  ktpChannelId: '1234567890',
  archiveChannelId: '0987654321',
  wargaRoleId: '1122334455',
  nicknameDecorations: DEFAULT_DECORATIONS,
  ticketEnabled: true,
  ticketChannelId: '2233445566',
  ticketStaffRoleId: '7788990011',
  ticketCategories: DEFAULT_TICKET_CATEGORIES,
  musicEnabled: true,
  musicChannelId: '8877665544',
  playlist: DEFAULT_PLAYLIST
};

const DEFAULT_CITIZENS: KtpRecord[] = [
  {
    id: '6704023211059722',
    userId: '1423089077032321105',
    username: 'vallensr1204',
    fullname: 'Jiyaaa',
    gender: 'Perempuan',
    address: 'Bandung',
    religion: 'Islam',
    hobby: 'Gaming dan nonton',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    createdAt: '10 - 06 - 2026',
  },
  {
    id: '6704025020166847',
    userId: '1423851502016684712',
    username: 'kyle_3214',
    fullname: 'Bowo made in china',
    gender: 'Laki-laki',
    address: 'Sumatra barat kota padang',
    religion: 'Islam',
    hobby: 'MANCING,main game,baca buku.',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
    createdAt: '11 - 06 - 2026',
  }
];

const DEFAULT_GACHA_ROLES: GachaRole[] = [
  { id: '1', roleName: '🔴 Dewa Langit (Founder)', rarity: 'Divine', chance: 0.1, color: '#eab308' },
  { id: '2', roleName: '🟣 Sultan Server (Donatur)', rarity: 'Legendary', chance: 1.9, color: '#a855f7' },
  { id: '3', roleName: '🔵 Kepala Suku (Lurah)', rarity: 'Epic', chance: 8.0, color: '#3b82f6' },
  { id: '4', roleName: '🟢 Begal Senior (Intel)', rarity: 'Rare', chance: 30.0, color: '#10b981' },
  { id: '5', roleName: '⚪ Warga Sipil (Rakyat)', rarity: 'Common', chance: 60.0, color: '#a1a1aa' }
];

export default function App() {
  const [currentTab, setCurrentTab] = useState('overview');
  const [botStatus, setBotStatus] = useState<'ONLINE' | 'OFFLINE'>('ONLINE');
  const [botConfig, setBotConfig] = useState<BotConfig>(DEFAULT_CONFIG);
  const [citizens, setCitizens] = useState<KtpRecord[]>(DEFAULT_CITIZENS);
  const [gachaRoles, setGachaRoles] = useState<GachaRole[]>(DEFAULT_GACHA_ROLES);
  const [nicknameDecorations, setNicknameDecorations] = useState<NicknameDecoration[]>(DEFAULT_DECORATIONS);
  
  // Custom tickets list
  const [tickets, setTickets] = useState<TicketRecord[]>([
    { id: 'TKT-1082', userId: 'user_1', username: 'Vallens#1204', category: '🤝 Kemitraan (Partnership)', reason: 'Ingin berkolaborasi mengadakan event bersama dengan server Gang Indo.', status: 'OPEN', createdAt: '11 Jun 2026, 12:45', messagesCount: 3 },
    { id: 'TKT-2491', userId: 'user_2', username: 'kyle_3214', category: '⚠️ Laporan Warga (Report)', reason: 'Ada warga toxic yang melakukan spam promo link di chat general.', status: 'CLOSED', createdAt: '10 Jun 2026, 15:30', messagesCount: 5 }
  ]);
  
  // Dashboard Log console
  const [logs, setLogs] = useState<LogEntry[]>([
    { timestamp: '07:11:12', type: 'info', source: 'Server', message: 'Sistem Dashboard Gang Indo Bot siap dijalankan.' },
    { timestamp: '07:11:15', type: 'success', source: 'Server', message: 'Database lokal berhasil dimuat (2 Warga terarsip).' },
    { timestamp: '07:11:20', type: 'info', source: 'Bot', message: 'Gateway Discord Bot terhubung 24/7 jam.' },
    { timestamp: '07:11:25', type: 'success', source: 'Bot', message: '70+ Slash Command didaftarkan ke Discord API.' }
  ]);

  const [copiedInvite, setCopiedInvite] = useState(false);
  const [commandCategory, setCommandCategory] = useState<'Semua' | 'Moderasi' | 'Utilitas' | 'Ekonomi & Game' | 'Hiburan & Budaya' | 'Event & Giveaway' | 'AI Canggih'>('Semua');
  const [commandSearch, setCommandSearch] = useState('');

  // Synchronize state with Express server database if present
  useEffect(() => {
    const loadDbData = async () => {
      try {
        const cRes = await fetch('/api/db/citizens');
        if (cRes.ok) {
          const data = await cRes.json();
          if (data && data.length > 0) setCitizens(data);
        }

        const gRes = await fetch('/api/db/gacha-roles');
        if (gRes.ok) {
          const data = await gRes.json();
          if (data && data.length > 0) setGachaRoles(data);
        }

        const cfRes = await fetch('/api/db/bot-config');
        if (cfRes.ok) {
          const data = await cfRes.json();
          if (data) {
            setBotConfig(data);
            if (data.nicknameDecorations && data.nicknameDecorations.length > 0) {
              setNicknameDecorations(data.nicknameDecorations);
            }
          }
        }

        const stRes = await fetch('/api/bot/status');
        if (stRes.ok) {
          const data = await stRes.json();
          setBotStatus(data.status);
        }
      } catch (err) {
        // Safe check - fallback to localStorage if running standalone in dev
        const localC = localStorage.getItem('citizens_db');
        if (localC) setCitizens(JSON.parse(localC));
        const localG = localStorage.getItem('gacha_db');
        if (localG) setGachaRoles(JSON.parse(localG));
        const localT = localStorage.getItem('tickets_db');
        if (localT) setTickets(JSON.parse(localT));
        const localCf = localStorage.getItem('config_db');
        if (localCf) {
          const cfg = JSON.parse(localCf);
          setBotConfig(cfg);
          if (cfg.nicknameDecorations && cfg.nicknameDecorations.length > 0) {
            setNicknameDecorations(cfg.nicknameDecorations);
          }
        }
      }
    };
    loadDbData();
  }, []);

  const saveConfig = async (updated: BotConfig) => {
    setBotConfig(updated);
    localStorage.setItem('config_db', JSON.stringify(updated));
    addLog('info', 'Server', 'Menyimpan konfigurasi bot ke database...');
    try {
      await fetch('/api/db/bot-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      addLog('success', 'Server', 'Konfigurasi bot tersimpan dan disinkronkan!');
    } catch (err) {
       addLog('success', 'Server', 'Konfigurasi tersimpan lokal (Offline mode).');
    }
  };

  const addCitizen = async (rec: KtpRecord) => {
    const updated = [rec, ...citizens];
    setCitizens(updated);
    localStorage.setItem('citizens_db', JSON.stringify(updated));
    addLog('success', 'Bot', `Warga baru terdaftar: ${rec.fullname} (${rec.id})`);
    try {
      await fetch('/api/db/citizens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch (err) {}
  };

  const deleteCitizen = async (id: string) => {
    const updated = citizens.filter(c => c.id !== id);
    setCitizens(updated);
    localStorage.setItem('citizens_db', JSON.stringify(updated));
    addLog('warn', 'Bot', `Warga dengan Nomor KTP ${id} berhasil dihapus.`);
    try {
      await fetch('/api/db/citizens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch (err) {}
  };

  const updateGachaRoles = async (updated: GachaRole[]) => {
    setGachaRoles(updated);
    localStorage.setItem('gacha_db', JSON.stringify(updated));
    addLog('info', 'Bot', 'Server gacha role pool diperbarui.');
    try {
      await fetch('/api/db/gacha-roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch (err) {}
  };

  const updateNicknameDecorations = async (updated: NicknameDecoration[]) => {
    setNicknameDecorations(updated);
    const updatedConfig = { ...botConfig, nicknameDecorations: updated };
    setBotConfig(updatedConfig);
    localStorage.setItem('config_db', JSON.stringify(updatedConfig));
    addLog('info', 'Bot', `Daftar hiasan nickname diperbarui (${updated.length} terdaftar).`);
    try {
      await fetch('/api/db/bot-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedConfig),
      });
      addLog('success', 'Server', 'Hiasan nama tersimpat dan tersinkronisasi!');
    } catch (err) {}
  };

  const updateTicketConfig = async (config: {
    ticketEnabled: boolean;
    ticketChannelId: string;
    ticketStaffRoleId: string;
    ticketCategories: TicketCategory[];
  }) => {
    const updatedConfig = { ...botConfig, ...config };
    setBotConfig(updatedConfig);
    localStorage.setItem('config_db', JSON.stringify(updatedConfig));
    addLog('info', 'Server', 'Konfigurasi loket tiket bantuan diubah.');
    try {
      await fetch('/api/db/bot-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedConfig),
      });
      addLog('success', 'Server', 'Konfigurasi tiket berhasil terkirim dan tersinkronisasi.');
    } catch (err) {}
  };

  const updateMusicConfig = async (config: {
    musicEnabled: boolean;
    musicChannelId: string;
    playlist: MusicTrack[];
  }) => {
    const updatedConfig = { ...botConfig, ...config };
    setBotConfig(updatedConfig);
    localStorage.setItem('config_db', JSON.stringify(updatedConfig));
    addLog('info', 'Server', `Diskografi musik DJ diperbarui (${config.playlist.length} lagu terdaftar).`);
    try {
      await fetch('/api/db/bot-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedConfig),
      });
      addLog('success', 'Server', 'Konfigurasi musik disinkronkan ke live bot!');
    } catch (err) {}
  };

  const updateTickets = (updated: TicketRecord[]) => {
    setTickets(updated);
    localStorage.setItem('tickets_db', JSON.stringify(updated));
    addLog('info', 'Server', `Daftar tiket diperbarui (${updated.length} arsip).`);
  };

  const addLog = (type: LogEntry['type'], source: LogEntry['source'], message: string) => {
    const timestamp = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs((prev) => [{ timestamp, type, source, message }, ...prev.slice(0, 39)]);
  };

  const copyInviteLink = () => {
    const inviteLnk = `https://discord.com/api/oauth2/authorize?client_id=${botConfig.clientId || '1234567890'}&permissions=8&scope=bot%20applications.commands`;
    navigator.clipboard.writeText(inviteLnk);
    setCopiedInvite(true);
    addLog('info', 'Server', 'Tautan undangan bot disalin.');
    setTimeout(() => setCopiedInvite(false), 2000);
  };

  const toggleBotOnline = async () => {
    const nextStatus = botStatus === 'ONLINE' ? 'OFFLINE' : 'ONLINE';
    setBotStatus(nextStatus);
    addLog('warn', 'Server', `Mengubah status bot menjadi ${nextStatus}...`);
    try {
      await fetch('/api/bot/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
    } catch (err) {}
  };

  // Filter commands database
  const filteredCommands = COMMANDS_DATA.filter((cmd) => {
    const matchesCategory = commandCategory === 'Semua' || cmd.category === commandCategory;
    const matchesSearch = cmd.name.toLowerCase().includes(commandSearch.toLowerCase()) || 
                          cmd.description.toLowerCase().includes(commandSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#111610] text-[#ebeceb] font-sans" id="app-viewport">
      {/* Sidebar navigation */}
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} botStatus={botStatus} />

      {/* Main content viewport panels */}
      <main className="flex-1 flex flex-col min-h-0 bg-[#161c14]/45">
        
        {/* TAB 1: OVERVIEW PANEL */}
        {currentTab === 'overview' && (
          <div className="flex-grow p-6 md:p-8 space-y-6 overflow-y-auto" id="overview-tab">
            
            {/* Elegant Header Card */}
            <div className="relative rounded-2xl bg-gradient-to-br from-[#1b2a16] to-[#0d160b] border border-[#2d4026] p-6 md:p-8 overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-8 transform rotate-12 opacity-15">
                <Bot size={150} className="text-[#9fe870]" />
              </div>
              <div className="relative z-10 space-y-3 max-w-2xl">
                <span className="px-3 py-1 bg-[#9fe870]/10 border border-[#9fe870]/30 text-[#9fe870] font-mono text-[10px] uppercase font-bold tracking-widest rounded-full">
                  Dashboard Administrasi Resmi
                </span>
                <h1 className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tight">
                  Gang Indo Bot Engine
                </h1>
                <p className="text-sm md:text-base text-gray-300 leading-relaxed font-sans">
                  Sistem manajemen discord bot terbesar dengan **70+ Slash Command profesional** canggih. 
                  Lakukan automasi *Cetak KTP Virtual* real-time, pasang permainan *Gacha Nasib Warga*, 
                  moderasi instan, ekonomi rupiah, serta integrasi super cerdas Gemini AI!
                </p>
                
                <div className="pt-3 flex flex-wrap gap-3">
                  <button
                    id="copy-invite-link-btn"
                    onClick={copyInviteLink}
                    className="flex items-center space-x-2 px-5 py-2.5 bg-[#9fe870] text-black font-extrabold rounded-lg hover:bg-green-400 active:scale-95 transition-all text-xs uppercase tracking-wider cursor-pointer shadow-lg"
                  >
                    {copiedInvite ? <Check size={14} /> : <ExternalLink size={14} />}
                    <span>{copiedInvite ? 'Undangan Disalin!' : 'Undang Bot Server'}</span>
                  </button>

                  <button
                    id="toggle-bot-status-btn"
                    onClick={toggleBotOnline}
                    className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all cursor-pointer active:scale-95 ${
                      botStatus === 'ONLINE'
                        ? 'bg-red-950/50 border border-red-800 text-red-200 hover:bg-red-900/60'
                        : 'bg-green-950/50 border border-[#2d4026] text-green-200 hover:bg-green-900/60'
                    }`}
                  >
                    <span>Matikan / Nyalakan Bot</span>
                  </button>
                </div>
              </div>
            </div>

            {/* General Status Widgets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="stats-widgets">
              <div className="bg-[#141b11] border border-[#2d4026]/80 rounded-xl p-4 flex items-center justify-between shadow">
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 font-mono uppercase block">Sertifikasi Server</span>
                  <span className="text-xl font-bold font-mono text-white">4.2K Server</span>
                </div>
                <Clock className="text-[#9fe870]" size={20} />
              </div>

              <div className="bg-[#141b11] border border-[#2d4026]/80 rounded-xl p-4 flex items-center justify-between shadow">
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 font-mono uppercase block">Total Anggota</span>
                  <span className="text-xl font-bold font-mono text-white">54.2K Warga</span>
                </div>
                <Activity className="text-green-400" size={20} />
              </div>

              <div className="bg-[#141b11] border border-[#2d4026]/80 rounded-xl p-4 flex items-center justify-between shadow">
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 font-mono uppercase block">Arsip KTP Virtual</span>
                  <span className="text-xl font-bold font-mono text-white">{citizens.length} KTP</span>
                </div>
                <MessageSquare className="text-blue-400" size={20} />
              </div>

              <div className="bg-[#141b11] border border-[#2d4026]/80 rounded-xl p-4 flex items-center justify-between shadow">
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 font-mono uppercase block">Fitur Aktif</span>
                  <span className="text-xl font-bold font-mono text-yellow-400">72 Slash</span>
                </div>
                <Sparkle className="text-yellow-400" size={20} />
              </div>
            </div>

            {/* Connection logsConsole */}
            <div className="bg-[#121611] border border-[#2d4026]/60 rounded-xl p-5 shadow-xl font-mono" id="logs-console">
              <div className="flex items-center justify-between border-b border-[#2d4026] pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <Terminal size={16} className="text-gray-400" />
                  <span className="font-bold text-xs text-zinc-100 uppercase tracking-widest">Konsol Log Gateway Server</span>
                </div>
                <span className="h-2 w-2 rounded-full bg-[#9fe870] animate-pulse" />
              </div>
              <div className="space-y-2.5 max-h-48 overflow-y-auto text-xs pr-1">
                {logs.map((log, index) => (
                  <div key={index} className="flex items-start space-x-2 hover:bg-black/10 py-0.5 rounded px-1">
                    <span className="text-zinc-500 font-semibold tracking-wider">{log.timestamp}</span>
                    <span className={`font-extrabold text-[10px] uppercase px-1 rounded font-mono ${
                      log.type === 'error' ? 'bg-red-950 text-red-400' :
                      log.type === 'warn' ? 'bg-yellow-950 text-yellow-400' :
                      log.type === 'success' ? 'bg-green-950 text-green-400' : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {log.source}
                    </span>
                    <span className="text-zinc-300 font-mono leading-tight break-all">{log.message}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BOT CONFIGURATION TAB */}
        {currentTab === 'config' && (
          <div className="flex-grow p-6 md:p-8 space-y-6 overflow-y-auto" id="config-tab">
            <div className="border-b border-[#2d4026] pb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                ⚙️ Setelan Discord Bot & Saluran Integrasi
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Salin token bot dan detail ID dari Discord Developer Portal untuk menautkan bot dengan server chat Anda secara nyata.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="config-cards-container">
              
              {/* Bot Credentials Box */}
              <div className="bg-[#141b11] border border-[#2d4026] p-6 rounded-2xl space-y-4 shadow-xl">
                <span className="text-[10px] font-mono text-[#9fe870] font-bold block uppercase tracking-wider">KREDENSI UTAMA</span>
                <h3 className="font-bold text-white text-base">Token Autentikasi Bot</h3>
                
                <div className="space-y-4 font-sans text-sm">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 font-semibold">TOKEN DISCORD BOT</label>
                    <input
                      type="password"
                      id="config-bot-token"
                      value={botConfig.token}
                      onChange={(e) => saveConfig({ ...botConfig, token: e.target.value })}
                      placeholder="MTEyMjMzNDQ1NTY2Nzc4ODk5..."
                      className="w-full bg-black/40 border border-[#2d4026] px-4 py-2.5 rounded text-zinc-100 placeholder-zinc-700 font-mono focus:border-[#9fe870] focus:outline-none text-xs"
                    />
                    <span className="text-[10px] text-zinc-500 font-mono block">Dapatkan token aman Anda melalui halaman Discord Sandbox Builder.</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-gray-400 font-semibold">CLIENT ID BOT</label>
                      <input
                        type="text"
                        id="config-bot-client-id"
                        value={botConfig.clientId}
                        onChange={(e) => saveConfig({ ...botConfig, clientId: e.target.value })}
                        placeholder="14238515020166"
                        className="w-full bg-black/40 border border-[#2d4026] px-3.5 py-2 rounded text-zinc-100 placeholder-zinc-700 font-mono focus:border-[#9fe870] focus:outline-none text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-gray-400 font-semibold">GUILD ID (ID SERVER)</label>
                      <input
                        type="text"
                        id="config-bot-guild-id"
                        value={botConfig.guildId}
                        onChange={(e) => saveConfig({ ...botConfig, guildId: e.target.value })}
                        placeholder="22334455667788"
                        className="w-full bg-black/40 border border-[#2d4026] px-3.5 py-2 rounded text-zinc-100 placeholder-zinc-700 font-mono focus:border-[#9fe870] focus:outline-none text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Discord Channels & Role Configurations */}
              <div className="bg-[#141b11] border border-[#2d4026] p-6 rounded-2xl space-y-4 shadow-xl">
                <span className="text-[10px] font-mono text-[#9fe870] font-bold block uppercase tracking-wider">SALURAN TARGET</span>
                <h3 className="font-bold text-white text-base">Tautan Channel & Role Warga</h3>

                <div className="space-y-4 font-sans text-sm">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 font-semibold">ROLE WARGA INDONESIA</label>
                    <input
                      type="text"
                      id="config-bot-role-warga"
                      value={botConfig.wargaRoleId}
                      onChange={(e) => saveConfig({ ...botConfig, wargaRoleId: e.target.value })}
                      placeholder="Role ID untuk Warga Resmi"
                      className="w-full bg-black/40 border border-[#2d4026] px-3.5 py-2 rounded text-zinc-100 placeholder-zinc-700 font-mono focus:border-[#9fe870] focus:outline-none text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-gray-400 font-semibold">CHANNEL LOKET KTP</label>
                      <input
                        type="text"
                        id="config-bot-ktp-channel"
                        value={botConfig.ktpChannelId}
                        onChange={(e) => saveConfig({ ...botConfig, ktpChannelId: e.target.value })}
                        className="w-full bg-black/40 border border-[#2d4026] px-3.5 py-2 rounded text-zinc-100 placeholder-zinc-700 font-mono focus:border-[#9fe870] focus:outline-none text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-gray-400 font-semibold">CHANNEL ARSIP KTP</label>
                      <input
                        type="text"
                        id="config-bot-archive-channel"
                        value={botConfig.archiveChannelId}
                        onChange={(e) => saveConfig({ ...botConfig, archiveChannelId: e.target.value })}
                        className="w-full bg-black/40 border border-[#2d4026] px-3.5 py-2 rounded text-zinc-100 placeholder-zinc-700 font-mono focus:border-[#9fe870] focus:outline-none text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Instruction Banner Box */}
            <div className="bg-yellow-950/20 border border-yellow-800/40 rounded-2xl p-6 flex items-start space-x-4 max-w-3xl font-sans text-sm shadow">
              <ShieldAlert className="text-yellow-400 shrink-0" size={24} />
              <div className="space-y-2">
                <h4 className="font-bold text-white text-base">Panduan Autentikasi Keamanan Premium</h4>
                <p className="text-zinc-300 leading-relaxed text-xs">
                  Sistem token kami disinkronisasikan ke backend Cloud Run container yang aman secara lokal. 
                  Anda tidak perlu khawatir data bocor ke eksternal client. Jika Anda belum mengisi kredensial, 
                  aplikasi web kami akan secara cerdas beralih ke mode **VIRTUAL SANDBOX SIMULATOR** 
                  sehingga fungsionalitas visual 70+ commands, Gacha, dan Pembuatan KTP Anda tetap dapat dicoba dengan lancar!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CITIZEN DIRECTORY MANAGER */}
        {currentTab === 'ktp' && (
          <KtpManager citizens={citizens} addCitizen={addCitizen} deleteCitizen={deleteCitizen} />
        )}

        {/* TAB 4: GACHA TIER POOLS CONFIG */}
        {currentTab === 'gacha' && (
          <GachaManager initialRoles={gachaRoles} updateRoles={updateGachaRoles} />
        )}

        {/* TAB DECORATIONS: NICKNAME EMBELLISHMENT CUSTOM */}
        {currentTab === 'decorations' && (
          <DecorationsManager decorations={nicknameDecorations} saveDecorations={updateNicknameDecorations} />
        )}

        {/* TAB TICKETS: TICKET & PARTNERSHIP MANAGER */}
        {currentTab === 'tickets' && (
          <TicketManager
            ticketEnabled={botConfig.ticketEnabled}
            ticketChannelId={botConfig.ticketChannelId}
            ticketStaffRoleId={botConfig.ticketStaffRoleId}
            ticketCategories={botConfig.ticketCategories || DEFAULT_TICKET_CATEGORIES}
            tickets={tickets}
            updateTicketConfig={updateTicketConfig}
            updateTickets={updateTickets}
          />
        )}

        {/* TAB MUSIC: MUSIC PLAYLIST & DJ PLAYER CONTROLLER COMPONENT */}
        {currentTab === 'music' && (
          <MusicManager
            musicEnabled={botConfig.musicEnabled}
            musicChannelId={botConfig.musicChannelId}
            playlist={botConfig.playlist || DEFAULT_PLAYLIST}
            updateMusicConfig={updateMusicConfig}
          />
        )}

        {/* TAB 5: VIRTUAL DISCORD CONSOLE PLAYGROUND */}
        {currentTab === 'playground' && (
          <Playground citizens={citizens} addCitizen={addCitizen} gachaRoles={gachaRoles} botToken={botConfig.token} nicknameDecorations={nicknameDecorations} />
        )}

        {/* TAB 6: COMMANDS DATABASE VIEWER */}
        {currentTab === 'commands' && (
          <div className="flex-grow p-6 md:p-8 space-y-6 overflow-y-auto text-gray-100 font-sans" id="commands-tab">
            <div className="border-b border-[#2d4026] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-1.5">
                  <BookOpen size={24} className="text-[#9fe870]" />
                  Direktori Fitur Komplit ({COMMANDS_DATA.length}+ Commands)
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  Buku panduan resmi pengoperasian slash commands Gang Indo Bot profesional. Filter berdasarkan kategori atau kata kunci.
                </p>
              </div>
            </div>

            {/* Selector category */}
            <div className="flex flex-wrap gap-2" id="commands-filter-tabs">
              {(['Semua', 'Moderasi', 'Utilitas', 'Ekonomi & Game', 'Hiburan & Budaya', 'Event & Giveaway', 'AI Canggih'] as const).map((cat) => (
                <button
                  key={cat}
                  id={`cat-filter-${cat.replace(/\s+/g, '_')}`}
                  onClick={() => setCommandCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-150 ${
                    commandCategory === cat
                      ? 'bg-[#9fe870] text-black font-extrabold shadow-md'
                      : 'bg-[#141b11] border border-[#2d4026] text-gray-300 hover:bg-[#1a2517] hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search filter input */}
            <div className="max-w-md">
              <input
                type="text"
                id="cmd-search-catalog"
                value={commandSearch}
                onChange={(e) => setCommandSearch(e.target.value)}
                placeholder="Cari command..."
                className="w-full bg-[#1b2019] border border-[#2d4026]/80 px-4 py-2.5 rounded-lg text-zinc-100 focus:border-[#9fe870] outline-none text-xs font-sans placeholder-zinc-600"
              />
            </div>

            {/* List Catalog */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="commands-deck">
              {filteredCommands.map((cmd) => (
                <div
                  key={cmd.name}
                  id={`cmdcard-${cmd.name}`}
                  className="bg-[#141b11] border border-[#2d4026] hover:border-[#9fe870]/45 p-5 rounded-xl flex flex-col justify-between space-y-4 hover:shadow-lg transition-all"
                >
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-baseline gap-2">
                      <span className="font-mono text-sm font-bold text-yellow-400 cursor-pointer hover:underline">
                        /{cmd.name}
                      </span>
                      <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded tracking-wide bg-[#2d4026]/30 text-[#9fe870] font-bold">
                        {cmd.category}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                      {cmd.description}
                    </p>
                  </div>
                  
                  <div className="bg-black/35 p-2 rounded border border-zinc-850">
                    <span className="text-[9px] text-zinc-500 font-mono block uppercase mb-1">Cara Penggunaan:</span>
                    <code className="text-[11px] font-mono font-bold text-[#9fe870]">{cmd.usage}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
