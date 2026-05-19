// routes/index.js
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", {
    title: "Oura Ring 4 — Smart Ring for Fitness, Stress, Sleep & Health",
    banner: "Free trial offer at checkout: Natural Cycles non-hormonal birth control",
    user: req.session.user,
    success_msg: req.flash("success_msg"),
    error_msg: req.flash("error_msg"),
  });
});

module.exports = router;