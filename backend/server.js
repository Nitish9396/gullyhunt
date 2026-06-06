const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

connectDB();

// CORS fix
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://gullyhunt-live.vercel.app",
    "https://gullyhunt-app.vercel.app",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.options("*", cors());

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