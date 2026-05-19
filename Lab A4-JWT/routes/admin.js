// routes/admin.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Product = require("../models/Product");
const { isAdmin } = require("../middleware/auth");

// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Check if user is logged in AND admin
const checkAdmin = (req, res, next) => {
  if (!req.session.user) {
    req.flash("error_msg", "Please login first");
    return res.redirect("/auth/login");
  }
  if (req.session.user.role !== "admin") {
    req.flash("error_msg", "Access Denied. Admin only.");
    return res.redirect("/");
  }
  next();
};

// DASHBOARD
router.get("/", checkAdmin, async (req, res) => {
  try {
    const products = await Product.find();
    res.render("admin/dashboard", { products, user: req.session.user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// ADD PRODUCT PAGE
router.get("/new", checkAdmin, (req, res) => {
  res.render("admin/addProduct", { error: null, user: req.session.user });
});

// ADD PRODUCT POST
router.post("/new", checkAdmin, upload.single("image"), async (req, res) => {
  try {
    const { name, price, category, rating, stock, description } = req.body;

    if (!name || !price || !category) {
      return res.status(400).render("admin/addProduct", {
        error: "Name, Price, and Category are required",
        user: req.session.user,
      });
    }

    const imagePath = req.file ? "/uploads/" + req.file.filename : "/images/placeholder.jpg";

    const product = await Product.create({
      name,
      price,
      category,
      rating: rating || 0,
      stock: stock || 0,
      description,
      image: imagePath,
    });

    req.flash("success_msg", "Product added successfully");
    res.redirect("/admin");
  } catch (err) {
    console.error(err);
    res.status(500).render("admin/addProduct", {
      error: "Failed to add product",
      user: req.session.user,
    });
  }
});

// EDIT PRODUCT PAGE
router.get("/edit/:id", checkAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send("Product not found");
    res.render("admin/editProduct", { product, error: null, user: req.session.user });
  } catch (err) {
    res.status(500).send("Error loading product");
  }
});

// EDIT PRODUCT POST
router.post("/edit/:id", checkAdmin, upload.single("image"), async (req, res) => {
  try {
    const { name, price, category, rating, stock, description } = req.body;

    if (!name || !price || !category) {
      const product = await Product.findById(req.params.id);
      return res.status(400).render("admin/editProduct", {
        product,
        error: "Name, Price, and Category are required",
        user: req.session.user,
      });
    }

    const updateData = { name, price, category, rating, stock, description };
    if (req.file) {
      updateData.image = "/uploads/" + req.file.filename;
    }

    await Product.findByIdAndUpdate(req.params.id, updateData);
    req.flash("success_msg", "Product updated successfully");
    res.redirect("/admin");
  } catch (err) {
    res.status(500).send("Error updating product");
  }
});

// DELETE PRODUCT
router.post("/delete/:id", checkAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    req.flash("success_msg", "Product deleted successfully");
    res.redirect("/admin");
  } catch (err) {
    res.status(500).send("Error deleting product");
  }
});

module.exports = router;