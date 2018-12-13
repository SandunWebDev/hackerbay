const twilio = require("twilio");
const config = require("../../configs/main");

const { sid, token, number: twilioNumber } = config.twilio;

const twilioClient = twilio(sid, token);
module.exports.twilioClient = twilioClient;

module.exports.sendSMS = function sendSMS(to, message) {
  if (!to || !message) {
    return Promise.reject({
      success: false,
      error: "Necessary data is not provided."
    });
  }

  return twilioClient.messages
    .create({
      body: message,
      from: twilioNumber,
      to
    })
    .then(sendDetails => ({ success: true, sendDetails }))
    .catch(err => ({
      success: false,
      error: "Error happend while sending SMS.",
      orgError: err
    }));
};

module.exports.validatePhoneNumber = function validatePhoneNumber(phoneNum) {
  if (!phoneNum) {
    return Promise.reject({
      success: false,
      error: "Necessary data (Phone Num) is not provided."
    });
  }

  return twilioClient.lookups
    .phoneNumbers(phoneNum)
    .fetch()
    .then(result => ({
      success: true,
      verifiedPhoneNum: result.phoneNumber,
      countryCode: result.countryCode
    }))
    .catch(err => ({
      success: false,
      error: "Error happend while validating phone number.",
      orgError: err
    }));
};

module.exports.addTrustedNumber = async function addTrustedNumber(
  phoneNum,
  name
) {
  if (!phoneNum) {
    return {
      success: false,
      error: "Necessary data (Phone Number) is not provided."
    };
  }

  return twilioClient.validationRequests
    .create({
      friendlyName: name || phoneNum,
      phoneNumber: phoneNum
    })
    .then(response => ({
      success: true,
      response
    }))
    .catch(err => ({
      success: false,
      error: "Error happend while adding phone number.",
      orgError: err
    }));
};

module.exports.makeCall = function makeCall(to = "") {
  if (!to) {
    return {
      success: false,
      error: "Necessary data (Phone Number) is not provided."
    };
  }

  return twilioClient.calls
    .create({
      url: "http://demo.twilio.com/docs/voice.xml",
      to,
      from: twilioNumber
    })
    .then(call => ({
      success: true,
      response: call
    }))
    .catch(err => ({
      success: false,
      error: "Error happend while making phone call.",
      orgError: err
    }));
};
