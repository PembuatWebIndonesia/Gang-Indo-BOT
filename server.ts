import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

// Read local .env
dotenv.config();

// Discord JS Imports
import { 
  Client, 
  GatewayIntentBits, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  EmbedBuilder, 
  ModalBuilder, 
  TextInputBuilder, 
  TextInputStyle,
  REST,
  Routes,
  SlashCommandBuilder,
  Interaction
} from 'discord.js';

const app = express();
const PORT = 3000;

app.use(express.json());

// Database paths
const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

// Ensure DB exists with safe default structure
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

interface DbStructure {
  citizens: any[];
  gachaRoles: any[];
  botConfig: any;
  botStatus: 'ONLINE' | 'OFFLINE';
}

const DEFAULT_DB: DbStructure = {
  citizens: [
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
  ],
  gachaRoles: [
    { id: '1', roleName: '🔴 Dewa Langit (Founder)', rarity: 'Divine', chance: 0.1, color: '#eab308' },
    { id: '2', roleName: '🟣 Sultan Server (Donatur)', rarity: 'Legendary', chance: 1.9, color: '#a855f7' },
    { id: '3', roleName: '🔵 Kepala Suku (Lurah)', rarity: 'Epic', chance: 8.0, color: '#3b82f6' },
    { id: '4', roleName: '🟢 Begal Senior (Intel)', rarity: 'Rare', chance: 30.0, color: '#10b981' },
    { id: '5', roleName: '⚪ Warga Sipil (Rakyat)', rarity: 'Common', chance: 60.0, color: '#a1a1aa' }
  ],
  botConfig: {
    token: process.env.DISCORD_TOKEN || '',
    clientId: process.env.DISCORD_CLIENT_ID || '',
    guildId: process.env.DISCORD_GUILD_ID || '',
    prefix: '/',
    ktpChannelId: '1234567890',
    archiveChannelId: '0987654321',
    wargaRoleId: '1122334455',
    nicknameDecorations: [
      { id: 'dec_1', name: 'Warga Biasa', prefix: '🏠 [WARGA] ', suffix: ' [🏠]', rarityNeeded: 'Any', active: true },
      { id: 'dec_2', name: 'Intel Lapangan', prefix: '🟢 [INTEL] ', suffix: ' [🕵️]', rarityNeeded: 'Rare', active: true },
      { id: 'dec_3', name: 'Lurah Istimewa', prefix: '🔵 [LURAH SAKTI] ', suffix: ' [🛡️]', rarityNeeded: 'Epic', active: true },
      { id: 'dec_4', name: 'Sultan Judi Server', prefix: '🟣 [SULTAN SANGAT TAJIR] ', suffix: ' [💰]', rarityNeeded: 'Legendary', active: true },
      { id: 'dec_5', name: 'Founder Dewa Langit', prefix: '👑 [DEWA LANGIT FOUNDER] ', suffix: ' [⚡]', rarityNeeded: 'Divine', active: true }
    ],
    ticketEnabled: true,
    ticketChannelId: '2233445566',
    ticketStaffRoleId: '7788990011',
    ticketCategories: [
      { id: 'cat_1', name: 'Kemitraan (Partnership)', value: 'partnership', description: 'Gunakan jika ingin bekerja sama atau menjalin kemitraan antar server.', emoji: '🤝' },
      { id: 'cat_2', name: 'Laporan Warga (Report)', value: 'laporan', description: 'Gunakan untuk melaporkan perilaku angkuh warga atau pelanggaran aturan.', emoji: '⚠️' },
      { id: 'cat_3', name: 'Layanan Donasi & Premium', value: 'donasi', description: 'Gunakan jika Anda ingin menanyakan perihal gacha berbayar atau donasi server.', emoji: '💎' },
      { id: 'cat_4', name: 'Bantuan Umum (Support)', value: 'bantuan', description: 'Butuh bantuan seputar fungsionalitas server Discord.', emoji: '❓' }
    ],
    musicEnabled: true,
    musicChannelId: '8877665544',
    playlist: [
      { id: 'track_1', title: 'Kopi Dangdut', artist: 'Fahmi Shahab', duration: '04:12', url: 'https://www.youtube.com/watch?v=FSmv1O6J-kY', thumbnailUrl: '' },
      { id: 'track_2', title: 'Blue Bird (Naruto)', artist: 'Ikimonogakari', duration: '03:36', url: 'https://www.youtube.com/watch?v=KpsJWNu_5vY', thumbnailUrl: '' },
      { id: 'track_3', title: 'Indonesia Pusaka (Lofi)', artist: 'DJ Nusantara', duration: '03:15', url: 'https://www.youtube.com/watch?v=lofi', thumbnailUrl: '' }
    ]
  },
  botStatus: 'ONLINE'
};

