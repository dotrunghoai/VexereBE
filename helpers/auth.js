const jwt = require("jsonwebtoken");
const config = require("config");

const User = require("../models/userModel");

const auth = (roles) => async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, config.get("jwtSignature"));
    const allowRoles = roles || ["user", "admin"];
    const foundUser = await User.findOne({
      _id: decoded._id,
      tokens: token,
      role: { $in: allowRoles },
    });
    if (!foundUser) {
      return res.status(401).send({ message: "You are not authorized !" });
    }
    req.user = foundUser;
    req.token = token;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "You are not authorized !" });
  }
};

module.exports = auth;
