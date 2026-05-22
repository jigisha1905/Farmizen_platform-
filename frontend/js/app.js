/* =========================================
   FARMIZEN — app.js
   Har page mein include karo:
   <script src="js/app.js"></script>
   Yeh file saare pages ko connect karti hai.
   ========================================= */

// ── CURRENT PAGE DETECT ──
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

// ── NAVBAR ACTIVE LINK ──
function setActiveNavLink() {
  document.querySelectorAll('.fz-nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && currentPage === href) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// ── CART COUNT BADGE ──
// Navbar mein cart icon ke saath count dikhata hai
function updateCartBadge() {
  const cart  = JSON.parse(localStorage.getItem('farmizen_cart') || '[]');
  const total = cart.reduce((sum, i) => sum + i.qty, 0);
  const badge = document.getElementById('cart-badge');
  if (!badge) return;
  badge.textContent    = total;
  badge.style.display  = total > 0 ? 'flex' : 'none';
}

// ── NAVBAR CART ICON INJECT ──
// Agar navbar mein cart icon nahi hai toh add karta hai
function injectCartIcon() {
  const navRight = document.querySelector('.navbar-nav');
  if (!navRight) return;
  if (document.getElementById('nav-cart-link')) return; // already exists

  const cartLi = document.createElement('li');
  cartLi.className = 'nav-item';
  cartLi.innerHTML = `
    <a href="cart.html" class="nav-link fz-nav-link fz-cart-icon-wrap" id="nav-cart-link">
      🛒
      <span class="fz-cart-badge" id="cart-badge" style="display:none;">0</span>
    </a>
  `;
  navRight.appendChild(cartLi);
  updateCartBadge();
}

// ── PAGE-SPECIFIC CONNECTIONS ──

// 1. MARKETPLACE → PRODUCT PAGE
// Product card click karne par product.html?id=X pe redirect
function connectMarketplaceToProduct() {
  if (currentPage !== 'marketplace.html') return;

  // Override openModal to redirect to product page instead
  window.goToProduct = function(id) {
    window.location.href = `product.html?id=${id}`;
  };
}

// 2. PRODUCT PAGE — URL se id read karke data load
function connectProductPage() {
  if (currentPage !== 'product.html') return;

  const params = new URLSearchParams(window.location.search);
  const id     = parseInt(params.get('id')) || 1;

  // Find product from mock data (baad mein API se aayega)
  const found = (window.allListings || []).find(p => p.id === id);
  if (found && window.product !== undefined) {
    // Map listing fields to product fields
    window.product = {
      id:        found.id,
      name:      found.name,
      category:  found.category,
      emoji:     (window.EMOJIS || {})[found.category] || '🌿',
      price:     found.price,
      unit:      found.unit,
      qty:       found.qty,
      location:  found.location,
      pincode:   found.pincode || '',
      phone:     found.phone,
      available: found.available,
      farmer:    found.farmer,
      desc:      found.desc,
    };
    if (typeof window.loadProduct === 'function') window.loadProduct();
  }
}

// 3. PRODUCT → CART (Add to Cart redirects to cart page)
function connectProductToCart() {
  if (currentPage !== 'product.html') return;

  // Override addToCart to show confirmation and offer to go to cart
  const original = window.addToCart;
  window.addToCart = function() {
    if (typeof original === 'function') original();
    // Show go-to-cart prompt after 1.5s
    setTimeout(() => {
      const go = confirm('Item added to cart! Go to cart now?');
      if (go) window.location.href = 'cart.html';
    }, 1500);
  };
}

// 4. CART → CHECKOUT
function connectCartToCheckout() {
  if (currentPage !== 'cart.html') return;

  // proceedToCheckout already handles this in cart.js
  // Just make sure checkout button exists
  const btn = document.querySelector('.fz-btn-checkout');
  if (btn) {
    btn.addEventListener('click', () => {
      // cart.js ka proceedToCheckout() call hoga
    });
  }
}

// 5. CHECKOUT → SUCCESS
function connectCheckoutToSuccess() {
  if (currentPage !== 'checkout.html') return;
  // checkout.js ka placeOrder() already redirects to success.html
}

// 6. SUCCESS → MARKETPLACE (Continue Shopping)
function connectSuccessToMarketplace() {
  if (currentPage !== 'success.html') return;
  // Links already set in success.html
}

// ── BACK BUTTON SUPPORT ──
function setupBackButtons() {
  document.querySelectorAll('[data-back]').forEach(btn => {
    btn.addEventListener('click', () => window.history.back());
  });
}

// ── PROTECT PAGES (login check) ──
// Jab auth ready ho tab yeh use hoga
function checkAuth() {
  const protectedPages = ['dashboard.html', 'checkout.html'];
  const user = JSON.parse(localStorage.getItem('farmizen_user') || 'null');

  if (protectedPages.includes(currentPage) && !user) {
    // Redirect to login with return URL
    window.location.href = `login.html?redirect=${currentPage}`;
  }
}

// ── SMOOTH PAGE TRANSITIONS ──
function setupPageTransitions() {
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    // Only internal pages, skip anchors and external
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('tel') || href.startsWith('mailto')) return;

    link.addEventListener('click', (e) => {
      e.preventDefault();
      document.body.style.opacity = '0';
      document.body.style.transition = 'opacity 0.2s ease';
      setTimeout(() => {
        window.location.href = href;
      }, 200);
    });
  });
}

