const products=[{id:1,name:'Mobile Legends Diamond',cat:'topup',price:3000,img:'ML'},{id:2,name:'Free Fire Diamond',cat:'topup',price:5000,img:'FF'},{id:3,name:'Joki Rank ML',cat:'joki',price:10000,img:'JR'},{id:4,name:'YouTube Premium',cat:'premium',price:15000,img:'YT'},{id:5,name:'Spotify Premium',cat:'premium',price:18000,img:'SP'},{id:6,name:'Akun Netflix',cat:'akun',price:25000,img:'NF'},{id:7,name:'OTP Virtual',cat:'lainnya',price:5000,img:'OTP'}];
let cartItems=[];
let activeCat='all';

function rupiah(n){return new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n)}
function byId(id){return document.getElementById(id)}

function renderProducts(){
  const grid=byId('grid');
  const searchInput=byId('searchInput');
  if(!grid)return;
  const q=(searchInput?.value||'').toLowerCase().trim();
  const result=products.filter(p=>(activeCat==='all'||p.cat===activeCat)&&p.name.toLowerCase().includes(q));
  grid.innerHTML='';
  if(!result.length){grid.innerHTML='<div class="empty-state">Produk tidak ditemukan.</div>';return;}
  result.forEach(p=>{
    const div=document.createElement('div');
    div.className='card product-card';
    div.innerHTML=`<span class="product-badge">READY</span><div class="product-img"><div class="profile-box"><div class="photo-box">${p.img}</div></div></div><h3>${p.name}</h3><p class="product-desc">Produk digital siap order.</p><div class="price">${rupiah(p.price)}</div><button type="button" data-add="${p.id}">Beli</button>`;
    grid.appendChild(div);
  });
}

function renderCartCount(){document.querySelectorAll('#cartCount').forEach(el=>el.textContent=cartItems.length)}
function showToast(text){const t=byId('liveToast');if(!t)return;t.textContent=text;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}
function add(id){const p=products.find(x=>x.id===id);if(!p)return;cartItems.push(p);renderCartCount();showToast(`${p.name} masuk keranjang`)}
window.add=add;

function showOverlay(){const o=byId('overlay');if(o)o.style.display='block'}
function hideOverlay(){const o=byId('overlay');if(o)o.style.display='none'}
function openMenu(){byId('navPanel')?.classList.add('open');showOverlay()}
function closePanels(){byId('navPanel')?.classList.remove('open');byId('cart')?.classList.remove('open');hideOverlay()}
function openCart(){byId('cart')?.classList.add('open');showOverlay()}

function init(){
  byId('menuBtn')?.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();openMenu()});
  byId('closeMenu')?.addEventListener('click',closePanels);
  byId('overlay')?.addEventListener('click',closePanels);
  byId('closeCart')?.addEventListener('click',closePanels);
  byId('cartBtn')?.addEventListener('click',function(e){e.preventDefault();openCart()});
  byId('categoryBtn')?.addEventListener('click',function(e){e.preventDefault();byId('tabs')?.classList.toggle('open')});
  document.querySelectorAll('.nav-panel a').forEach(a=>a.addEventListener('click',closePanels));
  document.querySelectorAll('.tab').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));btn.classList.add('active');activeCat=btn.dataset.cat;renderProducts();byId('tabs')?.classList.remove('open')}));
  byId('searchInput')?.addEventListener('input',renderProducts);
  document.addEventListener('click',e=>{const b=e.target.closest('[data-add]');if(b)add(Number(b.dataset.add))});

  let slide=0;
  const slides=[...document.querySelectorAll('.banner')];
  const dots=[...document.querySelectorAll('.dot')];
  function showSlide(i){slides.forEach(s=>s.classList.remove('active'));dots.forEach(d=>d.classList.remove('active'));slide=i;slides[slide]?.classList.add('active');dots[slide]?.classList.add('active')}
  dots.forEach((d,i)=>d.addEventListener('click',()=>showSlide(i)));
  setInterval(()=>{if(slides.length)showSlide((slide+1)%slides.length)},4500);

  renderProducts();
  renderCartCount();
}

document.addEventListener('DOMContentLoaded',init);