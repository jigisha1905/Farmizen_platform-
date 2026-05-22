// DASHBOARD JAVASCRIPT

// Sample Data
const listings = [
  {
    id: '#L001',
    title: 'Organic Tomatoes',
    seller: 'Rajesh Kumar',
    price: '₹500/kg',
    status: 'approved',
    date: '2 days ago'
  },
  {
    id: '#L002',
    title: 'Fresh Spinach',
    seller: 'Meera Joshi',
    price: '₹300/kg',
    status: 'pending',
    date: 'Today'
  },
  {
    id: '#L003',
    title: 'Farmland for Lease',
    seller: 'Vikram Singh',
    price: '₹1000/month',
    status: 'approved',
    date: '5 days ago'
  },
  {
    id: '#L004',
    title: 'Organic Herbs Bundle',
    seller: 'Anjali Verma',
    price: '₹150/bundle',
    status: 'rejected',
    date: '1 week ago'
  },
  {
    id: '#L005',
    title: 'Fresh Carrots',
    seller: 'Priya Singh',
    price: '₹400/kg',
    status: 'pending',
    date: 'Today'
  }
];

const users = [
  {
    id: '#U001',
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    phone: '+91 9876543210',
    role: 'farmer',
    status: 'active'
  },
  {
    id: '#U002',
    name: 'Meera Joshi',
    email: 'meera@example.com',
    phone: '+91 9876543211',
    role: 'consumer',
    status: 'active'
  },
  {
    id: '#U003',
    name: 'Vikram Singh',
    email: 'vikram@example.com',
    phone: '+91 9876543212',
    role: 'farmer',
    status: 'active'
  },
  {
    id: '#U004',
    name: 'Anjali Verma',
    email: 'anjali@example.com',
    phone: '+91 9876543213',
    role: 'consumer',
    status: 'inactive'
  },
  {
    id: '#U005',
    name: 'Priya Singh',
    email: 'priya@example.com',
    phone: '+91 9876543214',
    role: 'farmer',
    status: 'active'
  }
];

const transactions = [
  {
    id: '#T001',
    from: 'Meera Joshi',
    to: 'Rajesh Kumar',
    amount: '₹5,000',
    product: 'Organic Tomatoes (10kg)',
    date: '2 days ago',
    status: 'completed'
  },
  {
    id: '#T002',
    from: 'Vikram Singh',
    to: 'Priya Singh',
    amount: '₹8,000',
    product: 'Fresh Carrots (20kg)',
    date: '3 days ago',
    status: 'completed'
  },
  {
    id: '#T003',
    from: 'Anjali Verma',
    to: 'Rajesh Kumar',
    amount: '₹2,000',
    product: 'Organic Herbs',
    date: '1 week ago',
    status: 'pending'
  }
];

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', function() {
  populateRecentListings();
  populateRecentUsers();
  populateAllListings();
  populateAllUsers();
  populateTransactions();
});

// SWITCH TABS
function switchTab(tabName) {
  // Hide all tabs
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });

  // Remove active from all nav items
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });

  // Show selected tab
  const tabElement = document.getElementById(tabName + '-tab');
  if (tabElement) {
    tabElement.classList.add('active');
  }

  // Add active to clicked nav item
  event.target.closest('.nav-item').classList.add('active');

  // Update page title
  const titles = {
    'dashboard': 'Dashboard',
    'listings': 'All Listings',
    'users': 'All Users',
    'analytics': 'Analytics',
    'transactions': 'Transactions',
    'settings': 'Settings'
  };
  document.getElementById('pageTitle').textContent = titles[tabName];
}

// TOGGLE SIDEBAR (Mobile)
function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  sidebar.classList.toggle('active');
}

