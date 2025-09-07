document.getElementById("contact-form").addEventListener("submit", function (e) {
    let valid = true;

    document.querySelectorAll(".c-error").forEach(el => el.textContent = "");

    const name = document.getElementById("fname").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    if (name.length < 3) {
        document.getElementById("nameError").textContent = "Full name must be at least 3 characters";
        valid = false;
    }

    if (!email) {
        document.getElementById("emailError").textContent = "Email is required";
        valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.getElementById("emailError").textContent = "Enter a valid email address";
        valid = false;
    }

    if (!subject) {
        document.getElementById("subjectError").textContent = "Subject is required";
        valid = false;
    }

    if (!message) {
        document.getElementById("messageError").textContent = "Message is required";
        valid = false;
    }

    if (!valid) e.preventDefault();
});
