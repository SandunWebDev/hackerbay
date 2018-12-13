const axios = require("axios");

async function checkWebsiteOnlineStatus(url = "") {
  const websiteHTTPStatusValue = await axios
    .get(url)
    .then(r => r.status)
    .catch(() => false);

  // For now just making online only if status is 200.
  if (websiteHTTPStatusValue === 200) {
    return true;
  }

  return false;
}

module.exports = { checkWebsiteOnlineStatus };
