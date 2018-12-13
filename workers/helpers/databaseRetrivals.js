const { Website, User } = require("../../database/connect").models;

async function getDatabaseInstanceForEveryURL() {
  return Website.findAll({
    attributes: ["id", "url", "onlineStatus"],
    include: [
      {
        model: User,
        required: true,
        attributes: ["name", "email", "phoneNum"]
      }
    ]
  })
    .then(result => result)
    .catch(
      () => [] // Just returning empty array to avoid conflicts where this function been used.
    );
}

module.exports = { getDatabaseInstanceForEveryURL };
