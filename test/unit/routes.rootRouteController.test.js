const { expect } = require("chai");
const httpMocks = require("node-mocks-http");

const { rootPathGET } = require("../../routes/rootRouteController");

describe("'/' Root Path", function() {
  describe(" With GET request", function() {
    it("Should return status code 200 when successfull.", function() {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();

      rootPathGET(req, res);

      expect(res.statusCode).to.equal(200);
    });

    it("Should return JSON body containing '{status:'success'}' when successfull.", function() {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();

      rootPathGET(req, res);

      const recivedData = JSON.parse(res._getData());

      expect(recivedData).to.deep.equal({ status: "success" });
    });
  });
});
