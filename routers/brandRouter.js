const express = require("express");
const {
  postBrand,
  patchBrand,
  deleteBrand,
  getBrand,
} = require("../controllers/brandControl");
const auth = require("../helpers/auth");

const router = express.Router();

router.post("/brand", postBrand);
router.patch("/brand", patchBrand);
router.delete("/brand", deleteBrand);
router.get("/brand", auth(["admin"]), getBrand);

module.exports = router;
