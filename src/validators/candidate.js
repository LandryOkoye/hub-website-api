const Joi = require("joi");

const registerCandidateSchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .regex(/^(\+234|0)[7-9]\d{9}$/)
    .message("Phone Number must be Nigerian")
    .required(),
});

const updateCandidateSchema = Joi.object({
  name: Joi.string().min(2).max(255),
  email: Joi.string().email(),
  phone: Joi.string()
    .regex(/^(\+234|0)[7-9]\d{9}$/)
    .message("Phone Number must be Nigerian"),
});

module.exports = {
  registerCandidateSchema,
  updateCandidateSchema,
};
