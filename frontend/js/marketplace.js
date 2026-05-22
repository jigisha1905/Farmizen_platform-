/* =========================================
   FARMIZEN — marketplace.js
   Import: <script src="js/marketplace.js"></script>
   ========================================= */

// ── MOCK DATA ──
// Jab backend ready ho, yeh data api.js se fetch hoga
const EMOJIS = {
  'Vegetables':      '🥦',
  'Fruits':          '🍎',
  'Grains & Pulses': '🌾',
  'Dairy & Eggs':    '🥛',
  'Herbs & Spices':  '🌿',
  'Organic Products':'🌱',
};

let allListings = [
  { id:1,  name:'Organic Tomatoes',  category:'Vegetables',      qty:80,  price:40,  unit:'per kg',     location:'Jaipur, Rajasthan',     phone:'9876543210', available:true,  farmer:'Ramesh Sharma', desc:'Freshly harvested, no pesticides. Grown using natural compost.' },
  { id:2,  name:'Fresh Spinach',     category:'Vegetables',      qty:50,  price:30,  unit:'per kg',     location:'Sikar, Rajasthan',      phone:'9823456789', available:true,  farmer:'Sunita Devi',   desc:'Tender spinach leaves, harvested daily. Perfect for cooking and salads.' },
  { id:3,  name:'Desi Mangoes',      category:'Fruits',          qty:120, price:80,  unit:'per kg',     location:'Chittorgarh, Rajasthan',phone:'9812345678', available:true,  farmer:'Prakash Mali',  desc:'Sweet Langda variety mangoes, straight from the orchard.' },
  { id:4,  name:'Moong Dal',         category:'Grains & Pulses', qty:200, price:90,  unit:'per kg',     location:'Bikaner, Rajasthan',    phone:'9898765432', available:true,  farmer:'Abdul Karim',   desc:'Organically grown moong dal, rich in protein.' },
  { id:5,  name:'A2 Cow Milk',       category:'Dairy & Eggs',    qty:30,  price:60,  unit:'per litre',  location:'Ajmer, Rajasthan',      phone:'9765432109', available:false, farmer:'Gita Bai',      desc:'Pure A2 cow milk from Gir cows. Available daily morning 6–9 AM.' },
  { id:6,  name:'Tulsi & Pudina',    category:'Herbs & Spices',  qty:20,  price:20,  unit:'per bundle', location:'Jaipur, Rajasthan',     phone:'9876501234', available:true,  farmer:'Meena Kumari',  desc:'Fresh tulsi and mint bundles. Great for herbal tea.' },
  { id:7,  name:'Green Chillies',    category:'Vegetables',      qty:60,  price:25,  unit:'per kg',     location:'Tonk, Rajasthan',       phone:'9854321098', available:true,  farmer:'Bharat Singh',  desc:'Spicy green chillies, medium hot variety.' },
  { id:8,  name:'Organic Wheat',     category:'Grains & Pulses', qty:500, price:35,  unit:'per kg',     location:'Nagaur, Rajasthan',     phone:'9812309876', available:true,  farmer:'Suresh Patel',  desc:'Stone-ground organic wheat, ideal for chapati flour.' },
  { id:9,  name:'Free Range Eggs',   category:'Dairy & Eggs',    qty:200, price:8,   unit:'per piece',  location:'Kota, Rajasthan',       phone:'9898001234', available:true,  farmer:'Poonam Jain',   desc:'Country eggs from free-range hens. Nutritious and fresh.' },
  { id:10, name:'Dhaniya Powder',    category:'Herbs & Spices',  qty:30,  price:120, unit:'per kg',     location:'Alwar, Rajasthan',      phone:'9845678901', available:true,  farmer:'Rajpal Gujar',  desc:'Home-ground coriander powder, pure and aromatic.' },
  { id:11, name:'Watermelon',        category:'Fruits',          qty:90,  price:15,  unit:'per kg',     location:'Barmer, Rajasthan',     phone:'9823001234', available:true,  farmer:'Hamid Khan',    desc:'Sweet and juicy watermelons, freshly harvested.' },
  { id:12, name:'Curry Leaves',      category:'Herbs & Spices',  qty:15,  price:10,  unit:'per bundle', location:'Jodhpur, Rajasthan',    phone:'9876001234', available:true,  farmer:'Vimla Sharma',  desc:'Fresh kadi patta, aromatic and crisp.' },
];

// Farmer ki apni listings (subset) — backend se current user ki listings aayengi
let myListings = allListings.filter(l => [1, 6, 12].includes(l.id));

// ── ROLE STATE ──
let currentRole = 'farmer'; // 'farmer' | 'consumer'
let editingId   = null;

// ── ROLE SWITCH ──
function switchRole() {
  currentRole = currentRole === 'farmer' ? 'consumer' : 'farmer';
  applyRole();
}

