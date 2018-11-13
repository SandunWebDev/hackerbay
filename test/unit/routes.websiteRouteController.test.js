const { expect } = require("chai");
const sinon = require("sinon");
const httpMocks = require("node-mocks-http");
const events = require("events");

const { Website } = require("../../database/connect").models;

const {
  website_addRoutePOST,
  website_deleteRouteDELETE,
  website_listRouteGET
} = require("../../routes/websiteRouteController");

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
          expect(res.statusCode).to.equal(200);
          done();
        }, 0);
      });

      website_addRoutePOST(req, res);
    });

    it("Should return JSON body containing '{status:'success', added:'{....}'}' & status code 200  when successfull.", function(done) {
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
            success: true
          });
          expect(recivedData).to.have.property("added");
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

  describe("'/website/delete' Route", function() {
    let res;

    beforeEach(() => {
      res = httpMocks.createResponse({
        eventEmitter: events.EventEmitter
      });
    });

    afterEach(() => {
      sinon.restore();
    });

    it("Should return status code 200 when necessary data is provided and successfully deleted.", function(done) {
      const req = httpMocks.createRequest({
        method: "DELETE",
        body: {
          websiteItemId: "123ABC"
        }
      });

      // Mocking user is authenticated by passport.
      req.user = {
        id: "ABCD!@#123"
      };

      // Mocking value returned by findById
      const findById_ReturnValue = {
        destroy: () => Promise.resolve(1)
      };

      // Stubbing database findById and making sure get called with appopriate data.
      sinon
        .stub(Website, "findById")
        .withArgs("123ABC")
        .resolves(findById_ReturnValue);

      res.on("end", function() {
        // using setTimeOut becuase its seam "done()"" never get called if assertion failed.
        setTimeout(() => {
          expect(res.statusCode).to.equal(200);
          done();
        }, 0);
      });

      website_deleteRouteDELETE(req, res);
    });

    it("Should return JSON body containing '{status:true, deletedWebsiteItemId:'ITEMID'}' & status code 200  when successfull.", function(done) {
      const req = httpMocks.createRequest({
        method: "DELETE",
        body: {
          websiteItemId: "123ABC"
        }
      });

      // Mocking user is authenticated by passport.
      req.user = {
        id: "ABCD!@#123"
      };

      // Mocking value returned by findById
      const findById_ReturnValue = {
        destroy: () => Promise.resolve(1)
      };

      // Stubbing database findById and making sure get called with appopriate data.
      sinon
        .stub(Website, "findById")
        .withArgs("123ABC")
        .resolves(findById_ReturnValue);

      res.on("end", function() {
        // using setTimeOut becuase its seam "done()"" never get called if assertion failed.
        setTimeout(() => {
          const recivedData = JSON.parse(res._getData());

          expect(res.statusCode).to.equal(200);
          expect(recivedData).to.have.deep.include({
            success: true,
            deletedWebsiteItemId: "123ABC"
          });
          done();
        }, 0);
      });

      website_deleteRouteDELETE(req, res);
    });

    it("Should return JSON body containing '{status:'false', errMsg:'ERROR'}' & status code 400 when necessary data like 'websiteItemId' is not provided.", function() {
      const req = httpMocks.createRequest({
        method: "DELETE",
        body: {
          // mocking websiteItemId is not provided.
        }
      });

      // Mocking user is authenticated by passport.
      req.user = {
        id: "ABCD!@#123"
      };

      website_deleteRouteDELETE(req, res);

      const recivedData = JSON.parse(res._getData());

      expect(res.statusCode).to.equal(400);
      expect(recivedData).to.contain.keys("success", "errMsg");
      expect(recivedData).to.have.deep.include({ success: false });
    });

    it("Should return JSON body containing '{status:'false', errMsg:'ERROR'}' & status code 400 when some error occured in database like provided item id not exist", function(done) {
      const req = httpMocks.createRequest({
        method: "DELETE",
        body: {
          websiteItemId: "123ABC"
        }
      });

      // Mocking user is authenticated by passport.
      req.user = {
        id: "ABCD!@#123"
      };

      // Stubbing database findById to reject
      sinon
        .stub(Website, "findById")
        .withArgs("123ABC")
        .rejects(1);

      res.on("end", function() {
        // using setTimeOut becuase its seam "done()"" never get called if assertion failed.
        setTimeout(() => {
          const recivedData = JSON.parse(res._getData());

          expect(res.statusCode).to.equal(400);
          expect(recivedData).to.contain.keys("success", "errMsg");
          expect(recivedData).to.have.deep.include({ success: false });
          done();
        }, 0);
      });

      website_deleteRouteDELETE(req, res);
    });

    it("Should return JSON body containing '{status:'false', errMsg:'ERROR'}' & status code 400 when some error occured in database while deleting user.", function(done) {
      const req = httpMocks.createRequest({
        method: "DELETE",
        body: {
          websiteItemId: "123ABC"
        }
      });

      // Mocking user is authenticated by passport.
      req.user = {
        id: "ABCD!@#123"
      };

      // Mocking value returned by findById to reject to simulate deleting failed.
      const findById_ReturnValue = {
        destroy: () => Promise.rejects(1)
      };

      // Stubbing database findById and making sure get called with appopriate data.
      sinon
        .stub(Website, "findById")
        .withArgs("123ABC")
        .resolves(findById_ReturnValue);

      res.on("end", function() {
        // using setTimeOut becuase its seam "done()"" never get called if assertion failed.
        setTimeout(() => {
          const recivedData = JSON.parse(res._getData());

          expect(res.statusCode).to.equal(400);
          expect(recivedData).to.contain.keys("success", "errMsg");
          expect(recivedData).to.have.deep.include({ success: false });
          done();
        }, 0);
      });

      website_deleteRouteDELETE(req, res);
    });
  });

  describe("'/website/list' Route", function() {
    let res;

    beforeEach(() => {
      res = httpMocks.createResponse({
        eventEmitter: events.EventEmitter
      });
    });

    afterEach(() => {
      sinon.restore();
    });

    it("Should return status code 200 & array of web sites for current user when successful.", function(done) {
      const req = httpMocks.createRequest({
        method: "GET"
      });

      // Mocking user is authenticated by passport.
      req.user = {
        id: "ABCD!@#123"
      };

      // Stubbing database quering and simulating return of array of website data for current user.
      sinon.stub(Website, "findAll").resolves([{}, {}]);

      res.on("end", function() {
        // using setTimeOut becuase its seam "done()"" never get called if assertion failed.
        setTimeout(() => {
          const recivedData = JSON.parse(res._getData());
          expect(res.statusCode).to.equal(200);
          expect(recivedData).to.have.deep.include({
            success: true,
            result: [{}, {}]
          });

          done();
        }, 0);
      });

      website_listRouteGET(req, res);
    });

    it("Should return status code 400 when error occured in database operation. ", function(done) {
      const req = httpMocks.createRequest({
        method: "GET"
      });

      // Mocking user is authenticated by passport.
      req.user = {
        id: "ABCD!@#123"
      };

      // Stubbing database quering and simulating database operation error.
      sinon.stub(Website, "findAll").rejects("My Error");

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

      website_listRouteGET(req, res);
    });
  });
});
