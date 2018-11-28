const { expect } = require("chai");
const sinon = require("sinon");

const moment = require("moment");
const axios = require("axios");

const { Website } = require("../../database/connect").models;
const {
  websitesOnlineStatusUpdator
} = require("../../workers/websitesOnlineStatusUpdator");
const {
  checkWebsiteOnlineStatus
} = require("../../workers/helpers/networkRetrivals");
const {
  getDatabaseInstanceForEveryURL
} = require("../../workers/helpers/databaseRetrivals");

describe("Workers", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("Cron Jobs", () => {
    describe("websiteOnlineStatusUpdator()", () => {
      it("Cron Job Should be excuted for every minute.", () => {
        const nextFiveExecutionTime = websitesOnlineStatusUpdator.nextDates(5);

        // Checking theres consective five execution within one minute gaps.
        nextFiveExecutionTime.forEach((exTime, id) => {
          const isExutionTimeEqual = exTime.isSame(
            moment().add(id + 1, "m"),
            "minute"
          );

          expect(isExutionTimeEqual).to.equal(true);
        });
      });
    });
  });

  describe("Helpers", () => {
    describe("getDatabaseInstanceForEveryURL()", () => {
      it("Should return promise result when successfull.", async () => {
        const result = [1, 2, 3];

        sinon.stub(Website, "findAll").resolves(result);

        expect(await getDatabaseInstanceForEveryURL()).to.equal(result);
      });

      it("Should return empty array when error occured", async () => {
        sinon.stub(Website, "findAll").rejects(1);
        expect((await getDatabaseInstanceForEveryURL()).length).to.equal(0);
      });
    });

    describe("checkWebsiteOnlineStatus()", () => {
      it("Should be called with provided URL.", async () => {
        const axiosStub = sinon.stub(axios, "get").resolves({ status: 200 });

        await checkWebsiteOnlineStatus("http://google.com");

        expect(axiosStub.alwaysCalledWith("http://google.com")).to.equal(true);
      });

      it("Should return true when website is online (Meaning when status code is 200)", async () => {
        sinon.stub(axios, "get").resolves({ status: 200 });
        expect(await checkWebsiteOnlineStatus("http://google.com")).to.equal(
          true
        );
      });

      it("Should return false when website is offline (Meaning when status code is otherthan 200)", async () => {
        sinon.stub(axios, "get").resolves({ status: 400 });
        expect(await checkWebsiteOnlineStatus("http://google.com")).to.equal(
          false
        );
      });
    });
  });
});
