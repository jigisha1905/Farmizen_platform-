/* =========================================
   FARMIZEN — farmland.js
   Import: <script src="js/farmland.js"></script>
   ========================================= */

// ── MOCK DATA ──
const LAND_EMOJIS = {
  'Agricultural':   '🌾',
  'Horticultural':  '🌳',
  'Organic Farm':   '🌱',
  'Grazing Land':   '🐄',
  'Mixed Use':      '🏡',
};

let allLand = [
  { id:1,  title:'Fertile Agricultural Land',       type:'Agricultural',  listingType:'Sale',  size:5,   sizeUnit:'acres',   price:2500000, priceUnit:'total',    location:'Jaipur, Rajasthan',      pincode:'302001', phone:'9876543210', owner:'Ramesh Sharma',  features:['Water Source','Road Access','Electricity'], desc:'Well-irrigated land with canal water access. Suitable for wheat and mustard cultivation.' },
  { id:2,  title:'Mango Orchard for Lease',         type:'Horticultural', listingType:'Lease', size:3,   sizeUnit:'acres',   price:15000,   priceUnit:'per year', location:'Chittorgarh, Rajasthan', pincode:'312001', phone:'9812345678', owner:'Prakash Mali',   features:['Water Source','Fencing','Road Access'],     desc:'Established mango orchard with 120+ trees. Ready for immediate farming.' },
  { id:3,  title:'Organic Certified Farm',          type:'Organic Farm',  listingType:'Sale',  size:8,   sizeUnit:'acres',   price:4800000, priceUnit:'total',    location:'Ajmer, Rajasthan',       pincode:'305001', phone:'9765432109', owner:'Gita Bai',       features:['Water Source','Tube Well','Electricity','Fencing'], desc:'NPOP certified organic farm. Rich black soil with borewell irrigation.' },
  { id:4,  title:'Grazing Land Available',          type:'Grazing Land',  listingType:'Lease', size:12,  sizeUnit:'acres',   price:8000,    priceUnit:'per year', location:'Bikaner, Rajasthan',     pincode:'334001', phone:'9898765432', owner:'Abdul Karim',    features:['Road Access'],                              desc:'Open grazing land ideal for cattle and goat farming.' },
  { id:5,  title:'Mixed Use Agricultural Plot',     type:'Mixed Use',     listingType:'Sale',  size:2.5, sizeUnit:'acres',   price:1800000, priceUnit:'total',    location:'Sikar, Rajasthan',       pincode:'332001', phone:'9823456789', owner:'Sunita Devi',    features:['Water Source','Road Access','Storage'],     desc:'Versatile land suitable for vegetables, fruits and small poultry.' },
  { id:6,  title:'Horticultural Land with Borewell',type:'Horticultural', listingType:'Sale',  size:4,   sizeUnit:'acres',   price:3200000, priceUnit:'total',    location:'Kota, Rajasthan',        pincode:'324001', phone:'9898001234', owner:'Poonam Jain',    features:['Tube Well','Road Access','Electricity'],    desc:'Suitable for citrus and guava plantation. Existing borewell with motor.' },
  { id:7,  title:'Wheat Farm on Lease',             type:'Agricultural',  listingType:'Lease', size:6,   sizeUnit:'acres',   price:12000,   priceUnit:'per year', location:'Nagaur, Rajasthan',      pincode:'341001', phone:'9812309876', owner:'Suresh Patel',   features:['Water Source','Road Access'],               desc:'Productive land for wheat and pulses. Canal irrigation available.' },
  { id:8,  title:'Small Organic Plot',              type:'Organic Farm',  listingType:'Lease', size:1,   sizeUnit:'acres',   price:6000,    priceUnit:'per year', location:'Jodhpur, Rajasthan',     pincode:'342001', phone:'9876001234', owner:'Vimla Sharma',   features:['Water Source','Fencing','Electricity'],     desc:'Perfect for beginners. Small plot with basic infrastructure ready.' },
];

// Farmer ki apni listings
let myLand = allLand.filter(l => [1, 5].includes(l.id));

// ── STATE ──
let currentRole = 'farmer';
let editingId   = null;
let activeModal = null;

// ── ROLE SWITCH ──
function switchRole() {
  currentRole = currentRole === 'farmer' ? 'buyer' : 'farmer';
  applyRole();
}

