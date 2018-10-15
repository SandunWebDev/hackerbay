const {
  User: UserModel,
  Website: WebsiteModel
} = require("../database/connect").models;

module.exports.website_addRoutePOST = (
  req,
  res,
  { User = UserModel, WebSite = WebsiteModel } = {} // Object destructuring for easy dependency injection.
) => {
  const { websiteName, url } = req.body;
  const { id: userId } = req.user;

  res.status(200).json({ userId, websiteName, url });
};
