// routes/auth.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// REGISTER PAGE
router.get("/register", (req, res) => {
  res.render("auth/register");
});

// REGISTER POST
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;

    if (!name || !email || !password || !passwordConfirm) {
      return res.status(400).render("auth/register", {
        message: "All fields are required",
      });
    }

    if (password !== passwordConfirm) {
      return res.status(400).render("auth/register", {
        message: "Passwords do not match",
      });
    }

    if (password.length < 6) {
      return res.status(400).render("auth/register", {
        message: "Password must be at least 6 characters",
      });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).render("auth/register", {
        message: "Email already in use",
      });
    }

    user = await User.create({ name, email, password });

    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    req.flash("success_msg", `Welcome ${user.name}!`);
    return res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).render("auth/register", { message: error.message });
  }
});

// LOGIN PAGE
router.get("/login", (req, res) => {
  res.render("auth/login");
});

// LOGIN POST
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).render("auth/login", {
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).render("auth/login", {
        message: "Invalid email or password",
      });
    }

    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    req.flash("success_msg", `Welcome back, ${user.name}!`);
    return res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).render("auth/login", { message: error.message });
  }
});

// LOGOUT
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.send("Error logging out");
    req.flash("success_msg", "You have successfully logged out");
    res.redirect("/");
  });
});

module.exports = router;