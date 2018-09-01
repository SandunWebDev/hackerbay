const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Loading "sequalize" instance & Connecting to database
const sequelize = require("../database/connect");
// Loading postgres models.
const User = sequelize.import("../database/models/User");

// Loading correct configurations depending on "NODE_ENV".
const config = require("../configs/main");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
      session: false // Bug - In here "session: false" don't work as documentation specify. Added it to where authentication happen. Ex: "passport.authenticacte(local, {session: false })" in "/routes/user.js" , "/login" path
    },
    (req, email, password, done) => {
      // Check if user exist by this email.
      User.findOne({ where: { email } })
        .then(user => {
          // If "user" is null mean user doesn't exist. So authentication failed.
          if (!user) {
            return done(null, false, "Error : User doesn't exist.");
          }

          // Checking if password hashes match.
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err || !isMatch) {
              // Password hashes doesn't match. So authentication failed.
              return done(null, false, "Error : Invalid password.");
            }

            if (isMatch) {
              // Password hashes match. So we create JWT token and return it.
              const token = jwt.sign({ id: user.id }, config.jwt.secretKey, {
                expiresIn: config.jwt.expiresIn
              });

              // Authentication successful. This populate "req.user" with this details.
              return done(null, { token });
            }
          });
        })
        // Error handling for "User.findOne()". Database Error.
        .catch(err => done("Error : Database Error"));
    }
  )
);
