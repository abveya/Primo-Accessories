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

function updateCities() {
  const country = document.getElementById("country");
  const citySelect = document.getElementById("city");
  if (!country || !citySelect) return;

  citySelect.innerHTML = '<option value="">Select your city</option>';

  if (country.value && cityOptions[country.value]) {
    cityOptions[country.value].forEach(city => {
      const option = document.createElement("option");
      option.value = city;
      option.textContent = city;
      citySelect.appendChild(option);
    });
  }

  if (typeof window.updateSummary === "function") {
    window.updateSummary();
  }
}

document.addEventListener("DOMContentLoaded", async function () {
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

  function updateSummary() {
    const cityEl = document.getElementById("city");
    const priceEl = document.getElementById("price");
    const shippingEl = document.getElementById("shipping-fee");
    const totalEl = document.getElementById("total-cost");
    const formEl = document.getElementById("checkout-form");

    if (!cityEl || !priceEl || !shippingEl || !totalEl || !formEl) return;

    let selectedCity = cityEl.value;
    let shippingFee = shippingFees[selectedCity] || 0;

    priceEl.textContent = `LE ${totalPrice}`;
    shippingEl.textContent = `LE ${shippingFee}`;
    totalEl.textContent = `LE ${totalPrice + shippingFee}`;

    document.getElementById("hidden-price").value = totalPrice;
    document.getElementById("hidden-shipping-fee").value = shippingFee;
    document.getElementById("hidden-total-cost").value = totalPrice + shippingFee;

    document.querySelectorAll('input[name="product_ids[]"]').forEach(el => el.remove());

    cart.forEach(item => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = "product_ids[]"; // Array
      input.value = item.id;
      formEl.appendChild(input);
    });
  }

  // expose updateSummary to global so updateCities can call it
  window.updateSummary = updateSummary;

  const cityEl = document.getElementById("city");
  if (cityEl) {
    cityEl.addEventListener("change", updateSummary);
  }

  updateSummary();

  const checkoutForm = document.getElementById("checkout-form");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", function () {
      localStorage.removeItem(STORAGE_KEY);

      document.getElementById("price").textContent = "LE 0";
      document.getElementById("shipping-fee").textContent = "LE 0";
      document.getElementById("total-cost").textContent = "LE 0";

      document.getElementById("hidden-price").value = 0;
      document.getElementById("hidden-shipping-fee").value = 0;
      document.getElementById("hidden-total-cost").value = 0;

      const idsInput = document.getElementById("hidden-product-ids");
      if (idsInput) idsInput.value = "";
    });
  }
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

// document.addEventListener("DOMContentLoaded", async function () {
//   const API_BASE = "http://localhost:3000/api"; // غيّريها حسب السيرفر

//   const checkoutForm = document.getElementById("checkout-form");
//   const citySelect = document.getElementById("city");

//   let cart = [];
//   let totalPrice = 0;

//   const shippingFees = {
//     "Cairo": 55, "Giza": 55, "New Cairo": 60, "El Shorouk": 60,
//     "Badr": 60, "Administrative Capital": 60, "Obour": 60,
//     "Sheikh Zayed": 60, "6th of October": 60, "Hadayek El Ahram": 60,
//     "Madinaty": 60, "Alexandria": 70,
//     "Ismailia": 75, "Suez": 75, "Port Said": 75,
//     "Fayoum": 85, "Beni Suef": 85, "Minya": 85,
//     "Assiut": 85, "Sohag": 85,
//     "Beheira": 70, "Kafr El Sheikh": 70, "Dakahlia": 70,
//     "Qalyubia": 70, "Damietta": 70, "Monufia": 70,
//     "Sharqia": 70, "Gharbia": 70,
//     "New Valley": 125, "Red Sea": 125, "North Coast": 125, "Marsa Matrouh": 125
//   };

//   // تحميل الكارت من API
//   async function loadCartFromAPI() {
//     try {
//       const res = await fetch(`${API_BASE}/cart`);
//       cart = await res.json(); // لازم يرجع [{id, name, price, quantity}]
//       totalPrice = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
//       updateSummary();
//     } catch (err) {
//       console.error("خطأ في جلب الكارت:", err);
//     }
//   }

//   // تحديث الملخص
//   function updateSummary() {
//     let selectedCity = citySelect.value;
//     let shippingFee = shippingFees[selectedCity] || 0;

//     document.getElementById("price").textContent = `LE ${totalPrice}`;
//     document.getElementById("shipping-fee").textContent = `LE ${shippingFee}`;
//     document.getElementById("total-cost").textContent = `LE ${totalPrice + shippingFee}`;

//     // امسح أي inputs قديمة
//     document.querySelectorAll('input[name="product_ids[]"]').forEach(el => el.remove());

//     // أضف hidden input لكل منتج
//     cart.forEach(item => {
//       const input = document.createElement("input");
//       input.type = "hidden";
//       input.name = "product_ids[]";
//       input.value = item.id;
//       checkoutForm.appendChild(input);
//     });

//     // خزن القيم الحسابية برضه
//     document.getElementById("hidden-price").value = totalPrice;
//     document.getElementById("hidden-shipping-fee").value = shippingFee;
//     document.getElementById("hidden-total-cost").value = totalPrice + shippingFee;
//   }

//   // تحميل الكارت
//   await loadCartFromAPI();

//   // تحديث عند تغيير المدينة
//   citySelect.addEventListener("change", updateSummary);

//   // إرسال الطلب
//   checkoutForm.addEventListener("submit", async function (e) {
//     e.preventDefault();

//     const formData = new FormData(checkoutForm);
//     const payload = {};
//     formData.forEach((value, key) => {
//       // علشان الـ product_ids[] يروح Array
//       if (key === "product_ids[]") {
//         if (!payload.product_ids) payload.product_ids = [];
//         payload.product_ids.push(value);
//       } else {
//         payload[key] = value;
//       }
//     });

//     // نضيف بيانات الكارت كاملة
//     payload.items = cart;

//     try {
//       const res = await fetch(`${API_BASE}/orders`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload)
//       });

//       if (!res.ok) throw new Error("فشل في إرسال الطلب");
//       alert("تم إرسال الطلب بنجاح ✅");

//       // تصفير القيم
//       document.getElementById("price").textContent = "LE 0";
//       document.getElementById("shipping-fee").textContent = "LE 0";
//       document.getElementById("total-cost").textContent = "LE 0";

//       document.getElementById("hidden-price").value = 0;
//       document.getElementById("hidden-shipping-fee").value = 0;
//       document.getElementById("hidden-total-cost").value = 0;

//     } catch (err) {
//       console.error(err);
//       alert("حصل خطأ أثناء إرسال الطلب ❌");
//     }
//   });
// });