function applyRole() {
  const badge   = document.getElementById('role-badge');
  const btn     = document.querySelector('.fz-btn-switch');
  const sub     = document.getElementById('header-sub');
  const fTabs   = document.getElementById('farmer-tabs');
  const bTabs   = document.getElementById('buyer-tabs');

  if (currentRole === 'farmer') {
    badge.textContent   = '🌾 Farmer';
    badge.className     = 'fz-role-badge farmer';
    btn.textContent     = 'Switch to Buyer';
    sub.textContent     = 'List your land for sale or lease.';
    fTabs.style.display = 'flex';
    bTabs.style.display = 'none';
    showTab('my-listings');
  } else {
    badge.textContent   = '🏡 Buyer';
    badge.className     = 'fz-role-badge buyer';
    btn.textContent     = 'Switch to Farmer';
    sub.textContent     = 'Browse farmland available for sale or lease.';
    fTabs.style.display = 'none';
    bTabs.style.display = 'flex';
    showTab('browse');
  }
}

// ── TABS ──
function showTab(tab) {
  ['browse', 'my-listings', 'add-listing'].forEach(t => {
    const el = document.getElementById(`section-${t}`);
    if (el) el.style.display = 'none';
  });

  document.querySelectorAll('.fz-tab').forEach(b => b.classList.remove('active'));

  const section = document.getElementById(`section-${tab}`);
  if (section) section.style.display = 'block';

  const tabBtn = document.getElementById(`tab-${tab}`);
  if (tabBtn) tabBtn.classList.add('active');

  if (tab === 'browse')      renderBrowse();
  if (tab === 'my-listings') renderMyListings();
  if (tab === 'add-listing') resetForm();
}

