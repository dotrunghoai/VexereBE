const express = require("express");
const multer = require("multer");
const { uploadAvatar } = require("../controllers/uploadControl");
const auth = require("../helpers/auth");
const router = express.Router();
const upload = multer({
  storage: multer.diskStorage({
    destination: "images4",
    filename(req, file, done) {
      const name = Date.now() + "_" + file.originalname;
      done(null, name);
    },
  }),
});

router.post("/upload3", auth(), upload.single("data2"), uploadAvatar);

module.exports = router;
