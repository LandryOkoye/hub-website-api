const router = require("express").Router();
const userRouter = require("./users");
const candidateRouter = require("./candidates");
const blogRouter = require("./blog");
const mediaRouter = require("./media");
const registrationsRouter = require("./registrations");
const eventRouter = require("./event");
const couponsRouter = require("./coupons");
const allDataRouter = require("./all");

module.exports = () => {
  router.use(userRouter());
  router.use(candidateRouter());
  router.use(blogRouter());
  router.use(mediaRouter());
  router.use(allDataRouter());
  router.use(registrationsRouter());
  router.use(eventRouter());
  router.use(couponsRouter());
  return router;
};
