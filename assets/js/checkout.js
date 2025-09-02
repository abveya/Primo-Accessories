const cityOptions = {
  Egypt: ["Cairo", "Alexandria", "Giza"],
  USA: ["New York", "Los Angeles", "Chicago"],
  UK: ["London", "Manchester", "Birmingham"]
};

const regionOptions = {
  Cairo: ["Nasr City", "Maadi", "Heliopolis"],
  Alexandria: ["Raml Station", "Smouha", "Stanley"],
  Giza: ["Dokki", "Haram", "6th of October"],
  "New York": ["Manhattan", "Brooklyn", "Queens"],
  "Los Angeles": ["Hollywood", "Venice", "Downtown"],
  "Chicago": ["Lincoln Park", "Hyde Park", "River North"],
  London: ["Chelsea", "Greenwich", "Camden"],
  Manchester: ["Didsbury", "Salford", "Ancoats"],
  Birmingham: ["Selly Oak", "Edgbaston", "Jewellery Quarter"]
};

function updateCities() {
  const country = document.getElementById("country").value;
  const citySelect = document.getElementById("city");
  //   const regionSelect = document.getElementById("region");

  citySelect.innerHTML = '<option value="">Select your city</option>';
  //   regionSelect.innerHTML = '<option value="">Select your region</option>';

  if (country && cityOptions[country]) {
    cityOptions[country].forEach(city => {
      const option = document.createElement("option");
      option.value = city;
      option.textContent = city;
      citySelect.appendChild(option);
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const STORAGE_KEY = "cart_fallback";

  function safeParse(json) {
    try { return JSON.parse(json); } catch (e) { return null; }
  }
  function loadCartFromStorage() {
    return safeParse(localStorage.getItem(STORAGE_KEY)) || [];
  }

  let cart = loadCartFromStorage();

  // لو الكارت فاضي
  if (!cart || cart.length === 0) {
    document.getElementById("price").textContent = "LE 0";
    document.getElementById("shipping-fee").textContent = "LE 0";
    document.getElementById("total-cost").textContent = "LE 0";
    return;
  }

  // حساب السعر الكلي
  let totalPrice = 0;
  cart.forEach(item => {
    totalPrice += (item.price * (item.quantity || 1));
  });

  // مصاريف الشحن (ممكن تغيرها حسب الدولة أو عدد المنتجات)
  let shippingFee = 50;

  // تحديث الـ summary
  document.getElementById("price").textContent = `LE ${totalPrice}`;
  document.getElementById("shipping-fee").textContent = `LE ${shippingFee}`;
  document.getElementById("total-cost").textContent = `LE ${totalPrice + shippingFee}`;
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