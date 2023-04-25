const router = require("express").Router();
const userRouter = require("./users");
const candidateRouter = require("./candidates");
const blogRouter = require("./blog");
const webhookRouter = require("./webhooks");
const allDataRouter = require("./all");
const registrationsRouter = require("./registrations");
const eventRouter = require("./event");
const couponsRouter = require("./coupons");

module.exports = () => {
  router.use(userRouter());
  router.use(candidateRouter());
  router.use(blogRouter());
  router.use(webhookRouter());
  router.use(allDataRouter());
  router.use(registrationsRouter());
  router.use(eventRouter());
  router.use(couponsRouter());
  return router;
};

