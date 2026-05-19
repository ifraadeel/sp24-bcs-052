const mongoose = require("mongoose");
const path = require("path");

// Use absolute path to find Product model
const Product = require(path.join(__dirname, "models", "Products"));

mongoose
  .connect("mongodb://localhost:27017/oura_shop")
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Error:", err));

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
  { name: "Camera", price: 55000, category: "Electronics", rating: 4.8, stock: 18, description: "DSLR camera", image: "https://via.placeholder.com/200" },
  { name: "Tablet", price: 35000, category: "Electronics", rating: 4.1, stock: 22, description: "10-inch tablet", image: "https://via.placeholder.com/200" },
  { name: "Jacket", price: 3500, category: "Fashion", rating: 4.0, stock: 40, description: "Winter jacket", image: "https://via.placeholder.com/200" },
  { name: "Dress", price: 2800, category: "Fashion", rating: 4.4, stock: 55, description: "Summer dress", image: "https://via.placeholder.com/200" },
  { name: "Watch", price: 8000, category: "Fashion", rating: 4.5, stock: 35, description: "Analog watch", image: "https://via.placeholder.com/200" },
  { name: "Lamp", price: 1500, category: "Home", rating: 4.0, stock: 70, description: "Table lamp", image: "https://via.placeholder.com/200" },
  { name: "Rug", price: 4000, category: "Home", rating: 4.2, stock: 30, description: "Living room rug", image: "https://via.placeholder.com/200" },
  { name: "Bookshelf", price: 12000, category: "Home", rating: 4.3, stock: 15, description: "5-tier bookshelf", image: "https://via.placeholder.com/200" },
  { name: "Monitor", price: 22000, category: "Electronics", rating: 4.6, stock: 20, description: "27-inch monitor", image: "https://via.placeholder.com/200" },
  { name: "Keyboard", price: 2500, category: "Electronics", rating: 4.3, stock: 45, description: "Mechanical keyboard", image: "https://via.placeholder.com/200" },
  { name: "Mouse", price: 1200, category: "Electronics", rating: 4.1, stock: 60, description: "Wireless mouse", image: "https://via.placeholder.com/200" },
  { name: "Backpack", price: 3000, category: "Fashion", rating: 4.4, stock: 50, description: "Travel backpack", image: "https://via.placeholder.com/200" },
  { name: "Sunglasses", price: 1800, category: "Fashion", rating: 4.2, stock: 65, description: "UV protection sunglasses", image: "https://via.placeholder.com/200" },
  { name: "Chair", price: 8000, category: "Home", rating: 4.5, stock: 25, description: "Office chair", image: "https://via.placeholder.com/200" },
  { name: "Microwave", price: 18000, category: "Home", rating: 4.3, stock: 12, description: "Kitchen microwave", image: "https://via.placeholder.com/200" },
  { name: "Blender", price: 5000, category: "Home", rating: 4.1, stock: 28, description: "High-speed blender", image: "https://via.placeholder.com/200" },
  { name: "Speaker", price: 7000, category: "Electronics", rating: 4.4, stock: 40, description: "Bluetooth speaker", image: "https://via.placeholder.com/200" },
  { name: "Router", price: 4500, category: "Electronics", rating: 4.0, stock: 35, description: "WiFi router", image: "https://via.placeholder.com/200" },
  { name: "Hoodie", price: 2200, category: "Fashion", rating: 4.5, stock: 70, description: "Cotton hoodie", image: "https://via.placeholder.com/200" },
  { name: "Curtains", price: 3500, category: "Home", rating: 4.2, stock: 20, description: "Blackout curtains", image: "https://via.placeholder.com/200" }
];

async function seedDB() {
  try {
    await Products.deleteMany({});
    await Products.insertMany(products);
    console.log("✅ Database seeded with 30 products");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Seeding error:", error);
    mongoose.connection.close();
  }
}

seedDB();