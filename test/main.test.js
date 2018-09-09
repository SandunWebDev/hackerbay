const sequelize = require("../database/connect");

after(() => {
  // sequelze connection still run even after all test are done. So test process get hanged. Therefor in here forcefully close database connection after all tests completed.
  sequelize.close();
});
