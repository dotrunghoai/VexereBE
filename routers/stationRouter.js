const express = require("express");
const router = express.Router();

const {
  postStation,
  patchStation,
  deleteStation,
  getStation,
} = require("../controllers/stationControl");

router.post("/station", postStation);
router.patch("/station", patchStation);
router.delete("/station", deleteStation);
router.get("/station", getStation);

module.exports = router;