// ── PAGE FADE IN ──
function fadeInPage() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.3s ease';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  });
}

// ── GLOBAL TOAST (kisi bhi page se call kar sako) ──
window.showGlobalToast = function(msg, duration = 3000) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id        = 'toast';
    t.className = 'fz-toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
};

// ── SHARED MOCK DATA ──
// Saare pages ek hi data use karein
window.MOCK_LISTINGS = [
  { id:1,  name:'Organic Tomatoes',  category:'Vegetables',      qty:80,  price:40,  unit:'per kg',     location:'Jaipur, Rajasthan',      phone:'9876543210', available:true,  farmer:'Ramesh Sharma', desc:'Freshly harvested, no pesticides. Grown using natural compost.' },
  { id:2,  name:'Fresh Spinach',     category:'Vegetables',      qty:50,  price:30,  unit:'per kg',     location:'Sikar, Rajasthan',       phone:'9823456789', available:true,  farmer:'Sunita Devi',   desc:'Tender spinach leaves, harvested daily.' },
  { id:3,  name:'Desi Mangoes',      category:'Fruits',          qty:120, price:80,  unit:'per kg',     location:'Chittorgarh, Rajasthan', phone:'9812345678', available:true,  farmer:'Prakash Mali',  desc:'Sweet Langda variety mangoes, straight from the orchard.' },
  { id:4,  name:'Moong Dal',         category:'Grains & Pulses', qty:200, price:90,  unit:'per kg',     location:'Bikaner, Rajasthan',     phone:'9898765432', available:true,  farmer:'Abdul Karim',   desc:'Organically grown moong dal, rich in protein.' },
  { id:5,  name:'A2 Cow Milk',       category:'Dairy & Eggs',    qty:30,  price:60,  unit:'per litre',  location:'Ajmer, Rajasthan',       phone:'9765432109', available:false, farmer:'Gita Bai',      desc:'Pure A2 cow milk from Gir cows.' },
  { id:6,  name:'Tulsi & Pudina',    category:'Herbs & Spices',  qty:20,  price:20,  unit:'per bundle', location:'Jaipur, Rajasthan',      phone:'9876501234', available:true,  farmer:'Meena Kumari',  desc:'Fresh tulsi and mint bundles.' },
  { id:7,  name:'Green Chillies',    category:'Vegetables',      qty:60,  price:25,  unit:'per kg',     location:'Tonk, Rajasthan',        phone:'9854321098', available:true,  farmer:'Bharat Singh',  desc:'Spicy green chillies, medium hot variety.' },
  { id:8,  name:'Organic Wheat',     category:'Grains & Pulses', qty:500, price:35,  unit:'per kg',     location:'Nagaur, Rajasthan',      phone:'9812309876', available:true,  farmer:'Suresh Patel',  desc:'Stone-ground organic wheat, ideal for chapati flour.' },
  { id:9,  name:'Free Range Eggs',   category:'Dairy & Eggs',    qty:200, price:8,   unit:'per piece',  location:'Kota, Rajasthan',        phone:'9898001234', available:true,  farmer:'Poonam Jain',   desc:'Country eggs from free-range hens.' },
  { id:10, name:'Dhaniya Powder',    category:'Herbs & Spices',  qty:30,  price:120, unit:'per kg',     location:'Alwar, Rajasthan',       phone:'9845678901', available:true,  farmer:'Rajpal Gujar',  desc:'Home-ground coriander powder, pure and aromatic.' },
  { id:11, name:'Watermelon',        category:'Fruits',          qty:90,  price:15,  unit:'per kg',     location:'Barmer, Rajasthan',      phone:'9823001234', available:true,  farmer:'Hamid Khan',    desc:'Sweet and juicy watermelons.' },
  { id:12, name:'Curry Leaves',      category:'Herbs & Spices',  qty:15,  price:10,  unit:'per bundle', location:'Jodhpur, Rajasthan',     phone:'9876001234', available:true,  farmer:'Vimla Sharma',  desc:'Fresh kadi patta, aromatic and crisp.' },
];

