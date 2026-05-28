/* =========================================
   FARMIZEN — farmstay.js
   Import: <script src="js/farmstay.js"></script>
   ========================================= */

// ── MOCK DATA ──
let allStays = [
  { id:1,  name:'Peaceful Valley Farm Stay',      type:'Farm House',  bedrooms:3, guests:8, price:3500, location:'Jaipur, Rajasthan',      icon:'🏡', desc:'Spacious farmhouse with garden and farmland views.', amenities:['WiFi','Kitchen','AC','Hot Water','Garden'], activities:['Farm Tour','Cooking','Photography'], rating:4.8, reviews:240, phone:'8107161922' },
  { id:2,  name:'Riverside Farm Cottage',          type:'Cottage',     bedrooms:2, guests:4, price:2500, location:'Chittorgarh, Rajasthan', icon:'🏘️', desc:'Cozy cottage with river views and organic gardens.', amenities:['WiFi','Kitchen','Hot Water','Pool'], activities:['Farm Tour','Yoga','Stargazing'], rating:4.6, reviews:180, phone:'8107161922' },
  { id:3,  name:'Green Valley Eco Farm',           type:'Farm House',  bedrooms:4, guests:10, price:4500, location:'Udaipur, Rajasthan', icon:'🌾', desc:'Eco-friendly farmhouse with sustainability practices.', amenities:['WiFi','Kitchen','AC','Garden','Parking'], activities:['Farm Tour','Cooking','Photography','Yoga'], rating:4.9, reviews:320, phone:'8107161922' },
  { id:4,  name:'Mountain View Farm Hut',          type:'Hut',         bedrooms:1, guests:2, price:1500, location:'Ajmer, Rajasthan', icon:'⛰️', desc:'Rustic hut with mountain views and simple living.', amenities:['Kitchen','Hot Water','Garden'], activities:['Stargazing','Photography','Farm Tour'], rating:4.7, reviews:150, phone:'8107161922' },
  { id:5,  name:'Mango Orchard Farm Stay',         type:'Farm House',  bedrooms:3, guests:6, price:3000, location:'Sikar, Rajasthan', icon:'🥭', desc:'Stay among mango trees with homemade organic food.', amenities:['WiFi','Kitchen','Hot Water','Garden','Bonfire'], activities:['Farm Tour','Cooking','Horse Riding'], rating:4.8, reviews:210, phone:'8107161922' },
  { id:6,  name:'Desert Camp Experience',          type:'Camp Site',   bedrooms:0, guests:8, price:2000, location:'Bikaner, Rajasthan', icon:'⛺', desc:'Glamping under stars with farm activities.', amenities:['Bonfire'], activities:['Stargazing','Horse Riding','Photography'], rating:4.5, reviews:120, phone:'8107161922' },
  { id:7,  name:'Village Retreat Farm Cottage',   type:'Cottage',     bedrooms:2, guests:5, price:2800, location:'Kota, Rajasthan', icon:'🏘️', desc:'Traditional village-style cottage with local culture.', amenities:['WiFi','Kitchen','AC','Hot Water','Parking'], activities:['Farm Tour','Cooking','Photography','Yoga'], rating:4.7, reviews:190, phone:'8107161922' },
  { id:8,  name:'Organic Farm Villa',              type:'Farm House',  bedrooms:5, guests:12, price:5500, location:'Nagaur, Rajasthan', icon:'🏛️', desc:'Luxury farmhouse with all modern amenities.', amenities:['WiFi','Kitchen','AC','Hot Water','Pool','Garden','Parking','Bonfire'], activities:['Farm Tour','Cooking','Horse Riding','Photography','Yoga'], rating:4.9, reviews:380, phone:'8107161922' },
];

// Farmer ke stays
let myStays = allStays.filter(s => [1, 5].includes(s.id));

// ── STATE ──
let currentRole = 'guest';
let editingId = null;
let activeModal = null;

// ── ROLE SWITCH ──
function switchRole() {
  currentRole = currentRole === 'guest' ? 'host' : 'guest';
  applyRole();
}

