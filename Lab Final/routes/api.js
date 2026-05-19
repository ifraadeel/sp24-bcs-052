const express = require("express");
const router = express.Router();
const Products = require("../models/Products");
const Order = require("../models/Order");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }
  
  const token = authHeader.split(" ")[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret_here_2026");
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
}

// POST /api/v1/auth/login - JWT Login
router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    // Generate JWT
    const token = jwt.sign(
      { user_id: user._id, role: user.role },
      process.env.JWT_SECRET || "your_jwt_secret_here_2026",
      { expiresIn: "1h" }
    );
    
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("API login error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/v1/products - Get all products (with pagination)
router.get("/products", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const search = req.query.search || "";
    const category = req.query.category || "";
    
    let query = {};
    
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    
    if (category) {
      query.category = category;
    }
    
    const total = await Products.countDocuments(query);
    const products = await Products.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      products
    });
  } catch (error) {
    console.error("API products error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/v1/products/:id - Get single product
router.get("/products/:id", async (req, res) => {
  try {
    const product = await Products.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error("API product detail error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/v1/orders - Create order (Protected)
router.post("/orders", verifyToken, async (req, res) => {
  try {
    const { products, totalAmount } = req.body;
    
    const newOrder = await Order.create({
      userId: req.user.user_id,
      products,
      totalAmount,
      status: "completed"
    });
    
    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: newOrder
    });
  } catch (error) {
    console.error("API order error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/v1/user/profile - Get user profile (Protected)
router.get("/user/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.user_id).select("-password");
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error("API profile error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;