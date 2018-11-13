const express = require("express");

const {
  website_addRoutePOST,
  website_deleteRouteDELETE,
  website_listRouteGET
} = require("./websiteRouteController");

const router = express.Router();

router.post("/add", website_addRoutePOST);
router.delete("/delete", website_deleteRouteDELETE);
router.get("/list", website_listRouteGET);

module.exports = router;
