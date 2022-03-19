const Joi = require("joi");

const signUp = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const updateUser = Joi.object({
  name: Joi.string().min(2).max(255),
  email: Joi.string().email(),
  password: Joi.string(),
});

const login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = {
  signUp,
  login,
  updateUser,
};
