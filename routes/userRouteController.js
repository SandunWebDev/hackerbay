const bcryptModule = require("bcrypt");
const jwtModule = require("jsonwebtoken");

const sequelize = require("../database/connect");
const config = require("../configs/main");

const UserModel = sequelize.import("../database/models/User"); // Loading postgres models through its loading system.

module.exports.user_signupRoutePOST = (
  req,
  res,
  { User = UserModel, bcrypt = bcryptModule, jwt = jwtModule } = {}
) => {
  const { email, password } = req.body;

  // Check we have recived the email & password in request body.
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      errMsg: "Error : Please provide email and password to login."
    });
  }

  // Check if a user is registered to this email already. If not create one.
  User.count({ where: { email } })
    .then(result => {
      if (result > 0) {
        return res.status(400).json({
          success: false,
          errMsg: "Error : User already Exist."
        });
      }
      // Creating new hash, user & token.
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          res.status(500).json({
            success: false,
            errMsg: "Error : Server Error"
          });
        }

        User.create({
          email,
          password: hash
        })
          .then(createdUser => {
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
          .catch(createErr => {
            res.status(500).json({
              success: false,
              errMsg: `Error :  ${createErr.errors[0].type}`
            });
          });
      });
    })
    // Error handling for "User.count()"
    .catch(err =>
      res.status(500).json({
        success: false,
        errMsg: "Error : Database Error"
      })
    );
};
