const SUPABASE_URL = 'https://eggqozsnaybpvlcsohyr.supabase.co';
const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || '';

let supabaseClient = null;

function getClient() {
  if (!supabaseClient) {
    if (!window.supabase) {
      throw new Error('Supabase library belum dimuat.');
    }
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return supabaseClient;
}

function qs(selector) {
  return document.querySelector(selector);
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function rupiah(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

async function getSessionUser() {
  const client = getClient();
  const { data } = await client.auth.getUser();
  return data.user;
}

async function registerSeller(event) {
  event.preventDefault();
  const client = getClient();
  const form = event.currentTarget;
  const email = form.email.value.trim();
  const password = form.password.value;
  const fullName = form.full_name.value.trim();
  const storeName = form.store_name.value.trim();
  const username = slugify(form.username.value || storeName);
  const whatsapp = form.whatsapp.value.trim();
  const description = form.description.value.trim();

  const { data: signUpData, error: signUpError } = await client.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } }
  });

  if (signUpError) {
    alert(signUpError.message);
    return;
  }

  const userId = signUpData.user?.id;
  if (!userId) {
    alert('Registrasi berhasil. Silakan cek email untuk verifikasi, lalu login.');
    location.href = 'seller-login.html';
    return;
  }

  const { error: storeError } = await client.from('stores').insert({
    owner_id: userId,
    name: storeName,
    username,
    whatsapp,
    description,
    badge_type: 'unverified',
    is_verified: false,
    status: 'active'
  });

  if (storeError) {
    alert(storeError.message);
    return;
  }

  alert('Toko berhasil dibuat. Silakan login ke Seller Center.');
  location.href = 'seller-login.html';
}

async function loginSeller(event) {
  event.preventDefault();
  const client = getClient();
  const form = event.currentTarget;
  const email = form.email.value.trim();
  const password = form.password.value;

  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) {
    alert(error.message);
    return;
  }
  location.href = 'seller-dashboard.html';
}

async function logoutSeller() {
  await getClient().auth.signOut();
  location.href = 'seller-login.html';
}

async function loadDashboard() {
  const client = getClient();
  const user = await getSessionUser();
  if (!user) {
    location.href = 'seller-login.html';
    return;
  }

  const { data: store, error: storeError } = await client
    .from('stores')
    .select('*')
    .eq('owner_id', user.id)
    .single();

  if (storeError || !store) {
    qs('#sellerContent').innerHTML = '<div class="card">Toko belum ditemukan. Silakan buat toko terlebih dahulu.</div>';
    return;
  }

  const { data: products } = await client
    .from('products')
    .select('*')
    .eq('store_id', store.id)
    .order('created_at', { ascending: false });

  const totalSold = (products || []).reduce((sum, item) => sum + Number(item.sold || 0), 0);
  const avgRating = products && products.length
    ? (products.reduce((sum, item) => sum + Number(item.rating || 0), 0) / products.length).toFixed(1)
    : '0.0';

  qs('#sellerContent').innerHTML = `
    <section class="seller-hero">
      <div>
        <span class="seller-status">${store.is_verified ? 'Verified Store' : 'Belum Verified'}</span>
        <h1>${store.name}</h1>
        <p>${store.description || 'Belum ada deskripsi toko.'}</p>
      </div>
      <button onclick="logoutSeller()">Logout</button>
    </section>

    <section class="stats">
      <div class="card">Produk<br><strong>${products?.length || 0}</strong></div>
      <div class="card">Terjual<br><strong>${totalSold}</strong></div>
      <div class="card">Rating<br><strong>${avgRating}</strong></div>
      <div class="card">Status<br><strong>${store.is_verified ? 'Verified' : 'Pending'}</strong></div>
    </section>

    <section class="panel">
      <div class="panel-head">
        <h2>Tambah Produk</h2>
        <p>Produk akan masuk ke toko ${store.name}.</p>
      </div>
      <form id="productForm" class="seller-form product-form">
        <input name="name" placeholder="Nama produk" required>
        <input name="category" placeholder="Kategori" value="premium">
        <input name="price" type="number" placeholder="Harga" required>
        <input name="old_price" type="number" placeholder="Harga lama">
        <input name="image" placeholder="URL gambar/logo produk">
        <textarea name="description" placeholder="Deskripsi produk"></textarea>
        <button type="submit">Tambah Produk</button>
      </form>
    </section>

    <section class="panel">
      <h2>Produk Saya</h2>
      <div class="seller-products">
        ${(products || []).map(product => `
          <article class="seller-product-card">
            <div>
              <h3>${product.name}</h3>
              <p>${product.category || 'lainnya'} • ${product.status || 'active'}</p>
              <strong>${rupiah(product.price)}</strong>
            </div>
            <button onclick="deleteProduct('${product.id}')">Hapus</button>
          </article>
        `).join('') || '<p>Belum ada produk.</p>'}
      </div>
    </section>
  `;

  qs('#productForm').addEventListener('submit', event => addProduct(event, store.id));
}

async function addProduct(event, storeId) {
  event.preventDefault();
  const client = getClient();
  const form = event.currentTarget;

  const { error } = await client.from('products').insert({
    store_id: storeId,
    name: form.name.value.trim(),
    category: form.category.value.trim() || 'lainnya',
    description: form.description.value.trim(),
    price: Number(form.price.value || 0),
    old_price: Number(form.old_price.value || 0),
    image: form.image.value.trim(),
    rating: 5,
    sold: 0,
    status: 'active'
  });

  if (error) {
    alert(error.message);
    return;
  }

  alert('Produk berhasil ditambahkan.');
  loadDashboard();
}

async function deleteProduct(id) {
  if (!confirm('Hapus produk ini?')) return;
  const { error } = await getClient().from('products').delete().eq('id', id);
  if (error) {
    alert(error.message);
    return;
  }
  loadDashboard();
}

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = qs('#sellerRegisterForm');
  const loginForm = qs('#sellerLoginForm');
  if (registerForm) registerForm.addEventListener('submit', registerSeller);
  if (loginForm) loginForm.addEventListener('submit', loginSeller);
  if (qs('#sellerContent')) loadDashboard();
});
