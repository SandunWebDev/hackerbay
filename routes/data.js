const express = require("express");

const router = express.Router();

const { dataRouteGET, dataRoutePOST } = require("./dataRouteController");

router.get("/", dataRouteGET);

router.post("/", dataRoutePOST);

module.exports = router;
