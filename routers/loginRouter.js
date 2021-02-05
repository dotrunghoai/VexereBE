const express = require("express");
const passport = require("passport");
const facebookStrategy = require("passport-facebook-token");
const router = express.Router();
const { login } = require("../controllers/loginControl");
const User = require("../models/userModel");

passport.use(
  "fbAuth",
  new facebookStrategy(
    {
      clientID: "428444608484384",
      clientSecret: "ee16b0841e6e5f2c6285fdef6cd427ac",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const foundUser = await User.findOne({ email });
        let loginUser = foundUser;
        if (!foundUser) {
          loginUser = new User({
            email,
            role: "user",
            avatar: profile.photos[0].value,
          }).save();
        }
        done(null, loginUser);
      } catch (error) {
        done(error);
      }
    }
  )
);

router.post(
  "/login4",
  passport.authenticate("fbAuth", { session: false }),
  login
);

module.exports = router;
