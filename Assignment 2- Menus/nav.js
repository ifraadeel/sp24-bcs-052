
var hamburger = document.getElementById("hamburger");
var navList   = document.getElementById("nav-list");

// Step 2: When hamburger is clicked, toggle the menu open/closed
hamburger.addEventListener("click", function () {
    navList.classList.toggle("open");

    // Also swap the icon: ☰ when closed, ✕ when open
    if (navList.classList.contains("open")) {
        hamburger.textContent = "✕";
    } else {
        hamburger.textContent = "☰";
    }
});

// Step 3 (Bonus): Close the menu when any nav link is clicked
var navItems = document.querySelectorAll(".nav-item");

navItems.forEach(function (item) {
    item.addEventListener("click", function () {
        navList.classList.remove("open");
        hamburger.textContent = "☰";
    });
});
