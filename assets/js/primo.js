// AOS
AOS.refresh();  // init AOS
AOS.init({
    duration: 1000,
    once: true
});

// Exit Menu
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

// Search Box (Toggle)
document.addEventListener("DOMContentLoaded", () => {
    const searchIcon = document.querySelector(".search-box i");
    const searchBox = document.querySelector(".search-box");

    if (searchIcon && searchBox) {
        searchIcon.addEventListener("click", () => {
            searchBox.classList.toggle("active");
            if (searchBox.classList.contains("active")) {
                searchBox.querySelector("input").focus();
            }
        });
    }
});

// Search Box (Open / Close)
document.addEventListener("DOMContentLoaded", () => {
    const searchBox = document.querySelector(".search-box");
    const searchInput = searchBox.querySelector("input");
    const searchIcon = searchBox.querySelector("i");
    const closeBtn = searchBox.querySelector(".close-search");

    // open search
    searchIcon.addEventListener("click", () => {
        searchBox.classList.add("active");
        searchInput.focus();
    });

    // close search
    closeBtn.addEventListener("click", () => {
        searchBox.classList.remove("active");
        searchInput.value = "";
    });
});