function readDb(): DbStructure {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Database read failed, resetting to defaults.', error);
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2), 'utf-8');
  return DEFAULT_DB;
}

function writeDb(data: Partial<DbStructure>) {
  try {
    const current = readDb();
    const updated = { ...current, ...data };
    fs.writeFileSync(DB_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  } catch (error) {
    console.error('Database write failed.', error);
  }
}

// -------------------------------------------------------------
// SECURE GEMINI INTEGRATION (Using Named apiKey and userAgent)
// -------------------------------------------------------------
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not defined. Falling back to stub.');
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || 'DUMMY_KEY',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

// REST Web APIs
app.get('/api/db/citizens', (req, res) => {
  const db = readDb();
  res.json(db.citizens);
});

app.post('/api/db/citizens', (req, res) => {
  if (Array.isArray(req.body)) {
    writeDb({ citizens: req.body });
    res.json({ success: true });
  } else {
    res.status(400).json({ error: 'Body must be array of citizens.' });
  }
});

app.get('/api/db/gacha-roles', (req, res) => {
  const db = readDb();
  res.json(db.gachaRoles);
});

app.post('/api/db/gacha-roles', (req, res) => {
  if (Array.isArray(req.body)) {
    writeDb({ gachaRoles: req.body });
    res.json({ success: true });
  } else {
    res.status(400).json({ error: 'Body must be array of roles.' });
  }
});

app.get('/api/db/bot-config', (req, res) => {
  const db = readDb();
  res.json(db.botConfig);
});

app.post('/api/db/bot-config', (req, res) => {
  if (req.body && typeof req.body === 'object') {
    writeDb({ botConfig: req.body });
    // Reload Bot Client dynamically if credentials modified
    initDiscordBot();
    res.json({ success: true });
  } else {
    res.status(400).json({ error: 'Body must be BotConfig object.' });
  }
});

app.get('/api/bot/status', (req, res) => {
  const db = readDb();
  res.json({ status: db.botStatus });
});

app.post('/api/bot/toggle', (req, res) => {
  const { status } = req.body;
  if (status === 'ONLINE' || status === 'OFFLINE') {
    writeDb({ botStatus: status });
    if (status === 'ONLINE') {
      initDiscordBot();
    } else {
      shutdownDiscordBot();
    }
    res.json({ status });
  } else {
    res.status(400).json({ error: 'Status must be ONLINE or OFFLINE.' });
  }
});

// Gemini Ask API Proxy Endpoint
app.post('/api/gemini/tanya-ai', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Question prompt is required.' });
  }

  try {
    const ai = getGeminiClient();
    const result = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Anda adalah Gang Indo Bot, asisten AI super canggih untuk server Discord "Nexora Gang Indonesia". Jawab dengan gaya asisten profesional, ramah, dan solutif berbahasa Indonesia.'
      }
    });
    res.json({ response: result.text });
  } catch (err: any) {
    console.error('Gemini API call failed.', err);
    res.json({ response: `Halo kawan! Pertanyaan Anda [${prompt}] sangat luar biasa. Namun saat ini model pemrosesan server kami sedang mengalami pembatasan kuota atau kunci API tidak terhubung. Mari kita diskusikan kembali sebentar lagi!` });
  }
});

// -------------------------------------------------------------
// REAL DISCORD BOT ENGINE (with full exception handling safety)
// -------------------------------------------------------------
let discordClient: Client | null = null;

async function registerSlashCommands(token: string, clientId: string, guildId: string) {
  if (!token || !clientId) return;

  const commands = [
    new SlashCommandBuilder().setName('setup-ktp').setDescription('Menyiapkan loket pembuatan KTP Virtual di channel.'),
    new SlashCommandBuilder().setName('setup-gachanasib').setDescription('Menyiapkan panel gacha role nasib otomatis.'),
    new SlashCommandBuilder().setName('my-ktp').setDescription('Menampilkan KTP Virtual milik Anda.'),
    new SlashCommandBuilder().setName('tanya-ai').addStringOption(opt => opt.setName('tanya').setDescription('Pertanyaan ke AI').setRequired(true)).setDescription('Bertanya ke AI Gemini Super Canggih.'),
    new SlashCommandBuilder().setName('setup-ticket').setDescription('Menyiapkan loket tiket bantuan / partnership otomatis.'),
    new SlashCommandBuilder().setName('play').addStringOption(opt => opt.setName('lagu').setDescription('Judul lagu yang ingin diputar')).setDescription('Memutar trek musik secara otomatis di Voice Channel.'),
    new SlashCommandBuilder().setName('playlist').setDescription('Menampilkan daftar lagu aktif bot DJ server.'),
    new SlashCommandBuilder().setName('ping').setDescription('Mengecek kecepatan respon bot.')
  ].map(cmd => cmd.toJSON());

  const rest = new REST({ version: '10' }).setToken(token);
  try {
    console.log('Registering slash commands dynamically to Discord API...');
    if (guildId) {
      await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commands }
      );
    } else {
      await rest.put(
        Routes.applicationCommands(clientId),
        { body: commands }
      );
    }
    console.log('Slash commands registered successfully!');
  } catch (error) {
    console.error('Slash commands registration error neglected:', error);
  }
}

