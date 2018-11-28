// const NodeCron = require("cron").CronJob;

const { CronJob } = require("cron");
const {
  getDatabaseInstanceForEveryURL: getDatabaseInstanceForEveryURL__default
} = require("./helpers/databaseRetrivals");
const {
  checkWebsiteOnlineStatus: checkWebsiteOnlineStatus__default
} = require("./helpers/networkRetrivals");

async function updateWebsitesOnlineStatus({
  // Using object destructuring & default values For testing purposes.
  getDatabaseInstanceForEveryURL = getDatabaseInstanceForEveryURL__default,
  checkWebsiteOnlineStatus = checkWebsiteOnlineStatus__default
} = {}) {
  const databaseInstanceList = await getDatabaseInstanceForEveryURL();

  databaseInstanceList.forEach(async website => {
    try {
      const URL = website.get("url");
      // Return true/false after checking online or not.
      const websiteOnlineStatus = await checkWebsiteOnlineStatus(URL);

      // Updating database.
      website.update({
        onlineStatus: websiteOnlineStatus
      });
    } catch (err) {
      // Currently if any error occured, Don't make any changes to database about website status. Simplly leave already having status.
      console.log(
        "Error Occured While Checking Website Status Or Writing To Database For ",
        URL
      );
    }
  });
}

const websitesOnlineStatusUpdator = new CronJob(
  "0 */1 * * * *", // Run per every one minute.
  updateWebsitesOnlineStatus
);

module.exports = { websitesOnlineStatusUpdator, updateWebsitesOnlineStatus };
