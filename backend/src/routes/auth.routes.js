const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../db");
const { signupSchema } = require("../validators/auth.validators");
const jwt = require("jsonwebtoken");
const { loginSchema } = require("../validators/auth.validators");


const router = express.Router();

/**
 * POST /auth/signup
 */

router.post("/signup", async (req, res) => {
  try {
    //validate input by user
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parsed.error.flatten(),
      });
    }

    const { fullName, email, password, gender, experienceLevel, goal } = parsed.data;

    // if email already exists
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: "Email already registered" });
    }

    //Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    //Insert user in DB
    const userResult = await pool.query(
      `INSERT INTO users (full_name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, full_name, email, created_at`,
      [fullName, email, passwordHash]
    );

    const user = userResult.rows[0];

    //Insert profile
    await pool.query(
      `INSERT INTO profiles (user_id, gender, experience_level, goal)
       VALUES ($1, $2, $3, $4)`,
      [user.id, gender ?? null, experienceLevel ?? null, goal ?? null]
    );

    //Respond
    return res.status(201).json({
      message: "Signup successful",
      user,
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    // 1) Validate input
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parsed.error.flatten(),
      });
    }

    const { email, password } = parsed.data;

    // 2) Find user by email
    const userResult = await pool.query(
      "SELECT id, full_name, email, password_hash FROM users WHERE email = $1",
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = userResult.rows[0];

    // 3) Compare password with hashed password
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 4) Create token payload
    const payload = { userId: user.id, email: user.email };

    // 5) Sign JWT
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

    // 6) Return token (client stores it)
    return res.json({
      message: "Login successful",
      token,
      user: { id: user.id, fullName: user.full_name, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;


