const { expect } = require("chai");
const sinon = require("sinon");
const httpMocks = require("node-mocks-http");
const events = require("events");

const sequelize = require("../../database/connect");

const User = sequelize.import("../../database/models/User"); // Loading postgres models through its loading system.

const { user_signupRoutePOST } = require("../../routes/userRouteController");

describe("'/user' Route", function() {
  describe("'/user/signup' With POST", function() {
    let res;

    beforeEach(function() {
      // Creating empty response for every test with event emiiter.
      res = httpMocks.createResponse({
        eventEmitter: events.EventEmitter
      });
    });

    afterEach(() => {
      sinon.restore();
    });

    it("Should return '{sucess: false, errMsg:...} & status code 400 when request body don't contain email & password.", function() {
      const req = httpMocks.createRequest({
        method: "POST",
        body: {
          // Mocking Empty Body
        }
      });

      user_signupRoutePOST(req, res);

      const recivedData = JSON.parse(res._getData());
      expect(recivedData).to.have.deep.include({ success: false });
      expect(res.statusCode).to.equal(400);
    });

    it("Should return '{sucess: false, errMsg:...} & status code 400 when request body don't contain email.", function() {
      const req = httpMocks.createRequest({
        method: "POST",
        body: {
          password: "supersecret"
        }
      });

      user_signupRoutePOST(req, res);

      const recivedData = JSON.parse(res._getData());
      expect(recivedData).to.have.deep.include({ success: false });
      expect(res.statusCode).to.equal(400);
    });

    it("Should return '{sucess: false, errMsg:...} & status code 400 when request body don't contain password.", function() {
      const req = httpMocks.createRequest({
        method: "POST",
        body: {
          email: "example@gmail.com"
        }
      });

      user_signupRoutePOST(req, res);

      const recivedData = JSON.parse(res._getData());
      expect(recivedData).to.have.deep.include({ success: false });
      expect(res.statusCode).to.equal(400);
    });

    it("Should return '{sucess: false, errMsg:...} & status code 400 when request body don't contain valid email.", function() {
      const req = httpMocks.createRequest({
        method: "POST",
        body: {
          email: "NOT A EMAIL"
        }
      });

      user_signupRoutePOST(req, res);

      const recivedData = JSON.parse(res._getData());
      expect(recivedData).to.have.deep.include({ success: false });
      expect(res.statusCode).to.equal(400);
    });

    // ------------------------------------

    it("Should return '{sucess: false, errMsg:...} & status code 400 when provided email already exist.", function(done) {
      const req = httpMocks.createRequest({
        method: "POST",
        body: {
          email: "example@gmail.com",
          password: "supersecret"
        }
      });

      // Stubbing user model to simulate this user already exist. 1 is just magic number saying found one records in users table.
      sinon
        .stub(User, "count")
        .withArgs({ where: { email: "example@gmail.com" } })
        .resolves(1);

      res.on("end", function() {
        // using setTimeOut becuase its seam "done()"" never get called if assertion failed.
        setTimeout(() => {
          const recivedData = JSON.parse(res._getData());
          expect(recivedData).to.have.deep.include({ success: false });
          expect(res.statusCode).to.equal(400);
          done();
        }, 0);
      });

      user_signupRoutePOST(req, res, { User });
    });

    it("Should return '{sucess: false, errMsg:...} & status code 500 when querying database failed.", function(done) {
      const req = httpMocks.createRequest({
        method: "POST",
        body: {
          email: "example@gmail.com",
          password: "supersecret"
        }
      });

      // Stubbing user model to Simulate error occured when queying database.
      sinon.stub(User, "count").rejects("");

      res.on("end", function() {
        // using setTimeOut becuase its seam "done()"" never get called if assertion failed.
        setTimeout(() => {
          const recivedData = JSON.parse(res._getData());
          expect(recivedData).to.have.deep.include({ success: false });
          expect(res.statusCode).to.equal(500);
          done();
        }, 0);
      });

      user_signupRoutePOST(req, res, { User });
    });

    it("Should return '{sucess: false, errMsg:...} & status code 500 when hashing failed.", function(done) {
      const req = httpMocks.createRequest({
        method: "POST",
        body: {
          email: "example@gmail.com",
          password: "supersecret"
        }
      });

      // Stubbing user model to simulate this user don't exist. 0 is just magic number saying no user found in database.
      sinon
        .stub(User, "count")
        .withArgs({ where: { email: "example@gmail.com" } })
        .resolves(0);

      // Simulate error occured in hashing.
      const fakeBCrypt = function(password, salt, cb) {
        return cb(true);
      };

      res.on("end", function() {
        // using setTimeOut becuase its seam "done()"" never get called if assertion failed.
        setTimeout(() => {
          const recivedData = JSON.parse(res._getData());
          expect(recivedData).to.have.deep.include({ success: false });
          expect(res.statusCode).to.equal(500);
          done();
        }, 0);
      });

      user_signupRoutePOST(req, res, { User, bcrypt: fakeBCrypt });
    });

    it("Should return '{sucess: false, errMsg:...} & status code 500 when creating User failed.", function(done) {
      const req = httpMocks.createRequest({
        method: "POST",
        body: {
          email: "example@gmail.com",
          password: "supersecret"
        }
      });

      // Stubbing user model to Simulate this user don't exist. 0 is just magic number saying no user found in database.
      sinon.stub(User, "count").resolves(0);

      // Simulate error occured when user created.
      sinon
        .stub(User, "create")
        .rejects({ errors: [{ type: "My Custome DB Error" }] });

      // Simulate hasing successfully happened.
      const fakeBCrypt = {
        hash(password, salt, cb) {
          return cb(
            null,
            "$2b$10$lNKYy1pa5NuVJRr23e.zGOWB.AoJo1305lmAw2pz/X4EGUqZnNU.e" // Hash
          );
        }
      };

      res.on("end", function() {
        // using setTimeOut becuase its seam "done()"" never get called if assertion failed.
        setTimeout(() => {
          const recivedData = JSON.parse(res._getData());
          expect(recivedData).to.have.deep.include({ success: false });
          expect(res.statusCode).to.equal(500);
          done();
        }, 0);
      });

      // user_signupRoutePOST(req, res, { User: User, bcrypt: fakeBCrypt });
      user_signupRoutePOST(req, res, { User, bcrypt: fakeBCrypt });
    });

    it("Should return '{sucess: true, session:...} & status code 200 when hashing & creating User successful.", function(done) {
      const req = httpMocks.createRequest({
        method: "POST",
        body: {
          email: "example@gmail.com",
          password: "supersecret"
        }
      });

      // Stubbing user model to Simulate this user don't exist. 0 is just magic number saying no user found in database.
      sinon.stub(User, "count").resolves(0);

      // Simulate user successfully created.
      sinon.stub(User, "create").resolves({
        id: "UNIQUEID123345"
      });

      // Simulate hasing successfully happened.
      const fakeBCrypt = {
        hash(password, salt, cb) {
          return cb(
            null,
            "$2b$10$lNKYy1pa5NuVJRr23e.zGOWB.AoJo1305lmAw2pz/X4EGUqZnNU.e" // Hash
          );
        }
      };

      res.on("end", function() {
        // using setTimeOut becuase its seam "done()"" never get called if assertion failed.
        setTimeout(() => {
          const recivedData = JSON.parse(res._getData());
          expect(recivedData).to.have.deep.include({ success: true });
          expect(recivedData).to.have.key(["success", "session"]);
          expect(res.statusCode).to.equal(200);
          done();
        }, 0);
      });

      user_signupRoutePOST(req, res, { User, bcrypt: fakeBCrypt });
    });
  });
});
