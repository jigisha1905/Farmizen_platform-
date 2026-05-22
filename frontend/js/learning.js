/* =========================================
   FARMIZEN — learning.js
   Import: <script src="js/learning.js"></script>
   ========================================= */

// ── MOCK CONTENT DATA ──
const CONTENT_ICONS = {
  'course': '📚',
  'article': '📄',
  'video': '🎥',
  'tip': '💡',
};

let allContent = [
  { id:1,  type:'course',  title:'Organic Farming 101',                  category:'Organic Farming',    icon:'🌱', desc:'Learn the fundamentals of organic farming from certified experts. Get certified in just 4 weeks.', duration:'4 weeks', learners:'2,340', instructor:'Dr. Rajesh Singh', price:'₹4,999', rating:4.8, curriculum:['Soil preparation','Composting','Crop rotation','Natural pest control','Water management'] },
  { id:2,  type:'article', title:'Water Management in Dry Seasons',      category:'Water Management',   icon:'💧', desc:'Complete guide to efficient water usage and irrigation techniques for arid regions.', duration:'15 min read', learners:'890', instructor:'Priya Sharma', price:'Free', rating:4.6, curriculum:['Drip irrigation','Mulching','Rainwater harvesting','Soil moisture testing'] },
  { id:3,  type:'video',   title:'Identifying Crop Varieties',           category:'Crop Varieties',     icon:'🌾', desc:'Visual guide to identify and select the best crop varieties for your region.', duration:'22 min', learners:'1,230', instructor:'Ramesh Kumar', price:'Free', rating:4.7, curriculum:['Hybrid vs heirloom','Local varieties','Climate matching','Seed selection'] },
  { id:4,  type:'tip',     title:'Quick Tip: Natural Pest Control',      category:'Pest Control',       icon:'🐛', desc:'Learn 5 easy ways to control pests using natural methods at home.', duration:'5 min', learners:'5,600', instructor:'Sunita Devi', price:'Free', rating:4.5, curriculum:['Neem oil spray','Companion planting','Beneficial insects','Organic pesticides'] },
  { id:5,  type:'course',  title:'Soil Health & Fertility',              category:'Soil Health',        icon:'🌍', desc:'Master soil testing, nutrient management, and sustainable soil practices.', duration:'3 weeks', learners:'1,567', instructor:'Dr. Ajay Patel', price:'₹3,999', rating:4.9, curriculum:['Soil pH testing','NPK understanding','Composting methods','Crop rotation planning'] },
  { id:6,  type:'article', title:'Modern Farming Equipment Guide',       category:'Modern Equipment',   icon:'🚜', desc:'Comprehensive guide to essential farming equipment and their maintenance.', duration:'20 min read', learners:'720', instructor:'Vijay Singh', price:'Free', rating:4.4, curriculum:['Tractors basics','Irrigation equipment','Harvesters','Tool maintenance'] },
  { id:7,  type:'video',   title:'Market Trends 2024',                   category:'Market Trends',      icon:'📈', desc:'Latest market trends and tips to increase your farm profitability.', duration:'18 min', learners:'890', instructor:'Meera Kapoor', price:'Free', rating:4.8, curriculum:['Price trends','Export opportunities','Government schemes','Direct marketing'] },
  { id:8,  type:'course',  title:'Organic Certification Process',        category:'Organic Farming',    icon:'✅', desc:'Step-by-step guide to get your farm certified as organic.', duration:'2 weeks', learners:'640', instructor:'Dr. Rajesh Singh', price:'₹2,999', rating:4.6, curriculum:['Certification bodies','Documentation','Inspection process','Standards compliance'] },
  { id:9,  type:'tip',     title:'Composting in 30 Days',                category:'Soil Health',        icon:'🥕', desc:'Quick composting method to create rich soil in just 30 days.', duration:'8 min', learners:'3,400', instructor:'Ramesh Kumar', price:'Free', rating:4.5, curriculum:['Green waste','Brown waste','Moisture control','Temperature management'] },
  { id:10, type:'article', title:'Sustainable Farming Practices',        category:'Organic Farming',    icon:'🌿', desc:'Explore sustainable practices that benefit both environment and yield.', duration:'18 min read', learners:'1,100', instructor:'Sunita Devi', price:'Free', rating:4.7, curriculum:['Agroforestry','Intercropping','Biodiversity','Carbon sequestration'] },
];

// Experts data
const experts = [
  { name:'Dr. Rajesh Singh', title:'Organic Farming Expert', emoji:'👨‍⚕️', bio:'Ph.D. in Agricultural Science with 20+ years of experience.' },
  { name:'Priya Sharma', title:'Water Management Specialist', emoji:'👩‍💼', bio:'Expert in irrigation systems and water conservation techniques.' },
  { name:'Ramesh Kumar', title:'Crop Specialist', emoji:'👨‍🌾', bio:'Certified seed expert and crop variety consultant.' },
  { name:'Sunita Devi', title:'Sustainable Farming Advocate', emoji:'👩‍🌾', bio:'Pioneering sustainable farming methods in rural areas.' },
];