function applyRole() {
  const badge = document.getElementById('role-badge');
  const btn = document.querySelector('.fz-btn-switch');
  const sub = document.getElementById('header-sub');
  const gTabs = document.getElementById('guest-tabs');
  const hTabs = document.getElementById('host-tabs');

  if (currentRole === 'host') {
    badge.textContent = '🏡 Host';
    badge.className = 'fz-role-badge host';
    btn.textContent = 'Switch to Guest';
    sub.textContent = 'Manage your farmstays and bookings.';
    gTabs.style.display = 'none';
    hTabs.style.display = 'flex';
    showTab('my-stays');
  } else {
    badge.textContent = '🏡 Guest';
    badge.className = 'fz-role-badge';
    btn.textContent = 'Switch to Host';
    sub.textContent = 'Experience farm life. Stay with local farmers.';
    gTabs.style.display = 'flex';
    hTabs.style.display = 'none';
    showTab('browse');
  }
}

// ── TABS ──
function showTab(tab) {
  ['browse', 'my-stays', 'add-stay'].forEach(t => {
    const el = document.getElementById(`section-${t}`);
    if (el) el.style.display = 'none';
  });

  document.querySelectorAll('.fz-tab').forEach(b => b.classList.remove('active'));

  const section = document.getElementById(`section-${tab}`);
  if (section) section.style.display = 'block';

  const tabBtn = document.getElementById(`tab-${tab}`);
  if (tabBtn) tabBtn.classList.add('active');

  if (tab === 'browse') renderBrowse();
  if (tab === 'my-stays') renderMyStays();
  if (tab === 'add-stay') resetForm();
}

