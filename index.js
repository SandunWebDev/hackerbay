const express = require("express");

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

// Start the server and listen at port 3000.
app.listen(3000, () => console.log("Server Started At Port 3000"));
