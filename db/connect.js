const mongoose = require("mongoose");
const config = require("config");

const dbURL = config.get("dbURL");

mongoose
  .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(console.log("Connect Cloud MongoDB Success !"))
  .catch(console.log);
