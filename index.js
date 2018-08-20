/**
 * Main file of Node + Express back-end server. 
 * This get executed when we run "npm start" and start a web server at port 3000. 
 */

const express = require("express");

// Creating an instance of express app.  
const app = express();

/* Routes - Defining what to do for each routes requests*/

app.get("/", (req, res)=>{
  res.json({status: "success"});
});

// Start the server and listen at port 3000.
app.listen(3000, ()=>console.log("Server Started At Port 3000"));

