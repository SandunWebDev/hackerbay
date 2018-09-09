const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const config = require("../configs/main");
const { User } = require("../database/connect").models;

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
      session: false // Bug - In here "session: false" don't work as documentation specify. Add it to where authentication happen. Ex: "passport.authenticacte(local, {session: false })".
    },
    (req, email, password, done) => {
      User.findOne({ where: { email } })
        .then(user => {
          if (!user) {
            return done(null, false, "Error : User doesn't exist.");
          }

          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err || !isMatch) {
              return done(null, false, "Error : Invalid password.");
            }

            if (isMatch) {
              const token = jwt.sign({ id: user.id }, config.jwt.secretKey, {
                expiresIn: config.jwt.expiresIn
              });

              // Authentication successful. This populate "req.user" with this details.
              return done(null, { token });
            }
          });
        })
        .catch(() => done("Error : Database Error"));
    }
  )
);
