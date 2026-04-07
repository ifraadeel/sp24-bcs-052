// nav.js — Fixed & Improved

document.addEventListener("DOMContentLoaded", function () {

    var hamburger = document.getElementById("hamburger");
    var navList   = document.getElementById("nav-list");

    // Guard: if elements don't exist, don't crash
    if (!hamburger || !navList) return;

    // Toggle menu open/closed on hamburger click
    hamburger.addEventListener("click", function () {
        var isOpen = navList.classList.toggle("open");

        // Swap the icon: ☰ when closed, ✕ when open
        hamburger.textContent = isOpen ? "✕" : "☰";

        // Update aria-expanded for accessibility
        hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Bonus: Close the menu when any nav link is clicked
    var navItems = document.querySelectorAll(".nav-item");

    navItems.forEach(function (item) {
        item.addEventListener("click", function () {
            navList.classList.remove("open");
            hamburger.textContent = "☰";
            hamburger.setAttribute("aria-expanded", "false");
        });
    });

    // Bonus: Close menu when clicking outside the nav
    document.addEventListener("click", function (e) {
        var navHeader = document.querySelector(".nav-header");
        if (navHeader && !navHeader.contains(e.target)) {
            navList.classList.remove("open");
            hamburger.textContent = "☰";
            hamburger.setAttribute("aria-expanded", "false");
        }
    });

});
