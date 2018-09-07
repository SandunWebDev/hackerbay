const express = require("express");
const passport = require("passport");
const morgan = require("morgan");

const config = require("./configs/main");

require("./configs/passportStrategies");

const rootRoute = require("./routes/root");
const dataRoute = require("./routes/data");
const userRoute = require("./routes/user");

const app = express();

if (config.server.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

app.get("/", rootRoute);
app.use("/data", dataRoute);
app.use("/user", userRoute);

module.exports = app;
