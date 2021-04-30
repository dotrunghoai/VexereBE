const express = require("express");
const router = express.Router();

const { signUp, signIn, getUser } = require("../controllers/userControl");

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get('/user', getUser)

module.exports = router;
