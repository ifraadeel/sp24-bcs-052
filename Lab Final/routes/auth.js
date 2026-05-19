const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// GET /auth/login - Show login page
router.get("/login", (req, res) => {
  res.render("auth/login", { 
    layout: "layouts/main",
    title: "Login",
    error: null 
  });
});

// POST /auth/login - Handle login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.render("auth/login", {
        layout: "layouts/main",
        title: "Login",
        error: "Invalid email or password"
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render("auth/login", {
        layout: "layouts/main",
        title: "Login",
        error: "Invalid email or password"
      });
    }

    // Set session
    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    };

    // Redirect based on role
    if (user.role === "admin") {
      res.redirect("/admin/dashboard");
    } else {
      res.redirect("/products");
    }
  } catch (error) {
    console.error("Login error:", error);
    res.render("auth/login", {
      layout: "layouts/main",
      title: "Login",
      error: "Server error. Please try again."
    });
  }
});

// GET /auth/register - Show register page
router.get("/register", (req, res) => {
  res.render("auth/register", {
    layout: "layouts/main",
    title: "Register",
    error: null
  });
});

// POST /auth/register - Handle registration
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // Validate passwords match
    if (password !== confirmPassword) {
      return res.render("auth/register", {
        layout: "layouts/main",
        title: "Register",
        error: "Passwords do not match"
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.render("auth/register", {
        layout: "layouts/main",
        title: "Register",
        error: "User already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "customer"
    });

    // Auto-login after registration
    req.session.user = {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role
    };

    res.redirect("/products");
  } catch (error) {
    console.error("Registration error:", error);
    res.render("auth/register", {
      layout: "layouts/main",
      title: "Register",
      error: "Server error. Please try again."
    });
  }
});

// GET /auth/logout - Handle logout
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
    }
    res.redirect("/");
  });
});

module.exports = router;