# CORE RAMPAGE Marketplace Roadmap

Dokumen ini menjadi peta pengembangan CORE RAMPAGE dari homepage statis menuju marketplace multi-seller yang siap dipindahkan ke hosting berbayar seperti Namecheap, VPS, cPanel, atau cloud hosting lain.

## Status Saat Ini

Homepage sudah memiliki fondasi marketplace:

- Header marketplace dengan search utama
- Bottom navigation
- Banner promo
- Produk terlaris
- Katalog produk
- Keranjang dan checkout WhatsApp
- Multi-seller product card
- Nama toko pada produk
- Badge seller: Verified, Belum Verified, Star Seller, Mall, Promo, Ready, Limited
- Section Toko Terpercaya
- Ranking toko berdasarkan total penjualan dan rating
- Store Page / halaman toko
- Deskripsi toko
- Logo toko dan cover toko
- Statistik toko: produk, rating, terjual, follower, respon, performa
- Tombol Ikuti Toko
- Filter produk berdasarkan toko

## Prinsip Produk

CORE RAMPAGE akan dikembangkan sebagai marketplace digital untuk:

- Topup game
- Joki game
- Aplikasi premium
- Akun digital
- OTP virtual
- Produk digital reseller

Target akhir: user dapat membuka toko sendiri, mengupload produk, mengupload dokumen verifikasi, dan mengelola toko seperti Seller Center.

---

## Phase 1 — Finalisasi Homepage Marketplace

Tujuan: membuat homepage stabil, rapi, dan siap menjadi landing utama marketplace.

Checklist:

- [x] Header marketplace
- [x] Search produk dan toko
- [x] Bottom navigation
- [x] Kartu produk marketplace
- [x] Badge seller
- [x] Ikon verified store
- [x] Section Toko Terpercaya
- [x] Store Page
- [x] Deskripsi toko
- [x] Statistik toko
- [x] Filter produk berdasarkan toko
- [ ] Logo produk lokal agar tidak muncul tanda tanya
- [ ] Kategori icon bulat
- [ ] Flash sale countdown
- [ ] Popup promo profesional
- [ ] Animasi add-to-cart
- [ ] SEO schema untuk produk dan toko

Output phase 1:

- Homepage siap publik
- Struktur data produk dan toko sudah rapi
- UI mobile-first stabil

---

## Phase 2 — Frontend Seller Center

Tujuan: membuat tampilan awal agar user dapat melihat alur buka toko dan dashboard seller.

Halaman yang dibuat:

- `/seller-register.html`
- `/seller-login.html`
- `/seller-dashboard.html`
- `/seller-products.html`
- `/seller-verification.html`
- `/seller-settings.html`

Fitur frontend:

- Form buka toko
- Nama toko
- Username toko / store slug
- Upload logo toko
- Upload cover toko
- Deskripsi toko
- Nomor WhatsApp seller
- Kategori utama toko
- Tambah produk
- Edit produk
- Hapus produk
- Tambah varian produk
- Status produk: aktif / nonaktif
- Upload dokumen verifikasi
- Status verifikasi: pending / approved / rejected

Output phase 2:

- Seller Center versi frontend siap dilihat
- Belum wajib terhubung database

---

## Phase 3 — Backend Marketplace

Tujuan: membuat sistem benar-benar dinamis dan tidak bergantung pada file JavaScript statis.

Rekomendasi stack:

### Opsi A — Node.js + Express + MongoDB

Cocok untuk deployment ke VPS, Render, Railway, atau Namecheap VPS.

Komponen:

- Node.js
- Express.js
- MongoDB Atlas / MongoDB VPS
- JWT authentication
- Multer / Cloudinary untuk upload gambar

### Opsi B — PHP + MySQL

Cocok untuk Namecheap shared hosting / cPanel.

Komponen:

- PHP 8+
- MySQL
- Session login
- Upload file ke hosting
- Admin panel berbasis PHP

Untuk Namecheap shared hosting, opsi PHP + MySQL biasanya paling mudah.
Untuk VPS/Render/Railway, opsi Node.js lebih fleksibel.

Database utama:

- users
- sellers
- stores
- products
- product_variants
- orders
- payments
- verification_documents
- reviews
- settings
- banners
- faqs

Output phase 3:

- Login user
- Login seller
- Login admin
- Data toko tersimpan di database
- Produk seller tampil otomatis di homepage

---

## Phase 4 — Admin Dashboard

Tujuan: admin dapat mengontrol seluruh marketplace.

Fitur admin:

- Dashboard statistik
- Kelola user
- Kelola seller
- Approve / reject toko
- Approve / reject dokumen verifikasi
- Kelola produk
- Kelola kategori
- Kelola banner
- Kelola marquee
- Kelola FAQ
- Kelola metode pembayaran
- Kelola komisi marketplace
- Kelola order
- Kelola laporan seller

