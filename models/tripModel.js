const mongoose = require("mongoose");
const { seatSchema } = require("./seatModel");

const tripSchema = new mongoose.Schema(
  {
    departurePlace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Station",
      required: true,
    },
    arrivalPlace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Station",
      required: true,
    },
    startedDate: {
      type: Date,
      required: true,
    },
    departureTime: {
      type: Date,
      required: true,
    },
    arrayOfSeat: {
      type: [seatSchema],
    },
    carID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    // statusActive: {
    //   type: String,
    //   required: true,
    // },
    departureProvice: {
      type: String,
      required: true
    },
    arrivalProvice: {
      type: String,
      required: true
    },

    //Ramdom
    hhTo: Number,
    mmTo: Number,
    star: Number,
    countTrip: Number,
    countHH: Number,
    countMM: Number,
    //-----------------------
    brandName: String,
  },
  {
    timestamps: true,
  }
);

const Trip = mongoose.model("Trip", tripSchema, "Trip");

module.exports = Trip;
