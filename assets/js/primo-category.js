document.addEventListener("DOMContentLoaded", function () {
  // -----------------------------
  // AOS + CART LOGIC
  // -----------------------------
  const firstRowBoxes = document.querySelectorAll(".wrapper .box");
  let skipCount;
  if (window.innerWidth >= 992) {
    skipCount = 3; // large screens
  } else {
    skipCount = 2; // medium/small screens
  }

  firstRowBoxes.forEach((box, index) => {
    if (index < skipCount) {
      box.removeAttribute("data-aos");
      box.removeAttribute("data-aos-delay");
    } else {
      const animations = ["fade-right", "fade-down", "fade-left"];
      box.setAttribute("data-aos", animations[(index - skipCount) % animations.length]);
      box.setAttribute("data-aos-delay", "330");
    }
  });

  // cart count
  let cartCount = 0;
  const cartCountElement = document.getElementById("cart-count");
  document.querySelectorAll(".key-cover-price button").forEach((button) => {
    button.addEventListener("click", () => {
      cartCount++;
      cartCountElement.textContent = cartCount;
    });
  });

  // AOS init
  AOS.init({ duration: 1000, once: true });


  // -----------------------------
  // VIEW MORE PRODUCTS (SLIDE DOWN)
  // -----------------------------
  const viewMoreBtn = document.getElementById("viewMoreBtn");
  const hiddenProducts = document.querySelector(".hidden-products");

  viewMoreBtn.addEventListener("click", function () {
    hiddenProducts.classList.toggle("show");

    if (hiddenProducts.classList.contains("show")) {
      viewMoreBtn.textContent = "View Less";

      // Scroll smoothly after slide down
      setTimeout(() => {
        hiddenProducts.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 600);
    } else {
      viewMoreBtn.textContent = "View More";

      // Optional scroll back up when collapsing
      setTimeout(() => {
        viewMoreBtn.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    }
  });
});


// -----------------------------
// IMAGE SLIDER LOGIC
// -----------------------------
window.onload = function () {
  document.querySelectorAll(".images").forEach((container) => {
    const images = JSON.parse(container.getAttribute("data-images"));
    const img1 = document.createElement("img");
    const img2 = document.createElement("img");
    img1.src = images[0];
    img1.classList.add("active");
    container.appendChild(img1);
    container.appendChild(img2);
    let currentIndex = 0;
    let showingFirst = true;

    function changeImage(newIndex) {
      const nextSrc = images[newIndex];
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
    }

    container.querySelector(".nextImage").addEventListener("click", () => {
      changeImage((currentIndex + 1) % images.length);
    });
    container.querySelector(".prevImage").addEventListener("click", () => {
      changeImage((currentIndex - 1 + images.length) % images.length);
    });
  });
};