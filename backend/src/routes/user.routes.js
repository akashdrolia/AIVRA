const express = require("express");
const pool = require("../db");
const { requireAuth } = require("../middleware/auth.middleware");

const router = express.Router();

/**
 * GET /me
 * Protected route -> requires JWT
 * Returns user + profile
 */
router.get("/me", requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      `SELECT u.id, u.full_name, u.email, u.created_at,
              p.gender, p.experience_level, p.goal
       FROM users u
       LEFT JOIN profiles p ON p.user_id = u.id
       WHERE u.id = $1`,
      [userId]
    );

    return res.json({ user: result.rows[0] });
  } catch (err) {
    console.error("Me error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * PATCH /me
 * Update user's full name and profile goal
 */
router.patch("/me", requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { fullName, goal } = req.body;

    if (fullName) {
      await pool.query("UPDATE users SET full_name = $1 WHERE id = $2", [fullName, userId]);
    }

    if (goal !== undefined) {
      const upd = await pool.query("UPDATE profiles SET goal = $1 WHERE user_id = $2", [goal, userId]);
      if (upd.rowCount === 0) {
        await pool.query("INSERT INTO profiles (user_id, goal) VALUES ($1, $2)", [userId, goal]);
      }
    }

    const result = await pool.query(
      `SELECT u.id, u.full_name, u.email, u.created_at,
              p.gender, p.experience_level, p.goal
       FROM users u
       LEFT JOIN profiles p ON p.user_id = u.id
       WHERE u.id = $1`,
      [userId]
    );

    return res.json({ user: result.rows[0] });
  } catch (err) {
    console.error("Me update error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
