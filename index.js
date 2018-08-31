const express = require("express");
const Sequelize = require("sequelize");

// Loading Routes
const dataRoute = require("./routes/data");

// Loading correct configurations depending on "NODE_ENV".
const NODE_ENV =
  process.env.NODE_ENV === "production" ? "production" : "development";
const config = require("./configs/main")[NODE_ENV];

// Connecting & Configuring database credentials.
const sequelize = new Sequelize(
  config.database.name,
  config.database.username,
  config.database.password,
  {
    dialect: "postgres"
  }
);

// Checking databse connection.
sequelize
  .authenticate()
  .then(() => {
    console.log(
      `Successfully connected to "${config.database.name}" database as "${
        config.database.username
      }" user.`
    );
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });

// Loading postgres models.
const User = sequelize.import(`${__dirname}/database/models/User`);

const app = express();

// Parsing POST request's body data and adding those data to "req.body"
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* --- Routes  ---*/
app.get("/", (req, res) => res.json({ status: "success" }));
app.use("/data", dataRoute);

// Start the server.
app.listen(config.server.PORT, () =>
  console.log(
    `Server is running on "${NODE_ENV}" enviroment @ port ${
      config.server.PORT
    }.`
  )
);
