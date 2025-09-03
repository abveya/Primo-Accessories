// assets/js/cart.js
(function () {
  // === CONFIGURATION ===
  const BUTTON_SELECTOR = ".add-to-cart, .key-cover-price button, .buy-info button";
  const API_URL = "https://api.example.com/cart";
  const STORAGE_KEY = "cart_fallback";

  let apiAvailable = false;
  let cart = [];

  // --- Safe JSON parser ---
  function safeParse(json) {
    try { return JSON.parse(json); } catch (e) { return []; }
  }

  // === LOCAL STORAGE HELPERS ===
  function loadCartFromStorage() {
    return safeParse(localStorage.getItem(STORAGE_KEY)) || [];
  }
  function saveCartToStorage(c) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
  }

  // === API HELPERS ===
  async function fetchCartFromApi() {
    const res = await fetch(API_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("API returned " + res.status);
    const data = await res.json();
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.items)) return data.items;
    return [];
  }

  async function addToCartApi(product) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product)
    });
    if (!res.ok) throw new Error("Add API returned " + res.status);
    return await res.json();
  }

  async function removeFromCartApi(productId) {
    const res = await fetch(`${API_URL}/${encodeURIComponent(productId)}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Remove API returned " + res.status);
    return await res.json();
  }

  // === LOCAL ADD/REMOVE LOGIC ===
  function addToCartLocal(product) {
    const uniqueId = `${product.id}_${product.color}`;
    const idx = cart.findIndex(i => `${i.id}_${i.color}` === uniqueId);
    if (idx > -1) {
      cart[idx].quantity = (cart[idx].quantity || 0) + (product.quantity || 1);
    } else {
      cart.push(Object.assign({}, product, { quantity: product.quantity || 1 }));
    }
    saveCartToStorage(cart);
    return cart;
  }

  function removeFromCartLocal(product) {
    const uniqueId = `${product.id}_${product.color}`;
    cart = cart.filter(i => `${i.id}_${i.color}` !== uniqueId);
    saveCartToStorage(cart);
    return cart;
  }

  // === READ PRODUCT DATA ===
  function readProductDataFromButton(target) {
    if (!target) return null;
    const btn = target.closest ? target.closest(BUTTON_SELECTOR) : null;
    if (!btn) return null;

    const id = btn.dataset.productId || btn.dataset.id || btn.getAttribute("data-id") || btn.getAttribute("data-product-id");
    if (!id) return null;

    const name = btn.dataset.productName || btn.getAttribute("data-product-name") || btn.getAttribute("data-name") || btn.title || "";
    const price = parseFloat(btn.dataset.productPrice || btn.getAttribute("data-product-price") || btn.getAttribute("data-price")) || 0;
    const image = btn.dataset.productImage || btn.getAttribute("data-product-image") || "";
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

    return { id: String(id), name, price, image, color, quantity };
  }

  // === RENDER BUTTONS STATE ===
  function renderButtonsState() {
    document.querySelectorAll(BUTTON_SELECTOR).forEach(btn => {
      btn.classList.remove("in-cart");
      btn.textContent = "Add to cart";
    });
  }

  // === UPDATE CART COUNT ===
  function updateCartCountDisplay() {
    const cartCountElement = document.getElementById("cart-count");
    if (!cartCountElement) return;
    const total = cart.reduce((s, i) => s + (i.quantity || 0), 0);
    cartCountElement.textContent = total;
  }

  // === HANDLE ADD/REMOVE TO CART ===
  async function handleToggle(event) {
    const btn = event.target.closest ? event.target.closest(BUTTON_SELECTOR) : null;
    if (!btn) return;
    event.preventDefault();

    const product = readProductDataFromButton(btn);
    if (!product) return;

    const uniqueId = `${product.id}_${product.color}`;
    const exists = cart.some(i => `${i.id}_${i.color}` === uniqueId);

    if (exists) {
      removeFromCartLocal(product);
    } else {
      if (apiAvailable) {
        try {
          await addToCartApi(product);
          cart = await fetchCartFromApi();
        } catch (err) {
          console.warn("API failed, using local:", err);
          apiAvailable = false;
          addToCartLocal(product);
        }
      } else {
        addToCartLocal(product);
      }
    }

    renderButtonsState();
    updateCartCountDisplay();
    console.log("Cart updated:", cart, "apiAvailable:", apiAvailable);
  }

  // === INIT SCRIPT ===
  async function init() {
    try {
      cart = await fetchCartFromApi();
      apiAvailable = true;
      console.log("Using API cart. Items:", cart.length);
    } catch (err) {
      apiAvailable = false;
      cart = loadCartFromStorage();
      console.warn("API not available — using localStorage fallback:", cart.length, err);
    }

    renderButtonsState();
    updateCartCountDisplay();

    document.removeEventListener("click", handleToggle);
    document.addEventListener("click", handleToggle);

    console.log("Cart JS initialized. apiAvailable:", apiAvailable);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

// === PRODUCT IMAGE SWITCH & COLOR DATA ===
document.querySelectorAll(".product").forEach(product => {
  const imagesDiv = product.querySelector(".images");
  const images = JSON.parse(imagesDiv.getAttribute("data-images"));
  const imgTag = imagesDiv.querySelector("img");
  const addToCartBtn = product.querySelector(".add-to-cart");

  let currentIndex = 0;

  function updateButton() {
    const color = images[currentIndex].color || addToCartBtn.dataset.productColor || "-";
    addToCartBtn.setAttribute("data-product-color", color);
    addToCartBtn.setAttribute("data-product-image", images[currentIndex].src);
    imgTag.src = images[currentIndex].src;
  }

  updateButton();

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
