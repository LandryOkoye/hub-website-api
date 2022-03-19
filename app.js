require("express-async-errors");
const express = require("express");
const app = express();

const env = require("./src/config/env");
const logger = require("./src/config/logger");

require("./src/config/db")();
require("./src/config/routing")(app);

const PORT = env.PORT;
const mode = env.NODE_ENV;

app.listen(PORT, () => {
  logger.info(`app listening at port ${PORT} in ${mode} mode`);
});
