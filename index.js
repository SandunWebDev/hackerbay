const app = require("./app");
const config = require("./configs/main");

require("./database/connect");

app.listen(config.server.PORT, () =>
  console.log(
    `Server is running on "${config.server.NODE_ENV}" enviroment at port ${
      config.server.PORT
    }.`
  )
);
