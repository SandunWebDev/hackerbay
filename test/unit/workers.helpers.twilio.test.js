const { expect } = require("chai");
const sinon = require("sinon");

const twilio = require("../../workers/helpers/twilio");

describe("Workers", () => {
  describe("Helpers - Twilio", () => {
    afterEach(() => {
      sinon.restore();
    });

    describe("sendSMS()", () => {
      it("Should get an error when necessary arguments are not provided.", async () => {
        let error = await twilio.sendSMS().catch(err => err); // Calling without "to" and "message" arguments.
        expect(error.success).to.equal(false);

        error = await twilio.sendSMS("+94761234567").catch(err => err); // Calling without "message" arguments.
        expect(error.success).to.equal(false);
      });

      it("Twilio API call Should get called with appopraite date when necessary data is provided.", async () => {
        const messages__STUB = sinon
          .stub(twilio.twilioClient.messages, "create")
          .resolves(1);

        await twilio.sendSMS("+947612345678", "Welcome");

        expect(messages__STUB.firstCall.args[0].body).to.eql("Welcome");
        expect(messages__STUB.firstCall.args[0].to).to.eql("+947612345678");
      });

      it("Should send an SMS when necessary data is provided.", async () => {
        sinon.stub(twilio.twilioClient.messages, "create").resolves(1);
        const result = await twilio.sendSMS("+947612345678", "Welcome");

        expect(result.success).to.equal(true);
        expect(result).to.haveOwnProperty("sendDetails");
      });

      it("Should send an error when some error occured while sending SMS.", async () => {
        sinon.stub(twilio.twilioClient.messages, "create").rejects(1);

        const result = await twilio.sendSMS("+947612345678", "Welcome");
        expect(result.success).to.equal(false);
      });
    });

    describe("validatePhoneNumber()", () => {
      it("Should get an error when necessary arguments are not provided.", async () => {
        const error = await twilio.validatePhoneNumber().catch(err => err); // Calling without "phoneNum" argument.
        expect(error.success).to.equal(false);
      });
    });

    describe("addTrustedNumber()", () => {
      it("Should get an error when necessary arguments are not provided.", async () => {
        const error = await twilio.addTrustedNumber().catch(err => err); // Calling without "phoneNum" argument.
        expect(error.success).to.equal(false);
      });

      it("Twilio API call Should get called with appopraite date when necessary data is provided.", async () => {
        const validationRequests__STUB = sinon
          .stub(twilio.twilioClient.validationRequests, "create")
          .resolves();

        await twilio.addTrustedNumber("+94761234567");

        expect(validationRequests__STUB.firstCall.args[0].phoneNumber).to.equal(
          "+94761234567"
        );
      });

      it("Should validate given number when necessary data is provided.", async () => {
        sinon.stub(twilio.twilioClient.validationRequests, "create").resolves();

        const result = await twilio.addTrustedNumber("+94761234567");

        expect(result.success).to.equal(true);
      });

      it("Should get an error when some error occured while validating.", async () => {
        sinon.stub(twilio.twilioClient.validationRequests, "create").rejects();

        const result = await twilio.addTrustedNumber("+94761234567");

        expect(result.success).to.equal(false);
      });
    });

    describe("makeCall()", () => {
      it("Should get an error when necessary arguments are not provided.", async () => {
        const error = await twilio.addTrustedNumber().catch(err => err); // Calling without "to" argument.
        expect(error.success).to.equal(false);
      });

      it("Twilio API call Should get called with appopraite date when necessary data is provided.", async () => {
        const makeCall__STUB = sinon
          .stub(twilio.twilioClient.calls, "create")
          .resolves();

        await twilio.makeCall("+94761234567");

        expect(makeCall__STUB.firstCall.args[0].to).to.equal("+94761234567");
      });

      it("Should make a call to given number when necessary data is provided.", async () => {
        sinon.stub(twilio.twilioClient.calls, "create").resolves(1);

        const result = await twilio.makeCall("+94761234567");
        expect(result.success).to.equal(true);
      });

      it("Should get an error when some error occured while making the call.", async () => {
        sinon.stub(twilio.twilioClient.calls, "create").rejects(1);

        const result = await twilio.makeCall("+94761234567");
        expect(result.success).to.equal(false);
      });
    });
  });
});