// ── STATE ──
let activeModal = null;

// ── RENDER CONTENT GRID ──
function renderContent(filtered) {
  const data = filtered || allContent;
  const grid = document.getElementById('content-grid');
  const empty = document.getElementById('empty-content');

  if (!data.length) {
    grid.innerHTML = '';
    empty.classList.add('show');
    return;
  }

  empty.classList.remove('show');
  grid.innerHTML = data.map((c, i) => `
    <div class="col-md-6 col-lg-4">
      <div class="fz-content-card" style="animation-delay:${i * 0.05}s" onclick="openModal(${c.id})">
        <div class="fz-content-img">
          ${c.icon}
          <span class="fz-content-type-badge">${c.type}</span>
        </div>
        <div class="fz-content-body">
          <div class="fz-content-category">${c.category}</div>
          <div class="fz-content-title">${c.title}</div>
          <div class="fz-content-meta">
            <span>⏱️ ${c.duration}</span>
            <span>👥 ${c.learners}</span>
          </div>
          <div class="fz-content-rating">
            ${'⭐'.repeat(Math.floor(c.rating))} ${c.rating}
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// ── FILTER CONTENT ──
function filterContent() {
  let data = [...allContent];

  const q        = document.getElementById('search-input').value.toLowerCase().trim();
  const category = document.getElementById('filter-category').value;
  const type     = document.getElementById('filter-type').value;

  if (q) {
    data = data.filter(c =>
      c.title.toLowerCase().includes(q)       ||
      c.category.toLowerCase().includes(q)    ||
      c.instructor.toLowerCase().includes(q)
    );
  }

  if (category) data = data.filter(c => c.category === category);
  if (type)     data = data.filter(c => c.type === type);

  renderContent(data);
}

// ── OPEN MODAL ──
function openModal(id) {
  const c = allContent.find(x => x.id === id);
  if (!c) return;
  activeModal = c;

  document.getElementById('m-icon').textContent      = c.icon;
  document.getElementById('m-type').textContent      = c.type.toUpperCase();
  document.getElementById('m-title').textContent     = c.title;
  document.getElementById('m-desc').textContent      = c.desc;
  document.getElementById('m-duration').textContent  = c.duration;
  document.getElementById('m-learners').textContent  = c.learners;
  document.getElementById('m-instructor').textContent= c.instructor;
  document.getElementById('m-price').textContent     = c.price;

  document.getElementById('m-rating').innerHTML = `
    ${'⭐'.repeat(Math.floor(c.rating))} ${c.rating} (${Math.floor(Math.random() * 5000 + 1000)} reviews)
  `;

  document.getElementById('m-curriculum').innerHTML =
    c.curriculum.map(item => `<li>${item}</li>`).join('');

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

// ── ENROLL COURSE ──
function enrollCourse() {
  if (!activeModal) return;

  if (activeModal.price === 'Free') {
    showToast(`✅ Enrolled in "${activeModal.title}"! Start learning now.`);
  } else {
    showToast(`💳 Proceeding to payment for ${activeModal.price}...`);
    // In real app: redirect to checkout with course
  }

  closeModal();
}

// ── ADD TO WISHLIST ──
function addToWishlist() {
  if (!activeModal) return;

  const wishlist = JSON.parse(localStorage.getItem('farmizen_wishlist') || '[]');
  if (wishlist.find(w => w.id === activeModal.id)) {
    wishlist = wishlist.filter(w => w.id !== activeModal.id);
    showToast('📌 Removed from wishlist.');
  } else {
    wishlist.push({ id: activeModal.id, title: activeModal.title, icon: activeModal.icon });
    showToast('❤️ Added to wishlist!');
  }

  localStorage.setItem('farmizen_wishlist', JSON.stringify(wishlist));
}

// ── RENDER EXPERTS ──
function renderExperts() {
  const grid = document.getElementById('experts-grid');
  grid.innerHTML = experts.map((e, i) => `
    <div class="col-md-6 col-lg-3">
      <div class="fz-expert-card" style="animation-delay:${i * 0.08}s">
        <div class="fz-expert-avatar">${e.emoji}</div>
        <div class="fz-expert-name">${e.name}</div>
        <div class="fz-expert-title">${e.title}</div>
        <p class="fz-expert-bio">${e.bio}</p>
      </div>
    </div>
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
document.addEventListener('DOMContentLoaded', () => {
  renderContent();
  renderExperts();
});