// ── RENDER BROWSE GRID ──
function renderBrowse(filtered) {
  const data = filtered || allStays;
  const grid = document.getElementById('stays-grid');
  const empty = document.getElementById('empty-browse');
  const count = document.getElementById('results-count');

  count.textContent = `${data.length} stay${data.length !== 1 ? 's' : ''}`;

  if (!data.length) {
    grid.innerHTML = '';
    empty.classList.add('show');
    return;
  }

  empty.classList.remove('show');
  grid.innerHTML = data.map((s, i) => `
    <div class="col-md-6 col-lg-4">
      <div class="fz-stay-card" style="animation-delay:${i * 0.05}s" onclick="openModal(${s.id})">
        <div class="fz-stay-image">
          ${s.icon}
          <span class="fz-rating-badge">⭐${s.rating}</span>
        </div>
        <div class="fz-stay-body">
          <div class="fz-stay-name">${s.name}</div>
          <div class="fz-stay-meta">
            <span>🛏️ ${s.bedrooms} bed${s.bedrooms !== 1 ? 's' : ''}</span>
            <span>👥 ${s.guests} guests</span>
            <span>📍 ${s.location.split(',')[0]}</span>
          </div>
          <div class="fz-stay-footer">
            <div class="fz-stay-price">
              ₹${s.price}
              <span>/night</span>
            </div>
            <button class="fz-btn-view" onclick="event.stopPropagation(); openModal(${s.id})">
              Details
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// ── FILTER STAYS ──
function filterStays() {
  let data = [...allStays];

  const loctn = document.getElementById('search-location').value.toLowerCase().trim();
  const type = document.getElementById('filter-type').value;
  const priceRange = document.getElementById('filter-price').value;
  const amenity = document.getElementById('filter-amenities').value;

  if (loctn) {
    data = data.filter(s => s.location.toLowerCase().includes(loctn));
  }

  if (type) {
    data = data.filter(s => s.type === type);
  }

  if (priceRange) {
    const [min, max] = priceRange.includes('+')
      ? [parseInt(priceRange), Infinity]
      : priceRange.split('-').map(Number);
    data = data.filter(s => s.price >= min && s.price <= max);
  }

  if (amenity) {
    data = data.filter(s => s.amenities.some(a => a.toLowerCase().includes(amenity.toLowerCase())));
  }

  renderBrowse(data);
}

// ── RENDER MY STAYS ──
function renderMyStays() {
  const list = document.getElementById('my-stays-list');
  const empty = document.getElementById('empty-my');

  if (!myStays.length) {
    list.innerHTML = '';
    empty.classList.add('show');
    return;
  }

  empty.classList.remove('show');
  list.innerHTML = myStays.map((s, i) => `
    <div class="fz-stay-row" style="animation-delay:${i * 0.06}s">
      <div class="fz-row-icon">${s.icon}</div>
      <div class="fz-row-info">
        <div class="fz-row-name">${s.name}</div>
        <div class="fz-row-sub">${s.type} · ${s.bedrooms} bed${s.bedrooms !== 1 ? 's' : ''} · ${s.location}</div>
      </div>
      <div class="fz-row-price">₹${s.price}/night</div>
      <div class="fz-row-actions">
        <button class="fz-btn-edit" onclick="editStay(${s.id})">Edit</button>
        <button class="fz-btn-delete" onclick="deleteStay(${s.id})">Delete</button>
      </div>
    </div>
  `).join('');
}

// ── OPEN MODAL ──
function openModal(id) {
  const s = allStays.find(x => x.id === id);
  if (!s) return;
  activeModal = s;

  document.getElementById('m-image').textContent = s.icon;
  document.getElementById('m-type').textContent = s.type;
  document.getElementById('m-title').textContent = s.name;
  document.getElementById('m-rating').textContent = `⭐ ${s.rating} (${s.reviews} reviews)`;
  document.getElementById('m-desc').textContent = s.desc;
  document.getElementById('m-bedrooms').textContent = `${s.bedrooms} bedroom${s.bedrooms !== 1 ? 's' : ''}`;
  document.getElementById('m-guests').textContent = `${s.guests} guests`;
  document.getElementById('m-location').textContent = s.location;
  document.getElementById('m-price').textContent = `₹${s.price}/night`;

  document.getElementById('m-amenities').innerHTML =
    s.amenities.map(a => `<span>${a}</span>`).join('');
  document.getElementById('m-activities').innerHTML =
    s.activities.map(a => `<span>${a}</span>`).join('');

  // Reset booking form
  ['book-checkin', 'book-checkout'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  updateBookingTotal();

  document.getElementById('modal-overlay').classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('show');
  document.body.style.overflow = '';
  activeModal = null;
}

function closeModalOutside(e) {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
}

// ── UPDATE BOOKING TOTAL ──
function updateBookingTotal() {
  if (!activeModal) return;

  const checkin = document.getElementById('book-checkin').value;
  const checkout = document.getElementById('book-checkout').value;

  if (!checkin || !checkout) {
    document.getElementById('book-total').textContent = '₹0';
    return;
  }

  const nights = Math.ceil((new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24));
  const total = nights > 0 ? nights * activeModal.price : 0;
  document.getElementById('book-total').textContent = `₹${total.toLocaleString('en-IN')} (${nights} night${nights !== 1 ? 's' : ''})`;
}

document.addEventListener('change', updateBookingTotal);

// ── BOOK STAY ──
function bookStay() {
  if (!activeModal) return;

  const checkin = document.getElementById('book-checkin').value;
  const checkout = document.getElementById('book-checkout').value;

  if (!checkin || !checkout) {
    showToast('⚠️ Please select check-in and check-out dates.');
    return;
  }

  if (new Date(checkout) <= new Date(checkin)) {
    showToast('⚠️ Check-out date must be after check-in date.');
    return;
  }

  const nights = Math.ceil((new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24));
  const booking = {
    stayId: activeModal.id,
    stayName: activeModal.name,
    checkin,
    checkout,
    nights,
    total: nights * activeModal.price,
  };

  localStorage.setItem('farmizen_booking', JSON.stringify(booking));
  showToast('🎉 Booking confirmed! Proceeding to payment...');
  closeModal();
  // In real app: redirect to checkout/payment
}

// ── CONTACT HOST ──
function contactHost() {
  if (!activeModal) return;
  const msg = `Hi! I'm interested in booking ${activeModal.name} for my stay. Please contact me.`;
  window.open(`https://wa.me/91${activeModal.phone}?text=${encodeURIComponent(msg)}`, '_blank');
}

// ── FORM VALIDATION ──
function validateField(grpId, condition) {
  const el = document.getElementById(grpId);
  if (!el) return condition;
  el.classList.toggle('field-error', !condition);
  return condition;
}

// ── SUBMIT STAY ──
function submitStay() {
  const name = document.getElementById('f-name').value.trim();
  const type = document.getElementById('f-type').value;
  const bedrooms = document.getElementById('f-bedrooms').value;
  const guests = document.getElementById('f-guests').value;
  const price = document.getElementById('f-price').value;
  const location = document.getElementById('f-location').value.trim();
  const phone = document.getElementById('f-phone').value.trim();

  const ok = [
    validateField('grp-name', name !== ''),
    validateField('grp-type', type !== ''),
    validateField('grp-bedrooms', bedrooms !== '' && bedrooms > 0),
    validateField('grp-guests', guests !== '' && guests > 0),
    validateField('grp-price', price !== '' && price >= 0),
    validateField('grp-location', location !== ''),
    validateField('grp-phone', /^\d{10}$/.test(phone)),
  ].every(Boolean);

  if (!ok) return;

  const amenities = [];
  document.querySelectorAll('.fz-amenity-check input:checked').forEach(cb => {
    amenities.push(cb.value);
  });

  const activities = [];
  document.querySelectorAll('.fz-activity-check input:checked').forEach(cb => {
    activities.push(cb.value);
  });

  const stay = {
    id: editingId || Date.now(),
    name,
    type,
    bedrooms: parseInt(bedrooms),
    guests: parseInt(guests),
    price: parseInt(price),
    location,
    icon: '🏡',
    desc: document.getElementById('f-desc').value.trim(),
    amenities: amenities.length ? amenities : ['WiFi', 'Kitchen'],
    activities: activities.length ? activities : ['Farm Tour'],
    rating: 4.8,
    reviews: Math.floor(Math.random() * 300 + 50),
    phone,
  };

  if (editingId) {
    const mi = myStays.findIndex(s => s.id === editingId);
    const ai = allStays.findIndex(s => s.id === editingId);
    if (mi > -1) myStays[mi] = stay;
    if (ai > -1) allStays[ai] = stay;
    showToast('✅ Farmstay updated!');
  } else {
    myStays.unshift(stay);
    allStays.unshift(stay);
    showToast('🏡 Farmstay published!');
  }

  editingId = null;
  showTab('my-stays');
}

// ── EDIT STAY ──
function editStay(id) {
  const s = myStays.find(x => x.id === id);
  if (!s) return;
  editingId = id;

  document.getElementById('form-title').textContent = '✏️ Edit Farmstay';
  document.getElementById('f-name').value = s.name;
  document.getElementById('f-type').value = s.type;
  document.getElementById('f-bedrooms').value = s.bedrooms;
  document.getElementById('f-guests').value = s.guests;
  document.getElementById('f-price').value = s.price;
  document.getElementById('f-desc').value = s.desc || '';
  document.getElementById('f-location').value = s.location;
  document.getElementById('f-phone').value = s.phone;

  document.querySelectorAll('.fz-amenity-check input').forEach(cb => {
    cb.checked = s.amenities.includes(cb.value);
  });
  document.querySelectorAll('.fz-activity-check input').forEach(cb => {
    cb.checked = s.activities.includes(cb.value);
  });

  showTab('add-stay');
}

// ── DELETE STAY ──
function deleteStay(id) {
  if (!confirm('Delete this farmstay?')) return;
  myStays = myStays.filter(s => s.id !== id);
  allStays = allStays.filter(s => s.id !== id);
  renderMyStays();
  showToast('🗑️ Farmstay deleted.');
}

// ── RESET FORM ──
function resetForm() {
  editingId = null;
  document.getElementById('form-title').textContent = '🏡 Add New Farmstay';
  ['f-name','f-type','f-bedrooms','f-guests','f-price','f-desc','f-location','f-phone']
    .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  document.querySelectorAll('.fz-amenity-check input, .fz-activity-check input').forEach(cb => cb.checked = false);
  ['grp-name','grp-type','grp-bedrooms','grp-guests','grp-price','grp-location','grp-phone']
    .forEach(id => document.getElementById(id)?.classList.remove('field-error'));
}

// ── TOAST ──
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  applyRole();
});
