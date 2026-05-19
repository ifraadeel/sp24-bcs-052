const express    = require("express");
const path       = require("path");
const mongoose   = require("mongoose");
const session    = require("express-session");
const flash      = require("connect-flash");
const MongoStore = require("connect-mongodb-session")(require("express-session"));

const MONGO_URI = "mongodb://localhost:27017/oura_shop";

// Session store in MongoDB
const store = new MongoStore({ uri: MONGO_URI, collection: "sessions" });
store.on("error", (e) => console.error("Session store error:", e));

const app  = express();
const PORT = 5000;

// ── DB ──────────────────────────────────────────────────────────────────────
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ DB error:", err));

// ── CORE MIDDLEWARE ──────────────────────────────────────────────────────────
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ── SESSION ──────────────────────────────────────────────────────────────────
app.use(session({
  secret: "oura_lab_a3_secret",
  resave: false,
  saveUninitialized: false,
  store,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hours
}));

// ── FLASH ────────────────────────────────────────────────────────────────────
app.use(flash());

// ── GLOBALS: available in every EJS automatically ────────────────────────────
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.messages    = req.flash();
  next();
});

// ── ROUTES ───────────────────────────────────────────────────────────────────
const Products = require("./models/Products");

app.use("/",      require("./routes/index"));
app.use("/admin", require("./routes/admin"));
app.use("/auth",  require("./routes/auth"));

// Products catalog route
app.get("/products", async (req, res) => {
  try {
    const page     = parseInt(req.query.page) || 1;
    const limit    = 8;
    const skip     = (page - 1) * limit;
    const search   = req.query.search   || "";
    const category = req.query.category || "";
    const minPrice = req.query.minPrice || 0;
    const maxPrice = req.query.maxPrice || 1000000;

    let query = { price: { $gte: minPrice, $lte: maxPrice } };
    if (search)   query.name     = { $regex: search, $options: "i" };
    if (category) query.category = category;

    const totalProducts = await Products.countDocuments(query);
    const totalPages    = Math.ceil(totalProducts / limit);
    const products      = await Products.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });
    const categories    = await Products.distinct("category");

    res.render("products", { products, categories, currentPage: page, totalPages, search, category, minPrice, maxPrice });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
