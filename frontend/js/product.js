/* =========================================
   FARMIZEN — product.js
   Import: <script src="js/product.js"></script>
   ========================================= */

// ── MOCK PRODUCT DATA ──
// Real app mein: URL se id leke API se fetch hoga
// e.g. const id = new URLSearchParams(window.location.search).get('id');
// then: fetch(`/api/products/${id}`).then(...)

const product = {
  id:        1,
  name:      'Organic Tomatoes',
  category:  'Vegetables',
  emoji:     '🍅',
  price:     40,
  unit:      'per kg',
  qty:       80,
  location:  'Jaipur, Rajasthan',
  pincode:   '302001',
  phone:     '8107161922',
  available: true,
  farmer:    'Ramesh Sharma',
  desc:      'Freshly harvested, no pesticides. Grown using natural compost on our family farm in Jaipur. Available for same-day pickup or can be delivered within 10km radius.',
};

const related = [
  { name:'Fresh Spinach',  emoji:'🥬', price:30,  unit:'per kg',     href:'product.html?id=2' },
  { name:'Green Chillies', emoji:'🌶️', price:25,  unit:'per kg',     href:'product.html?id=7' },
  { name:'Curry Leaves',   emoji:'🌿', price:10,  unit:'per bundle', href:'product.html?id=12' },
  { name:'Desi Mangoes',   emoji:'🥭', price:80,  unit:'per kg',     href:'product.html?id=3' },
];

// ── STATE ──
let qty = 1;

// ── LOAD PRODUCT INTO PAGE ──
function loadProduct() {
  document.getElementById('bc-name').textContent         = product.name;
  document.getElementById('main-emoji').textContent      = product.emoji;
  document.getElementById('p-category').textContent      = product.category;
  document.getElementById('p-name').textContent          = product.name;
  document.getElementById('p-price').textContent         = product.price;
  document.getElementById('p-unit').textContent          = product.unit;
  document.getElementById('qty-unit-label').textContent  = product.unit.replace('per ', '');
  document.getElementById('f-name').textContent          = product.farmer;
  document.getElementById('f-loc').textContent           = '📍 ' + product.location;
  document.getElementById('desc-text').textContent       = product.desc;
  document.getElementById('d-category').textContent      = product.category;
  document.getElementById('d-qty').textContent           = product.qty + ' units available';
  document.getElementById('d-location').textContent      = product.location;
  document.getElementById('d-pincode').textContent       = product.pincode;
  document.title = product.name + ' — Farmizen';

  // Availability badge
  const badge = document.getElementById('avail-badge');
  badge.textContent = product.available ? '● Available' : '○ Not Available';
  badge.className   = 'fz-avail-badge ' + (product.available ? 'yes' : 'no');

  updateTotal();
  renderRelated();
}

// ── QUANTITY CONTROLS ──
function changeQty(delta) {
  qty = Math.max(1, Math.min(qty + delta, product.qty));
  document.getElementById('qty-display').textContent = qty;
  updateTotal();
}

function updateTotal() {
  const total = product.price * qty;
  document.getElementById('total-price').textContent = total.toLocaleString('en-IN');
}

// ── ADD TO CART ──
function addToCart() {
  const cart = JSON.parse(localStorage.getItem('farmizen_cart') || '[]');
  const existing = cart.find(i => i.id === product.id);

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      id:       product.id,
      name:     product.name,
      emoji:    product.emoji,
      price:    product.price,
      unit:     product.unit,
      farmer:   product.farmer,
      phone:    product.phone,
      location: product.location,
      qty:      qty,
    });
  }

  localStorage.setItem('farmizen_cart', JSON.stringify(cart));
  showToast(`🛒 ${qty} ${product.unit.replace('per ','')} of ${product.name} added to cart!`);
}

// ── WHATSAPP CONTACT ──
function contactWhatsApp() {
  const total = product.price * qty;
  const msg   = `Hi! I'm interested in buying ${qty} ${product.unit.replace('per ','')} of *${product.name}* (₹${total.toLocaleString('en-IN')} total) from your listing on Farmizen.`;
  window.open(`https://wa.me/91${product.phone}?text=${encodeURIComponent(msg)}`, '_blank');
}

// ── CALL FARMER ──
function callFarmer() {
  window.open(`tel:${product.phone}`);
}

// ── INFO TABS ──
function showPanel(panel, btn) {
  document.querySelectorAll('.fz-info-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.fz-info-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('panel-' + panel).classList.add('active');
  btn.classList.add('active');
}

// ── RENDER RELATED PRODUCTS ──
function renderRelated() {
  const grid = document.getElementById('related-grid');
  if (!grid) return;

  grid.innerHTML = related.map(r => `
    <a class="fz-related-card" href="${r.href}">
      <div class="fz-related-img">${r.emoji}</div>
      <div class="p-3">
        <div class="fz-related-name">${r.name}</div>
        <div class="fz-related-price">₹${r.price} <span>${r.unit}</span></div>
      </div>
    </a>
  `).join('');
}

// ── TOAST ──
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', loadProduct);