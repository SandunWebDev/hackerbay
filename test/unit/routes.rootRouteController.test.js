const { expect } = require("chai");
const httpMocks = require("node-mocks-http");

const { rootPath_GET } = require("../../routes/rootRouteController");

describe("'/' Root Path", function() {
  describe(" with GET request", function() {
    it("Should return 'statusCode:200' when successfull.", function() {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();

      rootPath_GET(req, res);

      expect(res.statusCode).to.equal(200);
    });

    it("Should return JSON body containing 'status:sucess' when successfull.", function() {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();

      rootPath_GET(req, res);

      const recivedData = JSON.parse(res._getData());

      expect(recivedData).to.deep.equal({ status: "success" });
    });
  });
});
