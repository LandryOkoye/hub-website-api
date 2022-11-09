const Joi = require("joi");

const createEventValidation = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  eventCode: Joi.string().required(),
});

const updateEventValidation = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  eventCode: Joi.string(),
});

module.exports = { createEventValidation, updateEventValidation };
