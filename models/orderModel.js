const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tripID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
    },
    seatID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seat",
      required: true,
    },
    departurePlace: {
      type: String
    },
    arrivalPlace: {
      type: String
    },
    seatName: {
      type: String
    },
    brandID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
      required: true
    },
    carID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      required: true
    }
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema, "Order");

module.exports = Order;
