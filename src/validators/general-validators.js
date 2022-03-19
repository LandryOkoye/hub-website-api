const Joi = require("joi");

const paramId = Joi.object({
  id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({ "string.pattern.base": "Invalid id" })
    .required(),
});

module.exports = { paramId };
