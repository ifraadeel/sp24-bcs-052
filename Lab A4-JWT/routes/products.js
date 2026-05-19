// routes/products.js
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 8;
    const skip = (page - 1) * limit;

    const search = req.query.search || "";
    const category = req.query.category || "";
    const minPrice = parseInt(req.query.minPrice) || 0;
    const maxPrice = parseInt(req.query.maxPrice) || 1000000;

    let query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    query.price = { $gte: minPrice, $lte: maxPrice };

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    const products = await Product.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const categories = await Product.distinct("category");

    res.render("products", {
      products,
      categories,
      currentPage: page,
      totalPages,
      search,
      category,
      minPrice,
      maxPrice,
      user: req.session.user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;