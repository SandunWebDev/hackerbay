const { expect } = require("chai");
const sinon = require("sinon");

const workerFn = require("../../workers/websitesOnlineStatusUpdator");

describe("Workers (Integration)", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("Cron Jobs", () => {
    describe("updateWebsitesOnlineStatus()", () => {
      it("Database Update get exeuted with appopriate data for every url provided.", async () => {
        const FAKE__databaseUpdateFn = sinon.stub();

        const tempDatabaseInstances = [
          {
            get: () => "http://google.com",
            update: FAKE__databaseUpdateFn
          },
          { get: () => "http://yahoo.com", update: FAKE__databaseUpdateFn },
          { get: () => "http://bing.com", update: FAKE__databaseUpdateFn }
        ];

        const FAKE__getDatabaseInstanceForEveryURL = sinon
          .stub()
          .returns(tempDatabaseInstances);

        const FAKE__checkWebsiteOnlineStatus = sinon
          .stub()
          .onCall(0) // For "http://google.com"
          .returns(true)
          .onCall(1) // For "http://yahoo.com"
          .returns(false)
          .onCall(2) // For "http://bing.com"
          .returns(true);

        return (
          workerFn
            .updateWebsitesOnlineStatus({
              getDatabaseInstanceForEveryURL: FAKE__getDatabaseInstanceForEveryURL,
              checkWebsiteOnlineStatus: FAKE__checkWebsiteOnlineStatus
            })
            // Asserting after function fully finished.
            .then(() => {
              expect(FAKE__getDatabaseInstanceForEveryURL.callCount).to.equal(
                1
              );
              expect(FAKE__checkWebsiteOnlineStatus.callCount).to.equal(3);

              expect(FAKE__databaseUpdateFn.callCount).to.equal(3);
              expect(
                FAKE__databaseUpdateFn.getCall(0).args[0].onlineStatus
              ).to.equal(true);
              expect(
                FAKE__databaseUpdateFn.getCall(1).args[0].onlineStatus
              ).to.equal(false);
              expect(
                FAKE__databaseUpdateFn.getCall(2).args[0].onlineStatus
              ).to.equal(true);
            })
        );
      });
    });
  });
});
