// seed.js
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Product = require("./models/Product");

mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("MongoDB Connected for seeding");
});

const seedDB = async () => {
  try {
    await User.deleteMany({});
    await Product.deleteMany({});

    // Create Demo Users
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@oura.com",
      password: "admin123",
      role: "admin",
    });

    const customerUser = await User.create({
      name: "John Doe",
      email: "john@example.com",
      password: "customer123",
      role: "customer",
    });

    console.log("✅ Users seeded");

    // Create Sample Products
    const products = [
      { name: "Laptop", price: 85000, category: "Electronics", rating: 4.5, stock: 15, description: "High-performance laptop", image: "https://via.placeholder.com/200" },
      { name: "Smartphone", price: 45000, category: "Electronics", rating: 4.2, stock: 30, description: "Latest smartphone", image: "https://via.placeholder.com/200" },
      { name: "Headphones", price: 3500, category: "Electronics", rating: 4.0, stock: 50, description: "Wireless headphones", image: "https://via.placeholder.com/200" },
      { name: "T-Shirt", price: 1200, category: "Fashion", rating: 4.3, stock: 100, description: "Cotton t-shirt", image: "https://via.placeholder.com/200" },
      { name: "Jeans", price: 2500, category: "Fashion", rating: 4.1, stock: 80, description: "Denim jeans", image: "https://via.placeholder.com/200" },
      { name: "Sneakers", price: 4500, category: "Fashion", rating: 4.4, stock: 60, description: "Running sneakers", image: "https://via.placeholder.com/200" },
      { name: "Sofa", price: 35000, category: "Home", rating: 4.6, stock: 10, description: "3-seater sofa", image: "https://via.placeholder.com/200" },
      { name: "Dining Table", price: 25000, category: "Home", rating: 4.3, stock: 12, description: "Wooden dining table", image: "https://via.placeholder.com/200" },
      { name: "Bed", price: 40000, category: "Home", rating: 4.7, stock: 8, description: "King-size bed", image: "https://via.placeholder.com/200" },
      { name: "Smartwatch", price: 15000, category: "Electronics", rating: 4.2, stock: 25, description: "Fitness smartwatch", image: "https://via.placeholder.com/200" },
    ];

    await Product.insertMany(products);
    console.log("✅ Products seeded");
    console.log("✅ Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
};

seedDB();