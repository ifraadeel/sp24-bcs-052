const express = require("express");
const router = express.Router();
const Products = require("../models/Products");

// GET /products - List all products with pagination
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 8;
    const skip = (page - 1) * limit;
    
    const search = req.query.search || "";
    const category = req.query.category || "";
    const minPrice = req.query.minPrice || 0;
    const maxPrice = req.query.maxPrice || 1000000;

    let query = {};
    
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    
    if (category) {
      query.category = category;
    }
    
    query.price = { $gte: minPrice, $lte: maxPrice };

    const totalProducts = await Products.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    const products = await Products.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const categories = await Products.distinct("category");

    res.render("products", {
      layout: "layouts/main",
      title: "Products",
      products,
      categories,
      currentPage: page,
      totalPages,
      search,
      category,
      minPrice,
      maxPrice
    });
  } catch (error) {
    console.error("Products error:", error);
    res.status(500).send("Error loading products");
  }
});

module.exports = router;