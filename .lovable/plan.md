
# Rencana Implementasi: Search, Category Pages, Quote Rotation, dan Mobile Reading Mode

## Ringkasan
Menambahkan 4 fitur utama:
1. **Search/Filter Artikel** - Pencarian dan filter berdasarkan kategori dan tags
2. **Halaman Kategori** - Halaman khusus untuk Filsafat dan Book Review
3. **Quote Rotation** - Animasi rotasi kutipan filsuf di hero section
4. **Mobile Reading Mode** - Perbaikan responsive untuk mode baca di mobile

---

## 1. Fitur Search dan Filter Artikel

### Komponen Baru: `ArticleSearch.tsx`
- Input pencarian dengan styling paper/vintage
- Filter dropdown untuk kategori (Filsafat, Book Review, Growth)
- Filter tags dengan chip yang bisa diklik
- Hasil pencarian real-time dengan animasi fade
- Tombol clear/reset filter

### Integrasi di Index.tsx
- Menambahkan komponen search di atas grid artikel
- State management untuk query, kategori aktif, dan tags aktif
- Filtering logic menggunakan `useMemo` untuk performa

### Fitur Pencarian:
- Pencarian berdasarkan judul artikel
- Pencarian berdasarkan subtitle
- Pencarian berdasarkan konten introduction
- Case-insensitive matching

---

## 2. Halaman Kategori Filsafat dan Book Review

### File Baru: `src/pages/Filsafat.tsx`
- Hero section dengan quote filsuf acak
- Grid artikel yang difilter kategori "Filsafat"
- Section "Tentang Filsafat" dengan paper styling
- Statistik artikel (jumlah artikel, total read time)
- Decorative elements (ornaments, torn edges)

### File Baru: `src/pages/BookReview.tsx`
- Hero section dengan ikon buku
- Grid artikel kategori "Book Review"
- Section "About Book Reviews" dengan rekomendasi
- Reading list sidebar atau featured review

### Update `App.tsx`
- Menambahkan route `/filsafat` dan `/book-review`
- Import halaman baru

### Update `Header.tsx`
- Memastikan link navigasi mengarah ke halaman kategori yang benar

---

## 3. Quote Rotation di Hero Section

### Update `HeroSection.tsx`
- Array kutipan filsuf terkenal (10-15 kutipan)
- State untuk quote aktif
- Auto-rotation setiap 8 detik
- Animasi transisi dengan framer-motion:
  - Fade out quote lama
  - Slide up quote baru
  - Efek typewriter opsional

### Kutipan yang Disertakan:
- Socrates, Plato, Aristoteles
- Marcus Aurelius, Seneca, Epictetus (Stoik)
- Kierkegaard, Nietzsche, Camus (Eksistensialis)
- Lao Tzu, Confucius (Eastern philosophy)

### Komponen Quote:
- Nama filsuf dengan font script
- Kutipan dengan font editorial italic
- Navigasi dots untuk manual switch
- Pause on hover

---

## 4. Mobile Responsive Reading Mode

### Masalah Saat Ini:
- Layout dua halaman (book spread) tidak sesuai untuk mobile
- Konten terpotong karena fixed width
- Navigation controls terlalu kecil
- Margin notes area mengambil terlalu banyak ruang

### Solusi di `BookReadingMode.tsx`:

#### Layout Mobile (< 768px):
- **Single page mode** - hanya menampilkan satu halaman, bukan spread
- Full width content area (95vw)
- Menghapus left page preview di mobile
- Menghapus book spine effect di mobile
- Larger touch targets untuk navigation

#### Perbaikan Spesifik:
```text
Desktop (2 pages):          Mobile (1 page):
+--------+--------+         +----------------+
| Left   | Right  |         |                |
| Page   | Page   |         |  Single Page   |
|        |        |         |   Full Width   |
+--------+--------+         +----------------+
```

#### Responsive Changes:
- Content area: `left-4 right-4` (bukan `left-16 right-10`)
- Font size: lebih besar untuk readability
- Navigation: tombol full-width di bawah
- Margin notes: collapsible sidebar atau bottom sheet
- Page curl: disabled di mobile (tap to navigate)

#### Touch Gestures:
- Swipe left/right untuk navigasi halaman
- Touch feedback yang jelas
- Disable pinch-to-zoom di reading mode

---

## Detail Teknis

### Struktur File Baru:
```text
src/
├── components/
│   └── ArticleSearch.tsx          (baru)
├── pages/
│   ├── Filsafat.tsx               (baru)
│   └── BookReview.tsx             (baru)
```

### File yang Dimodifikasi:
```text
src/
├── App.tsx                        (routes)
├── components/
│   ├── HeroSection.tsx            (quote rotation)
│   └── BookReadingMode.tsx        (mobile responsive)
├── pages/
│   └── Index.tsx                  (search integration)
```

### Dependencies:
- Tidak ada dependency baru yang diperlukan
- Menggunakan `framer-motion` yang sudah ada untuk animasi
- Menggunakan `use-mobile` hook yang sudah ada

### Data Helper Functions di `articles.ts`:
```typescript
// Menambahkan helper functions
export function getArticlesByCategory(category: string): Article[]
export function getAllTags(): string[]
export function searchArticles(query: string, category?: string, tags?: string[]): Article[]
```

---

## Urutan Implementasi

1. **Phase 1: Data Layer**
   - Tambahkan helper functions di `articles.ts`
   - Buat array kutipan filsuf

2. **Phase 2: Category Pages**
   - Buat `Filsafat.tsx` dan `BookReview.tsx`
   - Update routing di `App.tsx`

3. **Phase 3: Search Component**
   - Buat `ArticleSearch.tsx`
   - Integrasikan di `Index.tsx`

4. **Phase 4: Quote Rotation**
   - Update `HeroSection.tsx`
   - Tambahkan animasi dan auto-rotation

5. **Phase 5: Mobile Reading Mode**
   - Refactor `BookReadingMode.tsx`
   - Tambahkan responsive breakpoints
   - Implementasi single-page mode untuk mobile
   - Test di berbagai ukuran layar

---

## Preview Hasil Akhir

### Search Bar:
- Paper-styled input dengan ikon search
- Dropdown kategori dengan ornament styling
- Tags sebagai clickable chips dengan highlight effect

### Quote Rotation:
- Smooth fade transition antar kutipan
- Nama filsuf muncul dengan animasi handwriting
- Indicator dots untuk navigasi manual

### Mobile Reading Mode:
- Single page view yang nyaman dibaca
- Swipe navigation yang responsif
- Bottom navigation bar yang sticky
- Konten tidak terpotong