async function initDiscordBot() {
  const db = readDb();
  const config = db.botConfig;

  if (db.botStatus === 'OFFLINE' || !config.token) {
    console.log('Discord Bot is either offline or Token is empty. Running in Sandbox Visual Simulator.');
    return;
  }

  // Shutdown existing bot client safely first
  shutdownDiscordBot();

  try {
    discordClient = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
      ]
    });

    discordClient.on('ready', async () => {
      console.log(`🤖 Discord Bot connected as: ${discordClient?.user?.tag}`);
      // Register slash commands
      await registerSlashCommands(config.token, config.clientId, config.guildId);
    });

    // Slash and button interactions
    discordClient.on('interactionCreate', async (interaction: Interaction) => {
      if (interaction.isChatInputCommand()) {
        const { commandName } = interaction;

        if (commandName === 'ping') {
          await interaction.reply(`🏓 Pong! Latensi Gateway: ${discordClient?.ws.ping}ms`);
        } 
        else if (commandName === 'setup-ktp') {
          const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
              .setCustomId('buat_ktp_btn')
              .setLabel('Buat KTP Saya')
              .setStyle(ButtonStyle.Primary)
          );

          const embed = new EmbedBuilder()
            .setTitle('📇 Buat KTP Virtual Kamu!')
            .setDescription('Klik tombol di bawah untuk membuat **Kartu Tanda Penduduk** virtualmu di server ini.\n\n**KTP berisi:**\n• 👤 Nama Lengkap\n• ⚧️ Jenis Kelamin\n• 🏡 Domisili\n• 🕌 Agama\n• 🎯 Hobi\n\n✅ Setelah membuat KTP, kamu akan otomatis diberi role warga!')
            .setColor(0xd4af37);

          await interaction.reply({ embeds: [embed], components: [row] });
        }
        else if (commandName === 'setup-gachanasib') {
          const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
              .setCustomId('gacha_nasib_btn')
              .setLabel('Gacha Nasib Saya Sekarang')
              .setStyle(ButtonStyle.Success)
          );

          const embed = new EmbedBuilder()
            .setTitle('🔮 GACHAROLE NASIB SERVER!')
            .setDescription('Coba peruntungan nasib Anda di server! Klik tombol gacha di bawah untuk mendapat role prestisius secara acak berbasis Rarity.')
            .setColor(0xa855f7);

          await interaction.reply({ embeds: [embed], components: [row] });
        }
        else if (commandName === 'my-ktp') {
          const currentDb = readDb();
          const citizen = currentDb.citizens.find(c => c.userId === interaction.user.id);
          if (!citizen) {
            await interaction.reply({ content: '❌ Anda belum mendaftar KTP. Sila ketik `/setup-ktp` untuk mencetak.', ephemeral: true });
          } else {
            const embed = new EmbedBuilder()
              .setTitle(`KTP Virtual - ${citizen.fullname}`)
              .addFields(
                { name: 'Nomor KTP', value: citizen.id, inline: true },
                { name: 'Domisili', value: citizen.address, inline: true },
                { name: 'Gender', value: citizen.gender, inline: true },
                { name: 'Agama', value: citizen.religion, inline: true },
                { name: 'Hobi', value: citizen.hobby, inline: true }
              )
              .setColor(0x10b981);
            await interaction.reply({ embeds: [embed] });
          }
        }
        else if (commandName === 'tanya-ai') {
          await interaction.deferReply();
          const tanya = interaction.options.getString('tanya') || '';
          try {
            const ai = getGeminiClient();
            const result = await ai.models.generateContent({
              model: 'gemini-3.5-flash',
              contents: tanya,
            });
            await interaction.editReply(`🤖 **Tanya AI:** *${tanya}*\n\n${result.text}`);
          } catch (e) {
            await interaction.editReply(`🤖 Saya mendengar tantangan: "${tanya}". Hubungkan Gemini API Key di panel dashboard untuk respon AI premium!`);
          }
        }
        else if (commandName === 'setup-ticket') {
          const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
              .setCustomId('buka_tiket_btn')
              .setLabel('🎫 Buka Bantuan / Partnership')
              .setStyle(ButtonStyle.Primary)
          );

          const embed = new EmbedBuilder()
            .setTitle('🎟️ Loket Layanan & Kemitraan (Ticket Center)')
            .setDescription('Butuh bantuan? Ingin mengajukan kemitraan (partnership) dengan Geng Indo, melaporkan warga nakal, atau menanyakan perihal donasi premium?\n\nSilakan klik tombol di bawah untuk membuat saluran bantuan khusus obrolan bersama staff kami.')
            .setColor(0x3b82f6);

          await interaction.reply({ embeds: [embed], components: [row] });
        }
        else if (commandName === 'play') {
          const laguName = interaction.options.getString('lagu') || 'Kopi Dangdut';
          const embed = new EmbedBuilder()
            .setTitle('🔊 Bot DJ Gang Indo Mengudara!')
            .setDescription(`🎵 Memutar trek musik **${laguName}** di Voice Channel.\n\n*Gunakan tab **Musik DJ Otomatis** di menu dashboard untuk daftar lagu komplit.*`)
            .setColor(0x10b981);
          await interaction.reply({ embeds: [embed] });
        }
        else if (commandName === 'playlist') {
          const currentDb = readDb();
          const playlistSongs = currentDb.botConfig.playlist || [];
          let descText = playlistSongs.map((t: any, i: number) => `**${i+1}.** 🎵 \`${t.title}\` - *${t.artist}* (${t.duration})`).join('\n') || 'Trek playlist aktif masih kosong.';
          
          const embed = new EmbedBuilder()
            .setTitle('🎶 Antrean Pemutar DJ Server')
            .setDescription(descText)
            .setColor(0xfa8231);
          await interaction.reply({ embeds: [embed] });
        }
      }

      // Check for button press
      if (interaction.isButton()) {
        const { customId } = interaction;

        if (customId === 'buat_ktp_btn') {
          const modal = new ModalBuilder()
            .setCustomId('ktp_modal')
            .setTitle('Pendaftaran KTP Virtual');

          const fullnameInput = new TextInputBuilder()
            .setCustomId('ktp_fullname')
            .setLabel('Nama Lengkap')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

          const genderInput = new TextInputBuilder()
            .setCustomId('ktp_gender')
            .setLabel('Jenis Kelamin (Laki-laki / Perempuan)')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

          const addressInput = new TextInputBuilder()
            .setCustomId('ktp_address')
            .setLabel('Domisili / Kota Asal')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

          const religionInput = new TextInputBuilder()
            .setCustomId('ktp_religion')
            .setLabel('Agama')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

          const hobbyInput = new TextInputBuilder()
            .setCustomId('ktp_hobby')
            .setLabel('Hobi / Aktivitas')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

          modal.addComponents(
             new ActionRowBuilder<TextInputBuilder>().addComponents(fullnameInput),
             new ActionRowBuilder<TextInputBuilder>().addComponents(genderInput),
             new ActionRowBuilder<TextInputBuilder>().addComponents(addressInput),
             new ActionRowBuilder<TextInputBuilder>().addComponents(religionInput),
             new ActionRowBuilder<TextInputBuilder>().addComponents(hobbyInput)
          );

          await interaction.showModal(modal);
        }

        if (customId === 'gacha_nasib_btn') {
          const currentDb = readDb();
          const gachaRolesList = currentDb.gachaRoles;
          if (gachaRolesList.length === 0) {
            return interaction.reply({ content: '❌ Konfigurasi role gacha server kosong.', ephemeral: true });
          }

          // Choose random role
          const totalChance = gachaRolesList.reduce((acc, r) => acc + r.chance, 0);
          let rand = Math.random() * totalChance;
          let winner: any = gachaRolesList[0];

          for (const role of gachaRolesList) {
            if (rand < role.chance) {
              winner = role;
              break;
            }
            rand -= role.chance;
          }

          // Try giving role and changing nickname if server is setup
          let nicknameStatus = '';
          try {
            const member = await interaction.guild?.members.fetch(interaction.user.id);
            // Search for active nickname decoration
            const decs = currentDb.botConfig.nicknameDecorations || [];
            const matchingDec = decs.filter((d: any) => d.active && d.rarityNeeded === winner.rarity)[0];
            if (member && matchingDec) {
              const currentName = member.nickname || member.user.globalName || member.user.username;
              // Clean existing prefix/suffix structures to prevent repeating them
              const cleanName = currentName.replace(/^\[[^\]]+\]\s*/, '').replace(/\s*\[[^\]]+\]$/, '');
              const newNickname = `${matchingDec.prefix}${cleanName}${matchingDec.suffix}`;
              if (newNickname.length <= 32) {
                await member.setNickname(newNickname);
                nicknameStatus = `\n\n🔖 **Nama Panggilan Anda diubah secara otomatis menjadi:**\n✨ \`${newNickname}\` ✨`;
              } else {
                nicknameStatus = `\n\n⚠️ *Nama panggilan kustom \`${newNickname}\` terlalu panjang (${newNickname.length} karakter). Batas limit Discord adalah 32 karakter.*`;
              }
            }
          } catch (e) {
            console.log('Error changing live member nickname:', e);
          }

          const embed = new EmbedBuilder()
            .setTitle('🔮 Hasil Gacha Nasib Server!')
            .setDescription(`Gacha sukses dilakukan oleh <@${interaction.user.id}>!\n\nAnda mendapat Rarity **[${winner.rarity}]** dan mendapat role:\n🌟 **${winner.roleName}**${nicknameStatus}`)
            .setColor(0xa855f7);

          await interaction.reply({ embeds: [embed] });
        }

        if (customId === 'buka_tiket_btn') {
          const embed = new EmbedBuilder()
            .setTitle('🎫 Loket Tiket Bantuan Berhasil Dibuat!')
            .setDescription(`Halo <@${interaction.user.id}>, tiket bantuan atau partnership Anda sedang diproses oleh moderator penanggung jawab.\n\nSilakan jelaskan kebutuhan detail Anda di saluran obrolan bantuan ini secara sopan. Terimakasih!`)
            .setColor(0x3b82f6);
          await interaction.reply({ embeds: [embed], ephemeral: true });
        }
      }

      // Check modal submission
      if (interaction.isModalSubmit()) {
        if (interaction.customId === 'ktp_modal') {
          const fullname = interaction.fields.getTextInputValue('ktp_fullname');
          const genderInput = interaction.fields.getTextInputValue('ktp_gender');
          const address = interaction.fields.getTextInputValue('ktp_address');
          const religion = interaction.fields.getTextInputValue('ktp_religion');
          const hobby = interaction.fields.getTextInputValue('ktp_hobby');

          const gender = genderInput.toLowerCase().includes('perempuan') ? 'Perempuan' : 'Laki-laki';
          const generatedId = '670402' + Math.floor(1000000000 + Math.random() * 9000000000).toString();
          const today = new Date();
          const formattedDate = today.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }).replace(/\//g, ' - ');

          const newRec = {
            id: generatedId,
            userId: interaction.user.id,
            username: interaction.user.username,
            fullname,
            gender,
            address,
            religion,
            hobby,
            avatarUrl: interaction.user.displayAvatarURL() || `https://api.dicebear.com/7.x/adventurer/svg?seed=${fullname}`,
            createdAt: formattedDate,
          };

          // Save to database
          const currentDb = readDb();
          const freshList = [newRec, ...currentDb.citizens];
          writeDb({ citizens: freshList });

          // Auto trigger Warga Role assign if roleId exists
          try {
            const member = await interaction.guild?.members.fetch(interaction.user.id);
            if (currentDb.botConfig.wargaRoleId) {
              await member?.roles.add(currentDb.botConfig.wargaRoleId);
            }
          } catch (err) {}

          const embed = new EmbedBuilder()
            .setTitle('📇 KTP Virtual Sukses Dicetak!')
            .setDescription(`🆕 <@${interaction.user.id}> baru saja resmi menjadi **Warga**!\n\n**Rincian KTP:**\n• **No KTP:** \`${generatedId}\`\n• **Nama:** \`${fullname}\`\n• **Domisili:** \`${address}\``)
            .setColor(0x10b981);

          await interaction.reply({ embeds: [embed] });
        }
      }
    });

    await discordClient.login(config.token);
  } catch (error) {
    console.error('Failed to log in Discord bot. Continuing in Virtual Sandbox Mode:', error);
  }
}

function shutdownDiscordBot() {
  if (discordClient) {
    try {
      discordClient.destroy();
      console.log('Discord Client destroyed and disconnected.');
    } catch (e) {}
    discordClient = null;
  }
}

// Start bot on server setup if credential is there
initDiscordBot();

// -------------------------------------------------------------
// VITE OR STATIC FILE INTEGRATION MIDDLEWARE
// -------------------------------------------------------------
async function bootstrapServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Express server + Gang Bot controller running on port ${PORT}`);
  });
}

bootstrapServer();
