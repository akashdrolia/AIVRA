// src/index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

/**
 * Middleware concept:
 * app.use(...) runs BEFORE your routes.
 * Used for parsing, security, logging, etc.
 */
app.use(cors()); // allows cross-origin requests (React -> backend)
app.use(express.json()); // parses JSON request bodies into req.body

// Health check route (useful for debugging + deployments)
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "AIVRA backend running" });
});

module.exports = app;
