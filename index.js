const express = require("express");
const passport = require("passport");

// Loading "sequalize" instance & Connecting to database
const sequelize = require("./database/connect");

// Loading Routes
const dataRoute = require("./routes/data");
const userRoute = require("./routes/user");

// Loading correct configurations depending on "NODE_ENV".
const config = require("./configs/main");

const app = express();

// Parsing POST request's body data and adding those data to "req.body"
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

/* --- Routes  ---*/
app.get("/", (req, res) => res.json({ status: "success" }));
app.use("/data", dataRoute);
app.use("/user", userRoute); // Contain user signup, login paths.

// Start the server.
app.listen(config.server.PORT, () =>
  console.log(
    `Server is running on "${config.NODE_ENV}" enviroment @ port ${
      config.server.PORT
    }.`
  )
);
