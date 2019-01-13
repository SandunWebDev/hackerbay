require("dotenv").config(); // Loading enviroment variables from ".env" file. Pass explicit values if want to override these.

let { NODE_ENV, CORS_WHITE_LIST } = process.env;
const {
  PORT,
  DBNAME,
  DBUSERNAME,
  DBPASSWORD,
  DBHOST,
  JWTSECRET,
  JWTEXPIRES,
  TWILIO_SID,
  TWILIO_TOKEN,
  TWILIO_NUMBER
} = process.env;

NODE_ENV = NODE_ENV || "development"; // Setting up "NODE_ENV" to development if nothing passed.
CORS_WHITE_LIST = CORS_WHITE_LIST && CORS_WHITE_LIST.split(","); // Setting up "CORS_WHITE_LIST" to array if passed.

// Dirty hack to hide console.xxx in test enviroment so they don't distract test results.
if (NODE_ENV === "test") {
  console.info = () => { };
}

// All Configs
// Config Varaiable are formatted in "VAR_NAME : ENV_VALUE || DEFAULT VALUE"
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
      password: DBPASSWORD || "devadmin",
      host: DBHOST || "localhost"
    },
    jwt: {
      secretKey: JWTSECRET || "mySuperSecretsP4$$w0rD",
      expiresIn: JWTEXPIRES || "3600s"
    },
    twilio: {
      sid: TWILIO_SID || "",
      token: TWILIO_TOKEN || "",
      number: TWILIO_NUMBER || ""
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
      password: DBPASSWORD || "devadmin",
      host: DBHOST || "localhost"
    },
    jwt: {
      secretKey: JWTSECRET || "mySuperSecretsP4$$w0rD",
      expiresIn: JWTEXPIRES || "3600s"
    },
    twilio: {
      sid: TWILIO_SID || "",
      token: TWILIO_TOKEN || "",
      number: TWILIO_NUMBER || ""
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
      password: DBPASSWORD || "ADD SERVER PASSWORD HERE",
      host: DBHOST || "localhost"
    },
    jwt: {
      secretKey: JWTSECRET || "ADD SUPER JWT SECRET HERE",
      expiresIn: JWTEXPIRES || "3600s"
    },
    twilio: {
      sid: TWILIO_SID || "SECRET",
      token: TWILIO_TOKEN || "TOKEN",
      number: TWILIO_NUMBER || "NUM"
    }
  }
};

module.exports = configs[NODE_ENV];
