const { expect } = require("chai");
const request = require("supertest");
const sequelize = require("../../database/connect");

const User = sequelize.import("../../database/models/User"); // Loading postgres models through its loading system.

const app = require("../../app");

describe("'/user' Route", () => {
  describe("'/user/signup' With POST ", () => {
    beforeEach(() => {
      // Making sure "example@gmail.com" user doesn't exist.
      User.findOne({ where: { email: "example@gmail.com" } }).then(user => {
        if (user) {
          user.destroy();
        }
      });
    });

    after(() => {
      // Cleaning up "example@gmail.com" user.
      User.findOne({ where: { email: "example@gmail.com" } }).then(user => {
        if (user) {
          user.destroy();
        }
      });
    });

    it("Should return '{sucess: true, session:...} & status code 200 when user succesfully created on database.", done => {
      request(app)
        .post("/user/signup")
        .send({
          email: "example@gmail.com",
          password: "supersecret"
        })
        .expect("Content-Type", /json/)
        .end(function(err, res) {
          expect(res.statusCode).to.be.equal(200);
          expect(res.body).to.have.deep.include({ success: true });
          expect(res.body).to.have.key(["success", "session"]);
          done();
        });
    });
  });
});
