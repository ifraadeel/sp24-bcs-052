const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Product = require("../models/Products");

// ─── MULTER CONFIGURATION ───────────────────────────────────────────────────
// Multer controls where uploaded files go and what they're named.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/"); // save images here
  },
  filename: function (req, file, cb) {
    // e.g. "1716000000000-ring.jpg" — timestamp prevents name collisions
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
// GET /admin
// Fetches ALL products from MongoDB and renders the dashboard table.
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.render("admin/dashboard", { products });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error loading dashboard");
  }
});

// ─── ADD PRODUCT ─────────────────────────────────────────────────────────────
// GET /admin/new  →  show the blank "Add Product" form
router.get("/new", (req, res) => {
  res.render("admin/addProduct", { error: null });
});

// POST /admin/new  →  receive form data + uploaded image, save to MongoDB
router.post("/new", upload.single("image"), async (req, res) => {
  try {
    const { name, price, category, rating, stock, description } = req.body;

    // Basic validation — if any required field is empty, re-render with error
    if (!name || !price || !category) {
      return res.render("admin/addProduct", {
        error: "Name, Price, and Category are required.",
      });
    }

    // If admin uploaded an image file, build the public URL path.
    // Otherwise fall back to a placeholder.
    const imagePath = req.file
      ? "/uploads/" + req.file.filename
      : "/images/placeholder.jpg";

    const product = new Product({
      name,
      price,
      category,
      rating: rating || 0,
      stock: stock || 0,
      description,
      image: imagePath,
    });

    await product.save();
    res.redirect("/admin"); // back to dashboard after saving
  } catch (err) {
    console.error(err);
    res.render("admin/addProduct", { error: "Failed to save product." });
  }
});

// ─── EDIT PRODUCT ─────────────────────────────────────────────────────────────
// GET /admin/edit/:id  →  find product by ID, pre-fill the edit form
router.get("/edit/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send("Product not found");
    res.render("admin/editProduct", { product, error: null });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading product");
  }
});

// POST /admin/edit/:id  →  save the updated fields back to MongoDB
router.post("/edit/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, price, category, rating, stock, description } = req.body;

    if (!name || !price || !category) {
      const product = await Product.findById(req.params.id);
      return res.render("admin/editProduct", {
        product,
        error: "Name, Price, and Category are required.",
      });
    }

    // Build the update object
    const updateData = { name, price, category, rating, stock, description };

    // Only update image if a new file was uploaded
    if (req.file) {
      updateData.image = "/uploads/" + req.file.filename;
    }

    await Product.findByIdAndUpdate(req.params.id, updateData);
    res.redirect("/admin");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating product");
  }
});

// ─── DELETE PRODUCT ───────────────────────────────────────────────────────────
// POST /admin/delete/:id  →  remove product from MongoDB
// We use POST (not GET) for delete because GET requests should never modify data.
router.post("/delete/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect("/admin");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting product");
  }
});

module.exports = router;