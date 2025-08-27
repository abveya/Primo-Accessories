document.addEventListener("DOMContentLoaded", () => {
    console.log("Search.js loaded");

    const searchBox = document.getElementById("searchBox");

    function goToSearchPage() {
        const query = searchBox.value.toLowerCase().trim();
        if (query) {
            // يفتح صفحة نتائج البحث ومعاها الكلمة اللي كتبتيها
            window.location.href = `search-results.html?query=${encodeURIComponent(query)}`;
        }
    }

    // الضغط على Enter
    searchBox.addEventListener("keydown", (e) => {
        if (e.key === "Enter") goToSearchPage();
    });

    // الضغط على أيقونة البحث
    const searchIcon = document.querySelector(".search-box i");
    if (searchIcon) searchIcon.addEventListener("click", goToSearchPage);
});

