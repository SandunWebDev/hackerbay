const Sequelize = require("sequelize");

// Loading correct configurations depending on "NODE_ENV".
const config = require("../configs/main");

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

module.exports = sequelize;
