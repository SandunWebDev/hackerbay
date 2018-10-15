const request = require("supertest");

const app = require("../../app");

// Note - Below integration test are for just to experiment integration tests. All these test cases already cover in unit tests.

describe("'/' Root Path", function() {
  describe("with GET request", function() {
    it("Should return status code 200 when successfull.", function(done) {
      request(app)
        .get("/")
        .expect(200, done);
    });

    it("Should return JSON body containing 'status:sucess' when successfull.", function(done) {
      request(app)
        .get("/")
        .expect({ status: "success" }, done);
    });
  });
});
