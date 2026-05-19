const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Products = require("../models/Products");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

// GET /admin/dashboard
router.get("/dashboard", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const totalProducts = await Products.countDocuments();
    const totalOrders = await Order.countDocuments();
    
    res.render("admin/dashboard", {
      layout: "layouts/main",
      title: "Admin Dashboard",
      totalProducts,
      totalOrders
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).send("Error loading dashboard");
  }
});

// GET /admin/sales - Render sales dashboard
router.get("/sales", isAuthenticated, isAdmin, async (req, res) => {
  try {
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

// GET /admin/api/sales-data - Return JSON for AJAX polling
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
  const revenueStats = await Order.aggregate([
    { $match: { status: "completed" } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalAmount" },
        totalOrders: { $sum: 1 }
      }
    }
  ]);

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