const { expect } = require("chai");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const { User, Website } = require("../../database/connect").models;
const config = require("../../configs/main");

const app = require("../../app");

describe("'/website' Route", () => {
  let tempToken;
  let userId;

  before(async () => {
    // Creating temporary user to generate token so we can authenticated protected path.
    const tempUser = await User.create({
      name: "tempUser",
      email: "tempuser@gmail.com",
      password: "123456",
      phoneNum: "+94761234567"
    });

    userId = tempUser.id;

    tempToken = jwt.sign({ id: tempUser.id }, config.jwt.secretKey, {
      expiresIn: config.jwt.expiresIn
    });
  });

  after(async () => {
    // Cleaning up "tempuser@gmail.com" user.
    await User.destroy({ where: { email: "tempuser@gmail.com" } });
  });

  describe("'/website/add' With POST ", function() {
    beforeEach(async () => {
      // Make sure there is no "Example - example.com" entry when starting.
      await Website.destroy({ where: { url: "http://example.com" } });
      await Website.destroy({ where: { websiteName: "Example" } });
    });

    it("Should return '{success: true, added:...} & status code 200 when user is authenticated and website record succesfully created on database.", done => {
      request(app)
        .post("/website/add")
        .send({
          websiteName: "Example",
          url: "example.com",
          token: tempToken
        })
        .expect("Content-Type", /json/)
        .end(function(err, res) {
          expect(res.statusCode).to.be.equal(200);
          expect(res.body.success).to.be.equal(true);
          expect(res.body.added).to.have.deep.include({
            websiteName: "Example",
            url: "http://example.com"
          });
          expect(res.body).to.have.key(["success", "added"]);

          // Make sure recored is added to database.
          Website.count({ where: { url: "http://example.com" } }).then(
            result => {
              expect(result).to.be.equal(1);
            }
          );
          done();
        });
    });

    it("Should return '{success: false, errMsg:...} & status code 401 when user is NOT authenticated.", done => {
      request(app)
        .post("/website/add")
        .send({
          websiteName: "Example",
          url: "example.com",
          token: "AAAAA" // User is not autheticated
        })
        .expect("Content-Type", /json/)
        .end(function(err, res) {
          expect(res.statusCode).to.be.equal(401);
          expect(res.body).to.have.deep.include({
            success: false
          });
          expect(res.body).to.have.key(["success", "errMsg", "originalError"]);

          done();
        });
    });
  });

  describe("'/website/list' With GET ", function() {
    it("Should return '{success: true, result:[EMPTY ARRAY]} & status code 200 when user is authenticated & current user don't have any web site registered.", done => {
      request(app)
        .get(`/website/list?token=${tempToken}`)
        .expect("Content-Type", /json/)
        .end(function(err, res) {
          expect(res.statusCode).to.be.equal(200);
          expect(res.body).to.have.deep.include({
            success: true,
            result: []
          });

          done();
        });
    });

    describe("", () => {
      beforeEach(async () => {
        // Adding few website entries to current user.
        await Website.create({
          userId,
          websiteName: "ExampleA",
          url: "http://exampleA.com",
          onlineStatus: true
        });

        await Website.create({
          userId,
          websiteName: "ExampleB",
          url: "http://exampleB.com",
          onlineStatus: true
        });
      });

      afterEach(async () => {
        // Cleaning up current users entries
        await Website.destroy({ where: { url: "http://exampleA.com" } });
        await Website.destroy({ where: { url: "http://exampleB.com" } });
      });

      it("Should return '{success: true, result:[{},{},...}]} & status code 200 when user is authenticated & current user have some web site registered.", done => {
        request(app)
          .get(`/website/list?token=${tempToken}`)
          .expect("Content-Type", /json/)
          .end(function(err, res) {
            expect(res.statusCode).to.be.equal(200);
            expect(res.body).to.have.deep.include({
              success: true
            });
            expect(res.body.result.length).to.equal(2);

            done();
          });
      });
    });

    it("Should return '{success: false, errMsg:...} & status code 401 when user is NOT authenticated.", done => {
      request(app)
        .get(`/website/list?token=${"INVALID TOKEN "}`)
        .expect("Content-Type", /json/)
        .end(function(err, res) {
          expect(res.statusCode).to.be.equal(401);
          expect(res.body).to.have.deep.include({
            success: false
          });
          expect(res.body).to.have.key(["success", "errMsg", "originalError"]);

          done();
        });
    });
  });
});
