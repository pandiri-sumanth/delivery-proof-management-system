const express = require("express");
const { body, validationResult } = require("express-validator");
const { login } = require("../controllers/authController");

const router = express.Router();

// Validation middleware for login
const validateLogin = [
  body("email").isEmail().withMessage("Please include a valid email").normalizeEmail(),
  body("password").exists().withMessage("Password is required").trim().escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation Error", errors: errors.array() });
    }
    next();
  }
];

// @route   POST /auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", validateLogin, login);

module.exports = router;
