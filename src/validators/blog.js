const Joi = require("joi");

const createBlogPost = Joi.object({
  title: Joi.string().min(2).max(255).required(),
  image: Joi.string(),
  readingTime: Joi.number().greater(0),
  author: Joi.string(),
  altText: Joi.string(),
  content: Joi.string().required(),
  status: Joi.alternatives(["Published", "Draft"]).required(),
  publishDate: Joi.string().required(),
});

const updateBlogPost = Joi.object({
  title: Joi.string().min(2).max(255),
  image: Joi.string(),
  readingTime: Joi.number().greater(0),
  author: Joi.string(),
  altText: Joi.string(),
  content: Joi.string(),
  status: Joi.alternatives(["Published", "Draft"]),
  publishDate: Joi.string(),
});

module.exports = {
  createBlogPost,
  updateBlogPost,
};
