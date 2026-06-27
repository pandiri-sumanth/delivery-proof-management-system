const express = require("express");

const router = express.Router();

const upload = require("../config/multer");

const {
  createDelivery,
  getAllDeliveries,
  getDeliveryById,
  updateDelivery,
  deleteDelivery,
  getStats,
  getAIInsights
} = require("../controllers/deliveryController");

// Test Route
router.get("/test", (req, res) => {
  res.json({
    message: "Delivery Route Working"
  });
});

// Dashboard Routes
router.get("/stats", getStats);
router.get("/ai-insights", getAIInsights);

// Delivery Routes
router.get("/all", getAllDeliveries);
router.get("/:id", getDeliveryById);
router.post(
  "/",
  upload.array("proof_images", 10),
  createDelivery
);
router.put(
  "/:id",
  upload.array("proof_images", 10),
  updateDelivery
);
router.delete("/:id", deleteDelivery);

module.exports = router;