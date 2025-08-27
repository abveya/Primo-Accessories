window.onload = () => {
    // ----------------------------
    // 1) Get product ID from URL
    // ----------------------------
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    // ----------------------------
    // 2) Find product from dataset
    // ----------------------------
    const product = products.find(p => p.id === productId);
    const container = document.getElementById("product-container");

    if (!product) {
        container.innerHTML = "<p>❌ Product not found</p>";
        return;
    }

    // ----------------------------
    // 3) Handle discount & badge
    // ----------------------------
    const price = Number(product.price);
    const finalPrice = product.discount ? price - (price * product.discount / 100) : price;

    const badgeHTML = product.discount > 0 
        ? `<span class="badge-sale">${product.discount}% OFF</span>` 
        : "";

    const priceHTML = product.discount > 0
        ? `
            <p class="d-flex flex-column price">
                <span class="new-price">LE ${finalPrice.toFixed(2)}</span>
                <span class="old-price">LE ${product.price}.00</span>
            </p>
        `
        : `<p class="price">LE ${product.price}.00</p>`;

    // ----------------------------
    // 4) Build product HTML structure
    // ----------------------------
    container.innerHTML = `
        <div class="wrapper">
            <!-- Product Images -->
            <div class="image">
                <div class="main-image">
                    <img id="ProductImage" src="${product.images[0].src}" alt="${product.name}" class="active">
                    <img id="ProductImageClone" src="" alt="${product.name}" class="inactive">

                    ${badgeHTML}

                    <span id="prevImage" class="arrow left">
                        <i class="fa-solid fa-caret-left"></i>
                    </span>
                    <span id="nextImage" class="arrow right">
                        <i class="fa-solid fa-caret-right"></i>
                    </span>
                </div>

                <div class="sub-image">
                    ${product.images.map((img, idx) => `
                        <img src="${img.src}" data-src="${img.src}" data-color="${img.color}" 
                             alt="${product.name}" class="${idx === 0 ? "active" : ""}">
                    `).join("")}
                </div>
            </div>

            <!-- Popup Modal for Images -->
            <div id="image-popup" class="popup">
                <span class="close" onclick="closeImage()">&times;</span>
                <img class="popup-content" id="popup-img">
            </div>

            <!-- Product Info -->
            <div class="Product-info">
                <span style="color:#bcbcbc;font-size:13px;">${product.title}</span>
                <h1>${product.name}</h1>
                <p>${product.description}</p>

                <!-- Price with discount handling -->
                ${priceHTML}

                <!-- Color Options -->
                <div id="colorOptions">
                    ${product.images.some(img => img.color)  
                        ? product.images.map(c => `
                            <label>
                                <input type="radio" name="color" data-image="${c.src}" data-color="${c.color}">
                                <span class="color-option" style="background:${c.color};"></span>
                            </label>
                          `).join("")
                        : ""}
                </div>

                <!-- Material -->
                <p class="material">Material: <span>${product.material}</span></p>

                <!-- Quantity -->
                <div class="div-quantity">
                    <div class="quantity-text">
                        <h4>Quantity</h4>
                    </div>
                    <div class="quantity">
                        <button class="btn btn-outline-secondary decrement">−</button>
                        <input type="number" id="quantityInput" value="1" min="1" readonly class="form-control text-center mx-2">
                        <button class="btn btn-outline-secondary increment">+</button>
                    </div>
                </div>

                <!-- Buy & Cart -->
                <div class="buy-info">
                    <div class="total">
                        <h2>Total: 
                            <span id="totalPrice" price="${finalPrice}" class="price">LE ${finalPrice.toFixed(2)}</span>
                        </h2>
                    </div>
                    <button class="buy add-to-cart"
                        data-product-id="${product.id}"
                        data-product-name="${product.name}"
                        data-product-price="${finalPrice.toFixed(2)}"
                        data-product-color="${product.images[0].color || ''}"
                        data-product-image="${product.images[0].src}">
                        ADD TO CART
                    </button>
                </div>
            </div>
        </div>
    `;

    // ----------------------------
    // 5) Product logic (images, quantity, popup, etc.)
    // ----------------------------

    // === Update total price on quantity change ===
    const priceElement = document.getElementById('totalPrice');
    const priceValue = parseFloat(priceElement.getAttribute('price'));
    const quantityInput = document.getElementById('quantityInput');
    const totalPriceSpan = document.getElementById('totalPrice');

    const updateTotalPrice = () => {
        const quantity = parseInt(quantityInput.value);
        const totalPrice = priceValue * quantity;
        totalPriceSpan.textContent = `LE ${totalPrice.toFixed(2)}`;
    };

    document.querySelector('.increment').addEventListener('click', () => {
        quantityInput.value = parseInt(quantityInput.value) + 1;
        updateTotalPrice();
    });

    document.querySelector('.decrement').addEventListener('click', () => {
        const currentQuantity = parseInt(quantityInput.value);
        if (currentQuantity > 1) {
            quantityInput.value = currentQuantity - 1;
            updateTotalPrice();
        }
    });

    // === Main & Clone images ===
    const mainImage = document.getElementById('ProductImage');
    const cloneImage = document.getElementById('ProductImageClone');

    // === Add to cart button ===
    const addBtns = Array.from(document.querySelectorAll('.add-to-cart'));
    let selectedColor = "";

    const updateAddToCartData = (src, color = '') => {
        if (color) selectedColor = color;
        addBtns.forEach((btn) => {
            btn.dataset.productImage = src || "";
            if (selectedColor) btn.dataset.productColor = selectedColor;
        });
    };

    // === Sub-images ===
    const subImages = Array.from(document.querySelectorAll('.sub-image img'));
    let currentIndex = 0;
    let showingMain = true;

    // === Color change (radio buttons) ===
    document.querySelectorAll('input[name="color"]').forEach((input) => {
        input.addEventListener('change', function () {
            const newSrc = this.getAttribute('data-image');
            const newColor = this.getAttribute('data-color') || this.value || '';

            const activeImage = mainImage.classList.contains('active') ? mainImage : cloneImage;
            const inactiveImage = activeImage === mainImage ? cloneImage : mainImage;

            inactiveImage.src = newSrc;

            activeImage.classList.remove('active');
            activeImage.classList.add('inactive');
            inactiveImage.classList.remove('inactive');
            inactiveImage.classList.add('active');

            subImages.forEach((img) => {
                img.classList.toggle('active', img.dataset.src === newSrc);
            });

            currentIndex = subImages.findIndex(img => img.dataset.src === newSrc);
            showingMain = !showingMain;
            updateAddToCartData(newSrc, newColor);
        });
    });

    // === Image popup modal ===
    const imagePopup = document.getElementById("image-popup");
    const popupImg = document.getElementById("popup-img");

    imagePopup.style.display = "none";

    window.openImage = function (src) {
        popupImg.src = src;
        imagePopup.style.display = "flex";
        setTimeout(() => imagePopup.classList.add('active'), 10);
    };

    window.closeImage = function () {
        imagePopup.classList.remove('active');
        setTimeout(() => imagePopup.style.display = "none", 300);
    };

    mainImage.addEventListener('click', () => openImage(mainImage.src));
    cloneImage.addEventListener('click', () => openImage(cloneImage.src));

    // === Update main image (sub-images + arrows) ===
    const updateMainImage = (index) => {
        const newSrc = subImages[index].dataset.src;
        const newColor = subImages[index].dataset.color;

        if (showingMain) {
            cloneImage.src = newSrc;
            cloneImage.classList.add("active");
            cloneImage.classList.remove("inactive");

            mainImage.classList.remove("active");
            mainImage.classList.add("inactive");
        } else {
            mainImage.src = newSrc;
            mainImage.classList.add("active");
            mainImage.classList.remove("inactive");

            cloneImage.classList.remove("active");
            cloneImage.classList.add("inactive");
        }

        showingMain = !showingMain;

        subImages.forEach((img, idx) => {
            img.classList.toggle('active', idx === index);
        });

        currentIndex = index;

        updateAddToCartData(newSrc, newColor);
        selectedColor = newColor;
    };

    // Bind click on sub-images
    subImages.forEach((img, idx) => {
        img.addEventListener('click', () => {
            updateMainImage(idx);
        });
    });

    // Arrows navigation
    document.getElementById("prevImage").addEventListener("click", () => {
        const newIndex = (currentIndex - 1 + subImages.length) % subImages.length;
        updateMainImage(newIndex);
    });

    document.getElementById("nextImage").addEventListener("click", () => {
        const newIndex = (currentIndex + 1) % subImages.length;
        updateMainImage(newIndex);
    });
};
