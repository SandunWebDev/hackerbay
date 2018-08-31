const express = require("express");

const router = express.Router();

let postData = ""; // Temporary database like variable to save data we recive in "/data" POST route.

router.get("/", (req, res) => {
  res.json({ data: postData });
});

router.post("/", (req, res) => {
  postData = req.body.data;
  res.json({ data: req.body.data });
});

module.exports = router;
