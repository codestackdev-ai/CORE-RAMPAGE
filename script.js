const products=[{id:1,name:'Mobile Legends Diamond',cat:'topup',price:3000,img:'ML'},{id:2,name:'Free Fire Diamond',cat:'topup',price:5000,img:'FF'},{id:3,name:'Joki Rank ML',cat:'joki',price:10000,img:'JR'},{id:4,name:'YouTube Premium',cat:'premium',price:15000,img:'YT'},{id:5,name:'Spotify Premium',cat:'premium',price:18000,img:'SP'},{id:6,name:'Akun Netflix',cat:'akun',price:25000,img:'NF'},{id:7,name:'OTP Virtual',cat:'lainnya',price:5000,img:'OTP'}];
let cart=[];let activeCat='all';
const grid=document.getElementById('grid');
const cartCount=document.getElementById('cartCount');
const searchInput=document.getElementById('searchInput');
const tabs=document.getElementById('tabs');
const categoryBtn=document.getElementById('categoryBtn');
const menuBtn=document.getElementById('menuBtn');
const navPanel=document.getElementById('navPanel');
const closeMenu=document.getElementById('closeMenu');
const overlay=document.getElementById('overlay');
const cart=document.getElementById('cart');
const closeCart=document.getElementById('closeCart');
const liveToast=document.getElementById('liveToast');

function rupiah(n){return new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n)}
function render(){const q=(searchInput?.value||'').toLowerCase().trim();grid.innerHTML='';const result=products.filter(p=>(activeCat==='all'||p.cat===activeCat)&&p.name.toLowerCase().includes(q));if(!result.length){grid.innerHTML='<div class="empty-state">Produk tidak ditemukan.</div>';return;}result.forEach(p=>{const div=document.createElement('div');div.className='card product-card';div.innerHTML=`<span class="product-badge">READY</span><div class="product-img"><div class="profile-box"><div class="photo-box">${p.img}</div></div></div><h3>${p.name}</h3><p class="product-desc">Produk digital siap order.</p><div class="price">${rupiah(p.price)}</div><button onclick="add(${p.id})">Beli</button>`;grid.appendChild(div);});}
function add(id){const p=products.find(x=>x.id===id);cart.push(p);cartCount.textContent=cart.length;showToast(`${p.name} masuk keranjang`)}
function showToast(text){if(!liveToast)return;liveToast.textContent=text;liveToast.classList.add('show');setTimeout(()=>liveToast.classList.remove('show'),2200)}
function openOverlay(){if(overlay)overlay.style.display='block'}
function closeOverlay(){if(overlay)overlay.style.display='none'}
function openMenu(){navPanel?.classList.add('open');openOverlay()}
function closeMenuPanel(){navPanel?.classList.remove('open');cart?.classList.remove('open');closeOverlay()}
menuBtn?.addEventListener('click',openMenu);
closeMenu?.addEventListener('click',closeMenuPanel);
overlay?.addEventListener('click',closeMenuPanel);
categoryBtn?.addEventListener('click',()=>tabs?.classList.toggle('open'));
document.querySelectorAll('.nav-panel a').forEach(a=>a.addEventListener('click',closeMenuPanel));
document.getElementById('cartBtn')?.addEventListener('click',()=>{cart?.classList.add('open');openOverlay()});
closeCart?.addEventListener('click',closeMenuPanel);
document.querySelectorAll('.tab').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));btn.classList.add('active');activeCat=btn.dataset.cat;render();tabs?.classList.remove('open');}));
searchInput?.addEventListener('input',render);
let slide=0;const slides=[...document.querySelectorAll('.banner')];const dots=[...document.querySelectorAll('.dot')];function showSlide(i){slides.forEach(s=>s.classList.remove('active'));dots.forEach(d=>d.classList.remove('active'));slide=i;slides[slide]?.classList.add('active');dots[slide]?.classList.add('active')}dots.forEach((d,i)=>d.addEventListener('click',()=>showSlide(i)));setInterval(()=>{if(slides.length)showSlide((slide+1)%slides.length)},4500);
render();