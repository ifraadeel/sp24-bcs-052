const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  price:       { type: Number, required: true },
  category:    { type: String, required: true },
  rating:      { type: Number, default: 0, min: 0, max: 5 },
  stock:       { type: Number, default: 0 },
  description: { type: String },
  image:       { type: String }
}, { timestamps: true });

// Fix: prevent "Cannot overwrite model" error when file is required multiple times
module.exports = mongoose.models.Product || mongoose.model("Product", productSchema);
