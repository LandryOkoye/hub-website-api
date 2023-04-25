require("express-async-errors");
const express = require("express");
const app = express();

const env = require("./config/env");
const logger = require("./config/logger");

require("./config/db")();
require("./config/routing")(app);

const PORT = env.PORT || 3411;
const mode = env.NODE_ENV;

app.listen(PORT, () => {
  logger.info(`app listening at port ${PORT} in ${mode} mode`);
});
