document.addEventListener("DOMContentLoaded", () => {
    const wrapper = document.getElementById("productsWrapper");

    const allowedIDs = ["301", "302", "303", "201", "202", "203", "101", "102", "103"];
    const categoryProducts = products.filter(p => allowedIDs.includes(p.id));

    // تقسيم المنتجات حسب الفئات
    const keyCovers = categoryProducts.filter(p => p.id.startsWith("1"));
    const accessories = categoryProducts.filter(p => p.id.startsWith("2"));
    const nickPillows = categoryProducts.filter(p => p.id.startsWith("3"));


    // دمجهم بحيث تظهر كل فئة متتابعة
    const orderedProducts = [...keyCovers, ...accessories, ...nickPillows];

    orderedProducts.forEach(product => {
        const price = Number(product.price);
        const finalPrice = product.discount ? price - (price * product.discount / 100) : price;

        const badgeHTML = product.discount > 0
            ? `<span class="badge-sale">${product.discount}% OFF</span>`
            : "";

        const productHTML = `
            <div class="product col-lg-4 col-md-4 col-sm-6 col-6 d-flex justify-content-center">
                <div class="box d-flex flex-column">
                    <a href="${product.link}?id=${product.id}">
                        <div class="images" data-images='${JSON.stringify(product.images)}'>
                            <img src="${product.images[0].src}">
                            ${badgeHTML}
                            <span class="arrow left prevImage"><i class="fa-solid fa-caret-left"></i></span>
                            <span class="arrow right nextImage"><i class="fa-solid fa-caret-right"></i></span>
                        </div>
                    </a>
                    <div class="key-cover-info">
                        <p class="key-cover-title">${product.title}</p>
                        <p>${product.name}</p>
                    </div>
                    <div class="key-cover-price d-flex align-items-baseline">
                        <p class="d-flex flex-column">
                            ${product.discount > 0
                ? `<span class="new-price">LE ${finalPrice.toFixed(2)}</span>
                <span class="old-price">LE ${product.price}.00</span>`
                : `LE ${product.price}.00`}
                        </p>
                        <button class="btn-sm add-to-cart"
                            data-product-id="${product.id}"
                            data-product-name="${product.name}"
                            data-product-price="${finalPrice.toFixed(2)}"
                            data-product-color="black"
                            data-product-image="${product.images[0].src}">
                            Add to cart
                        </button>
                    </div>
                </div>
            </div>
        `;

        wrapper.innerHTML += productHTML;
    });
});
