const Joi = require("joi");

const createEventValidation = Joi.object({
  name: Joi.string().min(2).max(255).required(),
});

const updateEventValidation = Joi.object({
  name: Joi.string().min(2).max(255).required(),
});

module.exports = { createEventValidation, updateEventValidation };
