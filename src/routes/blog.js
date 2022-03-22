const router = require("express").Router();

const BlogController = require("../controllers/blog");
const multer = require("../lib/multer");
const authenticate = require("../middlewares/user-auth");
const { createBlogPost, updateBlogPost } = require("../validators/blog");
const validateBy = require("../middlewares/validator");
const validateById = require("../middlewares/validateById");

module.exports = function () {
  // router.post("/blog/", authenticate, BlogController.create);
  router.get("/blog", authenticate, BlogController.getAllBlogPosts);

  router.get(
    "/blog/:id",
    [validateById()],
    BlogController.getBlogPost
  );

  router.post("/blog/:id", [validateById()], BlogController.addBlogPostView);

  router.post(
    "/blog",
    [authenticate, multer.single("image"), validateBy(createBlogPost)],
    BlogController.create
  );

  router.put(
    "/blog/:id",
    [
      authenticate,
      multer.single("image"),
      validateById(),
      validateBy(updateBlogPost),
    ],
    BlogController.update
  );

  router.delete(
    "/blog/:id",
    [authenticate, validateById()],
    BlogController.delete
  );

  return router;
};
