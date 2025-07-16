# 🔗 Smart Linkify

Userscript ini secara otomatis mengubah semua teks yang menyerupai URL di sebuah halaman menjadi tautan (link) yang bisa Anda klik.

> Keunggulan utamanya adalah kemampuan untuk "belajar". Anda bisa mengajarinya pola URL baru dari domain mana pun melalui menu pengaturan, dan skrip akan mengingatnya untuk kunjungan berikutnya.

---

## ✨ Fitur Utama

-   **🤖 Linkify Otomatis**: Secara cerdas mengubah teks URL menjadi tautan `<a>` yang fungsional.
-   **🧠 Bisa Diajari (Teachable)**: Tambahkan dukungan untuk domain baru tanpa perlu menyentuh kode sama sekali.
-   **⚙️ Menu Pengaturan Terintegrasi**:
    -   **Tambah Pola URL**: Cukup berikan satu contoh URL, dan skrip akan membuat pola Regex secara otomatis untuk domain tersebut.
    -   **Hapus Pola**: Opsi untuk mereset semua pola kustom yang telah Anda ajarkan.
-   **💾 Penyimpanan Permanen**: Pola baru yang Anda tambahkan akan disimpan secara permanen di browser menggunakan `GM_setValue`.

---

## 🚀 Cara Penggunaan

### ➕ Menambah Pola Baru

1.  Klik ikon ekstensi **Tampermonkey** di browser Anda.
2.  Arahkan ke skrip **Smart Linkify** dan pilih **"Add New URL Pattern"**.
3.  Masukkan satu contoh URL lengkap dari domain yang ingin Anda aktifkan (contoh: `https://www.website-unik.com/folder/halaman.html`).
4.  Klik **OK** dan muat ulang halaman untuk melihat teks URL di situs tersebut menjadi tautan aktif.

### 🗑️ Menghapus Pola

1.  Klik ikon ekstensi **Tampermonkey**.
2.  Arahkan ke skrip dan pilih **"Delete All Saved Patterns"**.
3.  Konfirmasi pilihan Anda untuk menghapus semua pola yang telah Anda tambahkan.