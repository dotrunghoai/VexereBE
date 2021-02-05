const express = require("express");
const router = express.Router();

const {
  postCar,
  patchCar,
  deleteCar,
  getCar,
} = require("../controllers/carControl");

router.post("/car", postCar);
router.patch("/car", patchCar);
router.delete("/car", deleteCar);
router.get("/car", getCar);

module.exports = router;
