const express = require("express");

const { rootPathGET } = require("./rootRouteController");

const router = express.Router();

router.get("/", rootPathGET);

module.exports = router;
