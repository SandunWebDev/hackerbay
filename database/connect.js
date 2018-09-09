const Sequelize = require("sequelize");

const config = require("../configs/main");

// Becaue in test enviroment logging SQL command dirty the result report.
const enableSqlLogging = config.server.NODE_ENV !== "test";

// Connecting & Configuring database credentials.
const sequelize = new Sequelize(
  config.database.name,
  config.database.username,
  config.database.password,
  {
    dialect: "postgres",
    logging: enableSqlLogging,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Generating all models.
const models = {};
models.User = require("./models/User")(sequelize, Sequelize);

// Create table structure if they not exist.
sequelize.sync();

module.exports = {
  sequelize,
  models
};
