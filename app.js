const express = require("express");
const bodyParser = require("body-parser");
const config = require("config");
const path = require("path");
const cors = require("cors");

const routerBrand = require("./routers/brandRouter");
const routerCar = require("./routers/carRouter");
const routerStation = require("./routers/stationRouter");
const routerTrip = require("./routers/tripRouter");
const routerUser = require("./routers/userRouter");
const routerUpload = require("./routers/uploadRouter");
const routerLogin = require("./routers/loginRouter");

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
  })
);
app.use(bodyParser.json());
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(routerBrand);
app.use(routerCar);
app.use(routerStation);
app.use(routerTrip);
app.use(routerUser);
app.use(routerUpload);
app.use(routerLogin);

require("./db/connect");

// const port = config.get("port");
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Listening...");
});
