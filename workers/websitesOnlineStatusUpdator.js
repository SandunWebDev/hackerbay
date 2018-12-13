const { CronJob } = require("cron");
const {
  getDatabaseInstanceForEveryURL: getDatabaseInstanceForEveryURL__default
} = require("./helpers/databaseRetrivals");
const {
  checkWebsiteOnlineStatus: checkWebsiteOnlineStatus__default
} = require("./helpers/networkRetrivals");

const twilio__default = require("./helpers/twilio");

// Extracted this part for easy testing.
function updateWebsiteOnlineStatus__default(websiteInstance, value) {
  websiteInstance.update({
    onlineStatus: value
  });
}

function extractDetailsFromDatabaseInstance__default(websiteInstance) {
  const URL = websiteInstance.get("url");
  const phoneNum = websiteInstance.get("user").get("phoneNum");
  const username = websiteInstance.get("user").get("name");
  const previousWebsiteOnlineStatus = websiteInstance.get("onlineStatus");

  return {
    URL,
    phoneNum,
    username,
    previousWebsiteOnlineStatus
  };
}

async function updateAndNotifiy_AboutWebsiteStatus({
  // Using object destructuring & default values For testing purposes.
  getDatabaseInstanceForEveryURL = getDatabaseInstanceForEveryURL__default,
  extractDetailsFromDatabaseInstance = extractDetailsFromDatabaseInstance__default,
  checkWebsiteOnlineStatus = checkWebsiteOnlineStatus__default,
  twilio = twilio__default,
  updateWebsiteOnlineStatus = updateWebsiteOnlineStatus__default
} = {}) {
  const databaseInstanceList = await getDatabaseInstanceForEveryURL();

  // Checking each website status have changed and if changed database get updated and notofication get sended.
  return databaseInstanceList.map(async websiteInstance => {
    try {
      const {
        URL,
        phoneNum,
        username,
        previousWebsiteOnlineStatus
      } = extractDetailsFromDatabaseInstance(websiteInstance);

      const currentWebsiteOnlineStatus = await checkWebsiteOnlineStatus(URL);

      // Only update database and send notifcation when status change.
      if (currentWebsiteOnlineStatus !== previousWebsiteOnlineStatus) {
        // Updating database.
        updateWebsiteOnlineStatus(websiteInstance, currentWebsiteOnlineStatus);

        // Sending SMS notification only if user have mobile number stored.
        if (phoneNum) {
          const statusMessage = `Hi, ${username}, Your site (${URL}) ${
            currentWebsiteOnlineStatus === true ? "came online" : "went offline"
          } at ${new Date()}. - Hackerbay Team`;

          /* IMPORTATNT NOTE : Due to restrictions in Twilio Demo Account, we can't send SMS to unverified numbers and
           only two verified number creation is allowed per 72 hours.  
           
           So Testing Purposes, until twilio account is upgraded, In here we are sending SMS to pre-verified single explicit number 
           regardless of what user given for his mobile phone. 

           Once restriction lifted, Use twilio.addTrustedNumber(phoneNum) and "twilio.sendSMS(phoneNum, statusMessage)".
           */

          twilio
            .sendSMS("+94789078006", statusMessage)
            .then(() => "Message Successfully Sended.")
            .catch(() => "Error Occured While Message Sending.");
        }
      }
    } catch (err) {
      // Currently if any error occured, Don't make any changes to database about website status. Simplly leave already having status.
      console.info(
        "Error Occured While Checking Website Status Or Writing To Database"
      );
    }
  });
}

const websitesOnlineStatusUpdator = new CronJob(
  "0 */1 * * * *", // Run per every one minute.
  updateAndNotifiy_AboutWebsiteStatus
);

module.exports = {
  websitesOnlineStatusUpdator,
  updateAndNotifiy_AboutWebsiteStatus
};
