document.getElementById("checkout-form").addEventListener("submit", function (e) {
    let valid = true;

    document.querySelectorAll(".error").forEach(el => el.textContent = "");

    const name = document.getElementById("full-name").value.trim();
    const email = document.getElementById("Email").value.trim();
    const phone = document.getElementById("phone-number").value.trim();
    const country = document.getElementById("country").value;
    const city = document.getElementById("city").value;
    const region = document.getElementById("region").value.trim();
    const street = document.getElementById("street-address").value.trim();

    if (name.length < 3) {
        document.getElementById("nameError").textContent = "full name must be at least 3 characters";
        valid = false;
    }

    if (!email) {
        document.getElementById("emailError").textContent = "Email is required";
        valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.getElementById("emailError").textContent = "Enter a valid email address";
        valid = false;
    }

    if (!/^01[0-2,5]\d{8}$/.test(phone)) {
        document.getElementById("phoneError").textContent = "Enter a valid Egyptian phone number";
        valid = false;
    }

    if (!country) {
        document.getElementById("countryError").textContent = "Country is required";
        valid = false;
    }

    if (!city) {
        document.getElementById("cityError").textContent = "City is required";
        valid = false;
    }

    if (region.length < 2) {
        document.getElementById("regionError").textContent = "Region is required";
        valid = false;
    }

    if (street.length < 3) {
        document.getElementById("streetError").textContent = "Street address is required";
        valid = false;
    }

    if (!valid) e.preventDefault();

});