// POPULATE RECENT LISTINGS TABLE
function populateRecentListings() {
  const tbody = document.getElementById('listingsTableBody');
  tbody.innerHTML = '';

  listings.slice(0, 5).forEach(listing => {
    const statusClass = `status-${listing.status}`;
    const row = `
      <tr>
        <td><strong>${listing.id}</strong></td>
        <td>${listing.title}</td>
        <td>${listing.seller}</td>
        <td>${listing.price}</td>
        <td><span class="status-badge ${statusClass}">${listing.status.toUpperCase()}</span></td>
        <td>${listing.date}</td>
        <td>
          ${listing.status === 'pending' ? `
            <button class="action-btn btn-approve" onclick="approveListing('${listing.id}')">Approve</button>
            <button class="action-btn btn-reject" onclick="rejectListing('${listing.id}')">Reject</button>
          ` : ''}
          <button class="action-btn btn-view" onclick="viewListing('${listing.id}')">View</button>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

// POPULATE RECENT USERS TABLE
function populateRecentUsers() {
  const tbody = document.getElementById('usersTableBody');
  tbody.innerHTML = '';

  users.slice(0, 5).forEach(user => {
    const statusClass = user.status === 'active' ? 'status-approved' : 'status-rejected';
    const row = `
      <tr>
        <td><strong>${user.id}</strong></td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td><span style="text-transform: capitalize;">${user.role}</span></td>
        <td><span class="status-badge ${statusClass}">${user.status.toUpperCase()}</span></td>
        <td>2 weeks ago</td>
        <td>
          <button class="action-btn btn-view" onclick="viewUser('${user.id}')">View</button>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

// POPULATE ALL LISTINGS TABLE
function populateAllListings() {
  const tbody = document.getElementById('allListingsBody');
  tbody.innerHTML = '';

  listings.forEach(listing => {
    const statusClass = `status-${listing.status}`;
    const row = `
      <tr>
        <td><strong>${listing.id}</strong></td>
        <td>${listing.title}</td>
        <td>${listing.seller}</td>
        <td>Produce</td>
        <td>${listing.price}</td>
        <td><span class="status-badge ${statusClass}">${listing.status.toUpperCase()}</span></td>
        <td>
          ${listing.status === 'pending' ? `
            <button class="action-btn btn-approve" onclick="approveListing('${listing.id}')">Approve</button>
            <button class="action-btn btn-reject" onclick="rejectListing('${listing.id}')">Reject</button>
          ` : ''}
          <button class="action-btn btn-view" onclick="viewListing('${listing.id}')">View</button>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

// POPULATE ALL USERS TABLE
function populateAllUsers() {
  const tbody = document.getElementById('allUsersBody');
  tbody.innerHTML = '';

  users.forEach(user => {
    const statusClass = user.status === 'active' ? 'status-approved' : 'status-rejected';
    const roleEmoji = user.role === 'farmer' ? '👨‍🌾' : user.role === 'admin' ? '⚙️' : '👤';
    const row = `
      <tr>
        <td><strong>${user.id}</strong></td>
        <td>${roleEmoji} ${user.name}</td>
        <td>${user.email}</td>
        <td>${user.phone}</td>
        <td style="text-transform: capitalize;">${user.role}</td>
        <td><span class="status-badge ${statusClass}">${user.status.toUpperCase()}</span></td>
        <td>
          <button class="action-btn btn-view" onclick="viewUser('${user.id}')">View</button>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

// POPULATE TRANSACTIONS TABLE
function populateTransactions() {
  const tbody = document.getElementById('transactionsBody');
  tbody.innerHTML = '';

  transactions.forEach(trans => {
    const statusClass = trans.status === 'completed' ? 'status-approved' : 'status-pending';
    const row = `
      <tr>
        <td><strong>${trans.id}</strong></td>
        <td>${trans.from}</td>
        <td>${trans.to}</td>
        <td><strong>${trans.amount}</strong></td>
        <td>${trans.product}</td>
        <td>${trans.date}</td>
        <td><span class="status-badge ${statusClass}">${trans.status.toUpperCase()}</span></td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

// FILTER LISTINGS
function filterListings() {
  const filterValue = document.getElementById('listingStatusFilter').value;
  
  if (filterValue === '') {
    populateAllListings();
  } else {
    const filtered = listings.filter(l => l.status === filterValue);
    const tbody = document.getElementById('allListingsBody');
    tbody.innerHTML = '';
    
    filtered.forEach(listing => {
      const statusClass = `status-${listing.status}`;
      const row = `
        <tr>
          <td><strong>${listing.id}</strong></td>
          <td>${listing.title}</td>
          <td>${listing.seller}</td>
          <td>Produce</td>
          <td>${listing.price}</td>
          <td><span class="status-badge ${statusClass}">${listing.status.toUpperCase()}</span></td>
          <td>
            ${listing.status === 'pending' ? `
              <button class="action-btn btn-approve" onclick="approveListing('${listing.id}')">Approve</button>
              <button class="action-btn btn-reject" onclick="rejectListing('${listing.id}')">Reject</button>
            ` : ''}
            <button class="action-btn btn-view" onclick="viewListing('${listing.id}')">View</button>
          </td>
        </tr>
      `;
      tbody.innerHTML += row;
    });
  }
}

// FILTER USERS
function filterUsers() {
  const filterValue = document.getElementById('userRoleFilter').value;
  
  if (filterValue === '') {
    populateAllUsers();
  } else {
    const filtered = users.filter(u => u.role === filterValue);
    const tbody = document.getElementById('allUsersBody');
    tbody.innerHTML = '';
    
    filtered.forEach(user => {
      const statusClass = user.status === 'active' ? 'status-approved' : 'status-rejected';
      const roleEmoji = user.role === 'farmer' ? '👨‍🌾' : user.role === 'admin' ? '⚙️' : '👤';
      const row = `
        <tr>
          <td><strong>${user.id}</strong></td>
          <td>${roleEmoji} ${user.name}</td>
          <td>${user.email}</td>
          <td>${user.phone}</td>
          <td style="text-transform: capitalize;">${user.role}</td>
          <td><span class="status-badge ${statusClass}">${user.status.toUpperCase()}</span></td>
          <td>
            <button class="action-btn btn-view" onclick="viewUser('${user.id}')">View</button>
          </td>
        </tr>
      `;
      tbody.innerHTML += row;
    });
  }
}

// ACTION FUNCTIONS
function approveListing(listingId) {
  const listing = listings.find(l => l.id === listingId);
  if (listing) {
    listing.status = 'approved';
    populateAllListings();
    populateRecentListings();
    alert(`Listing ${listingId} approved successfully! ✅`);
  }
}

function rejectListing(listingId) {
  const listing = listings.find(l => l.id === listingId);
  if (listing) {
    listing.status = 'rejected';
    populateAllListings();
    populateRecentListings();
    alert(`Listing ${listingId} rejected! ❌`);
  }
}

function viewListing(listingId) {
  const listing = listings.find(l => l.id === listingId);
  if (listing) {
    alert(`Viewing: ${listing.title}\nSeller: ${listing.seller}\nPrice: ${listing.price}\nStatus: ${listing.status}`);
  }
}

function viewUser(userId) {
  const user = users.find(u => u.id === userId);
  if (user) {
    alert(`User: ${user.name}\nEmail: ${user.email}\nPhone: ${user.phone}\nRole: ${user.role}\nStatus: ${user.status}`);
  }
}

// SAVE SETTINGS
document.addEventListener('DOMContentLoaded', function() {
  const saveBtn = document.querySelector('.btn-save');
  if (saveBtn) {
    saveBtn.addEventListener('click', function() {
      alert('Settings saved successfully! ✅');
    });
  }
});

// EXPORT FOR TESTING
window.dashboard = {
  approveListing: approveListing,
  rejectListing: rejectListing,
  viewListing: viewListing,
  viewUser: viewUser,
  filterListings: filterListings,
  filterUsers: filterUsers,
  switchTab: switchTab
};