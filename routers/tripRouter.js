const express = require("express");
const router = express.Router();

const {
  postTrip,
  patchTrip,
  deleteTrip,
  getTrip,
} = require("../controllers/tripControl");

router.post("/trip", postTrip);
router.patch("/trip", patchTrip);
router.delete("/trip", deleteTrip);
router.get("/trip", getTrip);

module.exports = router;
