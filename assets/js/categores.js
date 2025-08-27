// const viewMoreBtn = document.getElementById("viewMoreBtn");
// const allProducts = document.querySelectorAll(".product");
// const rowsPerClick = 3;       // عدد الصفوف في كل مرة
// const productsPerRow = 3;     // عدد المنتجات في الصف
// const totalPerClick = rowsPerClick * productsPerRow;

// let currentVisible = 0;

// if (allProducts.length <= 9) {
//     // ✅ إخفاء الزرار
//     viewMoreBtn.style.display = "none";
//     // ✅ عرض كل المنتجات مرة واحدة
//     allProducts.forEach(p => p.classList.add("show"));
// } else {
//     // عرض أول دفعة عند تحميل الصفحة
//     showNextBatch();

//     viewMoreBtn.addEventListener("click", () => {
//         if (currentVisible >= allProducts.length) {
//             collapseAll();
//         } else {
//             showNextBatch();
//         }
//     });
// }

// function showNextBatch() {
//     const nextBatch = Array.from(allProducts).slice(currentVisible, currentVisible + totalPerClick);

//     nextBatch.forEach(p => {
//         p.classList.add("show");
//     });

//     currentVisible += nextBatch.length;

//     if (currentVisible >= allProducts.length) {
//         viewMoreBtn.textContent = "View Less";
//     } else {
//         viewMoreBtn.textContent = "View More";
//     }
// }

// function collapseAll() {
//     allProducts.forEach(p => p.classList.remove("show"));
//     currentVisible = 0;
//     viewMoreBtn.textContent = "View More";
//     showNextBatch(); // عرض أول دفعة مرة أخرى
// }

// AOS.init({ duration: 1000, once: true });
// document.addEventListener("DOMContentLoaded", () => {
//     const viewMoreBtn = document.getElementById("viewMoreBtn");
//     if (!viewMoreBtn) return; // لو الصفحة ما فيهاش الزرار، متعملش حاجة

//     const allProducts = document.querySelectorAll(".product");
//     const perRow = 3;
//     const rowsPerClick = 3;
//     const totalPerClick = perRow * rowsPerClick;
//     let currentVisible = 0;

//     if (allProducts.length <= totalPerClick) {
//         viewMoreBtn.style.display = "none";
//         allProducts.forEach(p => p.classList.add("show"));
//     } else {
//         showNextBatch();
//         viewMoreBtn.addEventListener("click", () => {
//             if (currentVisible >= allProducts.length) {
//                 collapseAll();
//             } else {
//                 showNextBatch();
//             }
//         });
//     }

//     function showNextBatch() {
//         const nextBatch = Array.from(allProducts).slice(currentVisible, currentVisible + totalPerClick);
//         nextBatch.forEach(p => p.classList.add("show"));
//         currentVisible += nextBatch.length;
//         viewMoreBtn.textContent = currentVisible >= allProducts.length ? "View Less" : "View More";
//     }

//     function collapseAll() {
//         allProducts.forEach(p => p.classList.remove("show"));
//         currentVisible = 0;
//         viewMoreBtn.textContent = "View More";
//         showNextBatch();
//     }
// });


document.addEventListener("DOMContentLoaded", () => {
    const viewMoreBtn = document.getElementById("viewMoreBtn");
    if (!viewMoreBtn) return; // لو مفيش زرار، ما نعملش حاجة

    const allProducts = document.querySelectorAll(".product");
    const perRow = 3;
    const rowsPerClick = 3;
    const totalPerClick = perRow * rowsPerClick;

    let currentVisible = 0;

    function showNextBatch() {
        const nextBatch = Array.from(allProducts).slice(currentVisible, currentVisible + totalPerClick);
        nextBatch.forEach(p => p.classList.add("show"));
        currentVisible += nextBatch.length;
        viewMoreBtn.textContent = currentVisible >= allProducts.length ? "View Less" : "View More";
    }

    function collapseAll() {
        allProducts.forEach(p => p.classList.remove("show"));
        currentVisible = 0;
        showNextBatch();
    }

    if (allProducts.length <= totalPerClick) {
        viewMoreBtn.style.display = "none";
        allProducts.forEach(p => p.classList.add("show"));
    } else {
        showNextBatch();
        viewMoreBtn.style.display = "inline-block";
        viewMoreBtn.addEventListener("click", () => {
            if (currentVisible >= allProducts.length) {
                collapseAll();
            } else {
                showNextBatch();
            }
        });
    }
});
