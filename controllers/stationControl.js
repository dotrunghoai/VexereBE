const Station = require("../models/stationModel");
const Trip = require("../models/tripModel");

const postStation = async (req, res) => {
  try {
    const { stationCode, stationName, stationAddress, provice } = req.body;
    const foundStation = await Station.findOne({ stationCode });
    if (foundStation) {
      return res.status(400).send({ message: "Station already exist !" });
    }
    const newStation = new Station({
      stationCode,
      stationName,
      stationAddress,
      provice,
      statusActive: "Active",
    });
    const result = await newStation.save();
    res.status(201).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong !" });
  }
};

const patchStation = async (req, res) => {
  try {
    const { stationCode, stationName, stationAddress, provice } = req.body;
    const foundStation = await Station.findOne({ stationCode });
    if (!foundStation) {
      return res.status(404).send({ message: "Invalid Station" });
    }
    foundStation.stationName = stationName;
    foundStation.stationAddress = stationAddress;
    foundStation.provice = provice;
    const result = await foundStation.save();
    res.status(202).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong !" });
  }
};

const deleteStation = async (req, res) => {
  try {
    const { stationCode } = req.query;
    const foundStation = await Station.findOne({ stationCode });
    if (!foundStation) {
      return res.status(404).send({ message: "Invalid Station" });
    }
    const findTrip = await Trip.findOne().or([
      { departurePlace: foundStation._id },
      { arrivalPlace: foundStation._id },
    ]);
    if (findTrip) {
      return res.status(400).send({ message: "Station is using !" });
    }
    foundStation.statusActive = "Inactive";
    const result = await foundStation.save();
    res.status(202).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong !" });
  }
};

const getStation = async (req, res) => {
  try {
    const findStation = await Station.find({ statusActive: 'Active' });
    res.status(200).send(findStation);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong !" });
  }
};

module.exports = { postStation, patchStation, deleteStation, getStation };
