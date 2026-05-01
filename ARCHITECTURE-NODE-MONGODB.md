# CORE RAMPAGE — Node.js + MongoDB Architecture

Pilihan backend: **Node.js + Express + MongoDB**.

Dokumen ini menjadi panduan teknis untuk membangun ulang CORE RAMPAGE ke hosting berbayar/VPS dengan backend modern dan scalable.

## Target Stack

- Runtime: Node.js 20+
- Framework: Express.js
- Database: MongoDB Atlas atau MongoDB self-hosted
- Auth: JWT + bcrypt
- Upload file: Multer + Cloudinary/S3/local VPS storage
- Validation: Zod/Joi
- Security: Helmet, CORS, rate limit
- Process manager: PM2
- Reverse proxy: Nginx
- SSL: Certbot

## Struktur Folder Target

```text
CORE-RAMPAGE/
├── client/
│   ├── index.html
│   ├── seller-register.html
│   ├── seller-login.html
│   ├── seller-dashboard.html
│   ├── admin-dashboard.html
│   ├── style.css
│   ├── script.js
│   └── assets/
├── server/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   │   ├── db.js
│   │   └── env.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Seller.js
│   │   ├── Store.js
│   │   ├── Product.js
│   │   ├── ProductVariant.js
│   │   ├── Order.js
│   │   ├── VerificationDocument.js
│   │   ├── Banner.js
│   │   ├── FAQ.js
│   │   └── Setting.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── seller.routes.js
│   │   ├── store.routes.js
│   │   ├── product.routes.js
│   │   ├── order.routes.js
│   │   ├── admin.routes.js
│   │   └── upload.routes.js
│   ├── controllers/
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── role.js
│   │   ├── upload.js
│   │   └── errorHandler.js
│   ├── utils/
│   └── package.json
├── docs/
├── ROADMAP.md
└── ARCHITECTURE-NODE-MONGODB.md
```

## Environment Variables

```env
NODE_ENV=production
PORT=3000
MONGO_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/core_rampage
JWT_SECRET=replace_with_long_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=https://domain-anda.com
UPLOAD_PROVIDER=local
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

## Database Collections

### users

Untuk pembeli, seller, dan admin.

```js
{
  name: String,
  email: String,
  phone: String,
  passwordHash: String,
  role: 'buyer' | 'seller' | 'admin',
  status: 'active' | 'suspended',
  createdAt: Date,
  updatedAt: Date
}
```

### stores

```js
{
  ownerId: ObjectId,
  storeName: String,
  storeSlug: String,
  description: String,
  logoUrl: String,
  coverUrl: String,
  badgeType: 'verified' | 'unverified' | 'star' | 'mall',
  verificationStatus: 'unverified' | 'pending' | 'verified' | 'rejected',
  whatsapp: String,
  category: String,
  followers: Number,
  responseSpeed: String,
  performance: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### products

```js
{
  storeId: ObjectId,
  name: String,
  slug: String,
  category: String,
  description: String,
  imageUrl: String,
  price: Number,
  oldPrice: Number,
  discountLabel: String,
  rating: Number,
  sold: Number,
  status: 'active' | 'inactive' | 'pending_review',
  createdAt: Date,
  updatedAt: Date
}
```

### product_variants

```js
{
  productId: ObjectId,
  name: String,
  price: Number,
  stock: Number,
  isActive: Boolean
}
```

### verification_documents

```js
{
  sellerId: ObjectId,
  storeId: ObjectId,
  ktpUrl: String,
  selfieUrl: String,
  payoutInfo: Object,
  status: 'pending' | 'approved' | 'rejected',
  adminNote: String,
  reviewedBy: ObjectId,
  reviewedAt: Date,
  createdAt: Date
}
```

### orders

```js
{
  buyerName: String,
  buyerPhone: String,
  items: [
    {
      productId: ObjectId,
      storeId: ObjectId,
      productName: String,
      storeName: String,
      variantName: String,
      price: Number,
      quantity: Number
    }
  ],
  paymentMethod: String,
  total: Number,
  status: 'pending' | 'paid' | 'processing' | 'completed' | 'cancelled',
  note: String,
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoint Plan

### Auth

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
```

### Seller

```text
POST /api/seller/open-store
GET  /api/seller/dashboard
PATCH /api/seller/store
POST /api/seller/verification
GET  /api/seller/orders
```

### Store

```text
GET /api/stores
GET /api/stores/trusted
GET /api/stores/:slug
GET /api/stores/:slug/products
```

### Product

```text
GET    /api/products
GET    /api/products/:slug
POST   /api/products
PATCH  /api/products/:id
DELETE /api/products/:id
POST   /api/products/:id/variants
PATCH  /api/products/:id/variants/:variantId
DELETE /api/products/:id/variants/:variantId
```

### Orders

```text
POST /api/orders
GET  /api/orders/:id
GET  /api/seller/orders
PATCH /api/seller/orders/:id/status
```

### Admin

```text
GET   /api/admin/dashboard
GET   /api/admin/sellers
PATCH /api/admin/sellers/:id/status
GET   /api/admin/verifications
PATCH /api/admin/verifications/:id/approve
PATCH /api/admin/verifications/:id/reject
GET   /api/admin/products
PATCH /api/admin/products/:id/status
PATCH /api/admin/settings
```

## Deployment ke VPS / Namecheap VPS

1. Install Node.js 20+
2. Install Nginx
3. Clone repository
4. Buat file `.env`
5. Jalankan `npm install` di folder `server`
6. Jalankan aplikasi dengan PM2

```bash
pm2 start server.js --name core-rampage-api
pm2 save
pm2 startup
```

7. Setup Nginx reverse proxy:

```nginx
server {
  server_name domain-anda.com www.domain-anda.com;

  root /var/www/CORE-RAMPAGE/client;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  location /api/ {
    proxy_pass http://127.0.0.1:3000/api/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

8. Aktifkan SSL:

```bash
sudo certbot --nginx -d domain-anda.com -d www.domain-anda.com
```

## Catatan Penting

GitHub Pages tetap bisa dipakai untuk versi frontend statis. Untuk marketplace penuh, gunakan VPS atau platform yang mendukung Node.js server.

Direkomendasikan untuk production:

- Namecheap VPS + Nginx + PM2 + MongoDB Atlas
- atau Render/Railway untuk backend + MongoDB Atlas

## Next Build Step

Langkah berikut di repository:

1. Buat folder `server/`
2. Buat `package.json`
3. Buat Express app skeleton
4. Buat model Mongoose dasar
5. Buat route auth dan store
6. Buat frontend Seller Center
