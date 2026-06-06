const Scorecard = require("../models/Scorecard");

// @desc Create new scorecard
// @route POST /api/scorecard
const createScorecard = async (req, res) => {
  try {
    const {
      matchName, team1, team2, playersPerTeam,
      totalOvers, team1Players, team2Players,
      tossWinner, tossChoice,
    } = req.body;

    const battingTeam = tossChoice === "bat" ? tossWinner
      : tossWinner === team1 ? team2 : team1;
    const bowlingTeam = battingTeam === team1 ? team2 : team1;

    const battingPlayers = battingTeam === team1 ? team1Players : team2Players;
    const bowlingPlayers = battingTeam === team1 ? team2Players : team1Players;

    const innings1 = {
      battingTeam,
      bowlingTeam,
      batsmen: battingPlayers.map((name, i) => ({
        name,
        isStriker: i === 0,
      })),
      bowlers: bowlingPlayers.map((name) => ({ name })),
      overs: [],
      extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0 },
    };

    const scorecard = await Scorecard.create({
      matchName, team1, team2, playersPerTeam,
      totalOvers, team1Players, team2Players,
      tossWinner, tossChoice,
      innings1,
      status: "live",
    });

    res.status(201).json(scorecard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get scorecard by share code
// @route GET /api/scorecard/:code
const getScorecardByCode = async (req, res) => {
  try {
    const scorecard = await Scorecard.findOne({
      shareCode: req.params.code.toUpperCase(),
    });
    if (!scorecard) {
      return res.status(404).json({ message: "Scorecard not found" });
    }
    res.json(scorecard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Add ball to scorecard
// @route POST /api/scorecard/:code/ball
const addBall = async (req, res) => {
  try {
    const {
      runs, isWicket, isWide, isNoBall,
      isBye, isLegBye, batsman, bowler,
      wicketType, fielder, nextBatsman,
    } = req.body;

    const scorecard = await Scorecard.findOne({
      shareCode: req.params.code.toUpperCase(),
    });

    if (!scorecard) {
      return res.status(404).json({ message: "Scorecard not found" });
    }

    const innings = scorecard.currentInnings === 1
      ? scorecard.innings1 : scorecard.innings2;

    // Extra runs for wide/no ball
    const extraRuns = (isWide || isNoBall) ? 1 : 0;
    const totalRuns = runs + extraRuns;

    // Update total score
    innings.totalRuns += totalRuns;

    // Update extras
    if (isWide) innings.extras.wides += 1 + runs;
    if (isNoBall) innings.extras.noBalls += 1;
    if (isBye) innings.extras.byes += runs;
    if (isLegBye) innings.extras.legByes += runs;

    // Update batsman stats
    const batsmanObj = innings.batsmen.find(
      (b) => b.name === batsman && !b.isOut
    );
    if (batsmanObj && !isWide) {
      batsmanObj.runs += runs;
      batsmanObj.balls += 1;
      if (runs === 4) batsmanObj.fours += 1;
      if (runs === 6) batsmanObj.sixes += 1;
    }

    // Update bowler stats
    const bowlerObj = innings.bowlers.find((b) => b.name === bowler);
    if (bowlerObj) {
      bowlerObj.runs += totalRuns;
      if (!isWide && !isNoBall) bowlerObj.balls += 1;
      if (isWide) bowlerObj.wides += 1;
      if (isNoBall) bowlerObj.noBalls += 1;
    }

    // Handle wicket
    if (isWicket) {
      innings.totalWickets += 1;
      if (batsmanObj) {
        batsmanObj.isOut = true;
        batsmanObj.dismissal = wicketType +
          (fielder ? " b " + fielder : "");
        batsmanObj.isStriker = false;
      }
      if (bowlerObj) bowlerObj.wickets += 1;
      innings.fallOfWickets.push({
        wicket: innings.totalWickets,
        runs: innings.totalRuns,
        batsman,
      });
      // Add next batsman
      if (nextBatsman) {
        const nextBatsmanObj = innings.batsmen.find(
          (b) => b.name === nextBatsman
        );
        if (nextBatsmanObj) nextBatsmanObj.isStriker = true;
      }
    }

    // Count valid balls and update overs
    if (!isWide && !isNoBall) {
      innings.totalBalls += 1;
      innings.totalOvers = Math.floor(innings.totalBalls / 6) +
        (innings.totalBalls % 6) / 10;

      // Rotate strike at end of over
      if (innings.totalBalls % 6 === 0) {
        const striker = innings.batsmen.find(
          (b) => b.isStriker && !b.isOut
        );
        const nonStriker = innings.batsmen.find(
          (b) => !b.isStriker && !b.isOut
        );
        if (striker && nonStriker) {
          striker.isStriker = false;
          nonStriker.isStriker = true;
        }
      }
    }

    // Check if innings complete
    const maxOvers = scorecard.totalOvers;
    const oversCompleted = Math.floor(innings.totalBalls / 6);
    const allOut = innings.totalWickets >= scorecard.playersPerTeam - 1;

    if (oversCompleted >= maxOvers || allOut) {
      innings.isCompleted = true;

      if (scorecard.currentInnings === 1) {
        // Start innings 2
        const battingTeam2 = innings.bowlingTeam;
        const bowlingTeam2 = innings.battingTeam;
        const batting2Players = battingTeam2 === scorecard.team1
          ? scorecard.team1Players : scorecard.team2Players;
        const bowling2Players = battingTeam2 === scorecard.team1
          ? scorecard.team2Players : scorecard.team1Players;

        scorecard.innings2 = {
          battingTeam: battingTeam2,
          bowlingTeam: bowlingTeam2,
          batsmen: batting2Players.map((name, i) => ({
            name, isStriker: i === 0,
          })),
          bowlers: bowling2Players.map((name) => ({ name })),
          overs: [],
          extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0 },
          target: innings.totalRuns + 1,
        };
        scorecard.currentInnings = 2;
        scorecard.status = "innings_break";
      } else {
        // Match complete
        scorecard.status = "completed";
        const inn1 = scorecard.innings1;
        const inn2 = scorecard.innings2;

        if (inn2.totalRuns > inn1.totalRuns) {
          const wicketsLeft = scorecard.playersPerTeam -
            1 - inn2.totalWickets;
          scorecard.result = inn2.battingTeam + " won by " +
            wicketsLeft + " wickets";
        } else if (inn1.totalRuns > inn2.totalRuns) {
          const runDiff = inn1.totalRuns - inn2.totalRuns;
          scorecard.result = inn1.battingTeam + " won by " +
            runDiff + " runs";
        } else {
          scorecard.result = "Match Tied";
        }
      }
    }

    await scorecard.save();
    res.json(scorecard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Start innings 2
// @route POST /api/scorecard/:code/start-innings2
const startInnings2 = async (req, res) => {
  try {
    const scorecard = await Scorecard.findOne({
      shareCode: req.params.code.toUpperCase(),
    });
    if (!scorecard) {
      return res.status(404).json({ message: "Scorecard not found" });
    }
    scorecard.status = "live";
    await scorecard.save();
    res.json(scorecard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get my scorecards
// @route GET /api/scorecard/my
const getMyScores = async (req, res) => {
  try {
    const scores = await Scorecard.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 })
      .select("matchName team1 team2 status shareCode createdAt result");
    res.json(scores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createScorecard,
  getScorecardByCode,
  addBall,
  startInnings2,
  getMyScores,
};