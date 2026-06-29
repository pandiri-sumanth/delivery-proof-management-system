const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Get token from header
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  // Check if not token
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || "your_super_secret_jwt_key_for_dpms";
    const decoded = jwt.verify(token, jwtSecret);

    // Attach user payload to request
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;