// ── RENDER BROWSE GRID ──
function renderBrowse(filtered) {
  const data  = filtered || allLand;
  const grid  = document.getElementById('land-grid');
  const empty = document.getElementById('empty-browse');
  const count = document.getElementById('results-count');

  count.textContent = `${data.length} listing${data.length !== 1 ? 's' : ''}`;

  if (!data.length) {
    grid.innerHTML = '';
    empty.classList.add('show');
    return;
  }

  empty.classList.remove('show');
  grid.innerHTML = data.map((l, i) => `
    <div class="col-md-6 col-lg-4">
      <div class="fz-land-card" style="animation-delay:${i * 0.05}s" onclick="openModal(${l.id})">
        <div class="fz-land-img">
          ${LAND_EMOJIS[l.type] || '🌾'}
          <span class="fz-listing-badge ${l.listingType.toLowerCase()}">${l.listingType}</span>
        </div>
        <div class="fz-card-body">
          <div class="fz-card-type">${l.type}</div>
          <div class="fz-card-title">${l.title}</div>
          <div class="fz-card-meta">
            <span>📍 ${l.location.split(',')[0]}</span>
            <span>📐 ${l.size} ${l.sizeUnit}</span>
            <span>👤 ${l.owner}</span>
          </div>
          <div class="fz-card-tags">
            ${l.features.slice(0,3).map(f => `<span class="fz-tag">${f}</span>`).join('')}
          </div>
          <div class="fz-card-footer">
            <div class="fz-card-price">
              ₹${formatPrice(l.price)}
              <span>${l.priceUnit !== 'total' ? l.priceUnit : ''}</span>
            </div>
            <button class="fz-btn-view" onclick="event.stopPropagation(); openModal(${l.id})">
              Inquire
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// ── FILTER LAND ──
function filterLand() {
  let data = [...allLand];

  const q       = document.getElementById('search-input').value.toLowerCase().trim();
  const type    = document.getElementById('filter-type').value;
  const listing = document.getElementById('filter-listing').value;
  const sort    = document.getElementById('filter-sort').value;

  if (q) {
    data = data.filter(l =>
      l.title.toLowerCase().includes(q)    ||
      l.location.toLowerCase().includes(q) ||
      l.type.toLowerCase().includes(q)     ||
      l.owner.toLowerCase().includes(q)
    );
  }

  if (type)    data = data.filter(l => l.type === type);
  if (listing) data = data.filter(l => l.listingType === listing);

  if (sort === 'price-asc')  data.sort((a,b) => a.price - b.price);
  if (sort === 'price-desc') data.sort((a,b) => b.price - a.price);
  if (sort === 'size-asc')   data.sort((a,b) => a.size  - b.size);
  if (sort === 'size-desc')  data.sort((a,b) => b.size  - a.size);

  renderBrowse(data);
}

// ── RENDER MY LISTINGS ──
function renderMyListings() {
  const list  = document.getElementById('my-land-list');
  const empty = document.getElementById('empty-my');

  if (!myLand.length) {
    list.innerHTML = '';
    empty.classList.add('show');
    return;
  }

  empty.classList.remove('show');
  list.innerHTML = myLand.map((l, i) => `
    <div class="fz-land-row" style="animation-delay:${i * 0.06}s">
      <div class="fz-row-icon">${LAND_EMOJIS[l.type] || '🌾'}</div>
      <div class="fz-row-info">
        <div class="fz-row-name">${l.title}</div>
        <div class="fz-row-sub">${l.type} · ${l.size} ${l.sizeUnit} · ${l.location}</div>
      </div>
      <span class="fz-listing-badge ${l.listingType.toLowerCase()} me-2">${l.listingType}</span>
      <div class="fz-row-price">₹${formatPrice(l.price)} <small style="font-size:11px;color:var(--bark);font-weight:300">${l.priceUnit !== 'total' ? l.priceUnit : ''}</small></div>
      <div class="fz-row-actions">
        <button class="fz-btn-edit"   onclick="editListing(${l.id})">Edit</button>
        <button class="fz-btn-delete" onclick="deleteListing(${l.id})">Delete</button>
      </div>
    </div>
  `).join('');
}

// ── OPEN INQUIRY MODAL ──
function openModal(id) {
  const l = allLand.find(x => x.id === id);
  if (!l) return;
  activeModal = l;

  document.getElementById('m-icon').textContent    = LAND_EMOJIS[l.type] || '🌾';
  document.getElementById('m-type').textContent    = l.type;
  document.getElementById('m-title').textContent   = l.title;
  document.getElementById('m-price').textContent   = `₹${formatPrice(l.price)} ${l.priceUnit !== 'total' ? l.priceUnit : ''}`;
  document.getElementById('m-size').textContent    = `${l.size} ${l.sizeUnit}`;
  document.getElementById('m-location').textContent= l.location;
  document.getElementById('m-ltype').textContent   = l.listingType;
  document.getElementById('m-owner').textContent   = l.owner;
  document.getElementById('m-desc').textContent    = l.desc;

  document.getElementById('m-tags').innerHTML =
    l.features.map(f => `<span class="fz-tag">${f}</span>`).join('');

  // Reset inquiry form
  ['inq-name','inq-phone','inq-message'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  ['grp-inq-name','grp-inq-phone'].forEach(id =>
    document.getElementById(id)?.classList.remove('field-error')
  );

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

// ── SUBMIT INQUIRY ──
function submitInquiry() {
  const name  = document.getElementById('inq-name').value.trim();
  const phone = document.getElementById('inq-phone').value.trim();

  const v1 = validateField('grp-inq-name',  name !== '');
  const v2 = validateField('grp-inq-phone', /^\d{10}$/.test(phone));
  if (!v1 || !v2) return;

  // In real app: POST to /api/inquiries
  showToast(`✅ Inquiry sent to ${activeModal?.owner || 'owner'}!`);
  closeModal();
}

// ── WHATSAPP OWNER ──
function whatsappOwner() {
  if (!activeModal) return;
  const msg = `Hi! I'm interested in your land listing "${activeModal.title}" (${activeModal.size} ${activeModal.sizeUnit}, ${activeModal.location}) on Farmizen. Please contact me.`;
  window.open(`https://wa.me/91${activeModal.phone}?text=${encodeURIComponent(msg)}`, '_blank');
}

// ── FORM VALIDATION ──
function validateField(grpId, condition) {
  const el = document.getElementById(grpId);
  if (!el) return condition;
  el.classList.toggle('field-error', !condition);
  return condition;
}

// ── SUBMIT LISTING ──
function submitListing() {
  const title       = document.getElementById('f-title').value.trim();
  const type        = document.getElementById('f-type').value;
  const listingType = document.getElementById('f-listing-type').value;
  const size        = document.getElementById('f-size').value;
  const price       = document.getElementById('f-price').value;
  const location    = document.getElementById('f-location').value.trim();
  const phone       = document.getElementById('f-phone').value.trim();

  const ok = [
    validateField('grp-title',        title !== ''),
    validateField('grp-type',         type !== ''),
    validateField('grp-listing-type', listingType !== ''),
    validateField('grp-size',         size !== '' && size > 0),
    validateField('grp-price',        price !== '' && price >= 0),
    validateField('grp-location',     location !== ''),
    validateField('grp-phone',        /^\d{10}$/.test(phone)),
  ].every(Boolean);

  if (!ok) return;

  // Collect selected features
  const features = [];
  document.querySelectorAll('.fz-feature-check input:checked').forEach(cb => {
    features.push(cb.value);
  });

  const listing = {
    id:          editingId || Date.now(),
    title,
    type,
    listingType,
    size:        parseFloat(size),
    sizeUnit:    document.getElementById('f-size-unit').value,
    price:       parseFloat(price),
    priceUnit:   document.getElementById('f-price-unit').value,
    desc:        document.getElementById('f-desc').value.trim(),
    location,
    pincode:     document.getElementById('f-pincode').value.trim(),
    phone,
    owner:       'You',
    features,
  };

  if (editingId) {
    const mi = myLand.findIndex(l => l.id === editingId);
    const ai = allLand.findIndex(l => l.id === editingId);
    if (mi > -1) myLand[mi]  = listing;
    if (ai > -1) allLand[ai] = listing;
    showToast('✅ Listing updated!');
  } else {
    myLand.unshift(listing);
    allLand.unshift(listing);
    showToast('🌱 Land listing published!');
  }

  editingId = null;
  showTab('my-listings');
}

// ── EDIT LISTING ──
function editListing(id) {
  const l = myLand.find(x => x.id === id);
  if (!l) return;
  editingId = id;

  document.getElementById('form-title').textContent         = '✏️ Edit Land Listing';
  document.getElementById('f-title').value                  = l.title;
  document.getElementById('f-type').value                   = l.type;
  document.getElementById('f-listing-type').value           = l.listingType;
  document.getElementById('f-size').value                   = l.size;
  document.getElementById('f-size-unit').value              = l.sizeUnit;
  document.getElementById('f-price').value                  = l.price;
  document.getElementById('f-price-unit').value             = l.priceUnit;
  document.getElementById('f-desc').value                   = l.desc;
  document.getElementById('f-location').value               = l.location;
  document.getElementById('f-pincode').value                = l.pincode || '';
  document.getElementById('f-phone').value                  = l.phone;

  // Set feature checkboxes
  document.querySelectorAll('.fz-feature-check input').forEach(cb => {
    cb.checked = l.features.includes(cb.value);
  });

  showTab('add-listing');
  document.getElementById('tab-add')?.classList.add('active');
}

// ── DELETE LISTING ──
function deleteListing(id) {
  if (!confirm('Delete this land listing?')) return;
  myLand  = myLand.filter(l => l.id !== id);
  allLand = allLand.filter(l => l.id !== id);
  renderMyListings();
  showToast('🗑️ Listing deleted.');
}

// ── RESET FORM ──
function resetForm() {
  editingId = null;
  document.getElementById('form-title').textContent = '🌱 Add New Land Listing';
  ['f-title','f-type','f-listing-type','f-size','f-price','f-desc','f-location','f-pincode','f-phone']
    .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  document.querySelectorAll('.fz-feature-check input').forEach(cb => cb.checked = false);
  ['grp-title','grp-type','grp-listing-type','grp-size','grp-price','grp-location','grp-phone']
    .forEach(id => document.getElementById(id)?.classList.remove('field-error'));
}

// ── FORMAT PRICE ──
function formatPrice(price) {
  if (price >= 10000000) return (price / 10000000).toFixed(1) + ' Cr';
  if (price >= 100000)   return (price / 100000).toFixed(1)   + ' L';
  if (price >= 1000)     return (price / 1000).toFixed(0)     + 'K';
  return price.toLocaleString('en-IN');
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