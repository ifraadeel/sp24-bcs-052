const express = require("express");
const path = require("path");
const indexRouter = require("./routes/index");
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/oura_shop")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ Error:", err));

const app = express();
const PORT = 5000;

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));   // parse form submissions
app.use(express.json());

// 1) Set EJS as view engine and views folder
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// 2) Serve static files from "public"
app.use(express.static(path.join(__dirname, "public")));

// 3) Use the index router for "/"
app.use("/", indexRouter);

const Products = require("./models/Products");
const adminRoutes  = require("./routes/admin");
app.use("/admin", adminRoutes); 

// Products route with pagination, search, and filters
app.get("/products", async (req, res) => {
  try {
    // Get query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = 8;
    const skip = (page - 1) * limit;
    
    const search = req.query.search || "";
    const category = req.query.category || "";
    const minPrice = req.query.minPrice || 0;
    const maxPrice = req.query.maxPrice || 1000000;

    // Build query object
    let query = {};
    
    // Search by name
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Filter by price range
    query.price = { $gte: minPrice, $lte: maxPrice };

    // Get total count for pagination
    const totalProducts = await Products.countDocuments(query);  // FIXED HERE
    const totalPages = Math.ceil(totalProducts / limit);

    // Fetch products with filters and pagination
    const products = await Products.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Get unique categories for filter dropdown
    const categories = await Products.distinct("category");

    // Render the page
    res.render("products", {
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
    console.error("Error:", error);
    res.status(500).send("Server Error");
  }
});

// 4) Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});