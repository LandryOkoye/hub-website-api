const mongoose = require("mongoose");
const env = require("./env");
const logger = require("./logger");

const db = env.DB_URI;

module.exports = () => {
  mongoose
    .connect(db)
    .then(() => {
      logger.info(`Connected to ${db}`);
    })
    .catch((err) => {
      return logger.error(err.message);
    });
};