function applyRole() {
  const badge = document.getElementById('role-badge');
  const btn   = document.querySelector('.btn-switch');
  const sub   = document.getElementById('header-sub');
  const fTabs = document.getElementById('farmer-tabs');
  const cTabs = document.getElementById('consumer-tabs');

  if (currentRole === 'farmer') {
    badge.textContent   = '🌾 Farmer';
    badge.className     = 'role-badge farmer';
    btn.textContent     = 'Switch to Consumer';
    sub.textContent     = 'Manage your produce listings or add new ones.';
    fTabs.style.display = 'flex';
    cTabs.style.display = 'none';
    showTab('my-listings');
  } else {
    badge.textContent   = '🛒 Consumer';
    badge.className     = 'role-badge consumer';
    btn.textContent     = 'Switch to Farmer';
    sub.textContent     = 'Browse fresh produce directly from local farmers.';
    fTabs.style.display = 'none';
    cTabs.style.display = 'flex';
    showTab('browse');
  }
}

// ── TABS ──
function showTab(tab) {
  document.querySelectorAll('.tab-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

  const map = {
    'browse':       'section-browse',
    'my-listings':  'section-my-listings',
    'add-listing':  'section-add-listing',
  };

  document.getElementById(map[tab])?.classList.add('active');

  if (tab === 'my-listings') document.getElementById('tab-my')?.classList.add('active');
  if (tab === 'add-listing') {
    document.getElementById('tab-add')?.classList.add('active');
    resetForm();
  }

  if (tab === 'browse')      renderBrowse();
  if (tab === 'my-listings') renderFarmerListings();
}

// ── RENDER BROWSE GRID ──
function renderBrowse(filtered) {
  const data  = filtered || allListings;
  const grid  = document.getElementById('listings-grid');
  const empty = document.getElementById('empty-browse');
  const count = document.getElementById('results-count');

  count.textContent = data.length + ' listing' + (data.length !== 1 ? 's' : '');

  if (!data.length) {
    grid.innerHTML = '';
    empty.classList.add('show');
    return;
  }

  empty.classList.remove('show');
  grid.innerHTML = data.map((l, i) => `
    <div class="product-card" style="animation-delay:${i * 0.04}s" onclick="openModal(${l.id})">
      <div class="card-img">${EMOJIS[l.category] || '🌿'}</div>
      <div class="card-body">
        <div class="card-category">${l.category}</div>
        <div class="card-name">${l.name}</div>
        <div class="card-meta">
          <span>📍 ${l.location.split(',')[0]}</span>
          <span>📦 ${l.qty} units</span>
        </div>
        <div class="card-footer">
          <div class="card-price">₹${l.price} <span>${l.unit}</span></div>
          <button class="btn-contact" onclick="event.stopPropagation(); openModal(${l.id})">View</button>
        </div>
      </div>
    </div>
  `).join('');
}

// ── FILTER & SEARCH ──
function filterListings() {
  let data = [...allListings];

  const q        = document.getElementById('search-input').value.toLowerCase().trim();
  const category = document.getElementById('filter-category').value;
  const sort     = document.getElementById('filter-sort').value;

  if (q) {
    data = data.filter(l =>
      l.name.toLowerCase().includes(q)     ||
      l.location.toLowerCase().includes(q) ||
      l.farmer.toLowerCase().includes(q)   ||
      l.category.toLowerCase().includes(q)
    );
  }

  if (category) data = data.filter(l => l.category === category);

  if (sort === 'price-asc')  data.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') data.sort((a, b) => b.price - a.price);
  if (sort === 'newest')     data.reverse();

  renderBrowse(data);
}

// ── RENDER FARMER LISTINGS ──
function renderFarmerListings() {
  const list  = document.getElementById('farmer-listings-list');
  const empty = document.getElementById('empty-farmer');

  if (!myListings.length) {
    list.innerHTML = '';
    empty.classList.add('show');
    return;
  }

  empty.classList.remove('show');
  list.innerHTML = myListings.map((l, i) => `
    <div class="farmer-listing-row" style="animation-delay:${i * 0.06}s">
      <div class="row-emoji">${EMOJIS[l.category] || '🌿'}</div>
      <div class="row-info">
        <div class="row-name">${l.name}</div>
        <div class="row-sub">${l.category} · ${l.location} · ${l.qty} units</div>
      </div>
      <span class="status-pill ${l.available ? 'active' : 'inactive'}">
        ${l.available ? '● Available' : '○ Unavailable'}
      </span>
      <div class="row-price">
        ₹${l.price}
        <small style="font-size:12px; color:var(--bark); font-weight:300">${l.unit}</small>
      </div>
      <div class="row-actions">
        <button class="btn-edit"   onclick="editListing(${l.id})">Edit</button>
        <button class="btn-delete" onclick="deleteListing(${l.id})">Delete</button>
      </div>
    </div>
  `).join('');
}

// ── PRODUCT DETAIL MODAL ──
function openModal(id) {
  const l = allListings.find(x => x.id === id);
  if (!l) return;

  document.getElementById('m-emoji').textContent    = EMOJIS[l.category] || '🌿';
  document.getElementById('m-category').textContent = l.category;
  document.getElementById('m-name').textContent     = l.name;
  document.getElementById('m-price').textContent    = `₹${l.price} ${l.unit}`;
  document.getElementById('m-qty').textContent      = `${l.qty} units`;
  document.getElementById('m-location').textContent = l.location;
  document.getElementById('m-avail').textContent    = l.available ? '✅ Available' : '❌ Not available';
  document.getElementById('m-farmer').textContent   = l.farmer;
  document.getElementById('m-desc').textContent     = l.desc;

  document.getElementById('m-whatsapp').onclick = () =>
    window.open(`https://wa.me/91${8107161922}?text=Hi! I'm interested in your ${l.name} listing on Farmizen.`, '_blank');

  document.getElementById('m-call').onclick = () =>
    window.open(`tel:${l.phone}`);

  document.getElementById('modal-overlay').classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('show');
  document.body.style.overflow = '';
}

function closeModalOutside(e) {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
}

// ── FORM VALIDATION ──
function validateField(grpId, condition) {
  const g = document.getElementById(grpId);
  if (!g) return condition;
  g.classList.toggle('field-error', !condition);
  return condition;
}

// ── SUBMIT LISTING (Add / Edit) ──
function submitListing() {
  const name     = document.getElementById('f-name').value.trim();
  const category = document.getElementById('f-category').value;
  const qty      = document.getElementById('f-qty').value;
  const price    = document.getElementById('f-price').value;
  const location = document.getElementById('f-location').value.trim();
  const phone    = document.getElementById('f-phone').value.trim();

  const ok = [
    validateField('grp-name',     name !== ''),
    validateField('grp-category', category !== ''),
    validateField('grp-qty',      qty !== '' && qty > 0),
    validateField('grp-price',    price !== '' && price >= 0),
    validateField('grp-location', location !== ''),
    validateField('grp-phone',    /^\d{10}$/.test(phone)),
  ].every(Boolean);

  if (!ok) return;

  const listing = {
    id:        editingId || Date.now(),
    name,
    category,
    qty:       parseInt(qty),
    price:     parseFloat(price),
    unit:      document.getElementById('f-unit').value,
    desc:      document.getElementById('f-desc').value.trim(),
    location,
    pincode:   document.getElementById('f-pincode').value.trim(),
    phone,
    available: document.getElementById('f-available').checked,
    farmer:    'You',
  };

  if (editingId) {
    // Update existing listing
    const idx  = myListings.findIndex(l => l.id === editingId);
    const aidx = allListings.findIndex(l => l.id === editingId);
    if (idx  > -1) myListings[idx]   = listing;
    if (aidx > -1) allListings[aidx] = listing;
    showToast('✅ Listing updated!');
  } else {
    // Add new listing
    myListings.unshift(listing);
    allListings.unshift(listing);
    showToast('🌱 Listing published!');
  }

  editingId = null;
  showTab('my-listings');
}

// ── EDIT LISTING ──
function editListing(id) {
  const l = myListings.find(x => x.id === id);
  if (!l) return;

  editingId = id;
  document.getElementById('form-title').textContent  = '✏️ Edit Listing';
  document.getElementById('f-name').value            = l.name;
  document.getElementById('f-category').value        = l.category;
  document.getElementById('f-qty').value             = l.qty;
  document.getElementById('f-price').value           = l.price;
  document.getElementById('f-unit').value            = l.unit;
  document.getElementById('f-desc').value            = l.desc;
  document.getElementById('f-location').value        = l.location;
  document.getElementById('f-pincode').value         = l.pincode || '';
  document.getElementById('f-phone').value           = l.phone;
  document.getElementById('f-available').checked     = l.available;

  showTab('add-listing');
  document.getElementById('tab-add')?.classList.add('active');
}

// ── DELETE LISTING ──
function deleteListing(id) {
  if (!confirm('Delete this listing?')) return;
  myListings  = myListings.filter(l => l.id !== id);
  allListings = allListings.filter(l => l.id !== id);
  renderFarmerListings();
  showToast('🗑️ Listing deleted.');
}

// ── RESET FORM ──
function resetForm() {
  editingId = null;
  document.getElementById('form-title').textContent = '🌱 Add New Listing';

  ['f-name','f-category','f-qty','f-price','f-desc','f-location','f-pincode','f-phone']
    .forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });

  document.getElementById('f-available').checked = true;

  ['grp-name','grp-category','grp-qty','grp-price','grp-location','grp-phone']
    .forEach(id => document.getElementById(id)?.classList.remove('field-error'));
}

// ── TOAST NOTIFICATION ──
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  applyRole();
  renderBrowse();
});