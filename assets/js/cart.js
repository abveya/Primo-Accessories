// // assets/js/cart.js
(function () {
  // === CONFIGURATION ===
  const BUTTON_SELECTOR = ".add-to-cart, .key-cover-price button, .buy-info button";
  // Selector for all "Add to Cart" buttons in the page
  const API_URL = "https://api.example.com/cart";
  // Backend API endpoint (replace when backend is ready)
  const STORAGE_KEY = "cart_fallback";
  // LocalStorage key for fallback cart

  let apiAvailable = false; // Flag: true if API works, false if using local fallback
  let cart = []; // Current cart (synced with API or localStorage)

  // --- Safe JSON parser (avoid crashes if JSON is invalid) ---
  function safeParse(json) {
    try { return JSON.parse(json); } catch (e) { return null; }
  }

  // === LOCAL STORAGE HELPERS (fallback when API is down) ===
  function loadCartFromStorage() {
    return safeParse(localStorage.getItem(STORAGE_KEY)) || [];
  }
  function saveCartToStorage(c) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
  }

  // === API HELPERS ===
  // Load entire cart from backend
  async function fetchCartFromApi() {
    const res = await fetch(API_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("API returned " + res.status);
    const data = await res.json();
    // Accept both array or { items: [...] } format
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.items)) return data.items;
    return [];
  }

  // Add item to cart via backend API
  async function addToCartApi(product) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product)
    });
    if (!res.ok) throw new Error("Add API returned " + res.status);
    return await res.json();
  }

  // Remove item from cart via backend API
  async function removeFromCartApi(productId) {
    const res = await fetch(`${API_URL}/${encodeURIComponent(productId)}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Remove API returned " + res.status);
    return await res.json();
  }

  // === LOCAL ADD/REMOVE LOGIC ===
function addToCartLocal(product) {
  // المفتاح الفريد = id + color
  const uniqueId = `${product.id}_${product.color}`;
  const idx = cart.findIndex(i => `${i.id}_${i.color}` === uniqueId);

  if (idx > -1) {
    // إذا العنصر موجود، زيادة الكمية
    cart[idx].quantity = (cart[idx].quantity || 0) + (product.quantity || 1);
  } else {
    // إضافة عنصر جديد
    cart.push(Object.assign({}, product, { quantity: product.quantity || 1 }));
  }

  saveCartToStorage(cart);
  return cart;
}

  // === READ PRODUCT DATA FROM BUTTON (flexible: supports different data-attr names) ===
  function readProductDataFromButton(target) {
    if (!target) return null;
    const btn = target.closest ? target.closest(BUTTON_SELECTOR) : null;
    if (!btn) return null;

    const id = btn.dataset.productId || btn.dataset.id || btn.getAttribute("data-id") || btn.getAttribute("data-product-id");
    if (!id) return null;

    const name = btn.dataset.productName || btn.getAttribute("data-product-name") || btn.getAttribute("data-name") || btn.title || "";
    const price = parseFloat(btn.dataset.productPrice || btn.getAttribute("data-product-price") || btn.getAttribute("data-price")) || 0;
    const image = btn.dataset.productImage || btn.getAttribute("data-product-image") || "";

    // 👇 هنا الإضافة الجديدة
    const color = btn.dataset.productColor || btn.getAttribute("data-product-color") || "-";

    let quantity = 1;
    const qInput = document.getElementById("quantityInput");
    if (qInput) {
      const q = parseInt(qInput.value);
      if (!Number.isNaN(q) && q > 0) quantity = q;
    } else {
      const qAttr = btn.dataset.productQuantity || btn.getAttribute("data-product-quantity") || btn.getAttribute("data-quantity");
      const q2 = parseInt(qAttr);
      if (!Number.isNaN(q2) && q2 > 0) quantity = q2;
    }

    return { id: String(id), name, price, image, color, quantity }; // 👈 color اتضاف هنا
  }



function renderButtonsState() {
  document.querySelectorAll(BUTTON_SELECTOR).forEach(btn => {
    btn.classList.remove("in-cart"); // إزالة أي تأثير سابق
    btn.textContent = "Add to cart"; // النص ثابت
  });
}


  // === UPDATE CART COUNT BADGE ===
  function updateCartCountDisplay() {
    const cartCountElement = document.getElementById("cart-count");
    if (!cartCountElement) return;
    const total = cart.reduce((s, i) => s + (i.quantity || 0), 0);
    cartCountElement.textContent = total;
  }

  // === MAIN HANDLER (toggle add/remove) ===
async function handleToggle(event) {
  const btn = event.target.closest ? event.target.closest(BUTTON_SELECTOR) : null;
  if (!btn) return;
  event.preventDefault();

  const product = readProductDataFromButton(btn);
  if (!product) return;

  if (apiAvailable) {
    try {
      await addToCartApi(product); // اضف المنتج دائمًا
      cart = await fetchCartFromApi(); // تحديث الكارت
    } catch (err) {
      console.warn("API operation failed — using local fallback:", err);
      apiAvailable = false;
      cart = addToCartLocal(product); // إضافة محلية
    }
  } else {
    cart = addToCartLocal(product); // إضافة محلية
  }

  renderButtonsState(); // تحديث الزر
  updateCartCountDisplay(); // تحديث عداد الكارت
  console.log("Cart updated:", cart, "apiAvailable:", apiAvailable);
}


  // === INIT SCRIPT ===
  async function init() {
    try {
      // Try to load from API first
      cart = await fetchCartFromApi();
      apiAvailable = true;
      console.log("Using API cart. Items:", cart.length);
    } catch (err) {
      // If API is not ready → fallback to localStorage
      apiAvailable = false;
      cart = loadCartFromStorage();
      console.warn("API not available — using localStorage fallback. Cart items:", cart.length, err);
    }

    renderButtonsState();
    updateCartCountDisplay();

    // Event delegation (only 1 listener for all buttons)
    document.removeEventListener("click", handleToggle);
    document.addEventListener("click", handleToggle);

    console.log("Cart JS initialized. apiAvailable:", apiAvailable);
  }

  // Run init when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

document.querySelectorAll(".product").forEach(product => {
  const imagesDiv = product.querySelector(".images");
  const images = JSON.parse(imagesDiv.getAttribute("data-images"));
  const imgTag = imagesDiv.querySelector("img");
  const addToCartBtn = product.querySelector(".add-to-cart");

  let currentIndex = 0;

  // وظيفة لتحديث الزرار على حسب الصورة الحالية
  function updateButton() {
    const color = images[currentIndex].color || addToCartBtn.dataset.productColor || "-";
    addToCartBtn.setAttribute("data-product-color", color);
    addToCartBtn.setAttribute("data-product-image", images[currentIndex].src);
    imgTag.src = images[currentIndex].src;
  }

  // أول مرة
  updateButton();

  // التحقق من وجود أزرار next/prev قبل الربط
  const nextBtn = product.querySelector(".nextImage");
  const prevBtn = product.querySelector(".prevImage");

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % images.length;
      updateButton();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      updateButton();
    });
  }
});
