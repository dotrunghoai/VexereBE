const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    brandCode: {
      type: String,
      required: true,
    },
    brandName: {
      type: String,
      required: true,
    },
    brandAddress: String,
    hotline: String,
    statusActive: {
      type: String,
      required: true,
    },
    carID: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Car",
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Brand = mongoose.model("Brand", brandSchema, "Brand");

module.exports = Brand;