Output phase 4:

- Admin tidak perlu edit GitHub lagi
- Semua konten homepage dapat diubah dari dashboard

---

## Phase 5 — Seller Verification System

Tujuan: seller yang mengupload dokumen lengkap mendapat logo Verified Store.

Dokumen seller:

- Nama lengkap
- Nomor WhatsApp aktif
- KTP / identitas
- Selfie dengan KTP
- Rekening / e-wallet payout
- Nama toko
- Deskripsi toko
- Logo toko

Status verifikasi:

- Belum Verified
- Pending Review
- Verified
- Rejected
- Suspended

Logika verified:

```js
if (seller.verificationStatus === 'verified') {
  store.badgeType = 'verified';
  store.verifiedIcon = true;
}
```

Output phase 5:

- Seller verified otomatis mendapat logo verified
- User dapat melihat status toko secara transparan

---

## Phase 6 — Order & Payment Flow

Tujuan: pesanan tidak hanya via WhatsApp, tetapi tercatat di sistem.

Fitur order:

- Checkout produk
- Pilih metode pembayaran
- Upload bukti pembayaran
- Status order: pending, paid, processing, completed, cancelled
- Order masuk ke seller
- Notifikasi admin
- Invoice order

Payment gateway opsional:

- Duitku
- Midtrans
- Xendit
- Tripay
- Manual QRIS

Output phase 6:

- Semua order tercatat
- Seller dapat melihat pesanan dari dashboard
- Admin dapat memantau transaksi

---

## Phase 7 — Telegram Bot Admin & Seller

Tujuan: admin dan seller bisa mengelola data tanpa membuka website.

Admin bot:

- Edit marquee
- Edit banner
- Edit FAQ
- Tambah produk
- Edit produk
- Hapus produk
- Approve seller
- Approve dokumen
- Cek order

Seller bot:

- Tambah produk
- Edit harga
- Nonaktifkan produk
- Cek order masuk
- Update status order

ReplyKeyboard contoh:

```text
🏪 Toko Saya | 📦 Produk Saya
➕ Tambah Produk | ✏️ Edit Produk
🧾 Order Masuk | ⚙️ Pengaturan
✅ Verifikasi | ❌ Batalkan
```

Output phase 7:

- Operasional marketplace bisa dilakukan dari Telegram

---

## Phase 8 — Migrasi ke Hosting Berbayar

Tujuan: website siap dipindahkan dari GitHub Pages ke hosting produksi.

### Jika menggunakan Namecheap Shared Hosting

Gunakan stack:

- PHP
- MySQL
- cPanel File Manager / FTP
- Domain + SSL Namecheap

Langkah migrasi:

1. Beli hosting Namecheap
2. Hubungkan domain ke hosting
3. Upload file frontend ke `public_html`
4. Buat database MySQL
5. Import tabel database
6. Konfigurasi file `.env` atau `config.php`
7. Aktifkan SSL
8. Test login, produk, seller, checkout

### Jika menggunakan VPS Namecheap

Gunakan stack:

- Ubuntu
- Nginx
- Node.js / PHP
- MongoDB / MySQL
- PM2 jika Node.js
- Certbot SSL

Langkah migrasi:

1. Setup VPS
2. Install Nginx
3. Install runtime backend
4. Upload source code
5. Setup environment variable
6. Setup database
7. Setup SSL
8. Setup domain DNS
9. Jalankan aplikasi production

---

## Struktur Folder Target

```text
CORE-RAMPAGE/
├── public/
│   ├── index.html
│   ├── assets/
│   │   ├── products/
│   │   ├── stores/
│   │   └── banners/
│   └── css/
├── src/
│   ├── js/
│   ├── components/
│   └── pages/
├── server/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── middleware/
├── admin/
├── seller/
├── database/
├── docs/
├── ROADMAP.md
└── README.md
```

---

## Prioritas Berikutnya

Urutan kerja berikutnya setelah roadmap ini:

1. Selesaikan homepage final
2. Buat halaman Buka Toko
3. Buat Seller Dashboard frontend
4. Buat Admin Dashboard frontend
5. Tentukan backend: PHP+MySQL atau Node.js+MongoDB
6. Buat database
7. Integrasi seller upload produk
8. Integrasi verifikasi dokumen seller
9. Integrasi order
10. Deploy ke hosting berbayar

---

## Catatan Penting

GitHub Pages hanya cocok untuk frontend statis. Untuk fitur seller yang benar-benar bisa login, upload produk, dan upload dokumen, website harus pindah ke backend hosting seperti:

- Namecheap shared hosting dengan PHP + MySQL
- Namecheap VPS dengan Node.js/PHP
- Render / Railway / VPS lain
- Supabase + frontend static hosting

Homepage sekarang adalah fondasi awal. Marketplace penuh membutuhkan database, authentication, file upload, dan admin approval system.
