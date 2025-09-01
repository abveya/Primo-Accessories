(function () {
  const BUTTON_SELECTOR = ".add-to-cart, .buy-info button";
  const STORAGE_KEY = "cart_fallback";

  let cart = [];

  function safeParse(json) { try { return JSON.parse(json); } catch (e) { return []; } }
  function loadCartFromStorage() { return safeParse(localStorage.getItem(STORAGE_KEY)); }
  function saveCartToStorage(c) { localStorage.setItem(STORAGE_KEY, JSON.stringify(c)); }

  function readProductDataFromButton(target) {
    const btn = target.closest ? target.closest(BUTTON_SELECTOR) : null;
    if (!btn) return null;

    const id = btn.dataset.productId || btn.dataset.id;
    if (!id) return null;

    const name = btn.dataset.productName || btn.getAttribute("data-product-name") || btn.title || "";
    const price = parseFloat(btn.dataset.productPrice || btn.getAttribute("data-product-price")) || 0;
    const image = btn.dataset.productImage || "";
    const color = btn.dataset.productColor || "";
    let quantity = 1;
    const qInput = document.getElementById("quantityInput");
    if (qInput) quantity = parseInt(qInput.value) || 1;

    return { id: String(id), name, price, image, color, quantity };
  }

  function addToCartLocal(product) {
    const idx = cart.findIndex(i => i.id === product.id);
    if (idx > -1) cart[idx].quantity += product.quantity;
    else cart.push({ ...product });
    saveCartToStorage(cart);
  }

  function removeFromCartLocal(productId) {
    cart = cart.filter(i => i.id !== productId);
    saveCartToStorage(cart);
  }

  function updateCartCountDisplay() {
    const cartCountElement = document.getElementById("cart-count");
    if (!cartCountElement) return;
    const total = cart.reduce((s, i) => s + i.quantity, 0);
    cartCountElement.textContent = total;
  }

  function renderCartItems() {
    const cartContent = document.querySelector(".cart-content");
    if (!cartContent) return;

    cartContent.querySelectorAll(".cart-item").forEach(el => el.remove());

    cart.forEach(product => {
      const item = document.createElement("div");
      item.className = "cart-item row align-items-center mb-3";
      item.dataset.id = product.id;

      item.innerHTML = `
        <div class="col-4 d-flex align-items-center img-container">
          <img src="${product.image}" alt="${product.name}" class="cart-item-image me-2">
          <span class="cart-item-name ms-2">${product.name}</span>
        </div>
        <div class="col-2 cart-item-color">${product.color || '-'}</div>
        <div class="col-2 cart-item-price">LE ${product.price.toFixed(2)}</div>
        <div class="col-2 d-flex align-items-center quantity">
          <button class="minus-btn border-0 bg-transparent">-</button>
          <input type="text" class="cart-item-qty text-center border-0 bg-transparent" value="${product.quantity}" min="1" readonly>
          <button class="plus-btn border-0 bg-transparent">+</button>
        </div>
        <div class="col-2 d-flex align-items-end total-remove">
          <span class="cart-item-total">LE ${(product.price * product.quantity).toFixed(2)}</span>
          <button class="btn btn-sm border-0 mt-1 remove-item text-dark p-0 ms-4"><i class="fa-solid fa-xmark"></i></button>
        </div>
      `;

      cartContent.appendChild(item);

      // استدعاء عناصر + و - و input و total
      const qtyInput = item.querySelector(".cart-item-qty");
      const minusBtn = item.querySelector(".minus-btn");
      const plusBtn = item.querySelector(".plus-btn");
      const totalSpan = item.querySelector(".cart-item-total");

      // --- تعديل الكمية بالنقص ---
      minusBtn.addEventListener("click", () => {
        if (product.quantity > 1) {
          product.quantity--;
          qtyInput.value = product.quantity;
          totalSpan.textContent = `LE ${(product.price * product.quantity).toFixed(2)}`;
          saveCartToStorage(cart);
          updateCartCountDisplay();
        }
      });

      // --- تعديل الكمية بالزيادة ---
      plusBtn.addEventListener("click", () => {
        product.quantity++;
        qtyInput.value = product.quantity;
        totalSpan.textContent = `LE ${(product.price * product.quantity).toFixed(2)}`;
        saveCartToStorage(cart);
        updateCartCountDisplay();
      });

      // --- زر Remove ---
      const removeBtn = item.querySelector(".remove-item");
      removeBtn.addEventListener("click", () => {
        removeFromCartLocal(product.id);
        renderCartItems();
      });
    });

    updateCartCountDisplay();
  }

  function handleToggle(event) {
    const btn = event.target.closest ? event.target.closest(BUTTON_SELECTOR) : null;
    if (!btn) return;
    event.preventDefault();

    const product = readProductDataFromButton(btn);
    if (!product) return;

    const exists = cart.some(i => i.id === product.id);
    if (exists) removeFromCartLocal(product.id);
    else addToCartLocal(product);

    renderCartItems();
  }

  function init() {
    cart = loadCartFromStorage();
    renderCartItems();
    document.addEventListener("click", handleToggle);
    console.log("Cart initialized. Items:", cart.length);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
