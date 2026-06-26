## Changelog — IMDb+

Versi semantik ditulis dalam bentuk MAJOR.MINOR.PATCH, dengan:
1. Tambah angka versi MAJOR jika membuat perubahan kode yang tidak lagi cocok dengan versi sebelumnya.
2. Tambah angka versi MINOR jika menambah fitur tanpa membuat versi lama tidak bisa digunakan.
3. Tambah angka versi PATCH jika ada perbaikan bug tanpa membuat versi lama tidak bisa digunakan.
4. Tambahan label dan versi sebelum rilis atau info tambahan tersedia sebagai ekstensi dari format MAJOR.MINOR.PATCH.

v2.0.0
- Baru      : integirtas ke TMDB
- perbaikan : Cache icon
- baru      : warna backround untuk kategori
- baru      : data scraping untuk TMDB
- baru      : link baru untuk function build

v1.4.1
- tambahkan: 10 link emblemb baru untuk movie dan tv

v1.4.0
- fix, add & update link
- add fungsi imput search

v1.3.1
- update get data
- get data helper

v1.3.0
- add pengaturan

v1.2.2 - Perbakan link:
- fix link vidsrch ke vsembed.ru
- hapus vidsrch.net
- add Cat3Film
- add pstream
- add Hydrahd
- add buildFilmAdult
- add Freudx
- add Nullsx
- add wilfmovies
- fix anymovie link
- fix yts
- fix ThePirateBay
- fix AnyMovies
- fix sflix
- fix vsembed.to

v1.2.1 — Perbaikan Link
Perbaikan & Peningkatan:
- Memperbaiki link 1movies.bz dan fmovies.gd untuk Alternative yang sebelumnya rusak.
- Memperbaiki sintax link pada Movies4uFree.net
- memperbaiki prompt chatgpt dan Perplexity

v1.2.0 - Menambahkan Link
Perbaikan & Peningkatan:
- Menambahkan link 1movies.bz dan fmovies.gd untuk Alternative.
- menambah mobile to webp (url)

v1.1.2 — Bugfix untuk Global IMDb
Perbaikan & Peningkatan:
- Memperbaiki @match untuk mirror /"*"/ (Global IMDb).

v1.1.1 — Perbaikan Stabilitas & Kebersihan Kode
Perbaikan & Peningkatan:
-	Memperbaiki error parser/TS pada 1.1.0 (sisa fragmen kode clipboard).
-	Refactor aman createPopup() dan perbaikan template HTML duplikat.
-	Konsisten ikon/label tombol (‘▶ IMDb+’, ‘❌’) + sinkronisasi ARIA.
-	Clipboard lebih andal + toast notifikasi (tanpa mengubah perilaku utama).
-	Penyesuaian kecil i18n dan grant userscript.
-	Pembersihan kode & pengoptimalan kinerja.

v1.1.0 — Penambahan Fitur & Perbaikan
Perbaikan & Peningkatan:
- Penambahan opsi pengaturan bahasa (Inggris & Indonesia)
- Penambahan dukungan multi-bahasa (UI: Inggris & Indonesia)
- Tema gelap/terang otomatis mengikuti preferensi sistem
- Opsi konfigurasi langsung via popup (tanpa edit kode)
- Penyimpanan preferensi via GM_setValue / GM_getValue

v1.0.1 — Penyempurnaan Stabilitas
Perbaikan & Peningkatan:
- Perbaikan bug popup kadang tidak tertutup otomatis setelah klik luar area
- Penyesuaian tampilan popup agar tetap rapi di layar kecil (<800px)
- Peningkatan keamanan clipboard (fallback aman untuk browser non-HTTPS)
- Optimisasi pemuatan ikon (favicon caching diaktifkan)
- Penambahan atribut aria-label & aria-controls agar lebih ramah pembaca layar
- Refactor kode builder createSection() dan createIcon() agar lebih modular
- Pembaruan dokumentasi internal di dalam kode (@description & @namespace)

v1.0.0 — Rilis Awal IMDb+
Fitur utama versi perdana:
- Menampilkan popup dinamis berisi kategori tautan:
  • Movie Streaming (berdasarkan IMDb ID tt#######)
  • TV Show Streaming (otomatis season=1&episode=1)
  • Subtitles (OpenSubtitles, Subscene, YIFY Subtitles)
  • Adult Section (opsional; berdasarkan nama/film)
- Tombol salin cepat:
  • Menyalin judul/nama film atau orang
  • Menyalin IMDb ID ke clipboard
  • Dilengkapi notifikasi kecil (“Disalin ke clipboard!”)
- Desain popup & tombol sederhana:
  • Warna abu lembut, bayangan halus, radius lembut
  • Responsif & ringan, tidak mengganggu tampilan IMDb asli
- Logika cerdas:
  • Parsing otomatis JSON-LD IMDb untuk mengambil judul & tahun film
  • Identifikasi otomatis apakah halaman title atau name
  • Favicon situs diambil otomatis (dengan fallback jika tidak ada)
- Interaksi pengguna:
  • Navigasi keyboard (Enter/Spasi untuk aktivasi tombol salin)
  • Popup dapat ditutup dengan klik di luar area
  • Fokus keyboard berpindah dengan jelas
- Konfigurasi mudah:
  • Variabel CONFIG di awal kode untuk mengatur kategori aktif
  • Dukungan mengubah ukuran ikon (default: 28px)
- Kompatibilitas luas:
  • Halaman didukung:
    - https://www.imdb.com/title/tt*
    - https://www.imdb.com/name/nm*
    - Termasuk mirror /id/ (Indonesian IMDb)
- Kinerja ringan:
  • Hanya aktif di domain IMDb
  • Tidak memakai dependensi eksternal selain jQuery 3.6.0
- Ikon
  • IMDb+ khusus dibuat sendiri (bukan dari sumber pihak ketiga)
  • mengubah ikon favicon dari image ke base64 inline agar lebih cepat dimuat
- Links
  • Link di dapat dari forum, rekomendasi, atau situs index link pihak ketiga
  • Link dibuka di tab baru (target="_blank" rel="noopener")

v0.9.0 — Versi Beta Internal
Fitur dasar yang diuji:
- Struktur awal tombol & popup
- Parsing sederhana dari window.location.href untuk mendapatkan ID
- Tombol salin pertama kali diimplementasikan (tanpa notifikasi)
- Layout CSS dasar (tanpa tema gelap)
- Builder link statis sederhana (1–2 situs uji coba)