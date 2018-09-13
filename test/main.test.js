// Initializing database connection here to make sure its successfully connected when test are stareted.
const { sequelize } = require("../database/connect");

// Deay the test suite because otherwise above database connection is not steady which result in strange errors.
// Tried various ways to solve this without initial delay, but this was the simplest.
before("Root level 'before' hook to initilaze database", done => {
  setTimeout(() => {
    done();
  }, 500);
});

after("Root level 'after' hook to close database connection", () => {
  // sequelze connection still run even after all test are done. So test process get hanged. Therefore in here forcefully close database connection after all tests completed.
  sequelize.close();
});
