const normalizeUrl = require("normalize-url");
const parseURL = require("url-parse");
const Joi = require("joi");
const {
  User: UserModel,
  Website: WebsiteModel
} = require("../database/connect").models;

module.exports.website_addRoutePOST = (
  req,
  res,
  { Website = WebsiteModel } = {} // Object destructuring for easy dependency injection.
) => {
  const { websiteName = "", url = "" } = req.body;
  const { id: userId } = req.user;

  // Trying to normalize and make valid as much as possible.
  let finalizedURL = "";
  try {
    const normalizedURL = normalizeUrl(url, {
      stripHash: true,
      stripWWW: true,
      removeTrailingSlash: true,
      removeDirectoryIndex: true
    });

    const parsedURL = parseURL(normalizedURL);
    finalizedURL = `${parsedURL.protocol}//${parsedURL.host}`; // Only protocol + host (ex: http://google.com)
  } catch (err) {
    // This error handler for errors happen in normalizeUrl and parseUrl due to urls that not parsable at all.
    return res
      .status(400)
      .json({ status: false, errMsg: "Given URL is not valid." });
  }

  // Validating Inputs.
  const validationSchema = Joi.object().keys({
    websiteName: Joi.string()
      .alphanum()
      .required(),
    url: Joi.string().uri()
  });

  const validationResult = Joi.validate(
    { websiteName, url: finalizedURL },
    validationSchema
  );

  if (validationResult.error) {
    return res.json({
      success: false,
      errMsg: "Validation Errors.",
      originalError: validationResult
    });
  }

  Website.create({
    userId,
    websiteName,
    url: finalizedURL,
    onlineStatus: true
  })
    .then(() => {
      res.status(200).json({ sucess: true, added: finalizedURL });
    })
    .catch(err => {
      res.status(400).json({
        success: false,
        errMsg: "Validation Errors.",
        originalError: err
      });
    });
};

// Return all web sites regited to current user.
module.exports.website_listRouteGET = (
  req,
  res,
  { Website = WebsiteModel } = {} // Object destructuring for easy dependency injection.
) => {
  const { id: userId } = req.user;

  Website.findAll({
    where: { userId },
    include: [
      {
        model: UserModel,
        required: true,
        attributes: ["name", "email"]
      }
    ]
  })
    .then(result => {
      res.status(200).json(result);
    })
    .error(err => {
      res.status(400).json(err);
    });
};
