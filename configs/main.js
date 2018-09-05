/* Pass enviroment variables is want to override these. */

// Setting up "NODE_ENV".
const NODE_ENV =
  process.env.NODE_ENV === "production" ? "production" : "development";

// All Configs
const configs = {
  development: {
    server: {
      NODE_ENV,
      PORT: process.env.PORT || 3000
    },
    database: {
      name: process.env.DBNAME || "hackerbay",
      username: process.env.DBUSERNAME || "devadmin",
      password: process.env.DBPASSWORD || "devadmin"
    },
    jwt: {
      secretKey: process.env.JWTSECRET || "mySuperSecretsP4$$w0rD",
      expiresIn: process.env.JWTEXPIRES || "60s"
    }
  },

  production: {
    server: {
      NODE_ENV,
      PORT: process.env.PORT || 80
    },
    database: {
      name: process.env.DBNAME || "ADD SERVER DBNAME HERE",
      username: process.env.DBUSERNAME || "ADD SERVER USERNAME HERE",
      password: process.env.DBPASSWORD || "ADD SERVER PASSWORD HERE"
    },
    jwt: {
      secretKey: process.env.JWTSECRET || "ADD SUPER JWT SECRET HERE",
      expiresIn: process.env.JWTEXPIRES || "ADD JWT EXPIRE DATE HERE"
    }
  }
};

module.exports = configs[NODE_ENV];
