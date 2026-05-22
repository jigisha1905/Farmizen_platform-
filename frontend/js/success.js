/* =========================================
   FARMIZEN — success.js
   Import: <script src="js/success.js"></script>
   ========================================= */

// ── RECOMMENDED PRODUCTS ──
const recommended = [
  { name:'Fresh Spinach',   emoji:'🥬', price:30,  unit:'per kg',     href:'product.html?id=2'  },
  { name:'Moong Dal',       emoji:'🌾', price:90,  unit:'per kg',     href:'product.html?id=4'  },
  { name:'A2 Cow Milk',     emoji:'🥛', price:60,  unit:'per litre',  href:'product.html?id=5'  },
  { name:'Free Range Eggs', emoji:'🥚', price:8,   unit:'per piece',  href:'product.html?id=9'  },
];

// ── PAYMENT METHOD LABELS ──
const paymentLabels = {
  upi:  '📱 UPI Payment',
  card: '💳 Credit/Debit Card',
  cod:  '💵 Cash on Delivery',
};

// ── LOAD ORDER DATA ──
function loadOrderData() {
  const stored = localStorage.getItem('farmizen_order');
  const order  = stored ? JSON.parse(stored) : getMockOrder();

  populatePage(order);
  renderRecommended();
}

// ── MOCK ORDER (fallback) ──
function getMockOrder() {
  return {
    orderId:   'FZ' + Date.now(),
    items: [
      { name:'Organic Tomatoes', emoji:'🍅', price:40, unit:'per kg',     qty:2, farmer:'Ramesh Sharma' },
      { name:'Tulsi & Pudina',   emoji:'🌿', price:20, unit:'per bundle', qty:3, farmer:'Meena Kumari'  },
      { name:'Desi Mangoes',     emoji:'🥭', price:80, unit:'per kg',     qty:1, farmer:'Prakash Mali'  },
    ],
    delivery: {
      name:    'Arjun Verma',
      phone:   '9876543210',
      address: '12, Gandhi Nagar, Jaipur, Rajasthan - 302001',
      type:    'delivery',
    },
    payment:    { method: 'upi' },
    subtotal:   220,
    grandTotal: 220,
    placedAt:   new Date().toISOString(),
  };
}

// ── POPULATE PAGE ──
function populatePage(order) {
  // Order ID
  document.getElementById('order-id').textContent = order.orderId;

  // Placed time
  const placedTime = new Date(order.placedAt);
  document.getElementById('tl-placed-time').textContent =
    placedTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) +
    ', ' + placedTime.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  // Items list
  const itemsHtml = order.items.map(item => `
    <div class="fz-order-item">
      <span class="fz-oi-emoji">${item.emoji}</span>
      <div class="fz-oi-info">
        <div class="fz-oi-name">${item.name}</div>
        <div class="fz-oi-meta">by ${item.farmer} · ×${item.qty} ${item.unit.replace('per ','')}</div>
      </div>
      <span class="fz-oi-price">₹${(item.price * item.qty).toLocaleString('en-IN')}</span>
    </div>
  `).join('');

  document.getElementById('order-items-list').innerHTML = itemsHtml;

  // Totals
  document.getElementById('order-subtotal').textContent = order.subtotal.toLocaleString('en-IN');
  document.getElementById('order-total').textContent    = order.grandTotal.toLocaleString('en-IN');

  // Delivery info
  document.getElementById('deliver-to').textContent      = order.delivery.name;
  document.getElementById('deliver-phone').textContent   = order.delivery.phone;
  document.getElementById('deliver-address').textContent = order.delivery.address || '—';
  document.getElementById('deliver-payment').textContent = paymentLabels[order.payment?.method] || '—';
}

// ── COPY ORDER ID ──
function copyOrderId() {
  const id = document.getElementById('order-id').textContent;
  navigator.clipboard.writeText(id).then(() => {
    showToast('📋 Order ID copied!');
  }).catch(() => {
    // Fallback for older browsers
    const el = document.createElement('textarea');
    el.value = id;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    showToast('📋 Order ID copied!');
  });
}

// ── DOWNLOAD RECEIPT AS PDF ──
function downloadReceipt() {
  const stored = localStorage.getItem('farmizen_order');
  const order  = stored ? JSON.parse(stored) : getMockOrder();

  // Load jsPDF dynamically if not already loaded
  if (typeof window.jspdf === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.onload = () => generatePDF(order);
    document.head.appendChild(script);
  } else {
    generatePDF(order);
  }
}

