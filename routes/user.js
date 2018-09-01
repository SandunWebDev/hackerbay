/*
* Routes for => /user/ path 
*/

const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Passport Strategies
const local = require("../configs/passportStrategies");

// Loading correct configurations depending on "NODE_ENV".
const config = require("../configs/main");

// Loading "sequalize" instance & Connecting to database
const sequelize = require("../database/connect");
// Loading postgres models.
const User = sequelize.import("../database/models/User");

const router = express.Router();

router.post("/signup", (req, res) => {
  const { email, password } = req.body;

  // Check we have recived the email & password in request body.
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      errMsg: "Error : Please provide email and password to login."
    });
  }

  // Check if a user is registered to this email already.
  User.count({ where: { email } })
    .then(result => {
      // result larger than 0 mean user exist already.
      if (result > 0) {
        return res.status(400).json({
          success: false,
          errMsg: "Error : User already Exist."
        });
      }

      // Came to here mean user doens't exist. So let's create new one.
      bcrypt.hash(password, 10, (err, hash) => {
        // Creating new hash from plain password.
        if (err) {
          res.status(500).json({
            success: false,
            errMsg: "Error : Server Error"
          });
        }

        // Creating new user.
        User.create({
          email,
          password: hash
        })
          .then(createdUser => {
            // Creating JWT token.
            const token = jwt.sign(
              { id: createdUser.id },
              config.jwt.secretKey,
              { expiresIn: config.jwt.expiresIn }
            );

            return res.status(200).json({
              success: true,
              session: token
            });
          })
          .catch(createErr =>
            res.status(500).json({
              success: false,
              errMsg: `Error :  ${createErr.errors[0].type}`
            })
          );
      });
    })
    // Error handling for "User.count()"
    .catch(err =>
      res.status(500).json({
        success: false,
        errMsg: "Error : Database Error"
      })
    );
});

router.post("/login", (req, res, next) => {
  passport.authenticate(
    "local",
    {
      session: false
    },
    // Passport custom error handling.
    (err, user, info) => {
      if (err) {
        return res.status(500).json({ success: false, errMsg: err });
      }

      // "user" not populated mean not authenticated.
      if (!user) return res.status(500).json({ success: false, errMsg: info });

      // User successfully authenticated.
      return res.status(200).json({ success: true, token: user.token });
    }
  )(req, res, next);
});

module.exports = router;
