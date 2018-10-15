const Sequelize = require("sequelize");

const config = require("../configs/main");

// Because in test enviroment logging SQL command dirty the result report.
// Also new sequalze version prefer function instead of just saying "true" for logging. Thats why using "console.log".
const enableSqlLogging =
  config.server.NODE_ENV !== "test" ? console.log : false;

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
models.User = require("./models/Website")(sequelize, Sequelize);

// Create table structure if they not exist.
sequelize.sync();

module.exports = {
  sequelize,
  models
};
