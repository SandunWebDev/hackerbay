const { CronJob } = require("cron");
const {
  getDatabaseInstanceForEveryURL: getDatabaseInstanceForEveryURL__default
} = require("./helpers/databaseRetrivals");
const {
  checkWebsiteOnlineStatus: checkWebsiteOnlineStatus__default
} = require("./helpers/networkRetrivals");

const twilio = require("./helpers/twilio");

async function updateWebsitesOnlineStatus({
  // Using object destructuring & default values For testing purposes.
  getDatabaseInstanceForEveryURL = getDatabaseInstanceForEveryURL__default,
  checkWebsiteOnlineStatus = checkWebsiteOnlineStatus__default
} = {}) {
  const databaseInstanceList = await getDatabaseInstanceForEveryURL();

  databaseInstanceList.forEach(async website => {
    try {
      const URL = website.get("url");
      const phoneNum = website.get("user").get("phoneNum");
      const username = website.get("user").get("name");

      const previousWebsiteOnlineStatus = website.get("onlineStatus");
      const currentWebsiteOnlineStatus = await checkWebsiteOnlineStatus(URL);

      // Only update database and send notifcation when status change.
      if (currentWebsiteOnlineStatus !== previousWebsiteOnlineStatus) {
        // Updating database.
        website.update({
          onlineStatus: currentWebsiteOnlineStatus
        });

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
            .then(() => console.log("Message Successfully Sended."))
            .catch(() => console.log("Error Occured While Message Sending."));
        }
      }
    } catch (err) {
      // Currently if any error occured, Don't make any changes to database about website status. Simplly leave already having status.
      console.log(
        "Error Occured While Checking Website Status Or Writing To Database"
      );
    }
  });
}

updateWebsitesOnlineStatus();

const websitesOnlineStatusUpdator = new CronJob(
  "0 */1 * * * *", // Run per every one minute.
  updateWebsitesOnlineStatus
);

module.exports = { websitesOnlineStatusUpdator, updateWebsitesOnlineStatus };
