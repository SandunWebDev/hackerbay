const bcryptModule = require("bcrypt");
const jwtModule = require("jsonwebtoken");

const { User: UserModel } = require("../database/connect").models;
const config = require("../configs/main");

module.exports.user_signupRoutePOST = (
  req,
  res,
  { User = UserModel, bcrypt = bcryptModule, jwt = jwtModule } = {} // Object destructuring for easy dependency injection.
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
    .catch(() =>
      res.status(500).json({
        success: false,
        errMsg: "Error : Database Error"
      })
    );
};
