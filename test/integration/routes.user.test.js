const { expect } = require("chai");
const request = require("supertest");
const { User } = require("../../database/connect").models;

const app = require("../../app");

describe("'/user' Route", () => {
  describe("'/user/signup' With POST ", function() {
    beforeEach(async () => {
      // Making sure "example@gmail.com" user don't exist.
      await User.destroy({ where: { email: "example@gmail.com" } });
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
    beforeEach(async () => {
      // Making sure "example@gmail.com" user exist.
      const userAvailable = await User.count({
        where: { email: "example@gmail.com" }
      });
      if (!userAvailable) {
        await User.create({
          email: "example@gmail.com",
          password:
            "$2b$10$lNKYy1pa5NuVJRr23e.zGOWB.AoJo1305lmAw2pz/X4EGUqZnNU.e" // Hash for password "supersecret"
        });
      }

      // Making sure "dontexist@gmail.com" user doesn't exist.
      await User.destroy({ where: { email: "dontexist@gmail.com" } });
    });

    afterEach(async () => {
      // Cleaning up "example@gmail.com" user.
      await User.destroy({ where: { email: "example@gmail.com" } });
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
