const mongoose = require("mongoose");

const ballSchema = new mongoose.Schema({
  runs: { type: Number, default: 0 },
  isWicket: { type: Boolean, default: false },
  isWide: { type: Boolean, default: false },
  isNoBall: { type: Boolean, default: false },
  isBye: { type: Boolean, default: false },
  isLegBye: { type: Boolean, default: false },
  batsman: { type: String },
  bowler: { type: String },
  wicketType: { type: String },
  fielder: { type: String },
});

const overSchema = new mongoose.Schema({
  overNumber: { type: Number },
  bowler: { type: String },
  balls: [ballSchema],
  runs: { type: Number, default: 0 },
  wickets: { type: Number, default: 0 },
});

const batsmanSchema = new mongoose.Schema({
  name: { type: String },
  runs: { type: Number, default: 0 },
  balls: { type: Number, default: 0 },
  fours: { type: Number, default: 0 },
  sixes: { type: Number, default: 0 },
  isOut: { type: Boolean, default: false },
  dismissal: { type: String },
  isStriker: { type: Boolean, default: false },
});

const bowlerSchema = new mongoose.Schema({
  name: { type: String },
  overs: { type: Number, default: 0 },
  balls: { type: Number, default: 0 },
  runs: { type: Number, default: 0 },
  wickets: { type: Number, default: 0 },
  wides: { type: Number, default: 0 },
  noBalls: { type: Number, default: 0 },
  isBowling: { type: Boolean, default: false },
});

const inningsSchema = new mongoose.Schema({
  battingTeam: { type: String },
  bowlingTeam: { type: String },
  totalRuns: { type: Number, default: 0 },
  totalWickets: { type: Number, default: 0 },
  totalOvers: { type: Number, default: 0 },
  totalBalls: { type: Number, default: 0 },
  extras: {
    wides: { type: Number, default: 0 },
    noBalls: { type: Number, default: 0 },
    byes: { type: Number, default: 0 },
    legByes: { type: Number, default: 0 },
  },
  batsmen: [batsmanSchema],
  bowlers: [bowlerSchema],
  overs: [overSchema],
  fallOfWickets: [{ wicket: Number, runs: Number, batsman: String }],
  isCompleted: { type: Boolean, default: false },
  target: { type: Number, default: 0 },
});

const scorecardSchema = new mongoose.Schema(
  {
    shareCode: {
      type: String,
      unique: true,
      uppercase: true,
    },
    matchName: { type: String, required: true },
    team1: { type: String, required: true },
    team2: { type: String, required: true },
    playersPerTeam: { type: Number, default: 11 },
    totalOvers: { type: Number, required: true },
    tossWinner: { type: String },
    tossChoice: { type: String, enum: ["bat", "bowl"] },
    team1Players: [{ type: String }],
    team2Players: [{ type: String }],
    innings1: inningsSchema,
    innings2: inningsSchema,
    currentInnings: { type: Number, default: 1 },
    status: {
      type: String,
      enum: ["setup", "toss", "live", "innings_break", "completed"],
      default: "setup",
    },
    result: { type: String },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Generate share code before saving
scorecardSchema.pre("save", function (next) {
  if (!this.shareCode) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.shareCode = code;
  }
  next();
});

module.exports = mongoose.model("Scorecard", scorecardSchema);