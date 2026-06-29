const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const upload = require("../config/multer");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  createDelivery,
  getAllDeliveries,
  getDeliveryById,
  updateDelivery,
  deleteDelivery,
  getStats,
  getAIInsights,
  searchByAI
} = require("../controllers/deliveryController");

// Validation Middleware for Delivery
const validateDelivery = [
  body("tracking_id").notEmpty().withMessage("Tracking ID is required").trim().escape(),
  body("receiver_name").notEmpty().withMessage("Receiver Name is required").trim().escape(),
  body("status").notEmpty().withMessage("Status is required").trim().escape(),
  body("condition_status").notEmpty().withMessage("Condition is required").trim().escape(),
  body("remarks").optional().trim().escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation Error", errors: errors.array() });
    }
    next();
  }
];

// All routes are protected by JWT
router.use(authMiddleware);

// Dashboard Routes
router.get("/stats", roleMiddleware("Admin", "Operations Staff", "Logistics Manager"), getStats);
router.get("/ai-insights", roleMiddleware("Admin", "Operations Staff", "Logistics Manager"), getAIInsights);
router.post("/ai-search", roleMiddleware("Admin", "Operations Staff", "Warehouse Staff", "Documentation Executive", "Logistics Manager"), searchByAI);

// Delivery Routes
// All roles can read deliveries (can be restricted further inside controller if needed)
router.get("/all", getAllDeliveries);
router.get("/:id", getDeliveryById);

// Create: Admin, Ops, Warehouse
router.post(
  "/",
  roleMiddleware("Admin", "Operations Staff", "Warehouse Staff"),
  upload.array("proof_images", 10),
  validateDelivery,
  createDelivery
);

// Update: Admin, Ops, Warehouse, Doc Exec
router.put(
  "/:id",
  roleMiddleware("Admin", "Operations Staff", "Warehouse Staff", "Documentation Executive"),
  upload.array("proof_images", 10),
  validateDelivery,
  updateDelivery
);

// Delete: Admin, Ops
router.delete("/:id", roleMiddleware("Admin", "Operations Staff"), deleteDelivery);

module.exports = router;