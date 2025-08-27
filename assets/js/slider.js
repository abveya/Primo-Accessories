// -------------------------------
//Slider لكل منتج (صور + لون)
// -------------------------------
window.onload = function () {
    document.querySelectorAll('.images').forEach(container => {
        const images = JSON.parse(container.getAttribute('data-images'));

        // أنشئ الصور الأولى والثانية للfade effect
        const img1 = document.createElement("img");
        const img2 = document.createElement("img");
        img1.classList.add("active");
        container.appendChild(img1);
        container.appendChild(img2);

        let currentIndex = 0;
        let showingFirst = true;

        function changeImage(newIndex) {
            const { src: nextSrc, color: nextColor } = images[newIndex];

            if (showingFirst) {
                img2.src = nextSrc;
                img2.classList.add("active");
                img1.classList.remove("active");
            } else {
                img1.src = nextSrc;
                img1.classList.add("active");
                img2.classList.remove("active");
            }
            showingFirst = !showingFirst;
            currentIndex = newIndex;

            // تحديث Add to Cart حسب الصورة واللون الحالي
            const addBtn = container.closest('.box').querySelector('.add-to-cart');
            if (addBtn) {
                addBtn.dataset.productImage = nextSrc;
                addBtn.dataset.productColor = nextColor || "";
            }
        }

        // Next / Prev buttons
        const nextBtn = container.querySelector('.nextImage');
        const prevBtn = container.querySelector('.prevImage');

        if (nextBtn) nextBtn.addEventListener('click', () => {
            changeImage((currentIndex + 1) % images.length);
        });
        if (prevBtn) prevBtn.addEventListener('click', () => {
            changeImage((currentIndex - 1 + images.length) % images.length);
        });

        // أول مرة تحديث
        changeImage(0);
    });
};


document.addEventListener('click', function (e) {
    const arrow = e.target.closest('.arrow');
    if (!arrow) return;

    e.preventDefault(); // يمنع فتح اللينك
    e.stopPropagation(); // يمنع bubbling
});
