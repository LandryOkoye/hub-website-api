const Joi = require("joi");

const createRegistrationValidation = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  eventCode: Joi.string().required(),
  couponCode: Joi.string(),
  ticket: Joi.string().required(),
  transaction: Joi.object({
    amount: Joi.string(),
    hasPaid: Joi.boolean(),
  }),
});

const updateRegistrationValidation = Joi.object({
  name: Joi.string().min(2).max(255),
  email: Joi.string().email(),
  phone: Joi.string(),
});

module.exports = { createRegistrationValidation, updateRegistrationValidation };
