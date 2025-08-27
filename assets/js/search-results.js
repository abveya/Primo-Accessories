document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get("query")?.toLowerCase() || "";

    const resultsContainer = document.getElementById("resultsContainer");
    const noResults = document.getElementById("noResults");

    let found = false;

    products.forEach(product => {
        if (product.name.toLowerCase().includes(query) || query === "") {
            const col = document.createElement("div");
            col.className = "col-lg-4 col-md-4 col-sm-6 col-6 d-flex justify-content-center product";
            col.style.display = "none";

            const dataImages = JSON.stringify(product.images).replace(/"/g, "&quot;");
            const finalPrice = product.discount > 0
                ? product.price - (product.price * product.discount / 100)
                : product.price;

            col.innerHTML = `
                <div class="box d-flex flex-column">
                    <a href="${product.link}">
                        <div class="images" data-images='${dataImages}'>
                            <img src="${product.images[0].src}">
                            <span class="arrow left prevImage"><i class="fa-solid fa-caret-left"></i></span>
                            <span class="arrow right nextImage"><i class="fa-solid fa-caret-right"></i></span>
                            ${product.discount > 0 ? `<span class="badge-sale">${product.discount}% OFF</span>` : ""}
                        </div>
                    </a>
                    <div class="key-cover-info">
                        <p class="key-cover-title">${product.title}</p>
                        <p>${product.name}</p>
                    </div>
                    <div class="key-cover-price d-flex align-items-baseline">
                        <p class="d-flex flex-column">
                            ${product.discount > 0
                    ? `<span class="new-price">LE ${finalPrice}.00</span>
                                <span class="old-price">LE ${product.price}.00</span>`
                    : `LE ${product.price}.00`}
                        </p>
                        <button class="btn-sm add-to-cart"
                        data-product-id="${product.id}"
                        data-product-name="${product.name}"
                        data-product-price="${finalPrice}"
                        data-product-image="${product.images[0].src}"
                        >
                            Add to cart
                        </button>
                    </div>
                </div>
                `;
            resultsContainer.appendChild(col);
            found = true;
        }
    });

    if (!found) noResults.style.display = "block";

    initializeViewMore();
});

function initializeViewMore() {
    const viewMoreBtn = document.getElementById("viewMoreBtn");
    const allProducts = document.querySelectorAll(".product");
    const rowsPerClick = 3;
    const productsPerRow = 3;
    const totalPerClick = rowsPerClick * productsPerRow;
    let currentVisible = 0;

    if (allProducts.length <= 9) {
        viewMoreBtn.style.display = "none";
        allProducts.forEach(p => p.classList.add("show", "d-flex"));
    } else {
        showNextBatch();
        viewMoreBtn.addEventListener("click", () => {
            if (currentVisible >= allProducts.length) collapseAll();
            else showNextBatch();
        });
    }

    function showNextBatch() {
        const nextBatch = Array.from(allProducts).slice(currentVisible, currentVisible + totalPerClick);
        nextBatch.forEach(p => {
            p.classList.add("show");
            p.style.display = "flex";
        });
        currentVisible += nextBatch.length;
        viewMoreBtn.textContent = currentVisible >= allProducts.length ? "View Less" : "View More";
    }

    function collapseAll() {
        allProducts.forEach(p => {
            p.classList.remove("show");
            p.style.display = "none";
        });
        currentVisible = 0;
        viewMoreBtn.textContent = "View More";
        showNextBatch();
    }
}

// منع فتح اللينك عند الضغط على الأسهم
document.addEventListener('click', function (e) {
    const arrow = e.target.closest('.arrow');
    if (!arrow) return;
    e.preventDefault();
    e.stopPropagation();
});

AOS.init({ duration: 1000, once: true });