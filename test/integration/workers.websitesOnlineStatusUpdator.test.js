const { expect } = require("chai");
const sinon = require("sinon");

const workerFn = require("../../workers/websitesOnlineStatusUpdator");

describe("Workers (Integration)", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe.only("Cron Jobs", () => {
    describe("updateAndNotifiy_AboutWebsiteStatus()", () => {
      let getDatabaseInstanceForEveryURL__STUB;
      let extractDetailsFromDatabaseInstance__STUB;
      let checkWebsiteOnlineStatus__STUB;
      let updateWebsiteInstance__STUB;
      let twilio__STUB;

      beforeEach(() => {
        // Override these in individual test case if some changes need to happen.

        // Mocking theres only one website in database.
        getDatabaseInstanceForEveryURL__STUB = sinon.stub().returns([{}]);

        // Mocking Details about current website in database.
        extractDetailsFromDatabaseInstance__STUB = sinon.stub().returns({
          URL: "http://google.com",
          phoneNum: "+94761234567",
          username: "John Doe",
          previousWebsiteOnlineStatus: true
        });

        // Mocking above website's states still same when checking again.
        checkWebsiteOnlineStatus__STUB = sinon
          .stub()
          .withArgs("http://google.com")
          .resolves(true);

        updateWebsiteInstance__STUB = sinon.stub().resolves(1);
        twilio__STUB = { sendSMS: sinon.stub().resolves(1) };
      });

      it("Database updates and Notification sending Should happen for each URL in the database according to there state change.", async () => {
        // Mocking theres multiple websites in database.
        getDatabaseInstanceForEveryURL__STUB = sinon
          .stub()
          .returns([{}, {}, {}]); // Three URLS

        // Mocking Details about current websites in database.
        extractDetailsFromDatabaseInstance__STUB = sinon
          .stub()
          .onCall(0)
          .returns({
            URL: "http://google.com",
            phoneNum: "+94761234567",
            username: "John Doe",
            previousWebsiteOnlineStatus: false
          })
          .onCall(1)
          .returns({
            URL: "http://yahoo.com",
            phoneNum: "+94767854895",
            username: "Rayan Bottom",
            previousWebsiteOnlineStatus: true
          })
          .onCall(2)
          .returns({
            URL: "http://yahoo.com",
            phoneNum: "+94768421574",
            username: "Nicolos Femmel",
            previousWebsiteOnlineStatus: true
          });

        // Mocking above website's states "CHANGED" or not when checking.
        // (2 State Changes and One Remain Same)
        checkWebsiteOnlineStatus__STUB = sinon
          .stub()
          .onCall(0)
          .resolves(true) // State changed false to true.
          .onCall(1)
          .resolves(true) // State NOT changed.
          .onCall(2)
          .resolves(false); // State changed true to false.

        return workerFn
          .updateAndNotifiy_AboutWebsiteStatus({
            getDatabaseInstanceForEveryURL: getDatabaseInstanceForEveryURL__STUB,
            extractDetailsFromDatabaseInstance: extractDetailsFromDatabaseInstance__STUB,
            checkWebsiteOnlineStatus: checkWebsiteOnlineStatus__STUB,
            twilio: twilio__STUB,
            updateWebsiteOnlineStatus: updateWebsiteInstance__STUB
          })
          .then(arrayOfPromises =>
            // Asserting after function fully finished.
            Promise.all(arrayOfPromises).then(() => {
              expect(getDatabaseInstanceForEveryURL__STUB.callCount).to.equal(
                1
              );
              expect(
                extractDetailsFromDatabaseInstance__STUB.callCount
              ).to.equal(3);

              // Only two exution becuase there was only two state changes.
              expect(updateWebsiteInstance__STUB.callCount).to.equal(2);
              expect(twilio__STUB.sendSMS.callCount).to.equal(2);
            })
          );
      });

      it("Database updates and Notification sending Shouldn't happen when website's state stays same.", async () =>
        workerFn
          .updateAndNotifiy_AboutWebsiteStatus({
            getDatabaseInstanceForEveryURL: getDatabaseInstanceForEveryURL__STUB,
            extractDetailsFromDatabaseInstance: extractDetailsFromDatabaseInstance__STUB,
            checkWebsiteOnlineStatus: checkWebsiteOnlineStatus__STUB,
            twilio: twilio__STUB,
            updateWebsiteOnlineStatus: updateWebsiteInstance__STUB
          })
          .then(arrayOfPromises =>
            // Asserting after function fully finished.
            Promise.all(arrayOfPromises).then(() => {
              expect(updateWebsiteInstance__STUB.callCount).to.equal(0);
              expect(twilio__STUB.sendSMS.callCount).to.equal(0);
            })
          ));

      it("Database updates and Notification sending Should happen when website's state are different.", async () => {
        // Mocking above website's states "CHANGED" when checking again.
        checkWebsiteOnlineStatus__STUB = sinon
          .stub()
          .withArgs("http://google.com")
          .resolves(false); // Prevoiusly true, Now False

        return workerFn
          .updateAndNotifiy_AboutWebsiteStatus({
            getDatabaseInstanceForEveryURL: getDatabaseInstanceForEveryURL__STUB,
            extractDetailsFromDatabaseInstance: extractDetailsFromDatabaseInstance__STUB,
            checkWebsiteOnlineStatus: checkWebsiteOnlineStatus__STUB,
            twilio: twilio__STUB,
            updateWebsiteOnlineStatus: updateWebsiteInstance__STUB
          })
          .then(arrayOfPromises =>
            // Asserting after function fully finished.
            Promise.all(arrayOfPromises).then(() => {
              expect(updateWebsiteInstance__STUB.callCount).to.equal(1);
              expect(twilio__STUB.sendSMS.callCount).to.equal(1);
            })
          );
      });

      it("Database updates and Notification sending Shouldn't happen when any error occured.", async () => {
        // Mocking an error
        checkWebsiteOnlineStatus__STUB = sinon
          .stub()
          .withArgs("http://google.com")
          .rejects(1);

        return workerFn
          .updateAndNotifiy_AboutWebsiteStatus({
            getDatabaseInstanceForEveryURL: getDatabaseInstanceForEveryURL__STUB,
            extractDetailsFromDatabaseInstance: extractDetailsFromDatabaseInstance__STUB,
            checkWebsiteOnlineStatus: checkWebsiteOnlineStatus__STUB,
            twilio: twilio__STUB,
            updateWebsiteOnlineStatus: updateWebsiteInstance__STUB
          })
          .then(arrayOfPromises =>
            // Asserting after function fully finished.
            Promise.all(arrayOfPromises).then(() => {
              expect(updateWebsiteInstance__STUB.callCount).to.equal(0);
              expect(twilio__STUB.sendSMS.callCount).to.equal(0);
            })
          );
      });

      it("SMS notification Shouldn't get sended when user don't have a mobile number saved.", async () => {
        extractDetailsFromDatabaseInstance__STUB = sinon.stub().returns({
          URL: "http://google.com",
          phoneNum: "", // Mocking NO MOBILE NUMBER.
          username: "John Doe",
          previousWebsiteOnlineStatus: false
        });

        // Mocking above website's states "CHANGED" when checking again.
        checkWebsiteOnlineStatus__STUB = sinon
          .stub()
          .withArgs("http://google.com")
          .resolves(true);

        return workerFn
          .updateAndNotifiy_AboutWebsiteStatus({
            getDatabaseInstanceForEveryURL: getDatabaseInstanceForEveryURL__STUB,
            extractDetailsFromDatabaseInstance: extractDetailsFromDatabaseInstance__STUB,
            checkWebsiteOnlineStatus: checkWebsiteOnlineStatus__STUB,
            twilio: twilio__STUB,
            updateWebsiteOnlineStatus: updateWebsiteInstance__STUB
          })
          .then(arrayOfPromises =>
            // Asserting after function fully finished.
            Promise.all(arrayOfPromises).then(() => {
              expect(twilio__STUB.sendSMS.callCount).to.equal(0);
            })
          );
      });

      it("SMS notification with appopriate message Should get sended when user have a mobile number saved. (When Goes Offline)", async () => {
        extractDetailsFromDatabaseInstance__STUB = sinon.stub().returns({
          URL: "http://google.com",
          phoneNum: "+94761234567", // Mocking Mobile Number is saved.
          username: "John Doe",
          previousWebsiteOnlineStatus: true // Mocking initially online
        });

        checkWebsiteOnlineStatus__STUB = sinon
          .stub()
          .withArgs("http://google.com")
          .resolves(false); // Mocking website came online.

        return workerFn
          .updateAndNotifiy_AboutWebsiteStatus({
            getDatabaseInstanceForEveryURL: getDatabaseInstanceForEveryURL__STUB,
            extractDetailsFromDatabaseInstance: extractDetailsFromDatabaseInstance__STUB,
            checkWebsiteOnlineStatus: checkWebsiteOnlineStatus__STUB,
            twilio: twilio__STUB,
            updateWebsiteOnlineStatus: updateWebsiteInstance__STUB
          })
          .then(arrayOfPromises =>
            // Asserting after function fully finished.
            Promise.all(arrayOfPromises).then(() => {
              expect(twilio__STUB.sendSMS.callCount).to.equal(1);
              expect(
                twilio__STUB.sendSMS.firstCall.args[1].includes("went offline")
              ).to.equal(true);
            })
          );
      });

      it("SMS notification with appopriate message Should get sended when user have a mobile number saved. (When Goes Online)", async () => {
        extractDetailsFromDatabaseInstance__STUB = sinon.stub().returns({
          URL: "http://google.com",
          phoneNum: "+94761234567", // Mocking Mobile Number is saved.
          username: "John Doe",
          previousWebsiteOnlineStatus: false // Mocking initially offline
        });

        checkWebsiteOnlineStatus__STUB = sinon
          .stub()
          .withArgs("http://google.com")
          .resolves(true); // Mocking website came online.

        return workerFn
          .updateAndNotifiy_AboutWebsiteStatus({
            getDatabaseInstanceForEveryURL: getDatabaseInstanceForEveryURL__STUB,
            extractDetailsFromDatabaseInstance: extractDetailsFromDatabaseInstance__STUB,
            checkWebsiteOnlineStatus: checkWebsiteOnlineStatus__STUB,
            twilio: twilio__STUB,
            updateWebsiteOnlineStatus: updateWebsiteInstance__STUB
          })
          .then(arrayOfPromises =>
            // Asserting after function fully finished.
            Promise.all(arrayOfPromises).then(() => {
              expect(twilio__STUB.sendSMS.callCount).to.equal(1);
              expect(
                twilio__STUB.sendSMS.firstCall.args[1].includes("came online")
              ).to.equal(true);
            })
          );
      });
    });
  });
});
