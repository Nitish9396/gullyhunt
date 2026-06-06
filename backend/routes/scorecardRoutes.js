const express = require("express");
const router = express.Router();
const {
  createScorecard,
  getScorecardByCode,
  addBall,
  startInnings2,
  getMyScores,
} = require("../controllers/scorecardController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createScorecard);
router.get("/my", protect, getMyScores);
router.get("/:code", getScorecardByCode);
router.post("/:code/ball", protect, addBall);
router.post("/:code/start-innings2", protect, startInnings2);

module.exports = router;