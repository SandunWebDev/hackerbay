const { sequelize } = require("../database/connect");

// Deay the test suite because otherwise database connection is not steady which result in strange errors.
// Tried various ways to solve this without initial delay, but this was the simplest.
before(function(done) {
  this.timeout(1000);
  setTimeout(() => {
    done();
  }, 500);
});

after(() => {
  // sequelze connection still run even after all test are done. So test process get hanged. Therefore in here forcefully close database connection after all tests completed.
  sequelize.close();
});
