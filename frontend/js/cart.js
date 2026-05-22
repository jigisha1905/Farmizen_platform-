/* =========================================
   FARMIZEN — cart.js
   Import: <script src="js/cart.js"></script>
   ========================================= */

// ── PROMO CODES ──
// Real app mein backend se validate hoga
const PROMO_CODES = {
  'FARM10':  { discount: 10, type: 'percent', label: '10% off applied!' },
  'FRESH50': { discount: 50, type: 'flat',    label: '₹50 off applied!' },
  'ORGANIC': { discount: 15, type: 'percent', label: '15% off applied!' },
};

let cart          = [];
let activePromo   = null;

// ── LOAD CART FROM localStorage ──
function loadCart() {
  const stored = localStorage.getItem('farmizen_cart');
  cart = stored ? JSON.parse(stored) : getMockCart();
  renderCart();
}

// ── MOCK CART (jab localStorage empty ho) ──
function getMockCart() {
  return [
    { id:1,  name:'Organic Tomatoes', emoji:'🍅', price:40,  unit:'per kg',     farmer:'Ramesh Sharma', location:'Jaipur',     phone:'9876543210', qty:2 },
    { id:6,  name:'Tulsi & Pudina',   emoji:'🌿', price:20,  unit:'per bundle', farmer:'Meena Kumari',  location:'Jaipur',     phone:'9876501234', qty:3 },
    { id:3,  name:'Desi Mangoes',     emoji:'🥭', price:80,  unit:'per kg',     farmer:'Prakash Mali',  location:'Chittorgarh',phone:'9812345678', qty:1 },
  ];
}

// ── SAVE CART TO localStorage ──
function saveCart() {
  localStorage.setItem('farmizen_cart', JSON.stringify(cart));
}

// ── RENDER FULL CART ── 
function renderCart() {
  const list      = document.getElementById('cart-items-list');
  const emptyEl   = document.getElementById('empty-cart');
  const summaryCol = document.getElementById('summary-col');

  if (!cart.length) {
    list.innerHTML = '';
    emptyEl.classList.add('show');
    summaryCol.style.display = 'none';
    document.getElementById('cart-count-text').textContent = 'Your cart is empty.';
    return;
  }

  emptyEl.classList.remove('show');
  summaryCol.style.display = 'block';
  document.getElementById('cart-count-text').textContent =
    `${cart.length} item${cart.length > 1 ? 's' : ''} in your cart`;

  // Group items by farmer
  const grouped = {};
  cart.forEach(item => {
    if (!grouped[item.farmer]) grouped[item.farmer] = [];
    grouped[item.farmer].push(item);
  });

  list.innerHTML = Object.entries(grouped).map(([farmer, items]) => `
    <div class="fz-farmer-group-header">
      <span>👨‍🌾</span>
      <span>From <strong>${farmer}</strong> · 📍 ${items[0].location}</span>
    </div>
    ${items.map((item, i) => renderCartItem(item, i)).join('')}
  `).join('');

  updateSummary();
}

// ── RENDER SINGLE CART ITEM ──
function renderCartItem(item, index) {
  const itemTotal = item.price * item.qty;
  return `
    <div class="fz-cart-item" id="cart-item-${item.id}">
      <div class="fz-item-img">${item.emoji}</div>
      <div class="fz-item-info">
        <div class="fz-item-name">${item.name}</div>
        <div class="fz-item-meta">📍 ${item.location}</div>
        <div class="fz-item-price-unit">₹${item.price} ${item.unit}</div>
      </div>
      <div class="fz-item-qty">
        <button class="fz-item-qty-btn" onclick="updateQty(${item.id}, -1)">−</button>
        <div class="fz-item-qty-val">${item.qty}</div>
        <button class="fz-item-qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
      </div>
      <div class="fz-item-total">₹${itemTotal.toLocaleString('en-IN')}</div>
      <button class="fz-item-remove" onclick="removeItem(${item.id})" title="Remove">✕</button>
    </div>
  `;
}

// ── UPDATE QUANTITY ──
function updateQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.qty = Math.max(1, item.qty + delta);
  saveCart();
  renderCart();
}

// ── REMOVE ITEM ──
function removeItem(id) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  cart = cart.filter(i => i.id !== id);
  saveCart();
  renderCart();
  showToast(`🗑️ ${item.name} removed from cart.`);
}

// ── UPDATE ORDER SUMMARY ──
function updateSummary() {
  const subtotal   = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);

  let discount = 0;
  if (activePromo) {
    if (activePromo.type === 'percent') {
      discount = Math.round(subtotal * activePromo.discount / 100);
    } else {
      discount = activePromo.discount;
    }
  }

  const grandTotal = Math.max(0, subtotal - discount);

  document.getElementById('item-count').textContent    = totalItems;
  document.getElementById('subtotal').textContent      = subtotal.toLocaleString('en-IN');
  document.getElementById('grand-total').textContent   = grandTotal.toLocaleString('en-IN');
  document.getElementById('delivery-text').textContent = 'FREE';

  // Show discount row if promo applied
  const discountRow = document.getElementById('discount-row');
  if (discountRow) {
    discountRow.style.display = discount > 0 ? 'flex' : 'none';
    document.getElementById('discount-amount').textContent = discount.toLocaleString('en-IN');
  }

  // Disable checkout if cart empty
  const checkoutBtn = document.querySelector('.fz-btn-checkout');
  if (checkoutBtn) checkoutBtn.disabled = cart.length === 0;
}

// ── APPLY PROMO CODE ──
function applyPromo() {
  const input = document.getElementById('promo-input');
  const msg   = document.getElementById('promo-msg');
  const code  = input.value.trim().toUpperCase();

  if (!code) {
    msg.textContent = 'Please enter a promo code.';
    msg.className   = 'fz-promo-msg error';
    return;
  }

  if (PROMO_CODES[code]) {
    activePromo     = PROMO_CODES[code];
    msg.textContent = '✅ ' + activePromo.label;
    msg.className   = 'fz-promo-msg success';
    input.disabled  = true;
    updateSummary();
    showToast('🎉 Promo code applied!');
  } else {
    activePromo     = null;
    msg.textContent = '❌ Invalid promo code.';
    msg.className   = 'fz-promo-msg error';
  }
}

// ── PROCEED TO CHECKOUT ──
function proceedToCheckout() {
  if (!cart.length) return;
  // Pass cart summary to checkout page
  const summary = {
    items:      cart,
    subtotal:   cart.reduce((sum, i) => sum + i.price * i.qty, 0),
    promo:      activePromo,
    grandTotal: parseInt(document.getElementById('grand-total').textContent.replace(/,/g, '')),
  };
  localStorage.setItem('farmizen_checkout', JSON.stringify(summary));
  window.location.href = 'checkout.html';
}

// ── TOAST ──
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', loadCart);