function generatePDF(order) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  const pageW  = doc.internal.pageSize.getWidth();
  const margin = 20;
  const col2   = pageW - margin;
  let y = 20;

  // ── Helper functions ──
  const text  = (str, x, yy, opts) => doc.text(str, x, yy, opts);
  const line  = (yy) => { doc.setDrawColor(220, 210, 195); doc.line(margin, yy, col2, yy); };
  const nl    = (n = 6) => { y += n; };

  // ── HEADER: Brand ──
  doc.setFillColor(74, 124, 63);
  doc.roundedRect(margin, y, pageW - margin * 2, 22, 4, 4, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  text('🌿 FARMIZEN', margin + 8, y + 9);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  text('Fresh from farm to your table', margin + 8, y + 16);

  doc.setFontSize(10);
  text('ORDER RECEIPT', col2 - 2, y + 9, { align: 'right' });
  doc.setFontSize(8);
  text(order.orderId, col2 - 2, y + 16, { align: 'right' });

  y += 30;

  // ── ORDER META ──
  doc.setTextColor(44, 26, 14);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  text('Order ID:', margin, y);
  doc.setFont('helvetica', 'normal');
  text(order.orderId, margin + 26, y);

  text('Date:', margin + 90, y);
  doc.setFont('helvetica', 'normal');
  text(new Date(order.placedAt).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }), margin + 102, y);

  nl(8);
  line(y); nl(6);

  // ── ITEMS TABLE HEADER ──
  doc.setFillColor(240, 232, 213);
  doc.rect(margin, y - 4, pageW - margin * 2, 10, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(92, 61, 30);
  text('ITEM',     margin + 2, y + 2);
  text('FARMER',   margin + 80, y + 2);
  text('QTY',      margin + 120, y + 2);
  text('AMOUNT',   col2 - 2, y + 2, { align: 'right' });

  nl(10);
  doc.setTextColor(44, 26, 14);

  // ── ITEMS ROWS ──
  order.items.forEach((item, i) => {
    // Alternate row bg
    if (i % 2 === 0) {
      doc.setFillColor(250, 244, 232);
      doc.rect(margin, y - 4, pageW - margin * 2, 9, 'F');
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(44, 26, 14);

    // Truncate long names
    const name = item.name.length > 28 ? item.name.substring(0, 26) + '..' : item.name;
    text(name,                          margin + 2, y + 1);
    text(item.farmer || '—',            margin + 80, y + 1);
    text(`${item.qty} ${item.unit.replace('per ','')}`, margin + 120, y + 1);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(74, 124, 63);
    text(`Rs.${(item.price * item.qty).toLocaleString('en-IN')}`, col2 - 2, y + 1, { align: 'right' });

    nl(9);
  });

  nl(2);
  line(y); nl(6);

  // ── TOTALS ──
  const totalsX = pageW / 2 + 10;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(92, 61, 30);

  text('Subtotal',  totalsX, y);
  doc.setTextColor(44, 26, 14);
  text(`Rs.${order.subtotal.toLocaleString('en-IN')}`, col2 - 2, y, { align: 'right' });
  nl(7);

  doc.setTextColor(92, 61, 30);
  text('Delivery',  totalsX, y);
  doc.setTextColor(74, 124, 63);
  text('FREE',      col2 - 2, y, { align: 'right' });
  nl(7);

  // Grand total box
  doc.setFillColor(74, 124, 63);
  doc.roundedRect(totalsX - 4, y - 5, col2 - totalsX + 6, 12, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  text('TOTAL PAID', totalsX, y + 2);
  text(`Rs.${order.grandTotal.toLocaleString('en-IN')}`, col2 - 2, y + 2, { align: 'right' });

  nl(18);
  line(y); nl(8);

  // ── DELIVERY INFO ──
  doc.setTextColor(92, 61, 30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  text('DELIVERY DETAILS', margin, y);
  nl(7);

  const fields = [
    ['Name',    order.delivery.name],
    ['Phone',   order.delivery.phone],
    ['Address', order.delivery.address || '—'],
    ['Payment', paymentLabels[order.payment?.method] || '—'],
    ['Type',    order.delivery.type === 'delivery' ? 'Home Delivery' : 'Self Pickup'],
  ];

  fields.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(92, 61, 30);
    doc.setFontSize(8);
    text(`${label}:`, margin, y);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(44, 26, 14);
    // Wrap long address
    const lines = doc.splitTextToSize(value, pageW - margin - 48);
    doc.text(lines, margin + 26, y);
    y += lines.length > 1 ? lines.length * 5 + 2 : 6;
  });

  nl(4);
  line(y); nl(8);

  // ── FOOTER ──
  doc.setFillColor(250, 244, 232);
  doc.rect(margin, y, pageW - margin * 2, 16, 'F');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(92, 61, 30);
  text('Thank you for supporting local farmers!', pageW / 2, y + 6, { align: 'center' });
  text('farmizen.com  |  support@farmizen.com', pageW / 2, y + 12, { align: 'center' });

  // ── SAVE PDF ──
  doc.save(`Farmizen_Receipt_${order.orderId}.pdf`);
  showToast('📄 PDF Receipt downloaded!');
}

// ── RENDER RECOMMENDED PRODUCTS ── 
function renderRecommended() {
  const grid = document.getElementById('rec-grid');
  if (!grid) return;

  grid.innerHTML = recommended.map((r, i) => `
    <div class="col-6 col-md-3">
      <a class="fz-rec-card" href="${r.href}" style="animation-delay:${i * 0.08}s">
        <div class="fz-rec-img">${r.emoji}</div>
        <div class="p-2">
          <div class="fz-rec-name">${r.name}</div>
          <div class="fz-rec-price">₹${r.price} <span>${r.unit}</span></div>
        </div>
      </a>
    </div>
  `).join('');
}

// ── TOAST ──
function showToast(msg) {
  // Create toast if not exists
  let t = document.getElementById('fz-toast');
  if (!t) {
    t = document.createElement('div');
    t.id        = 'fz-toast';
    t.className = 'fz-toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ── TOAST STYLES (inline fallback) ──
const toastStyle = document.createElement('style');
toastStyle.textContent = `
  .fz-toast {
    position: fixed; bottom: 28px; right: 28px;
    background: #2C1A0E; color: white;
    padding: 12px 20px; border-radius: 10px;
    font-size: 14px; z-index: 9999;
    opacity: 0; transform: translateY(10px);
    transition: all 0.3s; pointer-events: none;
    font-family: 'DM Sans', sans-serif;
  }
  .fz-toast.show { opacity: 1; transform: translateY(0); }
`;
document.head.appendChild(toastStyle);

// ── INIT ──
document.addEventListener('DOMContentLoaded', loadOrderData);