const express = require("express");
const passport = require("passport");
const morgan = require("morgan");

const config = require("./configs/main");
require("./configs/passportStrategies");
require("./database/connect");

const rootRoute = require("./routes/root");
const dataRoute = require("./routes/data");
const userRoute = require("./routes/user");

const app = express();

app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

app.get("/", rootRoute);
app.use("/data", dataRoute);
app.use("/user", userRoute);

app.listen(config.server.PORT, () =>
  console.log(
    `Server is running on "${config.server.NODE_ENV}" enviroment @ port ${
      config.server.PORT
    }.`
  )
);
