/* =========================================
   FARMIZEN — checkout.js
   Import: <script src="js/checkout.js"></script>
   ========================================= */

// ── STATE ──
let currentStep    = 1;
let selectedPayment  = 'upi';
let selectedDelivery = 'delivery';
let checkoutData   = null;

// ── LOAD DATA FROM CART ──
function loadCheckoutData() {
  const stored = localStorage.getItem('farmizen_checkout');
  checkoutData = stored ? JSON.parse(stored) : getMockCheckoutData();
  renderSummary();
}

// ── MOCK DATA (jab cart se data na aaye) ──
function getMockCheckoutData() {
  return {
    items: [
      { id:1, name:'Organic Tomatoes', emoji:'🍅', price:40, unit:'per kg',     qty:2, farmer:'Ramesh Sharma' },
      { id:6, name:'Tulsi & Pudina',   emoji:'🌿', price:20, unit:'per bundle', qty:3, farmer:'Meena Kumari'  },
      { id:3, name:'Desi Mangoes',     emoji:'🥭', price:80, unit:'per kg',     qty:1, farmer:'Prakash Mali'  },
    ],
    subtotal:  220,
    promo:     null,
    grandTotal: 220,
  };
}

// ── RENDER RIGHT SIDEBAR SUMMARY ──
function renderSummary() {
  if (!checkoutData) return;

  const itemsHtml = checkoutData.items.map(item => `
    <div class="fz-summary-item">
      <span class="fz-s-emoji">${item.emoji}</span>
      <span class="fz-s-name">${item.name}</span>
      <span class="fz-s-qty">×${item.qty}</span>
      <span class="fz-s-price">₹${(item.price * item.qty).toLocaleString('en-IN')}</span>
    </div>
  `).join('');

  document.getElementById('summary-items').innerHTML = itemsHtml;
  document.getElementById('s-subtotal').textContent  = checkoutData.subtotal.toLocaleString('en-IN');
  document.getElementById('s-total').textContent     = checkoutData.grandTotal.toLocaleString('en-IN');
  document.getElementById('final-total').textContent = checkoutData.grandTotal.toLocaleString('en-IN');

  // Discount row
  if (checkoutData.promo) {
    const discountRow = document.getElementById('s-discount-row');
    discountRow.style.display = 'flex';
    const discountAmt = checkoutData.grandTotal < checkoutData.subtotal
      ? checkoutData.subtotal - checkoutData.grandTotal
      : 0;
    document.getElementById('s-discount').textContent = discountAmt.toLocaleString('en-IN');
  }
}

