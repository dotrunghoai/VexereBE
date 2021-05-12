const Trip = require("../models/tripModel");
const Station = require("../models/stationModel");
const Car = require("../models/carModel");
const { Seat } = require("../models/seatModel");
const Order = require("../models/orderModel");
const mongoose = require("mongoose");
const Brand = require('../models/brandModel')

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
    // const foundStation = await Station.find().or([
    //   { _id: departurePlace },
    //   { _id: arrivalPlace },
    // ]);
    const foundStationDepart = await Station.findOne({ _id: departurePlace })
    const foundStationArri = await Station.findOne({ _id: arrivalPlace })
    if (!foundStationDepart || !foundStationArri) {
      return res.status(404).send({ message: "Invalid Station !" });
    }
    const foundCar = await Car.findById(carID);
    if (!foundCar) {
      return res.status(404).send({ message: "Invalid Car" });
    }
    const foundBrand = await Brand.findById(foundCar.brandID)
    let brandName = ""
    if (!foundBrand) {
      brandName = "Mai Linh"
    } else {
      brandName = foundBrand.brandName
    }
    const arrayOfSeat = [...new Array(foundCar.numberOfSeat)].map(
      (item, index) => {
        return new Seat({
          seatName: "A" + (index + 1),
          status: "available",
        });
      }
    );


    //Ramdom----------------------------
    const hhTo = Math.floor(Math.random() * 13 + 10)
    const mmTo = Math.floor(Math.random() * 49 + 10)
    const star = (Math.random() * 4 + 1).toFixed(2)
    const countTrip = Math.floor(Math.random() * 499 + 1)
    const countHH = Math.floor(Math.random() * 47 + 1)
    const countMM = Math.floor(Math.random() * 58 + 1)
    //----------------------------

    const newTrip = new Trip({
      departurePlace,
      arrivalPlace,
      // startedDate: startedDate + " 00:00:00",
      startedDate,
      departureTime,
      arrayOfSeat,
      carID,
      price,
      departureProvice: foundStationDepart.provice,
      arrivalProvice: foundStationArri.provice,
      // statusActive: "Active",

      //Ramdom
      hhTo,
      mmTo,
      star,
      countTrip,
      countHH,
      countMM,
      brandName
      //-----------------------
    });
    const result = await newTrip.save();
    const newResult = {
      departurePlace: {
        _id: foundStationDepart._id,
        stationName: foundStationDepart.stationName,
      },
      arrivalPlace: {
        _id: foundStationArri._id,
        stationName: foundStationArri.stationName,
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
  const { tripID, arrayOfSeat, totalPrice } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const foundTrip = await Trip.findById(tripID).session(session);
    if (!foundTrip) {
      return res.status(400).send({ message: 'Invalid Trip, ID not exist!' })
    }
    let arrayOfSeatName = []
    for (let index = 0; index < arrayOfSeat.length; index++) {
      const seat = arrayOfSeat[index];
      const foundSeat = foundTrip.arrayOfSeat.findIndex(
        (item) => item._id.toString() === seat._id && item.status === 'available'
      )
      if (foundSeat === -1) {
        return res.status(400).send({ message: `Seat ${arrayOfSeat[index].seatName}: Invalid or Booked!` })
      }
      foundTrip.arrayOfSeat[foundSeat].userID = req.user._id
      foundTrip.arrayOfSeat[foundSeat].status = 'booked'
      arrayOfSeatName.push(seat.seatName)
    }
    await foundTrip.save()

    const departurePlace = await Station.findById(foundTrip.departurePlace);
    const arrivalPlace = await Station.findById(foundTrip.arrivalPlace);
    const carID = await Car.findById(foundTrip.carID)
    const newOrder = await Order.create(
      [
        {
          userID: req.user._id,
          tripID: foundTrip._id,
          arrayOfSeat: arrayOfSeatName,
          departurePlace: departurePlace.stationName,
          arrivalPlace: arrivalPlace.stationName,
          brandID: carID.brandID,
          carID: foundTrip.carID,
          totalPrice
        },
      ],
      { session }
    );
    await session.commitTransaction();
    session.endSession();
    res.status(200).send(newOrder)
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log(error)
    res.status(500).send({ message: 'Something went wrong!' })
  }
};

const getTripByProvice = async (req, res) => {
  try {
    const { departureProvice, arrivalProvice, startedDate } = req.query
    const foundTrip = await Trip.find({ departureProvice, arrivalProvice, startedDate })
      .populate("departurePlace arrivalPlace carID", "stationName licensePlate")
    res.status(200).send(foundTrip)
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: 'Something went wrong!' })
  }
}

module.exports = { postTrip, patchTrip, deleteTrip, getTrip, getAllTrip, bookTrip, getTripByProvice };
