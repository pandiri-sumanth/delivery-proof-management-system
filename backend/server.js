console.log("Server.js Loaded");

const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

require("dotenv").config();

require("./config/db");

const authRoutes = require("./routes/authRoutes");
const deliveryRoutes = require("./routes/deliveryRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); // Allow images to load in frontend
// app.use(xss()); // Removed due to incompatibility with modern Express

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later."
});
app.use("/api", limiter);
app.use("/auth", limiter);
app.use("/delivery", limiter);

app.use(cors());
app.use(express.json());

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

app.get("/", (req, res) => {
  res.send("Delivery Proof Management System API Running Securely");
});

app.use("/auth", authRoutes);
app.use("/delivery", deliveryRoutes);

// Global Error Handler
app.use(errorMiddleware);

console.log("About to start server...");

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});