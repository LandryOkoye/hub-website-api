require("express-async-errors");
const express = require("express");
const app = express();

const env = require("../src/config/env");
const logger = require("../src/config/logger");

require("../src/config/db")();
require("../src/config/routing")(app);

const PORT = env.PORT || 3500;
const mode = env.NODE_ENV;

app.listen(PORT, () => {
  logger.info(`app listening at port ${PORT} in ${mode} mode`);
});

const morgan = require("morgan");
const compression = require("compression");
const cors = require("cors");

const { NotFoundError } = require("../src/lib/errors");
const errorMiddleware = require("../src/middlewares/error");
const router = express.Router();
const routes = require("../src/routes")(router);

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
