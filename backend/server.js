console.log("Server.js Loaded");

const path = require("path");
const express = require("express");
const cors = require("cors");

require("dotenv").config();

require("./config/db");

const deliveryRoutes = require("./routes/deliveryRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

app.get("/", (req, res) => {
  res.send("Delivery Proof Management System API Running");
});

app.use("/delivery", deliveryRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

console.log("About to start server...");

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});