const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authroutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const adviceRoutes = require("./routes/advice.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health" , (req,res) => {
  res.json({status: "ok", message: "AVIRA backend is running" });
});

//routes
app.use("/auth", authroutes);
app.use("/", userRoutes);
app.use("/", adviceRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});