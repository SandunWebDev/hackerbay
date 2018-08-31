const express = require("express");

// Loading correct configurations depending on "NODE_ENV".
const NODE_ENV = process.env.NODE_ENV || "development";
const config = require("./configs/main")[NODE_ENV];

console.log(config);
const app = express();

// Parsing POST request's body data and adding those data to "req.body"
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* --- Routes  ---*/
app.get("/", (req, res) => {
  res.json({ status: "success" });
});

let postData = ""; // Temporary database like variable to save data we recive in "/data" POST route.

app
  .route("/data")
  .post((req, res) => {
    postData = req.body.data;
    res.json({ data: req.body.data });
  })
  .get((req, res) => {
    res.json({ data: postData });
  });

// Start the server.
app.listen(config.server.PORT, () =>
  console.log(
    `Server is running on "${NODE_ENV}" enviroment @ port ${
      config.server.PORT
    }.`
  )
);
