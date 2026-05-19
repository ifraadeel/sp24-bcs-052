const mongoose = require("mongoose");
const Product = require("./models/Products");
const User = require("./models/User");
const Order = require("./models/Order");
const bcrypt = require("bcryptjs");
const Products = require("./models/Products");

mongoose
  .connect("mongodb://localhost:27017/oura_shop")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ Error:", err));

const products = [
  { name: "Oura Ring Gen3 - Silver", price: 299, category: "Rings", rating: 4.8, stock: 50, description: "Heritage Silver finish", image: "https://via.placeholder.com/300x200/C0C0C0/FFFFFF?text=Silver+Ring" },
  { name: "Oura Ring Gen3 - Black", price: 299, category: "Rings", rating: 4.9, stock: 45, description: "Stealth Black finish", image: "https://via.placeholder.com/300x200/000000/FFFFFF?text=Black+Ring" },
  { name: "Oura Ring Gen3 - Gold", price: 349, category: "Rings", rating: 4.7, stock: 30, description: "Gold finish", image: "https://via.placeholder.com/300x200/FFD700/000000?text=Gold+Ring" },
  { name: "Oura Charger", price: 49, category: "Accessories", rating: 4.5, stock: 100, description: "Official Oura charger", image: "https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=Charger" },
  { name: "Oura Membership (1 Year)", price: 69, category: "Membership", rating: 4.6, stock: 1000, description: "Annual membership", image: "https://via.placeholder.com/300x200/34C759/FFFFFF?text=Membership" },
  { name: "Oura Ring Sizing Kit", price: 10, category: "Accessories", rating: 4.4, stock: 200, description: "Find your perfect size", image: "https://via.placeholder.com/300x200/FF9500/FFFFFF?text=Sizing+Kit" }
];

async function seedDB() {
  try {
    // Clear existing data
    await Products.deleteMany({});
    await User.deleteMany({});
    await Order.deleteMany({});

    // Insert products
    const insertedProducts = await Products.insertMany(products);
    console.log("✅ Products seeded");

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const adminUser = await User.create({
      username: "admin",
      email: "admin@oura.com",
      password: hashedPassword,
      role: "admin"
    });
    console.log("✅ Admin user created (admin@oura.com / admin123)");

    // Create regular user
    const userPassword = await bcrypt.hash("user123", 10);
    const regularUser = await User.create({
      username: "john",
      email: "john@example.com",
      password: userPassword,
      role: "customer"
    });
    console.log("✅ Regular user created (john@example.com / user123)");

    // Create sample orders
    const orders = [
      {
        userId: regularUser._id,
        products: [
          {
            productId: insertedProducts[0]._id,
            name: insertedProducts[0].name,
            quantity: 1,
            price: insertedProducts[0].price
          },
          {
            productId: insertedProducts[3]._id,
            name: insertedProducts[3].name,
            quantity: 1,
            price: insertedProducts[3].price
          }
        ],
        totalAmount: 348,
        status: "completed"
      },
      {
        userId: regularUser._id,
        products: [
          {
            productId: insertedProducts[1]._id,
            name: insertedProducts[1].name,
            quantity: 2,
            price: insertedProducts[1].price
          }
        ],
        totalAmount: 598,
        status: "completed"
      },
      {
        userId: adminUser._id,
        products: [
          {
            productId: insertedProducts[2]._id,
            name: insertedProducts[2].name,
            quantity: 1,
            price: insertedProducts[2].price
          },
          {
            productId: insertedProducts[4]._id,
            name: insertedProducts[4].name,
            quantity: 1,
            price: insertedProducts[4].price
          }
        ],
        totalAmount: 418,
        status: "completed"
      },
      {
        userId: regularUser._id,
        products: [
          {
            productId: insertedProducts[0]._id,
            name: insertedProducts[0].name,
            quantity: 3,
            price: insertedProducts[0].price
          }
        ],
        totalAmount: 897,
        status: "completed"
      }
    ];

    await Order.insertMany(orders);
    console.log("✅ Sample orders created");

    console.log("\n🎉 Database seeded successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Seeding error:", error);
    mongoose.connection.close();
  }
}

seedDB();