// routes/index.js

const express = require("express");
const router  = express.Router();

// ── Home / Landing page ───────────────────────────────────
router.get("/", (req, res) => {
  res.render("index", {
    title: "Oura Ring 4 — Smart Ring for Fitness, Stress, Sleep & Health",
    banner: "Free trial offer at checkout: Natural Cycles non-hormonal birth control",
    navItems: ["Shop", "Health Features", "Experience", "For Organizations"],
    rings: [
      { name: "Oura Ring 4",        price: "From $349", img: "/images/men-ring.avif",   alt: "Men-Ring" },
      { name: "Oura Ring 4 Ceramic", price: "From $449", img: "/images/women-ring.jpg", alt: "Women-Ring" }
    ],
    newsCards: [
      { title: "CNN: CEOs and celebrities love Oura's sleep-tracking ring. Its CEO has a plan to stay ahead of Apple and Google" },
      { title: "CNBC: Oura reaches $11 billion valuation with new $900 million fundraise" },
      { title: "Cosmopolitan: I Tested the Oura Ring 4 for an Entire Year and Here's My Honest Review" }
    ],
    accuracyTabs: ["Starting your day", "Taking a walk", "Under the weather", "Winding down", "Hosting a party"],
    footerLinks: {
      company:  ["About Us", "Leadership", "Medical Advisory Board", "Careers", "Newsroom"],
      support:  ["Help Center ↗", "Sizing", "Recycling Program ↗", "Flexible Spending", "Heart Rate Monitoring", "My Account", "Oura on the Web ↗", "Contact"],
      partner:  ["For Organizations ↗", "Developers"],
      connect:  ["The Pulse Blog", "Facebook", "Instagram", "Pinterest", "TikTok", "X", "YouTube"]
    },
    payments: ["PayPal", "Apple Pay", "G Pay", "VISA", "MC", "AMEX"]
  });
});

module.exports = router;
