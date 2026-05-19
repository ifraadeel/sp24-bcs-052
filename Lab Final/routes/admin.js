const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

// GET /admin/sales - Render sales dashboard
router.get("/sales", isAuthenticated, isAdmin, async (req, res) => {
  try {
    // Calculate initial stats
    const stats = await calculateSalesStats();
    
    res.render("admin/sales", {
      layout: "layouts/main",
      title: "Sales Dashboard",
      ...stats
    });
  } catch (error) {
    console.error("Sales dashboard error:", error);
    res.status(500).send("Error loading sales dashboard");
  }
});

// GET /api/sales-data - Return JSON for AJAX polling
router.get("/api/sales-data", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const stats = await calculateSalesStats();
    res.json(stats);
  } catch (error) {
    console.error("API sales data error:", error);
    res.status(500).json({ error: "Failed to fetch sales data" });
  }
});

// Helper function to calculate sales statistics
async function calculateSalesStats() {
  // Total revenue and orders using aggregation
  const revenueStats = await Order.aggregate([
    {
      $match: { status: "completed" }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalAmount" },
        totalOrders: { $sum: 1 }
      }
    }
  ]);

  // Top-selling product
  const topProducts = await Order.aggregate([
    { $match: { status: "completed" } },
    { $unwind: "$products" },
    {
      $group: {
        _id: "$products.productId",
        productName: { $first: "$products.name" },
        totalQuantity: { $sum: "$products.quantity" },
        totalRevenue: { $sum: { $multiply: ["$products.quantity", "$products.price"] } }
      }
    },
    { $sort: { totalQuantity: -1 } },
    { $limit: 1 }
  ]);

  // Recent orders
  const recentOrders = await Order.find({ status: "completed" })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("userId", "username email");

  return {
    totalRevenue: revenueStats[0]?.totalRevenue || 0,
    totalOrders: revenueStats[0]?.totalOrders || 0,
    topProduct: topProducts[0] || null,
    recentOrders: recentOrders
  };
}

module.exports = router;