export interface NicknameDecoration {
  id: string;
  name: string; // Dynamic label
  prefix: string; // Prefix text, e.g. "[🔱 ELITE] "
  suffix: string; // Suffix text, e.g. " [🔱]"
  rarityNeeded?: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Divine' | 'Any';
  active: boolean;
}

export interface TicketCategory {
  id: string;
  name: string; // e.g. "🤝 Kemitraan (Partnership)"
  value: string; // "partnership", "laporan", "bantuan", "donasi"
  description: string;
  emoji: string;
}

export interface TicketRecord {
  id: string; // TKT-XXXX
  userId: string;
  username: string;
  category: string;
  reason: string;
  status: 'OPEN' | 'CLOSED' | 'PENDING';
  createdAt: string;
  messagesCount: number;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
  url: string;
  thumbnailUrl: string;
}

export interface BotConfig {
  token: string;
  clientId: string;
  guildId: string;
  prefix: string;
  ktpChannelId: string;
  archiveChannelId: string;
  wargaRoleId: string;
  nicknameDecorations?: NicknameDecoration[];
  ticketEnabled: boolean;
  ticketChannelId: string;
  ticketStaffRoleId: string;
  ticketCategories: TicketCategory[];
  musicEnabled: boolean;
  musicChannelId: string;
  playlist: MusicTrack[];
}

export interface KtpRecord {
  id: string; // KTP Number e.g. 670402xxxxxxxxxx
  userId: string; // Discord user ID
  username: string; // Discord user tag name
  fullname: string;
  gender: 'Laki-laki' | 'Perempuan';
  address: string; // Domisili
  religion: string;
  hobby: string;
  avatarUrl: string;
  createdAt: string; // DD-MM-YYYY
}

export interface GachaRole {
  id: string;
  roleName: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Divine';
  chance: number; // e.g., 60 for 60%
  color: string; // Tailwind color or hex
}

export interface GachaPoolConfig {
  roles: GachaRole[];
  enabled: boolean;
  channelId: string;
  cooldownHours: number;
}

export interface LogEntry {
  timestamp: string;
  type: 'info' | 'success' | 'warn' | 'error';
  source: 'Server' | 'Bot' | 'Gemini';
  message: string;
}

export interface CommandInfo {
  name: string;
  description: string;
  category: 'Moderasi' | 'Utilitas' | 'Ekonomi & Game' | 'Hiburan & Budaya' | 'Event & Giveaway' | 'AI Canggih';
  usage: string;
  args?: { name: string; description: string; required: boolean }[];
  exampleResponse: string | string[];
}
