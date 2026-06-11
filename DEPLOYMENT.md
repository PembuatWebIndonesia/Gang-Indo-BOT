# 🚀 Panduan Deployment Gang Indo Bot & Dashboard

Dokumen ini menjelaskan cara men-deploy aplikasi kustom **Gang Indo Bot Dashboard** ke berbagai platform hosting terpopuler (GitHub Pages, Vercel, Netlify, Railway, Render, VPS, dll.), serta menjelaskan fungsionalitas sistem.

---

## 🔍 1. Informasi Penting: Pesan Websocket di AI Studio (HMR)
Jika Anda melihat pesan peringatan berikut di bagian log konsol ketika sedang melakukan editing/development di Google AI Studio:
> `[vite] gagal terhubung ke websocket (Kesalahan: WebSocket ditutup tanpa dibuka)`

⚠️ **Ini adalah hal yang normal dan aman untuk diabaikan.**
* **Kenapa terjadi?** Di lingkungan pengembangan sandboxed AI Studio, fitur *Hot Module Replacement* (HMR) sengaja dimatikan (`DISABLE_HMR=true`) agar web preview stabil dan tidak berkedip saat AI sedang menulis kode.
* **Apakah merusak program?** **Tidak.** HMR hanya digunakan untuk pembaruan cepat kode saat development. Ketika aplikasi Anda di-build atau di-deploy ke hosting luar, pesan ini otomatis hilang dan program berjalan 100% normal.

---

## 📦 2. Pilihan Model Deployment sesuai Jenis Hosting

Aplikasi ini dibangun menggunakan arsitektur **Full-Stack (Vite + React + Express Node.js)**. Anda dapat men-deploy-nya dengan 2 sistem cara:

### METODE A: Pure Static Frontend Only (GitHub Pages / Vercel / Netlify)
Gunakan metode ini jika Anda ingin meng-hosting panel dashboard simulator secara gratis dan interaktif.
* **Fitur Utama:** Simulator KTP, Simulator Gacha, Simulator Hiasan Nama Kustom, Pemutar DJ, dan Konsol Playground berjalan sepenuhnya di sisi browser (Local Storage).
* **Perintah Build:** Run `npm run build:client`
* **Folder Output:** Upload isi folder `dist/` hasil build ke penyedia hosting statis.

### METODE B: Full-Stack Container (Google Cloud Run / Railway / Render / VPS)
Gunakan metode ini jika Anda ingin menjalankan bot Discord secara live 24/7 beserta dashboard konfigurasinya yang saling sinkron secara real-time.
* **Fitur Utama:** Bot merespon command `/buat-ktp`, `/profile`, `/gacha-nasib`, `/play`, `/setup-ticket` di server Discord Anda seutuhnya, disokong oleh API Node.js.
* **Perintah Build:** Run `npm run build`
* **Perintah Menjalankan:** Run `npm run start`

---

## 🛠️ 3. Langkah-Langkah Deployment per Platform

### 🐙 A. GitHub Pages (Gratis - Static Frontend)
1. Buka file `vite.config.ts`. Jika Anda men-deploy di subfolder repository (contoh: `https://username.github.io/repository-name/`), tambahkan properti `base` di config:
   ```typescript
   export default defineConfig({
     base: '/repository-name/', // Sesuaikan dengan nama repo Anda
     plugins: [react(), tailwind()],
   });
   ```
2. Jalankan perintah kompilasi:
   ```bash
   npm run build:client
   ```
3. Folder `dist` baru akan terbentuk di direktori root.
4. Push folder `dist` tersebut ke branch `gh-pages` atau gunakan fitur GitHub Actions untuk auto-deploy.

### 🔺 B. Vercel / Netlify (Gratis - Static Frontend / Serverless)
1. Hubungkan akun GitHub Anda ke Vercel atau Netlify.
2. Impor repositori project ini.
3. Atur konfigurasi build berikut di panel:
   * **Framework Preset:** `Vite` (atau `Other`)
   * **Build Command:** `npm run build:client`
   * **Output Directory:** `dist`
4. Tekan tombol **Deploy**. Aplikasi Anda akan aktif dalam beberapa detik dengan tautan gratis HTTPS!

### 🚆 C. Railway / Render / Fly.io (Berbayar/Gratis - Full-Stack Express Bot)
Platform ini sangat cocok karena mendukung server runtime Node.js secara penuh untuk menghidupkan bot Discord Anda 24/7.
1. Daftarkan akun di Railway atau Render.
2. Buat layanan baru dari repositori GitHub Anda.
3. Tambahkan beberapa **Environment Variables** (Variabel Lingkungan) penting di dashboard hosting Anda:
   * `DISCORD_TOKEN` = Token Bot Discord Anda
   * `DISCORD_CLIENT_ID` = Client ID Bot Discord
   * `DISCORD_GUILD_ID` = Server ID Discord Anda
   * `GEMINI_API_KEY` = Kunci API Google Gemini (Optional untuk fitur tanya-ai)
4. Build commands akan terdeteksi otomatis dari `package.json`:
   * **Build command:** `npm run build`
   * **Start command:** `npm run start`
5. Deploy, dan bot Anda akan otomatis aktif secara real-time bergabung di server Discord!

### 🖥️ D. VPS Tradisional (Ubuntu / Debian / Centos)
1. Install Node.js v18+ dan git di server VPS Anda.
2. Clone repository Anda:
   ```bash
   git clone <url-repository>
   cd <nama-folder>
   ```
3. Install dependensi:
   ```bash
   npm install
   ```
4. Jalankan build full-stack:
   ```bash
   npm run build
   ```
5. Gunakan process manager seperti `pm2` agar server backend dan bot Anda tetap menyala meskipun terminal ditutup:
   ```bash
   npm install -g pm2
   pm2 start dist/server.cjs --name "gang-indo-bot"
   ```
6. Setup reverse proxy menggunakan Nginx ke port `3000` untuk meng-online-kan dashboard web Anda agar bisa diakses secara publik.

---

## 💡 Tips & Trik Tambahan
* **Sistem Database Mandiri:** Project ini dikonfigurasi untuk membaca database lokal terenkripsi serta API server. Jika Anda membutuhkan integrasi Cloud terpusat, Anda dapat dengan mudah mengaktifkan Firebase Firestore melalui langkah setup di lingkungan pengembangan kami.
* **Batasan Nama Panggilan Discord:** Ketika menggunakan fitur **Hiasan Nickname Kustom**, pastikan total panjang karakter prefiks + nama warga + sufiks tidak melebihi **32 karakter**, karena batasan mutlak dari sistem Discord.
