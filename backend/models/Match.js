const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Match title is required"],
      trim: true,
    },
    sport: {
      type: String,
      required: [true, "Sport is required"],
      enum: [
        "cricket",
        "football",
        "badminton",
        "basketball",
        "kabaddi",
        "volleyball",
        "table_tennis",
        "other",
      ],
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    organizerName: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    locality: {
      type: String,
      required: [true, "Locality is required"],
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    time: {
      type: String,
      required: [true, "Time is required"],
    },
    totalPlayersNeeded: {
      type: Number,
      required: true,
      min: 2,
    },
    playersJoined: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    entryType: {
      type: String,
      enum: ["free", "paid_per_head", "paid_per_team"],
      default: "free",
    },
    entryFee: {
      type: Number,
      default: 0,
    },
    skillLevel: {
      type: String,
      enum: ["all", "beginner", "intermediate", "advanced"],
      default: "all",
    },
    venueType: {
      type: String,
      enum: ["gully", "turf", "stadium", "academy", "school", "park", "other"],
      default: "gully",
    },
    contactNumber: {
      type: String,
      required: [true, "Contact number is required"],
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming",
    },
    // Simple lat/lng for map pins
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  { timestamps: true }
);

// Virtual: spots left
matchSchema.virtual("spotsLeft").get(function () {
  return this.totalPlayersNeeded - this.playersJoined.length;
});

// Virtual: isFull
matchSchema.virtual("isFull").get(function () {
  return this.playersJoined.length >= this.totalPlayersNeeded;
});

matchSchema.set("toJSON", { virtuals: true });
matchSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Match", matchSchema);