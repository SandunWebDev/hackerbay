/* Pass enviroment variables if want to override these. */

let {
  NODE_ENV,
  PORT,
  CORS_WHITE_LIST,
  DBNAME,
  DBUSERNAME,
  DBPASSWORD,
  JWTSECRET,
  JWTEXPIRES
} = process.env;

NODE_ENV = NODE_ENV || "development"; // Setting up "NODE_ENV" to development if nothing passed.
CORS_WHITE_LIST = CORS_WHITE_LIST && CORS_WHITE_LIST.split(","); // Setting up "CORS_WHITE_LIST" to array if passed.

// Dirty hack to hide console.xxx in test enviroment so they don't distract test results.
if (NODE_ENV === "test") {
  console.info = () => {};
}

// All Configs
const configs = {
  development: {
    server: {
      NODE_ENV,
      PORT: PORT || 4000,
      CORSWhiteList: CORS_WHITE_LIST || ["http://localhost:3000"]
    },
    database: {
      name: DBNAME || "hackerbay",
      username: DBUSERNAME || "devadmin",
      password: DBPASSWORD || "devadmin"
    },
    jwt: {
      secretKey: JWTSECRET || "mySuperSecretsP4$$w0rD",
      expiresIn: JWTEXPIRES || "3600s"
    }
  },

  test: {
    server: {
      NODE_ENV,
      PORT: PORT || 4000,
      CORSWhiteList: CORS_WHITE_LIST || ["http://localhost:3000"]
    },
    database: {
      name: DBNAME || "hackerbay",
      username: DBUSERNAME || "devadmin",
      password: DBPASSWORD || "devadmin"
    },
    jwt: {
      secretKey: JWTSECRET || "mySuperSecretsP4$$w0rD",
      expiresIn: JWTEXPIRES || "3600s"
    }
  },

  production: {
    server: {
      NODE_ENV,
      PORT: PORT || 80,
      CORSWhiteList: CORS_WHITE_LIST || []
    },
    database: {
      name: DBNAME || "ADD SERVER DBNAME HERE",
      username: DBUSERNAME || "ADD SERVER USERNAME HERE",
      password: DBPASSWORD || "ADD SERVER PASSWORD HERE"
    },
    jwt: {
      secretKey: JWTSECRET || "ADD SUPER JWT SECRET HERE",
      expiresIn: JWTEXPIRES || "3600s"
    }
  }
};

module.exports = configs[NODE_ENV];
