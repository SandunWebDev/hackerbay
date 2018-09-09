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

  describe("'/user/login' With POST + Passport ", () => {
    before(() => {
      // Making sure "example@gmail.com" user exist.
      User.findOne({ where: { email: "example@gmail.com" } }).then(user => {
        if (!user) {
          User.create({
            email: "example@gmail.com",
            password:
              "$2b$10$lNKYy1pa5NuVJRr23e.zGOWB.AoJo1305lmAw2pz/X4EGUqZnNU.e" // Hash for password "supersecret"
          });
        }
      });

      // Making sure "dontexist@gmail.com" user doesn't exist.
      User.findOne({ where: { email: "dontexist@gmail.com" } }).then(user => {
        if (user) {
          user.destroy();
        }
      });
    });

    afterEach(() => {
      // Cleaning up "example@gmail.com" user.
      User.findOne({ where: { email: "example@gmail.com" } }).then(user => {
        if (user) {
          user.destroy();
        }
      });
    });

    it("Should return '{sucess: true, session:...} & status code 200 when user succesfully logged in.", done => {
      request(app)
        .post("/user/login")
        .send({
          email: "example@gmail.com",
          password: "supersecret"
        })
        .expect("Content-Type", /json/)
        .end(function(err, res) {
          expect(res.statusCode).to.be.equal(200);
          expect(res.body).to.have.deep.include({ success: true });
          expect(res.body).to.have.key(["success", "token"]);
          done();
        });
    });

    it("Should return '{sucess: false, errMsg:...} & status code 400 when user don't exist.", done => {
      request(app)
        .post("/user/login")
        .send({
          email: "dontexist@gmail.com",
          password: "supersecret"
        })
        .expect("Content-Type", /json/)
        .end(function(err, res) {
          expect(res.statusCode).to.be.equal(400);
          expect(res.body).to.have.deep.include({ success: false });
          done();
        });
    });

    it("Should return '{sucess: false, errMsg:...} & status code 400 when password doesn't match.", done => {
      request(app)
        .post("/user/login")
        .send({
          email: "example@gmail.com",
          password: "wrongpassword"
        })
        .expect("Content-Type", /json/)
        .end(function(err, res) {
          expect(res.statusCode).to.be.equal(400);
          expect(res.body).to.have.deep.include({ success: false });
          done();
        });
    });

    it("Should return '{sucess: false, errMsg:...} & status code 400 when credentials are empty.", done => {
      request(app)
        .post("/user/login")
        .send({
          email: "",
          password: ""
        })
        .expect("Content-Type", /json/)
        .end(function(err, res) {
          expect(res.statusCode).to.be.equal(400);
          expect(res.body).to.have.deep.include({ success: false });
          done();
        });
    });

    it("Should return '{sucess: false, errMsg:...} & status code 400 when credentials are not provided.", done => {
      request(app)
        .post("/user/login")
        .send({
          email: "",
          password: ""
        })
        .expect("Content-Type", /json/)
        .end(function(err, res) {
          expect(res.statusCode).to.be.equal(400);
          expect(res.body).to.have.deep.include({ success: false });
          done();
        });
    });
  });
});
