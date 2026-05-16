const express = require("express");
const path = require("path");
const indexRouter = require("./routes/index");

const app = express();
const PORT = 3000;

// 1) Set EJS as view engine and views folder
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// 2) Serve static files from "public"
app.use(express.static(path.join(__dirname, "public")));

// 3) Use the index router for "/"
app.use("/", indexRouter);

// 4) Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});