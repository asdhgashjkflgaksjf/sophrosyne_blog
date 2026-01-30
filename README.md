# Sophrosyne Blog

> Where Wisdom Meets Wonder — Blog filosofi personal dengan estetika vintage paper.

![Sophrosyne](https://img.shields.io/badge/Sophrosyne-Blog-8B4513?style=for-the-badge)
![Decap CMS](https://img.shields.io/badge/Decap-CMS-00C7B7?style=for-the-badge)
![Cloudflare](https://img.shields.io/badge/Cloudflare-Pages-F38020?style=for-the-badge)

---

## 📋 Daftar Isi

- [Fitur](#-fitur)
- [Tech Stack](#-tech-stack)
- [Setup Development](#-setup-development)
- [Setup Decap CMS](#-setup-decap-cms)
- [Setup GitHub OAuth](#-setup-github-oauth)
- [Deploy ke Cloudflare Pages](#-deploy-ke-cloudflare-pages)
- [Menulis Artikel Pertama](#-menulis-artikel-pertama)
- [Mode Maintenance](#-mode-maintenance)
- [Struktur Konten](#-struktur-konten)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Fitur

- 📝 **Decap CMS** — Panel admin untuk menulis artikel tanpa coding
- 📅 **Scheduled Posts** — Jadwalkan publikasi artikel di masa depan
- 📋 **Editorial Workflow** — Draft → Review → Ready → Published
- 🎨 **Vintage Paper Style** — Estetika kertas tua yang unik
- 🔧 **Mode Maintenance** — Halaman "Under Construction" yang bisa diaktifkan via CMS
- 📱 **Responsive** — Tampil sempurna di desktop dan mobile
- 🌐 **SEO Optimized** — Meta tags, canonical URL, dan structured data

---

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| TypeScript | Type Safety |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Decap CMS | Content Management |
| Cloudflare Pages | Hosting |

---

## 💻 Setup Development

### Prerequisites

- Node.js 18+ atau Bun
- Git
- Akun GitHub
- Akun Cloudflare (gratis)
- Akun Netlify (gratis, untuk OAuth)

### Instalasi Lokal

```bash
# Clone repository
git clone https://github.com/USERNAME/sophrosyne-blog.git
cd sophrosyne-blog

# Install dependencies
npm install
# atau
bun install

# Jalankan development server
npm run dev
# atau
bun dev
```

Buka `http://localhost:5173` di browser.

---

## 📝 Setup Decap CMS

Decap CMS sudah terkonfigurasi di project ini. File konfigurasi ada di:

```
public/admin/
├── config.yml    # Konfigurasi CMS
└── index.html    # Halaman admin
```

### Struktur Koleksi

| Koleksi | Path | Deskripsi |
|---------|------|-----------|
| `articles` | `src/content/articles/` | Artikel blog utama |
| `drafts` | `src/content/drafts/` | Draft box untuk ide |
| `settings` | `src/content/settings/` | Pengaturan website |

---

## 🔐 Setup GitHub OAuth

Decap CMS membutuhkan autentikasi untuk mengakses repository GitHub. Kita menggunakan **Netlify Identity** sebagai OAuth bridge (gratis!).

### Langkah 1: Buat GitHub OAuth App

1. Buka [GitHub Developer Settings](https://github.com/settings/developers)
2. Klik **"New OAuth App"**
3. Isi form:

| Field | Value |
|-------|-------|
| Application name | `Sophrosyne Blog Admin` |
| Homepage URL | `https://your-site.pages.dev` |
| Authorization callback URL | `https://api.netlify.com/auth/done` |

4. Klik **"Register application"**
5. **Catat Client ID** yang muncul
6. Klik **"Generate a new client secret"**
7. **Catat Client Secret** (hanya muncul sekali!)

### Langkah 2: Setup Netlify Site

1. Buka [Netlify](https://app.netlify.com)
2. Klik **"Add new site"** → **"Import an existing project"**
3. Pilih repository GitHub Anda
4. Untuk build settings, isi:
   - Build command: `npm run build` (atau kosongkan)
   - Publish directory: `dist`
5. Klik **"Deploy site"**

> ⚠️ **Catatan**: Kita hanya butuh Netlify untuk OAuth, bukan untuk hosting. Hosting tetap di Cloudflare Pages.

### Langkah 3: Enable Netlify Identity

1. Di dashboard Netlify, buka site Anda
2. Pergi ke **Site configuration** → **Identity**
3. Klik **"Enable Identity"**

### Langkah 4: Configure External Providers

1. Di halaman Identity, scroll ke **"Registration preferences"**
2. Pilih **"Invite only"** (rekomendasi untuk keamanan)
3. Scroll ke **"External providers"**
4. Klik **"Add provider"** → **"GitHub"**
5. Masukkan **Client ID** dan **Client Secret** dari langkah 1
6. Klik **"Save"**

### Langkah 5: Enable Git Gateway

1. Di halaman Identity, scroll ke bawah
2. Di bagian **"Services"**, klik **"Enable Git Gateway"**

### Langkah 6: Update Config CMS

Edit `public/admin/config.yml`:

```yaml
backend:
  name: github
  repo: YOUR_GITHUB_USERNAME/YOUR_REPO_NAME
  branch: main
  site_domain: YOUR_NETLIFY_SITE.netlify.app
```

Ganti:
- `YOUR_GITHUB_USERNAME` dengan username GitHub Anda
- `YOUR_REPO_NAME` dengan nama repository
- `YOUR_NETLIFY_SITE` dengan subdomain Netlify Anda

### Langkah 7: Invite Yourself

1. Di Netlify Identity, klik **"Invite users"**
2. Masukkan email Anda
3. Cek email dan klik link untuk setup password

### Test Login

1. Buka `https://your-site.pages.dev/admin`
2. Klik **"Login with Netlify Identity"**
3. Login dengan GitHub atau email/password
4. Anda sekarang bisa mengakses panel admin! 🎉

---

## 🚀 Deploy ke Cloudflare Pages

### Langkah 1: Push ke GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### Langkah 2: Connect ke Cloudflare Pages

1. Buka [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Pilih akun Anda
3. Pergi ke **Workers & Pages** → **Pages**
4. Klik **"Create application"** → **"Pages"** → **"Connect to Git"**
5. Authorize Cloudflare untuk akses GitHub
6. Pilih repository Anda

### Langkah 3: Configure Build

| Setting | Value |
|---------|-------|
| Framework preset | `Vite` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/` |

### Langkah 4: Deploy

1. Klik **"Save and Deploy"**
2. Tunggu proses build selesai (biasanya 1-2 menit)
3. Site Anda tersedia di `https://your-project.pages.dev`

### Custom Domain (Opsional)

1. Di Cloudflare Pages, buka project Anda
2. Pergi ke **Custom domains**
3. Klik **"Set up a custom domain"**
4. Ikuti instruksi untuk menambahkan DNS record

---

## ✍️ Menulis Artikel Pertama

### Akses Panel Admin

1. Buka `https://your-site.pages.dev/admin`
2. Login dengan Netlify Identity

### Membuat Artikel Baru

1. Di sidebar, klik **"📚 Artikel Blog"**
2. Klik **"New Artikel Blog"**
3. Isi informasi artikel:

#### Informasi Dasar

| Field | Deskripsi | Contoh |
|-------|-----------|--------|
| Judul Artikel | Judul utama | "Filosofi Stoikisme untuk Kehidupan Modern" |
| Slug URL | URL-friendly slug | `filosofi-stoikisme-modern` |
| Tanggal Publikasi | Kapan artikel dipublish | `2024-01-15` |
| Kategori | Kategori artikel | `filsafat` |
| Penulis | Nama penulis | "Sophrosyne" |

#### Konten Artikel

Di bagian **"Konten Artikel"**, Anda bisa menambahkan berbagai block:

| Block Type | Kegunaan |
|------------|----------|
| **Heading** | Sub-judul (H2, H3, H4) |
| **Paragraph** | Paragraf teks biasa |
| **List** | Daftar (ordered/unordered) |
| **Image** | Gambar dengan caption |
| **Quote** | Kutipan dengan sumber |
| **Highlight Box** | Box info, tip, warning, atau quote |
| **Code Block** | Kode dengan syntax highlighting |
| **Divider** | Pemisah dekoratif |

#### Contoh Struktur Artikel

```
1. [Heading] H2: "Apa itu Stoikisme?"
2. [Paragraph] "Stoikisme adalah filosofi Yunani kuno..."
3. [Quote] "Kita tidak bisa mengontrol apa yang terjadi pada kita..."
4. [Highlight Box - Tip] "Mulailah dengan mencatat 3 hal..."
5. [Divider - Ornament]
6. [Heading] H2: "Praktik Harian Stoikisme"
7. [List - Ordered] "1. Meditasi pagi, 2. Journaling malam..."
```

#### SEO (Opsional)

- **Meta Title**: Judul untuk search engine (max 60 karakter)
- **Meta Description**: Deskripsi untuk search engine (max 160 karakter)
- **Canonical URL**: URL kanonik jika artikel dipublish di tempat lain

### Menyimpan & Publish

1. **Save Draft**: Simpan sebagai draft (tidak dipublish)
2. **Publish**: Langsung publish artikel

Dengan **Editorial Workflow**:

1. **Draft** → Artikel sedang ditulis
2. **In Review** → Artikel siap direview
3. **Ready** → Artikel siap dipublish
4. Klik **"Publish"** untuk mempublish

### Scheduled Posts

Untuk menjadwalkan artikel:

1. Set **"Tanggal Publikasi"** ke tanggal di masa depan
2. Simpan artikel
3. Artikel akan otomatis muncul setelah tanggal tersebut

---

## 🔧 Mode Maintenance

### Mengaktifkan via CMS

1. Buka `/admin`
2. Pergi ke **"⚙️ Pengaturan"** → **"🔧 Mode Maintenance"**
3. Toggle **"Aktifkan Mode Maintenance"** ke ON
4. Isi pesan dan estimasi waktu
5. Klik **"Publish"**

### Mengaktifkan via File

Edit `src/content/settings/maintenance.json`:

```json
{
  "enabled": true,
  "title": "Sedang Dalam Perbaikan",
  "message": "Kami sedang melakukan pembaruan...",
  "estimatedTime": "1-2 jam",
  "contactEmail": "hello@sophrosyne.id",
  "showProgress": true,
  "progressPercent": 50
}
```

> 📝 **Catatan**: Route `/admin` tetap bisa diakses saat maintenance mode aktif.

---

## 📁 Struktur Konten

```
src/content/
├── articles/           # Artikel blog (JSON)
│   └── contoh-artikel.json
├── books/              # Review buku (coming soon)
├── drafts/             # Draft box untuk ide
│   └── .gitkeep
└── settings/           # Pengaturan website
    ├── about.json      # Halaman About
    ├── general.json    # Pengaturan umum
    ├── maintenance.json # Mode maintenance
    ├── newsletter.json # Newsletter settings
    └── social.json     # Social media links
```

### Format Artikel (JSON)

```json
{
  "title": "Judul Artikel",
  "slug": "judul-artikel",
  "publishDate": "2024-01-15",
  "category": "filsafat",
  "author": "Sophrosyne",
  "excerpt": "Ringkasan singkat artikel...",
  "featured": false,
  "hidden": false,
  "featuredImage": "/images/artikel.jpg",
  "content": [
    {
      "type": "paragraph",
      "text": "Paragraf pertama..."
    },
    {
      "type": "heading",
      "level": "h2",
      "text": "Sub Judul"
    }
  ],
  "seo": {
    "metaTitle": "Judul untuk SEO",
    "metaDescription": "Deskripsi untuk SEO"
  }
}
```

---

## ❓ Troubleshooting

### Error: "Unable to access repo"

**Penyebab**: Git Gateway belum diaktifkan atau credential salah.

**Solusi**:
1. Pastikan Git Gateway sudah di-enable di Netlify Identity
2. Cek Client ID dan Secret di GitHub OAuth App
3. Pastikan `site_domain` di config.yml sesuai

### Error: "No identity instance"

**Penyebab**: Netlify Identity widget tidak bisa connect.

**Solusi**:
1. Pastikan URL `site_domain` di config.yml benar
2. Clear cache browser
3. Coba login di incognito window

### Artikel Scheduled Tidak Muncul

**Penyebab**: Logic filter belum berjalan.

**Solusi**:
1. Pastikan format tanggal `publishDate` adalah `YYYY-MM-DD`
2. Cek timezone server vs lokal
3. Rebuild site setelah tanggal publikasi

### Build Error di Cloudflare

**Penyebab**: Node version atau dependency issue.

**Solusi**:
1. Di Cloudflare Pages settings, set environment variable:
   - `NODE_VERSION` = `18`
2. Pastikan `package-lock.json` ada di repository

---

## 📄 License

MIT License - Feel free to use this project for your own blog!

---

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

<p align="center">
  <strong>Sophrosyne</strong><br>
  <em>Where Wisdom Meets Wonder</em>
</p>
