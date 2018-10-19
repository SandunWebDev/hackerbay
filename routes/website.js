const express = require("express");

const {
  website_addRoutePOST,
  website_listRouteGET
} = require("./websiteRouteController");

const router = express.Router();

router.post("/add", website_addRoutePOST);
router.get("/list", website_listRouteGET);

module.exports = router;
