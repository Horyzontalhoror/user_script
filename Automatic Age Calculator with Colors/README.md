# ⏱️ Kalkulator Umur Torrent Otomatis

Userscript ini secara otomatis memindai tanggal unggahan pada halaman torrent, menghitung usianya hingga hari ini, dan menampilkannya dengan jelas di samping tanggal asli.

> Dapatkan informasi visual cepat tentang usia sebuah torrent, apakah itu baru diunggah atau sudah lama ada, tanpa perlu menghitung manual.

---

## ✨ Fitur Utama

-   **🎯 Perhitungan Akurat**: Menghitung selisih waktu secara presisi dalam format **tahun, bulan, dan hari**.

-   **ℹ️ Tampilan Informatif**: Menambahkan label usia yang mudah dibaca (contoh: `(1 tahun 2 bulan)`) setelah tanggal unggahan.

-   **🎨 Pewarnaan Kondisional**: Memberikan warna pada label usia untuk identifikasi cepat:
    -   **Hijau**: Untuk torrent berusia **1 bulan atau kurang**.
    -   **Oranye**: Untuk torrent berusia antara **1 bulan hingga 1 tahun**.
    -   **Merah**: Untuk torrent berusia **1 tahun atau lebih**.

---

## 🔧 Konfigurasi & Kustomisasi

Agar skrip ini berfungsi di berbagai situs *tracker*, Anda mungkin perlu melakukan penyesuaian sederhana.

-   **Selector CSS Default**: Secara bawaan, skrip menargetkan elemen dengan selector `span.list-item.item-uploaded label`.
-   **Cara Mengubah**: Jika Anda ingin menggunakannya pada situs lain, Anda perlu **mengubah selector** ini di dalam kode skrip agar sesuai dengan struktur HTML halaman *tracker* tersebut.