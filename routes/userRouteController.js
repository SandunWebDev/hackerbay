// Previously used "bcrypt" module, but there was strange crashes without any error due to it. So for now just using "bcryptjs" module.
const bcryptModule = require("bcryptjs");
const jwtModule = require("jsonwebtoken");

const { User: UserModel } = require("../database/connect").models;
const config = require("../configs/main");

module.exports.user_signupRoutePOST = (
  req,
  res,
  { User = UserModel, bcrypt = bcryptModule, jwt = jwtModule } = {} // Object destructuring for easy dependency injection.
) => {
  const { name, email, password, phoneNum } = req.body;

  // Check we have recived the email & password in request body.
  if (!email || !password || !name || !phoneNum) {
    return res.status(400).json({
      success: false,
      errMsg: "Name / Email / Password / Phone not provided."
    });
  }

  // Check if a user is registered to this email already. If not create one.
  User.count({ where: { email } })
    .then(result => {
      if (result > 0) {
        return res.status(400).json({
          success: false,
          errMsg: "User already Exist."
        });
      }
      // Creating new hash, user & token.
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          res.status(500).json({
            success: false,
            errMsg: "Server Error"
          });
        }

        User.create({
          name,
          email,
          password: hash,
          phoneNum
        })
          .then(createdUser => {
            const token = jwt.sign(
              { id: createdUser.id },
              config.jwt.secretKey,
              { expiresIn: config.jwt.expiresIn }
            );

            return res.status(200).json({
              success: true,
              session: token,
              name,
              email
            });
          })
          .catch(createErr => {
            res.status(500).json({
              success: false,
              errMsg: `${createErr.errors[0].type}`
            });
          });
      });
    })
    // Error handling for "User.count()"
    .catch(() =>
      res.status(500).json({
        success: false,
        errMsg: "Database Error"
      })
    );
};
