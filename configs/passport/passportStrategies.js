const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const extractJWT = require("passport-jwt").ExtractJwt;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const config = require("../main");
const { User } = require("../../database/connect").models;

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
            return done(null, false, "User doesn't exist.");
          }

          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err || !isMatch) {
              return done(null, false, "Invalid password.");
            }

            if (isMatch) {
              const token = jwt.sign({ id: user.id }, config.jwt.secretKey, {
                expiresIn: config.jwt.expiresIn
              });

              // Authentication successful. This populate "req.user" with this details.
              return done(null, {
                token,
                name: user.name,
                email: user.email
              });
            }
          });
        })
        .catch(() => done("Database Error"));
    }
  )
);

// JWT Token Authentication

const extractOptionsForJWT = {
  jwtFromRequest: extractJWT.fromExtractors([
    extractJWT.fromAuthHeaderAsBearerToken(),
    extractJWT.fromBodyField("token"),
    extractJWT.fromUrlQueryParameter("token")
  ]),
  secretOrKey: config.jwt.secretKey
};

passport.use(
  new JWTStrategy(extractOptionsForJWT, (jwtPayload, done) => {
    if (!jwtPayload.id) {
      return done(null, false, "Invalid Token.");
    }

    User.findById(jwtPayload.id)
      .then(user => {
        if (!user) {
          return done(null, false, "User doesn't exist Or Invalid Token.");
        }

        // Authentication successful. This populate "req.user" with database "user" object.
        return done(null, user);
      })
      .catch(() => done("Database Error"));
  })
);
