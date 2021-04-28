const express = require("express");
const router = express.Router();

const {
  postTrip,
  patchTrip,
  deleteTrip,
  getTrip,
  getAllTrip,
} = require("../controllers/tripControl");

router.post("/trip", postTrip);
router.patch("/trip", patchTrip);
router.delete("/trip", deleteTrip);
router.get("/trip", getTrip);
router.get("/alltrip", getAllTrip);

module.exports = router;
