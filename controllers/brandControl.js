const Brand = require("../models/brandModel");
const Trip = require("../models/tripModel");

const postBrand = async (req, res) => {
  try {
    const { brandCode, brandName, brandAddress, hotline } = req.body;
    const foundBrand = await Brand.findOne({ brandCode });
    if (foundBrand) {
      return res.status(400).send({ message: "Brand already exist !" });
    }
    const newBrand = new Brand({
      brandCode,
      brandName,
      brandAddress,
      hotline,
      statusActive: "Active",
    });
    const result = await newBrand.save();
    res.status(201).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong !" });
  }
};

const patchBrand = async (req, res) => {
  try {
    const { brandCode, brandName, brandAddress, hotline } = req.body;
    const foundBrand = await Brand.findOne({ brandCode });
    if (!foundBrand) {
      return res.status(404).send({ message: "Invalid Brand !" });
    }
    foundBrand.brandName = brandName;
    foundBrand.brandAddress = brandAddress;
    foundBrand.hotline = hotline;
    const result = await foundBrand.save();
    res.status(202).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong !" });
  }
};

const deleteBrand = async (req, res) => {
  try {
    const { brandCode } = req.query;
    const foundBrand = await Brand.findOne({ brandCode });
    if (!foundBrand) {
      return res.status(404).send({ message: "Invalid Brand !" });
    }
    const findTrip = await Trip.find({ statusActive: "Active" });
    foundBrand.carID.forEach((carBrand) => {
      findTrip.forEach((trip) => {
        if (carBrand.equals(trip.carID)) {
          return res.status(400).send({ message: "Brand is using !" });
        }
      });
    });
    foundBrand.statusActive = "Inactive";
    const result = await foundBrand.save();
    res.status(203).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong !" });
  }
};

const getBrand = async (req, res) => {
  try {
    const findBrand = await Brand.find().populate(
      "carID",
      "licensePlate numberOfSeat statusActive -_id"
    );
    res.status(200).send(findBrand);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong !" });
  }
};

module.exports = { postBrand, patchBrand, deleteBrand, getBrand };
