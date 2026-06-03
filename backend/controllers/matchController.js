const Match = require("../models/Match");
const User = require("../models/User");

// @desc    Get all matches (with filters)
// @route   GET /api/matches
// @access  Public
const getMatches = async (req, res) => {
  try {
    const { city, sport, skillLevel, entryType, status, date } = req.query;

    // Build filter
    const filter = {};
    if (city) filter.city = { $regex: city, $options: "i" };
    if (sport) filter.sport = sport;
    if (skillLevel) filter.skillLevel = skillLevel;
    if (entryType) filter.entryType = entryType;
    if (status) filter.status = status;
    else filter.status = { $in: ["upcoming", "ongoing"] };

    // Filter by date (today onwards by default)
    if (date) {
      const d = new Date(date);
      filter.date = {
        $gte: new Date(d.setHours(0, 0, 0, 0)),
        $lte: new Date(d.setHours(23, 59, 59, 999)),
      };
    } else {
      filter.date = { $gte: new Date(new Date().setHours(0, 0, 0, 0)) };
    }

    const matches = await Match.find(filter)
      .populate("organizer", "name phone")
      .sort({ date: 1, createdAt: -1 });

    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single match
// @route   GET /api/matches/:id
// @access  Public
const getMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate("organizer", "name phone email city")
      .populate("playersJoined", "name city favoriteSports");

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    res.json(match);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Post a new match
// @route   POST /api/matches
// @access  Private
const createMatch = async (req, res) => {
  try {
    const {
      title,
      sport,
      city,
      locality,
      address,
      date,
      time,
      totalPlayersNeeded,
      entryType,
      entryFee,
      skillLevel,
      venueType,
      contactNumber,
      description,
      location,
    } = req.body;

    const match = await Match.create({
      title,
      sport,
      organizer: req.user._id,
      organizerName: req.user.name,
      city,
      locality,
      address,
      date,
      time,
      totalPlayersNeeded,
      entryType,
      entryFee: entryType === "free" ? 0 : entryFee,
      skillLevel,
      venueType,
      contactNumber,
      description,
      location,
    });

    // Add to user's gamesPosted
    await User.findByIdAndUpdate(req.user._id, {
      $push: { gamesPosted: match._id },
    });

    res.status(201).json(match);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Join a match
// @route   POST /api/matches/:id/join
// @access  Private
const joinMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    // Check if full
    if (match.playersJoined.length >= match.totalPlayersNeeded) {
      return res.status(400).json({ message: "Match is already full" });
    }

    // Check if already joined
    if (match.playersJoined.includes(req.user._id)) {
      return res.status(400).json({ message: "You have already joined this match" });
    }

    // Check if organizer
    if (match.organizer.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot join your own match as a player" });
    }

    match.playersJoined.push(req.user._id);
    await match.save();

    // Add to user's gamesJoined
    await User.findByIdAndUpdate(req.user._id, {
      $push: { gamesJoined: match._id },
    });

    res.json({ message: "Joined successfully!", match });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Leave a match
// @route   POST /api/matches/:id/leave
// @access  Private
const leaveMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    if (!match.playersJoined.includes(req.user._id)) {
      return res.status(400).json({ message: "You have not joined this match" });
    }

    match.playersJoined = match.playersJoined.filter(
      (id) => id.toString() !== req.user._id.toString()
    );
    await match.save();

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { gamesJoined: match._id },
    });

    res.json({ message: "Left the match", match });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a match
// @route   PUT /api/matches/:id
// @access  Private (organizer only)
const updateMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    if (match.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this match" });
    }

    const updated = await Match.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a match
// @route   DELETE /api/matches/:id
// @access  Private (organizer only)
const deleteMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    if (match.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this match" });
    }

    await match.deleteOne();

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { gamesPosted: match._id },
    });

    res.json({ message: "Match deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMatches,
  getMatch,
  createMatch,
  joinMatch,
  leaveMatch,
  updateMatch,
  deleteMatch,
};