# Deploy CORE RAMPAGE ke Vercel + Supabase

Dokumen ini menjelaskan arah deployment CORE RAMPAGE menggunakan:

- Frontend/Serverless API: Vercel
- Database/Auth/Storage: Supabase

Catatan penting: sebelumnya arsitektur utama direncanakan Node.js + MongoDB. Untuk Vercel + Supabase, arsitektur yang lebih cocok adalah Node.js serverless API + PostgreSQL Supabase. Jadi database MongoDB diganti menjadi Supabase Postgres.

## Kenapa Supabase Cocok

Supabase menyediakan:

- PostgreSQL database
- Authentication
- Row Level Security (RLS)
- Storage untuk logo toko, cover toko, gambar produk, dan dokumen verifikasi
- REST API otomatis
- Realtime opsional

## Struktur Project Target untuk Vercel

```text
CORE-RAMPAGE/
├── api/
│   ├── products.js
│   ├── stores.js
│   ├── seller-open-store.js
│   ├── seller-products.js
│   └── orders.js
├── lib/
│   └── supabase.js
├── seller/
│   ├── seller-login.html
│   ├── seller-register.html
│   ├── seller-dashboard.html
│   └── seller-style.css
├── assets/
├── index.html
├── style.css
├── script.js
├── package.json
├── vercel.json
├── .env.example
└── supabase/
    └── schema.sql
```

## Environment Variables di Vercel

Tambahkan di Vercel Project Settings > Environment Variables:

```env
SUPABASE_URL=https://PROJECT_ID.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Penting: `SUPABASE_SERVICE_ROLE_KEY` hanya boleh dipakai di serverless API folder `/api`, jangan pernah dipakai langsung di frontend.

## Setup Supabase

1. Buat project baru di Supabase.
2. Buka SQL Editor.
3. Jalankan file:

```text
supabase/schema.sql
```

4. Buat storage bucket:

```text
store-logos
store-covers
product-images
verification-documents
```

5. Aktifkan RLS sesuai kebutuhan production.

## Tabel Database

Tabel utama:

- profiles
- stores
- products
- product_variants
- orders
- order_items
- verification_documents
- site_settings
- banners
- faqs

## Deployment ke Vercel

1. Push repository ke GitHub.
2. Login ke Vercel.
3. Add New Project.
4. Import repository `CORE-RAMPAGE`.
5. Framework Preset: Other.
6. Build Command: kosongkan.
7. Output Directory: kosongkan.
8. Tambahkan environment variables Supabase.
9. Deploy.

## URL Penting

Frontend:

```text
/
/seller/seller-login.html
/seller/seller-register.html
/seller/seller-dashboard.html
```

API:

```text
/api/stores
/api/products
/api/seller-open-store
/api/orders
```

## Roadmap Teknis Vercel + Supabase

### Step 1 — Setup Static + API Skeleton

- package.json
- vercel.json
- lib/supabase.js
- api/products.js
- api/stores.js

### Step 2 — Supabase Schema

- Buat tabel stores
- Buat tabel products
- Buat tabel orders
- Buat tabel verification_documents

### Step 3 — Connect Homepage

- Homepage ambil data produk dari `/api/products`
- Homepage ambil toko terpercaya dari `/api/stores`

### Step 4 — Seller Center

- Buka toko masuk ke Supabase
- Produk seller masuk ke Supabase
- Upload logo/cover ke Supabase Storage

### Step 5 — Verification

- Seller upload dokumen
- Admin approve
- Store badge berubah menjadi verified

## Catatan Production

Untuk production, gunakan Supabase RLS dan authentication. Untuk tahap awal testing, API serverless bisa memakai service role key agar lebih cepat build, tetapi jangan expose key tersebut di browser.
