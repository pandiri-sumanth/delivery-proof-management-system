const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate request
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Check if user exists
    const [users] = await db.promise().query(
      "SELECT id, name, email, password, role, status FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = users[0];

    // Check if user is active
    if (user.status !== "Active") {
      return res.status(403).json({ message: "Your account is disabled" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    const jwtSecret = process.env.JWT_SECRET || "your_super_secret_jwt_key_for_dpms";

    jwt.sign(
      payload,
      jwtSecret,
      { expiresIn: "8h" },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({
          message: "Login successful",
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        });
      }
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login
};
