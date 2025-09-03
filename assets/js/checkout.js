const cityOptions = {
  Egypt: [
    "Cairo", "Giza", "New Cairo", "6th of October",
    "Alexandria",
    "Ismailia", "Suez", "Port Said",
    "Fayoum", "Beni Suef", "Minya", "Assiut", "Sohag",
    "Beheira", "Kafr El Sheikh", "Dakahlia", "Qalyubia", "Damietta", "Monufia", "Sharqia", "Gharbia",
    "New Valley", "Red Sea", "North Coast", "Marsa Matrouh"
  ]
};

const shippingFees = {
  "Cairo": 55,
  "Giza": 55,
  "New Cairo": 60,
  "El Shorouk": 60,
  "Badr": 60,
  "Administrative Capital": 60,
  "Obour": 60,
  "Sheikh Zayed": 60,
  "6th of October": 60,
  "Hadayek El Ahram": 60,
  "Madinaty": 60,

  "Alexandria": 70,

  "Ismailia": 75,
  "Suez": 75,
  "Port Said": 75,

  "Fayoum": 85,
  "Beni Suef": 85,
  "Minya": 85,
  "Assiut": 85,
  "Sohag": 85,

  "Beheira": 70,
  "Kafr El Sheikh": 70,
  "Dakahlia": 70,
  "Qalyubia": 70,
  "Damietta": 70,
  "Monufia": 70,
  "Sharqia": 70,
  "Gharbia": 70,

  "New Valley": 125,
  "Red Sea": 125,
  "North Coast": 125,
  "Marsa Matrouh": 125
};

// async function loadShippingFees() {
//   let res = await fetch("/api/shipping-fees");
//   let fees = await res.json();
//   return fees;
// }

function updateCities() {
  const country = document.getElementById("country").value;
  const citySelect = document.getElementById("city");

  citySelect.innerHTML = '<option value="">Select your city</option>';

  if (country && cityOptions[country]) {
    cityOptions[country].forEach(city => {
      const option = document.createElement("option");
      option.value = city;
      option.textContent = city;
      citySelect.appendChild(option);
    });
  }

  updateSummary();
}

document.addEventListener("DOMContentLoaded", async function () {  // 👈 خليتها async
  const STORAGE_KEY = "cart_fallback";

  function safeParse(json) {
    try { return JSON.parse(json); } catch (e) { return null; }
  }
  function loadCartFromStorage() {
    return safeParse(localStorage.getItem(STORAGE_KEY)) || [];
  }

  let cart = loadCartFromStorage();

  let totalPrice = 0;
  cart.forEach(item => {
    totalPrice += (item.price * (item.quantity || 1));
  });

  // let shippingFees = {};
  // try {
  //   let res = await fetch("http://localhost:5000/api/shipping-fees");
  //   shippingFees = await res.json();
  // } catch (e) {
  //   console.error("Backend not available, fallback to empty fees.", e);
  //   shippingFees = {}; // fallback
  // }

  function updateSummary() {
    let selectedCity = document.getElementById("city").value;
    let shippingFee = shippingFees[selectedCity] || 0;

  document.getElementById("price").textContent = `LE ${totalPrice}`;
  document.getElementById("shipping-fee").textContent = `LE ${shippingFee}`;
  document.getElementById("total-cost").textContent = `LE ${totalPrice + shippingFee}`;

  document.getElementById("hidden-price").value = totalPrice;
  document.getElementById("hidden-shipping-fee").value = shippingFee;
  document.getElementById("hidden-total-cost").value = totalPrice + shippingFee;
  }

  document.getElementById("city").addEventListener("change", updateSummary);

  updateSummary();


  const checkoutForm = document.getElementById("checkout-form");
  checkoutForm.addEventListener("submit", function () {

    localStorage.removeItem(STORAGE_KEY);

    document.getElementById("price").textContent = "LE 0";
    document.getElementById("shipping-fee").textContent = "LE 0";
    document.getElementById("total-cost").textContent = "LE 0";

    document.getElementById("hidden-price").value = 0;
    document.getElementById("hidden-shipping-fee").value = 0;
    document.getElementById("hidden-total-cost").value = 0;
  });
});



// Exit Menu
const exitMenu = document.querySelector('.exit-menu');
const navbarCollapse = document.getElementById('mainNavbar');

if (exitMenu) {
  exitMenu.addEventListener('click', () => {
    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
    if (bsCollapse) {
      bsCollapse.hide();
    }
  });
}
