const express = require("express");
const router = express.Router();

const { signUp, signIn, getUser, updateUser, updatePassword } = require("../controllers/userControl");
const auth = require("../helpers/auth");

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get('/user', getUser);
router.post('/updateUser', auth(['user']), updateUser)
router.post('/updatePassword', auth(['user']), updatePassword)

module.exports = router;