window.EMOJIS = {
  'Vegetables':      '🥦',
  'Fruits':          '🍎',
  'Grains & Pulses': '🌾',
  'Dairy & Eggs':    '🥛',
  'Herbs & Spices':  '🌿',
  'Organic Products':'🌱',
};

// ── PRODUCT PAGE: load product from URL id ──
function loadProductFromURL() {
  if (currentPage !== 'product.html') return;

  const params = new URLSearchParams(window.location.search);
  const id     = parseInt(params.get('id')) || 1;
  const found  = window.MOCK_LISTINGS.find(p => p.id === id);

  if (found) {
    // Inject into product.js's product variable
    window._productData = {
      id:        found.id,
      name:      found.name,
      category:  found.category,
      emoji:     window.EMOJIS[found.category] || '🌿',
      price:     found.price,
      unit:      found.unit,
      qty:       found.qty,
      location:  found.location,
      pincode:   found.pincode || '',
      phone:     found.phone,
      available: found.available,
      farmer:    found.farmer,
      desc:      found.desc,
    };
  }
}

// ── MARKETPLACE: card click goes to product page ──
function connectMarketplaceCards() {
  if (currentPage !== 'marketplace.html') return;

  // Wait for cards to render then add links
  const observer = new MutationObserver(() => {
    document.querySelectorAll('.product-card').forEach(card => {
      if (card.dataset.linked) return;
      card.dataset.linked = 'true';

      const onclickAttr = card.getAttribute('onclick');
      if (onclickAttr) {
        const idMatch = onclickAttr.match(/openModal\((\d+)\)/);
        if (idMatch) {
          const id = idMatch[1];
          card.setAttribute('onclick', `window.location.href='product.html?id=${id}'`);
        }
      }
    });
  });

  const grid = document.getElementById('listings-grid');
  if (grid) observer.observe(grid, { childList: true });
}

// ── INIT — runs on every page ──
document.addEventListener('DOMContentLoaded', () => {
  fadeInPage();
  setActiveNavLink();
  injectCartIcon();
  setupBackButtons();
  loadProductFromURL();
  connectMarketplaceCards();
  // checkAuth(); // Uncomment when login is ready
});

// Update cart badge whenever storage changes
window.addEventListener('storage', updateCartBadge);