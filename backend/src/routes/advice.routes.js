const express = require("express");
const pool = require("../db");
const { requireAuth } = require("../middleware/auth.middleware");
const { getAdvice } = require("../services/ai.service");

const router = express.Router();

router.post("/advice", requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { category, question } = req.body;

    // 1) Basic validation
    if (!category || !question) {
      return res.status(400).json({ message: "category and question are required" });
    }

    // 2) Fetch user profile context 
    const profileRes = await pool.query(
      "SELECT gender, experience_level, goal FROM profiles WHERE user_id = $1",
      [userId]
    );

    const profile = profileRes.rows[0];
    const userProfile = profile
      ? `gender=${profile.gender ?? "N/A"}, exp=${profile.experience_level ?? "N/A"}, goal=${profile.goal ?? "N/A"}`
      : null;

    let aiText;
    try {
      aiText = await getAdvice({ category, question, userProfile });
    } catch (e) {
      console.error("AI failed:", e.message);
      aiText = "AI is busy right now (free tier limit). Please try again later.";
    }


    const saved = await pool.query(
      `INSERT INTO advice_history (user_id, category, user_input, ai_output)
       VALUES ($1, $2, $3, $4)
       RETURNING id, category, user_input, ai_output, created_at`,
      [userId, category, question, aiText]
    );

    return res.status(201).json({
      message: "Advice generated",
      record: saved.rows[0],
    });
  } catch (err) {
    console.error("Advice error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/advice/history", requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId;

    const history = await pool.query(
      `SELECT id, category, user_input, ai_output, created_at
       FROM advice_history
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 30`,
      [userId]
    );

    return res.json({ items: history.rows });
  } catch (err) {
    console.error("History error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
