import { CommandInfo } from '../types';

export const COMMANDS_DATA: CommandInfo[] = [
  // --- KTP & Gacha (Main Features) ---
  {
    name: 'setup-ktp',
    description: 'Menyiapkan loket pembuatan KTP Virtual di channel saat ini.',
    category: 'AI Canggih',
    usage: '/setup-ktp',
    exampleResponse: 'Loket KTP Virtual sukses dikirim ke channel #loket-ktp!'
  },
  {
    name: 'setup-gachanasib',
    description: 'Menyiapkan panel gacha role nasib otomatis di channel saat ini.',
    category: 'AI Canggih',
    usage: '/setup-gachanasib',
    exampleResponse: 'Sistem Gacha Nasib berhasil dipasang di channel #gacha-role!'
  },
  {
    name: 'my-ktp',
    description: 'Menampilkan KTP Virtual milk Anda atau user lain.',
    category: 'AI Canggih',
    usage: '/my-ktp [user]',
    args: [{ name: 'user', description: 'User Discord yang ingin dilihat', required: false }],
    exampleResponse: 'Menampilkan Kartu Tanda Penduduk milik @novirahmiati.'
  },
  {
    name: 'tanya-ai',
    description: 'Bertanya apa saja ke kecerdasan buatan Gemini AI Super Canggih.',
    category: 'AI Canggih',
    usage: '/tanya-ai [pertanyaan]',
    args: [{ name: 'pertanyaan', description: 'Pertanyaan atau prompt untuk AI', required: true }],
    exampleResponse: 'Menurut analisis saya, server Gang Discord Indonesia memiliki potensi kegemilangan...'
  },
  {
    name: 'analisis-server',
    description: 'Menganalisis status keaktifan server secara cerdas dengan Gemini AI.',
    category: 'AI Canggih',
    usage: '/analisis-server',
    exampleResponse: 'Analisis Server: Skor keaktifan 98/100. Rekomendasi event harian...'
  },

  // --- Moderasi (15 Commands) ---
  {
    name: 'ban',
    description: 'Memblokir anggota dari server secara permanen.',
    category: 'Moderasi',
    usage: '/ban [user] [alasan]',
    args: [
      { name: 'user', description: 'User yang ingin diban', required: true },
      { name: 'alasan', description: 'Alasan pemblokiran', required: false }
    ],
    exampleResponse: 'Anggota @bams sukses diblokir permanen. Alasan: SARA.'
  },
  {
    name: 'kick',
    description: 'Mengeluarkan anggota dari server.',
    category: 'Moderasi',
    usage: '/kick [user] [alasan]',
    args: [
      { name: 'user', description: 'User yang ingin dikick', required: true },
      { name: 'alasan', description: 'Alasan kick', required: false }
    ],
    exampleResponse: 'Anggota @kikim sukses dikeluarkan dari server.'
  },
  {
    name: 'mute',
    description: 'Membisukan suara/ketikan anggota di server.',
    category: 'Moderasi',
    usage: '/mute [user] [durasi] [alasan]',
    args: [
      { name: 'user', description: 'User yang ingin dimute', required: true },
      { name: 'durasi', description: 'Durasi bisu, cnth: 1h, 1d', required: true }
    ],
    exampleResponse: 'Anggota @tole sukses dimute selama 1 jam.'
  },
  {
    name: 'unmute',
    description: 'Mengembalikan suara/hak ketik anggota.',
    category: 'Moderasi',
    usage: '/unmute [user]',
    args: [{ name: 'user', description: 'User yang ingin diunmute', required: true }],
    exampleResponse: 'Hukuman mute untuk @tole telah dicabut.'
  },
  {
    name: 'warn',
    description: 'Memberikan peringatan formal kepada anggota.',
    category: 'Moderasi',
    usage: '/warn [user] [alasan]',
    args: [
      { name: 'user', description: 'User yang diwarn', required: true },
      { name: 'alasan', description: 'Alasan warn', required: true }
    ],
    exampleResponse: 'Peringatan ke-1 dikirimkan ke @tole. Alasan: Capslock berlebihan.'
  },
  {
    name: 'warn-list',
    description: 'Melihat histori peringatan tertulis anggota.',
    category: 'Moderasi',
    usage: '/warn-list [user]',
    exampleResponse: 'Histori @tole: 1 Warn (Capslock berlebihan).'
  },
  {
    name: 'warn-clear',
    description: 'Menghapus seluruh histori peringatan anggota.',
    category: 'Moderasi',
    usage: '/warn-clear [user]',
    exampleResponse: 'Seluruh peringatan untuk @tole telah dibersihkan.'
  },
  {
    name: 'clear',
    description: 'Menghapus pesan dalam jumlah banyak di channel.',
    category: 'Moderasi',
    usage: '/clear [jumlah]',
    args: [{ name: 'jumlah', description: 'Jumlah pesan (1-100)', required: true }],
    exampleResponse: 'Sukses menyapu bersih 50 pesan kotor!'
  },
  {
    name: 'lock',
    description: 'Mengunci channel saat ini agar tidak bisa diketik.',
    category: 'Moderasi',
    usage: '/lock [alasan]',
    exampleResponse: 'Channel #loket-ktp telah dikunci sementara. Harap tenang.'
  },
  {
    name: 'unlock',
    description: 'Membuka kunci channel agar bisa diketik kembali.',
    category: 'Moderasi',
    usage: '/unlock',
    exampleResponse: 'Lock dicabut. Channel #loket-ktp siap digunakan kembali.'
  },
  {
    name: 'slowmode',
    description: 'Mengatur durasi jeda pengiriman pesan di channel.',
    category: 'Moderasi',
    usage: '/slowmode [detik]',
    exampleResponse: 'Slowmode dipasang: 5 detik jeda per pesan.'
  },
  {
    name: 'timeout',
    description: 'Mengistirahatkan anggota dari obrolan secara otomatis.',
    category: 'Moderasi',
    usage: '/timeout [user] [menit]',
    exampleResponse: 'Anggota @rusdi ditaruh di ruang timeout selama 15 menit.'
  },
  {
    name: 'blacklist-word',
    description: 'Menambah kata terlarang otomatis disensor bot.',
    category: 'Moderasi',
    usage: '/blacklist-word [kata]',
    exampleResponse: 'Kata "kasar" telah ditambahkan ke database sensor bot.'
  },
  {
    name: 'purge-user',
    description: 'Menghapus pesan dari satu user spesifik.',
    category: 'Moderasi',
    usage: '/purge-user [user] [jumlah]',
    exampleResponse: 'Sukses menghapus 15 pesan terakhir dari @spammer.'
  },
  {
    name: 'check-alt',
    description: 'Menganalisis akun mencurigakan (clone/anak bawang).',
    category: 'Moderasi',
    usage: '/check-alt',
    exampleResponse: 'Hasil analisis: 2 akun terdeteksi berusia kurang dari 3 hari.'
  },

  // --- Utilitas (15 Commands) ---
  {
    name: 'ping',
    description: 'Mengecek kecepatan respon dan latensi bot.',
    category: 'Utilitas',
    usage: '/ping',
    exampleResponse: '🏓 Pong! Latensi Bot: 42ms | Latensi API: 35ms'
  },
  {
    name: 'botinfo',
    description: 'Melihat rincian spesifikasi dan statistik Gang Indo Bot.',
    category: 'Utilitas',
    usage: '/botinfo',
    exampleResponse: '🤖 **Gang Indo Bot v2.0-PRO** \n- Operating system: Linux \n- Node.JS: v20 \n- RAM: 154MB / 1024MB \n- Servers: 4,200 \n- Online: 24/7'
  },
  {
    name: 'serverinfo',
    description: 'Mengecek detail profil, owner, dan jumlah member server.',
    category: 'Utilitas',
    usage: '/serverinfo',
    exampleResponse: '🏰 **Nexora Gang Indonesia** \n- Owner: OwnerGanteng#123 \n- Regions: Indonesia \n- Members: 54,203 \n- Boost Level: 3'
  },
  {
    name: 'userinfo',
    description: 'Memeriksa detail informasi akun discord pengguna.',
    category: 'Utilitas',
    usage: '/userinfo [user]',
    exampleResponse: '👤 **Profil kicaumania** \n- ID: 1423089077032 \n- Join Discord: 2020 \n- Peran: @Admin, @TAEK'
  },
  {
    name: 'avatar',
    description: 'Mengunduh foto profil discord beresolusi tinggi.',
    category: 'Utilitas',
    usage: '/avatar [user]',
    exampleResponse: 'Berikut adalah tautan foto profil resolusi HD milik @budi: [Avatar Link]'
  },
  {
    name: 'help',
    description: 'Panduan navigasi perintah resmi dan menu tutorial bot.',
    category: 'Utilitas',
    usage: '/help',
    exampleResponse: 'Menampilkan buku panduan bot komplit. Ketik `/help [kategori]` untuk detail.'
  },
  {
    name: 'uptime',
    description: 'Mengukur seberapa lama bot menyala tanpa henti.',
    category: 'Utilitas',
    usage: '/uptime',
    exampleResponse: 'Bot aktif selama: 32 Hari, 15 Jam, 42 Menit.'
  },
  {
    name: 'translate',
    description: 'Menerjemahkan teks antar bahasa dunia secara instan.',
    category: 'Utilitas',
    usage: '/translate [teks] [ke_bahasa]',
    exampleResponse: 'Inggris -> Indonesia: "I love Indonesia" => "Saya cinta Indonesia".'
  },
  {
    name: 'reminder',
    description: 'Memasang alarm pengingat otomatis di masa depan.',
    category: 'Utilitas',
    usage: '/reminder [waktu] [pesan]',
    exampleResponse: 'Alarm terpasang! Bot akan membisikkan "Waktunya sahur" dalam 5 jam.'
  },
  {
    name: 'poll',
    description: 'Membuat pemungutan suara (voting) reaksi cepat.',
    category: 'Utilitas',
    usage: '/poll [pilihan1] | [pilihan2]',
    exampleResponse: 'Polling dimulai: "Makan Bakso" vs "Makan Seblak". Berikan reaksi!'
  },
  {
    name: 'invite',
    description: 'Mendapat tautan resmi memasukkan bot ke server Anda.',
    category: 'Utilitas',
    usage: '/invite',
    exampleResponse: 'Tautan undangan resmi: [Klik di Sini untuk Undang Gang Indo Bot]'
  },
  {
    name: 'weather',
    description: 'Melihat perkiraan cuaca kota-kota di Indonesia.',
    category: 'Utilitas',
    usage: '/weather [kota]',
    exampleResponse: 'Cuaca di Jakarta Selatan: 29°C (Cerah Berawan, Kelembapan 78%).'
  },
  {
    name: 'calculator',
    description: 'Menghitung rumus matematika langsung tanpa keluar discord.',
    category: 'Utilitas',
    usage: '/calculator [rumus]',
    exampleResponse: 'Hasil dari `250 * 4 / 2` adalah: `500`'
  },
  {
    name: 'shorten-url',
    description: 'Membuat link s.id atau bit.ly secara cepat.',
    category: 'Utilitas',
    usage: '/shorten-url [url]',
    exampleResponse: 'Link pendek sukses diproduksi: https://s.id/indo-gang-bot'
  },
  {
    name: 'embed-maker',
    description: 'Membuat pesan berkotak indah (Embed) kustomisasi warna.',
    category: 'Utilitas',
    usage: '/embed-maker [judul] | [konten]',
    exampleResponse: 'Embed kustom sukses dirender dan diletakkan di channel.'
  },

  // --- Ekonomi & RPG (15 Commands) ---
  {
    name: 'daily',
    description: 'Klaim gaji harian gratis Rp 5.000 rupiah virtual.',
    category: 'Ekonomi & Game',
    usage: '/daily',
    exampleResponse: 'Anda sukses mengklaim gaji harian sebesar Rp 5.000!'
  },
  {
    name: 'work',
    description: 'Bekerja serabutan halal (sopir angkot, koki, dll) untuk cari koin.',
    category: 'Ekonomi & Game',
    usage: '/work',
    exampleResponse: 'Anda bekerja sebagai Sopir TransJakarta dan digaji Rp 2.450!'
  },
  {
    name: 'beg',
    description: 'Mengemis di pinggir jalan raya barangkali ada sultan baik.',
    category: 'Ekonomi & Game',
    usage: '/beg',
    exampleResponse: 'Seseorang berhati emas melemparkan koin Rp 350 ke topi Anda.'
  },
  {
    name: 'balance',
    description: 'Melihat saldo dompet rupiah dan tabungan bank Anda.',
    category: 'Ekonomi & Game',
    usage: '/balance',
    exampleResponse: '💳 **Dompet:** Rp 15.200 | 🏦 **Tabungan:** Rp 140.000'
  },
  {
    name: 'pay',
    description: 'Mentransfer rupiah virtual ke sesama anggota server.',
    category: 'Ekonomi & Game',
    usage: '/pay [user] [jumlah]',
    args: [
      { name: 'user', description: 'User tujuan transfer', required: true },
      { name: 'jumlah', description: 'Jumlah uang transfer', required: true }
    ],
    exampleResponse: 'Sukses mengirimkan Rp 10.000 ke rekening @novirahmiati.'
  },
  {
    name: 'rob',
    description: 'Mencopet tabungan user lain (awas dilaporkan polisi!).',
    category: 'Ekonomi & Game',
    usage: '/rob [user]',
    exampleResponse: 'Aksi nekad! Anda berhasil mencopet Rp 4.200 dari kantong @bams.'
  },
  {
    name: 'gamble',
    description: 'Taruhan dadu koin nasib lipat ganda (untung atau buntung).',
    category: 'Ekonomi & Game',
    usage: '/gamble [taruhan]',
    exampleResponse: '💰 Menang! Dadu menunjukkan angka 6. Taruhan Rp 5.000 digandakan jadi Rp 10.000!'
  },
  {
    name: 'shop',
    description: 'Membuka minimarket warung bot untuk belanja gacha tiket dll.',
    category: 'Ekonomi & Game',
    usage: '/shop',
    exampleResponse: '🎒 **Warung Gang Bot:** \n1. Gacha Tiket - Rp 10.000 \n2. Pancingan Kayu - Rp 3.500 \n3. Senjata Berburu - Rp 12.000'
  },
  {
    name: 'buy',
    description: 'Membeli item berguna dari toko bot.',
    category: 'Ekonomi & Game',
    usage: '/buy [nomor_item]',
    exampleResponse: 'Sukses membeli Pancingan Kayu seharga Rp 3.500.'
  },
  {
    name: 'inventory',
    description: 'Membuka tas inventaris penyimpanan barang Anda.',
    category: 'Ekonomi & Game',
    usage: '/inventory',
    exampleResponse: '💼 **Tas @novirahmiati:** \n- 🎣 1x Pancingan Kayu \n- 🎟️ 3x Gacha Tiket \n- 🐟 15x Ikan Lele'
  },
  {
    name: 'fish',
    description: 'Memancing ikan di empang bapak (bisa dijual jadi duit).',
    category: 'Ekonomi & Game',
    usage: '/fish',
    exampleResponse: '🎣 Tarik berat! Anda mendapatkan *1x Ikan Gurame* seberat 3kg!'
  },
  {
    name: 'hunt',
    description: 'Berburu di hutan belantara mencari kelinci atau babi hutan.',
    category: 'Ekonomi & Game',
    usage: '/hunt',
    exampleResponse: '🎯 Door! Anda memburu seekor *Babi Hutan Liar* segar.'
  },
  {
    name: 'sell',
    description: 'Menjual hasil tangkapan pancingan/buruan menjadi uang tunai.',
    category: 'Ekonomi & Game',
    usage: '/sell [item]',
    exampleResponse: 'Sukses menjual *15x Ikan Lele* seharga Rp 7.500.'
  },
  {
    name: 'crime',
    description: 'Melakukan kejahatan licik berisiko tinggi (rampok bank).',
    category: 'Ekonomi & Game',
    usage: '/crime',
    exampleResponse: '🚨 Ketangkap Polisi! Anda gagal membobol brankas dan didenda Rp 2.000.'
  },
  {
    name: 'blackjack',
    description: 'Bermain kartu legendaris Blackjack 21 melawan Dealer Bot.',
    category: 'Ekonomi & Game',
    usage: '/blackjack [taruhan]',
    exampleResponse: '🃏 Blackjack! Nilai kartu Anda 21 mendominasi bot. Anda berhak mendapat uang ganda!'
  },

  // --- Hiburan & Budaya Indonesia (15 Commands) ---
  {
    name: 'pantun',
    description: 'Membuat pantun jenaka, romantis, atau nasehat khas nusantara.',
    category: 'Hiburan & Budaya',
    usage: '/pantun',
    exampleResponse: [
      'Masak air biar matang, nunggu matang sambil rebahan.',
      'Gimana hati gak bimbang, dompet tipis pas tanggal tua kawan.'
    ]
  },
  {
    name: 'tebak-gambar',
    description: 'Kuis game Tebak Gambar Indonesia dengan skor peringkat.',
    category: 'Hiburan & Budaya',
    usage: '/tebak-gambar',
    exampleResponse: '🧩 Gambar: [Buah Mangga + Kepala Sapi] => Ayo tebak! Jawaban disensor.'
  },
  {
    name: 'gombal',
    description: 'Kumpulan gombalan maut bikin hati target meleleh.',
    category: 'Hiburan & Budaya',
    usage: '/gombal',
    exampleResponse: 'Napas aku kok sesek ya? Oh iya, baru tersadar setengah napas aku kan tertinggal di kamu.'
  },
  {
    name: 'cerita-seram',
    description: 'Mitos seram dan cerita hantu urban legend Indonesia terpopuler.',
    category: 'Hiburan & Budaya',
    usage: '/cerita-seram',
    exampleResponse: 'Suatu malam di koridor sekolah tua, terdengar ketukan piano pelan berirama lingsir wengi...'
  },
  {
    name: 'joke-bapak2',
    description: 'Lelucon garing khas bapak-bapak Whatsapp bikin menghela napas.',
    category: 'Hiburan & Budaya',
    usage: '/joke-bapak2',
    exampleResponse: 'Kota apa yang selalu wangi? ... Kota Ba-ru harum!'
  },
  {
    name: 'primbon',
    description: 'Ramalan kecocokan jodoh menggunakan weton Jawa kuno.',
    category: 'Hiburan & Budaya',
    usage: '/primbon [nama1] [nama2]',
    exampleResponse: 'Kecocokan budi & sela: 85% (Suami pelindung, Istri pembawa rezeki berlimpah).'
  },
  {
    name: 'ramalan',
    description: 'Ramalan zodiak harian tentang cinta, karir, dan keuangan.',
    category: 'Hiburan & Budaya',
    usage: '/ramalan [zodiak]',
    exampleResponse: '♈ Aries: Karier bersinar, keuangan ada pemasukan mendadak, cinta jangan terlalu cuek!'
  },
  {
    name: 'meme',
    description: 'Menarik meme lucu internet random terpopuler dari reddit/FB.',
    category: 'Hiburan & Budaya',
    usage: '/meme',
    exampleResponse: 'Menampilkan meme humor gokil Indonesia.'
  },
  {
    name: 'suit',
    description: 'Taruhan suit jempol gajah, telunjuk manusia, kelingking semut.',
    category: 'Hiburan & Budaya',
    usage: '/suit [gajah|manusia|semut]',
    exampleResponse: 'Anda memilih Gajah, bot memilih Semut. Yah, Anda Kalah!'
  },
  {
    name: 'tebakan',
    description: 'Teka-teki seru bikin otak berputar humor tinggi.',
    category: 'Hiburan & Budaya',
    usage: '/tebakan',
    exampleResponse: 'Gajah apa yang belalainya pendek? Gajah minder.'
  },
  {
    name: 'weton',
    description: 'Hitung neptu weton hari lahir berdasarkan kalender jawa.',
    category: 'Hiburan & Budaya',
    usage: '/weton [tanggal-bulan-tahun]',
    exampleResponse: 'Lahir Kamis Pon memiliki Neptu 15: Watak penyabar namun keras kepala.'
  },
  {
    name: 'tebak-kata',
    description: 'Game menyusun kata terserak bahasa Indonesia.',
    category: 'Hiburan & Budaya',
    usage: '/tebak-kata',
    exampleResponse: 'Susunlah kata: "A-N-D-O-I-S-E-I-N" => Jawaban: INDONESIA!'
  },
  {
    name: 'ramal-nasib',
    description: 'Membaca peruntungan garis kelapa tangan virtual.',
    category: 'Hiburan & Budaya',
    usage: '/ramal-nasib',
    exampleResponse: 'Garis rezeki tegas! Di umur 27 tahun Anda diramal mendapat keberhasilan masif.'
  },
  {
    name: 'angka-keberuntungan',
    description: 'Menghitung deret angka hoki berdasarkan nama lengkap.',
    category: 'Hiburan & Budaya',
    usage: '/angka-keberuntungan [nama]',
    exampleResponse: 'Angka takdir keberuntungan Anda hari ini adalah: 7, 14, 88.'
  },
  {
    name: 'kamus-gaul',
    description: 'Kamus bahasa slang jakarta / anak Jaksel ter-update.',
    category: 'Hiburan & Budaya',
    usage: '/kamus-gaul [kata]',
    exampleResponse: 'Arti "Skena": Komunitas penikmat genre musik atau gaya hidup estetis tertentu.'
  },

  // --- Giveaway & Event (10 Commands) ---
  {
    name: 'giveaway-start',
    description: 'Memulai undian giveaway instan berhadiah menarik.',
    category: 'Event & Giveaway',
    usage: '/giveaway-start [durasi] [pemenang] [hadiah]',
    exampleResponse: '🎉 GIVEAWAY DIMULAI! Hadiah: Nitro Classic. Klik reaction 🎉 untuk ikut serta!'
  },
  {
    name: 'giveaway-end',
    description: 'Mengakhiri giveaway lebih awal dan mengambil pemenang.',
    category: 'Event & Giveaway',
    usage: '/giveaway-end [message_id]',
    exampleResponse: 'Giveaway berakhir! Selamat kepada pemenang: @kicaumania!'
  },
  {
    name: 'giveaway-reroll',
    description: 'Mengocok ulang pemenang giveaway jika hangus.',
    category: 'Event & Giveaway',
    usage: '/giveaway-reroll [message_id]',
    exampleResponse: 'Sukses reroll! Pemenang baru: @novirahmiati!'
  },
  {
    name: 'event-create',
    description: 'Membuat jadwal kegiatan server yang rapi disertai pengingat.',
    category: 'Event & Giveaway',
    usage: '/event-create [nama] [tanggal]',
    exampleResponse: 'Jadwal event: "Malam Akrab Karaoke" sukses dicatat pada 12 Juni 2026.'
  },
  {
    name: 'event-list',
    description: 'Menampilkan list seluruh jadwal acara server mendatang.',
    category: 'Event & Giveaway',
    usage: '/event-list',
    exampleResponse: '📋 **Daftar Event:** \n1. Karaoke Server (Besok) \n2. Turnamen MLBB (15 Juni)'
  },
  {
    name: 'tumpengan',
    description: 'Gelar acara potong nasi tumpeng virtual bersama semua member.',
    category: 'Event & Giveaway',
    usage: '/tumpengan',
    exampleResponse: '🌾 Tumpengan Akbar! Nasi kuning dipotong dan dibagikan ke @novirahmiati & segenap warga.'
  },
  {
    name: 'dangdutan',
    description: 'Nyetel irama koplo virtual joget santuy bareng bot.',
    category: 'Event & Giveaway',
    usage: '/dangdutan',
    exampleResponse: '💃 Tarik sis semongko! Musik dangdut koplo bergema kencang di voice channel!'
  },
  {
    name: 'absen',
    description: 'Melakukan presensi kehadiran harian di server.',
    category: 'Event & Giveaway',
    usage: '/absen',
    exampleResponse: '✅ @bams sukses berabsen ke-15 hari ini.'
  },
  {
    name: 'leaderboard',
    description: 'Data peringkat kekayaan member paling tajir melintir di server.',
    category: 'Event & Giveaway',
    usage: '/leaderboard',
    exampleResponse: '🏆 **Orang Terkaya Server:** \n1. @novirahmiati - Rp 1.500.0000 \n2. @bams - Rp 940.000'
  },
  {
    name: 'soundboard',
    description: 'Memutar suara khas meme Indonesia (Cukurukuk, Wadidaw, dll).',
    category: 'Event & Giveaway',
    usage: '/soundboard [nama_suara]',
    exampleResponse: '🔊 Memutar suara meme "Wadidaw" di diskord.'
  }
];
