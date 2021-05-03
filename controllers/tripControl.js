const Trip = require("../models/tripModel");
const Station = require("../models/stationModel");
const Car = require("../models/carModel");
const { Seat } = require("../models/seatModel");
const Order = require("../models/orderModel");
const mongoose = require("mongoose");

const postTrip = async (req, res) => {
  try {
    const {
      departurePlace,
      arrivalPlace,
      startedDate,
      departureTime,
      carID,
      price,
    } = req.body;
    const foundStation = await Station.find().or([
      { _id: departurePlace },
      { _id: arrivalPlace },
    ]);
    if (foundStation.length !== 2) {
      return res.status(404).send({ message: "Invalid Station !" });
    }
    const foundCar = await Car.findById(carID);
    if (!foundCar) {
      return res.status(404).send({ message: "Invalid Car" });
    }
    const arrayOfSeat = [...new Array(foundCar.numberOfSeat)].map(
      (item, index) => {
        return new Seat({
          seatName: index + 1,
          status: "available",
        });
      }
    );
    const newTrip = new Trip({
      departurePlace,
      arrivalPlace,
      // startedDate: startedDate + " 00:00:00",
      startedDate,
      departureTime,
      arrayOfSeat,
      carID,
      price,
      // statusActive: "Active",
    });
    const result = await newTrip.save();
    const newResult = {
      departurePlace: {
        _id: foundStation[0]._id,
        stationName: foundStation[0].stationName,
      },
      arrivalPlace: {
        _id: foundStation[1]._id,
        stationName: foundStation[1].stationName,
      },
      // startedDate: startedDate + " 00:00:00",
      startedDate,
      departureTime,
      arrayOfSeat,
      carID: {
        _id: foundCar._id,
        licensePlate: foundCar.licensePlate
      },
      price,
      _id: result._id
      // statusActive: "Active",
    }
    res.status(201).send(newResult);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong !" });
  }
};

const patchTrip = async (req, res) => {
  try {
    const { tripID, startedDate, departureTime, price } = req.body;
    const foundTrip = await Trip.findById(tripID);
    if (!foundTrip) {
      return res.status(404).send({ message: "Invalid Trip !" });
    }
    // foundTrip.startedDate = startedDate + " 00:00:00";
    foundTrip.startedDate = startedDate;
    foundTrip.departureTime = departureTime;
    foundTrip.price = price;
    const result = await foundTrip.save();
    res.status(202).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong !" });
  }
};

const deleteTrip = async (req, res) => {
  try {
    const { tripID } = req.query;
    const findOrder = await Order.findOne({ tripID });
    if (findOrder) {
      return res.status(400).send({ message: "Trip was booked" });
    }
    const foundTrip = await Trip.findByIdAndDelete(tripID);
    if (!foundTrip) {
      return res.status(404).send({ message: "Invalid Trip !" });
    }
    // foundTrip.statusActive = "Inactive";
    // const result = await foundTrip.save();
    res.status(203).send(foundTrip);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong !" });
  }
};

const getTrip = async (req, res) => {
  try {
    const { departurePlace, arrivalPlace, startedDate } = req.query;
    const findTrip = await Trip.find().and([
      { departurePlace },
      { arrivalPlace },
      { startedDate: startedDate + " 00:00:00" },
    ]);
    if (findTrip.length === 0) {
      return res.status(404).send({ message: "Not Found Trip" });
    }
    res.status(200).send(findTrip);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong !" });
  }
};

const getAllTrip = async (req, res) => {
  try {
    const findTrip = await Trip.find().populate("departurePlace arrivalPlace carID", "stationName licensePlate")
    if (findTrip.length === 0) {
      return res.status(404).send({ message: "Not Found Trip" });
    }
    res.status(200).send(findTrip);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong !" });
  }
};

const bookTrip = async (req, res) => {
  const { tripID, seatID } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const foundTrip = await Trip.findById(tripID).session(session);
    if (!foundTrip) {
      return res.status(400).send({ message: 'Invalid Trip, ID not exist!' })
    }
    const foundSeat = foundTrip.arrayOfSeat.findIndex(
      (item) => item._id.toString() === seatID && item.status === 'available'
    )
    if (foundSeat === -1) {
      return res.status(400).send({ message: 'Invalid Seat!' })
    }
    foundTrip.arrayOfSeat[foundSeat].userID = req.user._id
    foundTrip.arrayOfSeat[foundSeat].status = 'booked'
    await foundTrip.save()

    const departurePlace = await Station.findById(foundTrip.departurePlace);
    const arrivalPlace = await Station.findById(foundTrip.arrivalPlace);
    const seatName = foundTrip.arrayOfSeat[foundSeat].seatName;
    const carID = await Car.findById(foundTrip.carID)
    await Order.create(
      [
        {
          userID: req.user._id,
          tripID: foundTrip._id,
          seatID: foundTrip.arrayOfSeat[foundSeat],
          departurePlace: departurePlace.stationName,
          arrivalPlace: arrivalPlace.stationName,
          seatName,
          brandID: carID.brandID,
          carID: foundTrip.carID,
        },
      ],
      { session }
    );
    await session.commitTransaction();
    session.endSession();
    res.status(200).send({ message: 'Book ticket successfully!!!' })
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).send({ message: 'Something went wrong!' })
  }
};

module.exports = { postTrip, patchTrip, deleteTrip, getTrip, getAllTrip, bookTrip };
