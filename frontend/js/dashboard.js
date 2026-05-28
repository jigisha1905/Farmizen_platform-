const monthData = {
  January: {
    current: 90,
    last: 55
  },
  February: {
    current: 135,
    last: 95
  },
  March: {
    current: 190,
    last: 130
  },
  April: {
    current: 160,
    last: 120
  },
  May: {
    current: 210,
    last: 140
  },
  June: {
    current: 125,
    last: 80
  },
  July: {
    current: 240,
    last: 170
  },
  August: {
    current: 220,
    last: 160
  },
  September: {
    current: 180,
    last: 120
  },
  October: {
    current: 145,
    last: 100
  },
  November: {
    current: 165,
    last: 110
  },
  December: {
    current: 250,
    last: 190
  }
};

const monthSelect = document.getElementById("monthSelect");
const currentSalesBar = document.getElementById("currentSales");
const lastSalesBar = document.getElementById("lastSales");

currentSalesBar.style.height = monthData.January.current + "px";
lastSalesBar.style.height = monthData.January.last + "px";

currentSalesBar.style.transition = "0.5s ease";
lastSalesBar.style.transition = "0.5s ease";

monthSelect.addEventListener("change", function () {
  const selectedMonth = this.value;
  const data = monthData[selectedMonth];

  currentSalesBar.style.height = data.current + "px";
  lastSalesBar.style.height = data.last + "px";
});

// DASHBOARD STATS FROM BACKEND

async function loadDashboardStats() {

  try {

    const response = await fetch(
      "http://localhost:5000/api/dashboard/stats"
    );

    const data = await response.json();

    // Total Products
    document.getElementById("totalProducts").innerText =
      data.totalProducts;

    // Total Orders
    document.getElementById("totalOrders").innerText =
      data.totalOrders;

    // Total Users
    document.getElementById("totalUsers").innerText =
      data.totalUsers;

  } catch (error) {

    console.log("Dashboard Error:", error);

  }

}

loadDashboardStats();