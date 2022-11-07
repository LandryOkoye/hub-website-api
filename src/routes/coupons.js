const router = require("express").Router();

const couponsController = require("../controllers/coupons");
const authenticate = require("../middlewares/user-auth");
const validateById = require("../middlewares/validateById");

const validateBy = require("../middlewares/validator");
const { createCouponValidation } = require("../validators/coupons");

module.exports = function () {
  router.get("/coupons/", authenticate, couponsController.getAll);
  router.get("/coupons/event/:eventId", couponsController.getByEvent);

  router.post(
    "/coupons/",
    [authenticate, validateBy(createCouponValidation)],
    couponsController.create
  );

  router.delete(
    "/coupons/:id",
    [authenticate, validateById()],
    couponsController.delete
  );

  return router;
};