// ── STEP NAVIGATION ──
function goToStep(step) {
  // Validate before moving forward
  if (step > currentStep) {
    if (currentStep === 1 && !validateDelivery()) return;
    if (currentStep === 2 && !validatePayment()) return;
  }

  // Hide current, show next
  document.getElementById(`section-delivery`).classList.remove('active');
  document.getElementById(`section-payment`).classList.remove('active');
  document.getElementById(`section-review`).classList.remove('active');

  const sectionMap = { 1: 'delivery', 2: 'payment', 3: 'review' };
  document.getElementById(`section-${sectionMap[step]}`).classList.add('active');

  // Update navbar steps
  for (let i = 1; i <= 3; i++) {
    const el = document.getElementById(`step-${i}`);
    el.classList.remove('active', 'done');
    if (i === step) el.classList.add('active');
    if (i < step)   el.classList.add('done');
  }

  currentStep = step;

  // If going to review, populate review blocks
  if (step === 3) populateReview();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── VALIDATE DELIVERY FORM ──
function validateDelivery() {
  const fname   = document.getElementById('fname').value.trim();
  const lname   = document.getElementById('lname').value.trim();
  const phone   = document.getElementById('phone').value.trim();
  const address = document.getElementById('address').value.trim();
  const city    = document.getElementById('city').value.trim();
  const pincode = document.getElementById('pincode').value.trim();

  const v1 = validateField('grp-fname',   fname !== '');
  const v2 = validateField('grp-lname',   lname !== '');
  const v3 = validateField('grp-phone',   /^\d{10}$/.test(phone));
  const v4 = validateField('grp-address', address !== '');
  const v5 = validateField('grp-city',    city !== '');
  const v6 = validateField('grp-pincode', /^\d{6}$/.test(pincode));

  return v1 && v2 && v3 && v4 && v5 && v6;
}

// ── VALIDATE PAYMENT FORM ──
function validatePayment() {
  if (selectedPayment === 'upi') {
    const upi = document.getElementById('upi-id').value.trim();
    return validateField('grp-upi', upi.includes('@') && upi.length > 3);
  }

  if (selectedPayment === 'card') {
    const num    = document.getElementById('card-num').value.replace(/\s/g, '');
    const expiry = document.getElementById('expiry').value.trim();
    const cvv    = document.getElementById('cvv').value.trim();

    const v1 = validateField('grp-cardnum', num.length === 16);
    const v2 = validateField('grp-expiry',  /^\d{2}\/\d{2}$/.test(expiry));
    const v3 = validateField('grp-cvv',     cvv.length === 3);
    return v1 && v2 && v3;
  }

  // COD — no validation needed
  return true;
}

// ── FIELD VALIDATION HELPER ──
function validateField(grpId, condition) {
  const el = document.getElementById(grpId);
  if (!el) return condition;
  el.classList.toggle('field-error', !condition);
  return condition;
}

// ── SELECT DELIVERY TYPE ──
function selectDelivery(type) {
  selectedDelivery = type;
  document.getElementById('opt-delivery').classList.toggle('active', type === 'delivery');
  document.getElementById('opt-pickup').classList.toggle('active',   type === 'pickup');
}

// ── SELECT PAYMENT METHOD ──
function selectPayment(method) {
  selectedPayment = method;

  const methods = ['upi', 'card', 'cod'];
  methods.forEach(m => {
    document.getElementById(`pay-${m}`).classList.toggle('active', m === method);
    document.getElementById(`radio-${m}`).textContent = m === method ? '●' : '○';
  });

  // Show / hide input fields
  const upiWrap  = document.getElementById('upi-input-wrap');
  const cardWrap = document.getElementById('card-input-wrap');

  if (upiWrap)  upiWrap.style.display  = method === 'upi'  ? 'block' : 'none';
  if (cardWrap) cardWrap.style.display = method === 'card' ? 'block' : 'none';
}

// ── POPULATE REVIEW STEP ──
function populateReview() {
  // Delivery info
  const fname   = document.getElementById('fname').value.trim();
  const lname   = document.getElementById('lname').value.trim();
  const phone   = document.getElementById('phone').value.trim();
  const address = document.getElementById('address').value.trim();
  const city    = document.getElementById('city').value.trim();
  const pincode = document.getElementById('pincode').value.trim();
  const state   = document.getElementById('state').value;
  const note    = document.getElementById('note').value.trim();
  const delType = selectedDelivery === 'delivery' ? '🚚 Home Delivery' : '🏪 Self Pickup';

  document.getElementById('review-delivery').innerHTML = `
    <strong>${fname} ${lname}</strong> · 📱 ${phone}<br>
    ${address}, ${city}, ${state} - ${pincode}<br>
    ${note ? `<em>Note: ${note}</em><br>` : ''}
    ${delType}
  `;

  // Payment info
  const payLabels = {
    upi:  `📱 UPI — ${document.getElementById('upi-id').value || ''}`,
    card: `💳 Card ending in ${document.getElementById('card-num').value.slice(-4) || '****'}`,
    cod:  '💵 Cash on Delivery',
  };

  document.getElementById('review-payment').innerHTML = payLabels[selectedPayment];

  // Items
  if (checkoutData) {
    document.getElementById('review-items').innerHTML = checkoutData.items.map(item => `
      <div class="fz-review-item">
        <span class="fz-review-item-emoji">${item.emoji}</span>
        <span class="fz-review-item-name">${item.name}</span>
        <span class="fz-review-item-qty">×${item.qty} ${item.unit.replace('per ','')}</span>
        <span class="fz-review-item-price">₹${(item.price * item.qty).toLocaleString('en-IN')}</span>
      </div>
    `).join('');
  }
}

// ── PLACE ORDER ──
function placeOrder() {
  const termsChecked = document.getElementById('terms-check').checked;

  if (!termsChecked) {
    showToast('⚠️ Please accept the Terms & Conditions.');
    return;
  }

  // Build order object
  const order = {
    orderId:  'FZ' + Date.now(),
    items:    checkoutData?.items || [],
    delivery: {
      name:    `${document.getElementById('fname').value} ${document.getElementById('lname').value}`,
      phone:   document.getElementById('phone').value,
      address: document.getElementById('address').value,
      city:    document.getElementById('city').value,
      state:   document.getElementById('state').value,
      pincode: document.getElementById('pincode').value,
      type:    selectedDelivery,
      note:    document.getElementById('note').value,
    },
    payment: {
      method: selectedPayment,
    },
    subtotal:   checkoutData?.subtotal   || 0,
    grandTotal: checkoutData?.grandTotal || 0,
    placedAt:   new Date().toISOString(),
    status:     'confirmed',
  };

  // Save order
  localStorage.setItem('farmizen_order', JSON.stringify(order));

  // Clear cart
  localStorage.removeItem('farmizen_cart');
  localStorage.removeItem('farmizen_checkout');

  // Redirect to success page
  window.location.href = 'success.html';
}

// ── CARD NUMBER FORMAT (1234 5678 9012 3456) ──
function formatCard(input) {
  let val = input.value.replace(/\D/g, '').substring(0, 16);
  input.value = val.replace(/(.{4})/g, '$1 ').trim();
}

// ── EXPIRY FORMAT (MM/YY) ──
function formatExpiry(input) {
  let val = input.value.replace(/\D/g, '').substring(0, 4);
  if (val.length >= 3) val = val.slice(0,2) + '/' + val.slice(2);
  input.value = val;
}

// ── TOAST ──
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', loadCheckoutData);