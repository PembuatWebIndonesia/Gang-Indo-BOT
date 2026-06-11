import React from 'react';
import { LayoutDashboard, Bot, FolderHeart, Sparkles, Terminal, BookOpen, Settings, Info, Tag, Ticket, Music } from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  botStatus: 'ONLINE' | 'OFFLINE';
}

export default function Sidebar({ currentTab, setCurrentTab, botStatus }: SidebarProps) {
  const menuItems = [
    { id: 'overview', name: 'Ringkasan Bot', icon: LayoutDashboard },
    { id: 'config', name: 'Konfigurasi Bot', icon: Settings },
    { id: 'ktp', name: 'Arsip KTP Virtual', icon: FolderHeart },
    { id: 'gacha', name: 'Gacha Nasib', icon: Sparkles },
    { id: 'decorations', name: 'Hiasan Nickname', icon: Tag },
    { id: 'tickets', name: 'Tiket Bantuan', icon: Ticket },
    { id: 'music', name: 'Musik DJ Otomatis', icon: Music },
    { id: 'playground', name: 'Konsol Playground', icon: Terminal },
    { id: 'commands', name: 'Daftar Perintah (70+)', icon: BookOpen },
  ];

  return (
    <aside className="w-full md:w-64 bg-[#141b11] border-r border-[#2d4026] text-gray-200 flex flex-col justify-between" id="sidebar-container">
      <div>
        {/* Brand */}
        <div className="p-6 border-b border-[#2d4026] flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-tr from-[#9fe870] to-green-600 rounded-lg text-black font-semibold">
            <Bot size={22} className="animate-pulse" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight text-white tracking-wide">Gang Indo</h1>
            <span className="text-[10px] text-[#9fe870] font-mono tracking-wider font-bold">DISCORD BOT ENGINE</span>
          </div>
        </div>

        {/* Live Status Guard */}
        <div className="m-4 p-3 bg-black/40 border border-[#2d4026] rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Status Bot:</span>
            <div className="flex items-center space-x-2">
              <span className={`h-2.5 w-2.5 rounded-full ${botStatus === 'ONLINE' ? 'bg-[#9fe870] animate-ping' : 'bg-red-500'}`} />
              <span className={`text-[11px] font-bold font-mono ${botStatus === 'ONLINE' ? 'text-[#9fe870]' : 'text-red-400'}`}>
                {botStatus}
              </span>
            </div>
          </div>
          <div className="mt-1 text-[9px] text-[#9fe870]/80 font-mono flex justify-between">
            <span>Uptime: 24/7 Hours</span>
            <span>Ping: 32ms</span>
          </div>
        </div>

        {/* Menus */}
        <nav className="px-3 py-2 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidemenu-tab-${item.id}`}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 font-medium ${
                  isActive
                    ? 'bg-[#293d22] text-[#9fe870] border-l-4 border-[#9fe870] font-semibold'
                    : 'text-gray-400 hover:bg-[#1a2517] hover:text-white'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-[#9fe870]' : 'text-gray-400'} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer credits inside sidebar */}
      <div className="p-4 border-t border-[#2d4026] bg-black/20 text-center">
        <p className="text-[10px] text-gray-500 font-mono">Nexora Gang Indonesia App</p>
        <p className="text-[9px] text-gray-600 mt-0.5">Premium Bot Version 2.0</p>
      </div>
    </aside>
  );
}
