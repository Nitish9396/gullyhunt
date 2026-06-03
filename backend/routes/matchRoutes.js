const express = require("express");
const router = express.Router();
const {
  getMatches,
  getMatch,
  createMatch,
  joinMatch,
  leaveMatch,
  updateMatch,
  deleteMatch,
} = require("../controllers/matchController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", getMatches);
router.get("/:id", getMatch);
router.post("/", protect, createMatch);
router.post("/:id/join", protect, joinMatch);
router.post("/:id/leave", protect, leaveMatch);
router.put("/:id", protect, updateMatch);
router.delete("/:id", protect, deleteMatch);

module.exports = router;