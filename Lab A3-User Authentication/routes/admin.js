const express  = require("express");
const router   = express.Router();
const multer   = require("multer");
const Product  = require("../models/Products");
const { isAdmin } = require("../middleware/auth");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads/"),
  filename:    (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// All routes protected by isAdmin middleware
router.get("/", isAdmin, async (req, res) => {
  const products = await Product.find();
  res.render("admin/dashboard", { products });
});

router.get("/new", isAdmin, (req, res) => {
  res.render("admin/addProduct", { error: null });
});

router.post("/new", isAdmin, upload.single("image"), async (req, res) => {
  const { name, price, category, rating, stock, description } = req.body;
  if (!name || !price || !category)
    return res.render("admin/addProduct", { error: "Name, Price, and Category are required." });
  const image = req.file ? "/uploads/" + req.file.filename : "/images/placeholder.jpg";
  await new Product({ name, price, category, rating: rating||0, stock: stock||0, description, image }).save();
  req.flash("success", "Product added.");
  res.redirect("/admin");
});

router.get("/edit/:id", isAdmin, async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).send("Not found");
  res.render("admin/editProduct", { product, error: null });
});

router.post("/edit/:id", isAdmin, upload.single("image"), async (req, res) => {
  const { name, price, category, rating, stock, description } = req.body;
  if (!name || !price || !category) {
    const product = await Product.findById(req.params.id);
    return res.render("admin/editProduct", { product, error: "Name, Price, and Category are required." });
  }
  const updateData = { name, price, category, rating, stock, description };
  if (req.file) updateData.image = "/uploads/" + req.file.filename;
  await Product.findByIdAndUpdate(req.params.id, updateData);
  req.flash("success", "Product updated.");
  res.redirect("/admin");
});

router.post("/delete/:id", isAdmin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  req.flash("success", "Product deleted.");
  res.redirect("/admin");
});

module.exports = router;
