/*
 This file contains configurations for "PRDOCUTION" and "DEVELOPMENT" enviroment.
 Pass enviroment variables is want to override these.
*/

module.exports = {
  development: {
    server: {
      PORT: process.env.PORT || 3000
    },
    database: {
      name: process.env.DBNAME || "hackerbay",
      username: process.env.DBUSERNAME || "admin",
      password: process.env.DBPASSWORD || "admin"
    }
  },
  production: {
    server: {
      PORT: process.env.PORT || 80
    },
    database: {
      name: process.env.DBNAME || "",
      username: process.env.DBUSERNAME || "",
      password: process.env.DBPASSWORD || ""
    }
  }
};
