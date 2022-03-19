const Joi = require("joi");

const createMedia = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  file: Joi.string(),
});

const updateMedia = Joi.object({
  name: Joi.string().min(2).max(255),
  file: Joi.string(),
});

module.exports = {
  createMedia,
  updateMedia,
};
