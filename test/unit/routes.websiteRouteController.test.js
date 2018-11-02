const { expect } = require("chai");
const sinon = require("sinon");
const httpMocks = require("node-mocks-http");
const events = require("events");

const { User, Website } = require("../../database/connect").models;

const { website_addRoutePOST } = require("../../routes/websiteRouteController");

describe("'/website/' Route", function() {
  describe("'/website/add' Route", function() {
    let res;

    beforeEach(() => {
      res = httpMocks.createResponse({
        eventEmitter: events.EventEmitter
      });
    });

    afterEach(() => {
      sinon.restore();
    });

    it("Should return status code 200 when necessary data is provided.", function(done) {
      const req = httpMocks.createRequest({
        method: "POST",
        body: {
          websiteName: "Example Web Site",
          url: "example.com"
        }
      });

      // Mocking user is authenticated by passport.
      req.user = {
        id: "ABCD!@#123"
      };

      // Stubbing database creation and making sure get called with appopriate data.
      sinon
        .stub(Website, "create")
        .withArgs({
          userId: req.user.id,
          websiteName: "Example Web Site",
          url: "http://example.com",
          onlineStatus: true
        })
        .resolves(1);

      res.on("end", function() {
        // using setTimeOut becuase its seam "done()"" never get called if assertion failed.
        setTimeout(() => {
          const recivedData = JSON.parse(res._getData());
          expect(res.statusCode).to.equal(200);
          expect(recivedData).to.have.deep.include({
            success: true,
            added: "http://example.com"
          });

          done();
        }, 0);
      });

      website_addRoutePOST(req, res);
    });

    it("Should return JSON body containing '{status:'success', added:'WEBSITEURL'}' & status code 200  when successfull.", function(done) {
      const req = httpMocks.createRequest({
        method: "POST",
        body: {
          websiteName: "Example",
          url: "example.com"
        }
      });

      // Mocking user is authenticated by passport.
      req.user = {
        id: "ABCD!@#123"
      };

      // Stubbing database creation and making sure get called with appopriate data.
      sinon
        .stub(Website, "create")
        .withArgs({
          userId: req.user.id,
          websiteName: "Example",
          url: "http://example.com",
          onlineStatus: true
        })
        .resolves(1);

      res.on("end", function() {
        // using setTimeOut becuase its seam "done()"" never get called if assertion failed.
        setTimeout(() => {
          const recivedData = JSON.parse(res._getData());

          expect(recivedData).to.have.deep.include({
            success: true,
            added: "http://example.com"
          });
          expect(res.statusCode).to.equal(200);

          done();
        }, 0);
      });

      website_addRoutePOST(req, res);
    });

    it("Should return JSON body containing '{status:'false', errMsg:'ERROR'}' & status code 400 when necessary data like 'webSiteName' is not provided.", function() {
      const req = httpMocks.createRequest({
        method: "POST",
        body: {
          // Website Name is not provided. (websiteName: "Example"),
          url: "example.com"
        }
      });

      // Mocking user is authenticated by passport.
      req.user = {
        id: "ABCD!@#123"
      };

      website_addRoutePOST(req, res);
      const recivedData = JSON.parse(res._getData());

      expect(res.statusCode).to.equal(400);
      expect(recivedData).to.contain.keys("success", "errMsg");
      expect(recivedData).to.have.deep.include({ success: false });
    });

    it("Should return JSON body containing '{status:'false', errMsg:'ERROR'}' & status code 400 when necessary data like 'url' is not provided.", function() {
      const req = httpMocks.createRequest({
        method: "POST",
        body: {
          websiteName: "Example"
          // URL is not provided. (url: "example.com")
        }
      });

      // Mocking user is authenticated by passport.
      req.user = {
        id: "ABCD!@#123"
      };

      website_addRoutePOST(req, res);
      const recivedData = JSON.parse(res._getData());

      expect(res.statusCode).to.equal(400);
      expect(recivedData).to.contain.keys("success", "errMsg");
      expect(recivedData).to.have.deep.include({ success: false });
    });

    it("Should return JSON body containing '{status:'false', errMsg:'ERROR'}' & status code 400 when provided url is not valid at all.", function(done) {
      const req = httpMocks.createRequest({
        method: "POST",
        body: {
          websiteName: "Example",
          url: "example"
        }
      });

      // Mocking user is authenticated by passport.
      req.user = {
        id: "ABCD!@#123"
      };

      res.on("end", function() {
        // using setTimeOut becuase its seam "done()"" never get called if assertion failed.
        setTimeout(() => {
          const recivedData = JSON.parse(res._getData());

          expect(res.statusCode).to.equal(400);
          expect(recivedData).to.contain.keys("success", "errMsg");
          expect(recivedData).to.have.deep.include({
            success: false
          });

          done();
        }, 0);
      });

      website_addRoutePOST(req, res);
    });

    it("Should return JSON body containing '{status:'false', errMsg:'ERROR'}' & status code 400 when some error occured in database operation.", function(done) {
      const req = httpMocks.createRequest({
        method: "POST",
        body: {
          websiteName: "Example",
          url: "example"
        }
      });

      // Mocking user is authenticated by passport.
      req.user = {
        id: "ABCD!@#123"
      };

      // Stubbing database creation to simulate error in database opertaion.
      sinon.stub(Website, "create").rejects(1);

      res.on("end", function() {
        // using setTimeOut becuase its seam "done()"" never get called if assertion failed.
        setTimeout(() => {
          const recivedData = JSON.parse(res._getData());

          expect(res.statusCode).to.equal(400);
          expect(recivedData).to.contain.keys("success", "errMsg");
          expect(recivedData).to.have.deep.include({
            success: false
          });

          done();
        }, 0);
      });

      website_addRoutePOST(req, res);
    });
  });
});
