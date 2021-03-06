const express = require("express");
const passport = require("passport");
const morgan = require("morgan");
const cors = require("cors");

const config = require("./configs/main");

require("./configs/passport/passportStrategies");

const rootRoute = require("./routes/root");
const dataRoute = require("./routes/data");
const userRoute = require("./routes/user");
const websiteRoute = require("./routes/website");

const customPassportAuthenticators = require("./configs/passport/customPassportAuthenticators");
const {
  websitesOnlineStatusUpdator
} = require("./workers/websitesOnlineStatusUpdator");

const app = express();

if (config.server.NODE_ENV !== "test") {
  app.use(morgan("dev"));

  // Starting Cron Job For Updating All Website's Online Status in Every One Minute.
  websitesOnlineStatusUpdator.start();
}

app.use(cors({ origin: config.server.CORSWhiteList }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

app.use("/", rootRoute);
app.use("/data", dataRoute);
app.use("/user", userRoute);
app.use(
  "/website",
  customPassportAuthenticators.jwtAuthWithCustomErrorHandler,
  websiteRoute
);

app.use((err, req, res, next) => {
  res.status(500).json({ status: false, errMsg: "Server Error." });
});

app.use((req, res) => {
  res.status(404).json({ status: false, errMsg: "Requested path not found." });
});

module.exports = app;
