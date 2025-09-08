// AOS
AOS.refresh();  // init AOS
AOS.init({
    duration: 1000,
    once: true
});


// ================== Exit Menu ==================
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

// ================== Search Box ==================
document.addEventListener("DOMContentLoaded", () => {
    const searchBox = document.querySelector(".search-box");
    if (!searchBox) return;

    const searchInput = searchBox.querySelector("input");
    const searchIcon = searchBox.querySelector("i");
    const closeBtn = searchBox.querySelector(".close-search");

    if (searchIcon) {
        searchIcon.addEventListener("click", () => {
            searchBox.classList.toggle("active");
            if (searchBox.classList.contains("active")) {
                searchInput.focus();
            }
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            searchBox.classList.remove("active");
            searchInput.value = "";
        });
    }
});