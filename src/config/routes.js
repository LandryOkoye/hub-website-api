const router = require("express").Router();
const userRouter = require("../routes/users");
const candidateRouter = require("../routes/candidates");
const blogRouter = require("../routes/blog");
const webhookRouter = require("../routes/webhooks");
const allDataRouter = require("../routes/all");
const registrationsRouter = require("../routes/registrations");
const eventRouter = require("../routes/event");
const couponsRouter = require("../routes/coupons");

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
