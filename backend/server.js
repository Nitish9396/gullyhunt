const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

connectDB();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://gullyhunt-live.vercel.app",
  "https://gullyhunt-app.vercel.app",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/matches", require("./routes/matchRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/scorecard", require("./routes/scorecardRoutes"));

app.get("/", (req, res) => {
  res.json({ message: "GullyHunt API is running 🏏" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});