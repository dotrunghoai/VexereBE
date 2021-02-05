const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema(
  {
    seatName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Seat = mongoose.model("Seat", seatSchema, "Seat");

module.exports = { seatSchema, Seat };
