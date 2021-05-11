const Car = require("../models/carModel");
const Brand = require("../models/brandModel");
const Trip = require("../models/tripModel");

const postCar = async (req, res) => {
  try {
    const { brandID, licensePlate, numberOfSeat } = req.body;
    const foundBrand = await Brand.findById(brandID);
    if (!foundBrand) {
      return res.status(404).send({ message: "Invalid Brand" });
    }
    const foundCar = await Car.findOne({ licensePlate });
    if (foundCar) {
      return res.status(400).send({ message: "Car already exist !" });
    }
    const newCar = new Car({
      brandID,
      licensePlate,
      numberOfSeat,
      statusActive: "Active",
    });
    foundBrand.carID.push(newCar._id);
    await foundBrand.save();
    const result = await newCar.save();
    const newResult = {
      brandID: {
        brandName: foundBrand.brandName,
        brandAddress: foundBrand.brandAddress,
        _id: brandID
      },
      licensePlate,
      numberOfSeat,
      statusActive: "Active",
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      _id: result._id
    }
    res.status(201).send(newResult);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong !" });
  }
};

const patchCar = async (req, res) => {
  try {
    const { numberOfSeat, licensePlate } = req.body;
    const foundCar = await Car.findOne({ licensePlate });
    if (!foundCar) {
      return res.status(404).send({ message: "Invalid Car" });
    }
    foundCar.numberOfSeat = numberOfSeat;
    const result = await foundCar.save();
    res.status(202).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong !" });
  }
};

const deleteCar = async (req, res) => {
  try {
    const { licensePlate } = req.query;
    const foundCar = await Car.findOne({ licensePlate });
    if (!foundCar) {
      return res.status(404).send({ message: "Invalid Car" });
    }
    const findTrip = await Trip.find({ statusActive: "Active" });
    let isTrue = true;
    findTrip.forEach((trip) => {
      if (trip.carID.equals(foundCar._id)) {
        // return res.status(400).send({ message: "Car is using !" });
        isTrue = false;
      }
    });

    if (!isTrue) {
      return res.status(400).send({ message: "Car is using !" });
    }

    foundCar.statusActive = "Inactive";
    const result = await foundCar.save();
    res.status(203).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong !" });
  }
};

const getCar = async (req, res) => {
  try {
    const findCar = await Car.find({ statusActive: 'Active' }).populate(
      "brandID",
      "brandName brandAddress"
    );
    res.status(200).send(findCar);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong !" });
  }
};

module.exports = { postCar, patchCar, deleteCar, getCar };
