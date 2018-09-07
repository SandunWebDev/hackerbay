const express = require("express");

const { rootPath_GET } = require("./rootRouteController");

const router = express.Router();

router.get("/", rootPath_GET);

module.exports = router;
