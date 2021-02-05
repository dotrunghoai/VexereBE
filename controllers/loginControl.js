const jwt = require("jsonwebtoken");
const config = require("config");

const login = async (req, res) => {
  try {
    const token = jwt.sign(
      {
        _id: req.user._id,
      },
      config.get("jwtSignature")
    );
    res.status(201).send(token);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong !" });
  }
};

module.exports = { login };
