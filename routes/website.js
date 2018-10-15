const express = require("express");

const { website_addRoutePOST } = require("./websiteRouteController");

const router = express.Router();

router.post("/add", website_addRoutePOST);

module.exports = router;
