const { expect } = require("chai");
const httpMocks = require("node-mocks-http");

const {
  dataRouteGET,
  dataRoutePOST
} = require("../../routes/dataRouteController");
const { tempStorage } = require("../../routes/dataRouteController");

describe("'/data' Route", function() {
  afterEach(function() {
    tempStorage.data = ""; // Making sure initially no data is saved.
  });

  describe("With GET request", function() {
    it("Should return status code 200 when saved 'data' is available.", function() {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();

      tempStorage.data = "TESTDATA"; // Mocking saved data

      dataRouteGET(req, res);

      expect(res.statusCode).to.equal(200);
    });

    it("Should return status code 400 when saved 'data' is not available.", function() {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();

      dataRouteGET(req, res);

      expect(res.statusCode).to.equal(400);
    });

    it("Should return JSON body contating '{data:'TEMPDATA'}' when saved 'data' is available.", function() {
      const req = httpMocks.createRequest({
        method: "POST",
        body: {
          data: "TESTDATA"
        }
      });
      const res = httpMocks.createResponse();

      dataRoutePOST(req, res);

      const recivedData = JSON.parse(res._getData());

      expect(recivedData).to.deep.equal({ data: "TESTDATA" });
    });
  });

  describe("With POST request", function() {
    it("Should return status code 200 when req body has String 'data'.", function() {
      const req = httpMocks.createRequest({
        method: "POST",
        body: {
          data: "TESTDATA"
        }
      });
      const res = httpMocks.createResponse();

      dataRoutePOST(req, res);

      expect(res.statusCode).to.equal(200);
    });

    it("Should return status code 400 when req body don't have any 'data'.", function() {
      const req = httpMocks.createRequest({
        method: "POST",
        body: {}
      });
      const res = httpMocks.createResponse();

      dataRoutePOST(req, res);

      expect(res.statusCode).to.equal(400);
    });

    it("Should return JSON body contating '{data:'TEMPDATA'}' when req body has string 'data'.", function() {
      const req = httpMocks.createRequest({
        method: "POST",
        body: {
          data: "TESTDATA"
        }
      });
      const res = httpMocks.createResponse();

      dataRoutePOST(req, res);

      const recivedData = JSON.parse(res._getData());

      expect(recivedData).to.deep.equal({ data: "TESTDATA" });
    });

    it("Should return status code 400 when req body 'data' is Empty OR not a String .", function() {
      const multipleDataTypes = ["", 200, true, { age: 20 }, null, undefined];

      // Iterating over each dataType and send request. Simplly track if all requests are recived 400 or not.
      const allRequestAre400 = multipleDataTypes.every(data => {
        const req = httpMocks.createRequest({
          method: "POST",
          body: {
            data
          }
        });
        const res = httpMocks.createResponse();

        dataRoutePOST(req, res);

        if (res.statusCode === 400) {
          return true;
        }
        return false;
      });

      expect(allRequestAre400).to.equal(true);
    });
  });
});
