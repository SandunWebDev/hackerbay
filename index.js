/**
 * Main file of Node + Express back-end server.
 * This get executed when we run "npm start" and start a web server at port 3000.
 */

const express = require("express");

// Creating an instance of express app.
const app = express();

/*--- Setting up middle wares. ---*/
// Parsing POST request's body data and adding those data to "req.body"
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/*--- Routes - Defining what to do for each routes requests ---*/
app.get("/", (req, res) => {
  res.json({ status: "success" });
});

let postData = ""; // Temporary database like variable to save data we recive in "/data" POST route.

app
  .route("/data")
  .post((req, res) => {
    // Saving data outside of this scope.
    postData = req.body.data;

    res.json({ data: req.body.data });
  })
  .get((req, res) => {
    res.json({ data: postData });
  });

// Start the server and listen at port 3000.
app.listen(3000, () => console.log("Server Started At Port 3000"));
