// routes/api.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");
const verifyToken = require("../middleware/verifyToken");

// ─── PUBLIC ENDPOINTS ──────────────────────────────────────────────

// GET ALL PRODUCTS (Paginated)
router.get("/products", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 8;
    const skip = (page - 1) * limit;

    const search = req.query.search || "";
    let query = {};
    
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query)
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET SINGLE PRODUCT
router.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── LOGIN ENDPOINT (Returns JWT) ──────────────────────────────────

// POST /api/v1/auth/login
router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { user_id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── PROTECTED ENDPOINTS (Requires JWT) ────────────────────────────

// GET USER PROFILE
router.get("/user/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.user_id);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST ORDER
router.post("/orders", verifyToken, async (req, res) => {
  try {
    const { products, totalAmount } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Products array is required",
      });
    }

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        error: "Valid totalAmount is required",
      });
    }

    const order = await Order.create({
      userId: req.user.user_id,
      products,
      totalAmount,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;