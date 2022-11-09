const Joi = require("joi");

const createCouponValidation = Joi.object({
  eventId: Joi.string()
    .regex(/^[a-zA-Z0-9]{3,30}$/)
    .required(),
  ticket: Joi.string().required(),
});

module.exports = { createCouponValidation };
