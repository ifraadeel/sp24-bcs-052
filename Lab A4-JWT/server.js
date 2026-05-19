// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const app = express();
const PORT = process.env.PORT || 5000;

// ─── DATABASE CONNECTION ───────────────────────────────────────────
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// ─── MIDDLEWARE ───────────────────────────────────────────────────
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      touchAfter: 24 * 3600,
    }),
    cookie: {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  })
);

// Flash Middleware
app.use(flash());

// Make flash messages available in all views
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.user = req.session.user || null;
  next();
});

// ─── ROUTES ───────────────────────────────────────────────────────
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/products", require("./routes/products"));
app.use("/admin", require("./routes/admin"));
app.use("/api/v1", require("./routes/api"));

// 404 Handler
app.use((req, res) => {
  res.status(404).render("404");
});

// ─── START SERVER ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});