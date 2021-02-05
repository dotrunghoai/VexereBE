const mongoose = require("mongoose");

const stationSchema = new mongoose.Schema(
  {
    stationCode: {
      type: String,
      required: true,
    },
    stationName: {
      type: String,
      required: true,
    },
    stationAddress: String,
    provice: String,
    statusActive: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Station = mongoose.model("Station", stationSchema, "Station");

module.exports = Station;
