const express = require("express");
const router = express.Router();
const auth = require("../helpers/auth");

const {
  postTrip,
  patchTrip,
  deleteTrip,
  getTrip,
  getAllTrip,
  bookTrip
} = require("../controllers/tripControl");

router.post("/trip", postTrip);
router.patch("/trip", patchTrip);
router.delete("/trip", deleteTrip);
router.get("/trip", getTrip);
router.get("/alltrip", getAllTrip);
router.post('/bookTrip', auth(['user', 'admin']), bookTrip)

module.exports = router;
