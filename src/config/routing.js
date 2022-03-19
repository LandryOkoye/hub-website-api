const express = require("express");
const morgan = require("morgan");
const compression = require("compression");
const cors = require("cors");

const { NotFoundError } = require("../lib/errors");
const errorMiddleware = require("../middlewares/error");
const router = express.Router();
const routes = require("../routes/index")(router);

module.exports = (app) => {
  app.use(compression());
  app.use(morgan("dev"));

  app.use(express.static("public"));
  app.use("/api/v1/static", express.static("uploads"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use(cors());

  app.use("/ping", (req, res) => res.send(`Live`));
  app.use("/api/v1", routes);

  app.use((req, res, next) => {
    next(new NotFoundError());
  });

  app.use(errorMiddleware);

  return app;
};
