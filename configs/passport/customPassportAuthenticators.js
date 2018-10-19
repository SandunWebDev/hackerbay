const passport = require("passport");

const jwtAuthWithCustomErrorHandler = (req, res, next) => {
  passport.authenticate(
    "jwt",
    {
      session: false
    },
    (err, user, info) => {
      if (err) {
        return res.status(500).json({
          success: false,
          errMsg: "Server/Database Error",
          originalError: err
        });
      }

      // "user" not populated mean not authenticated.
      if (!user)
        return res.status(401).json({
          success: false,
          errMsg: "Invalid Token.",
          originalError: info
        });

      // Because when custom error handlers used, its our responsibilt to pass this if needed.
      req.user = user;

      next();
    }
  )(req, res, next);
};

module.exports = {
  jwtAuthWithCustomErrorHandler
};
