const express = require("express");
const passport = require("passport");

const { user_signupRoutePOST } = require("./userRouteController");

const router = express.Router();

router.post("/signup", user_signupRoutePOST);

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
      if (!user) return res.status(400).json({ success: false, errMsg: info });

      return res.status(200).json({
        success: true,
        session: user.token,
        name: user.name,
        email: user.email
      });
    }
  )(req, res, next);
});

module.exports = router;
