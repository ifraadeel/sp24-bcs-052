const express = require("express");
const router  = express.Router();
const User    = require("../models/User");

// GET /auth/register
router.get("/register", (req, res) => {
  if (req.session.user) return res.redirect("/");
  res.render("auth/register");
});

// POST /auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      req.flash("error", "Passwords do not match.");
      return res.redirect("/auth/register");
    }
    if (password.length < 6) {
      req.flash("error", "Password must be at least 6 characters.");
      return res.redirect("/auth/register");
    }
    const existing = await User.findOne({ email });
    if (existing) {
      req.flash("error", "An account with that email already exists.");
      return res.redirect("/auth/register");
    }
    const user = new User({ name, email, password });
    await user.save();
    req.flash("success", "Account created! Please log in.");
    res.redirect("/auth/login");
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong.");
    res.redirect("/auth/register");
  }
});

// GET /auth/login
router.get("/login", (req, res) => {
  if (req.session.user) return res.redirect("/");
  res.render("auth/login");
});

// POST /auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      req.flash("error", "Invalid email or password.");
      return res.redirect("/auth/login");
    }
    const match = await user.comparePassword(password);
    if (!match) {
      req.flash("error", "Invalid email or password.");
      return res.redirect("/auth/login");
    }
    req.session.user = { id: user._id, name: user.name, email: user.email, role: user.role };
    req.flash("success", `Welcome back, ${user.name}!`);
    return user.role === "admin" ? res.redirect("/admin") : res.redirect("/");
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong.");
    res.redirect("/auth/login");
  }
});

// POST /auth/logout
router.post("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

module.exports = router;
