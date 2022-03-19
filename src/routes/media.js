const router = require("express").Router();

const MediaController = require("../controllers/media");
const multer = require("../lib/multer");
const authenticate = require("../middlewares/user-auth");
const { createMedia, updateMedia } = require("../validators/media.js");
const validateBy = require("../middlewares/validator");
const validateById = require("../middlewares/validateById");

module.exports = function () {
  router.get("/media", authenticate, MediaController.getAllMediaResources);

  router.get(
    "/media/:id",
    [authenticate, validateById()],
    MediaController.getMediaResource
  );

  router.post(
    "/media",
    [authenticate, multer.single("file"), validateBy(createMedia)],
    MediaController.create
  );

  router.put(
    "/media/:id",
    [
      authenticate,
      multer.single("file"),
      validateById(),
      validateBy(updateMedia),
    ],
    MediaController.update
  );

  router.delete(
    "/media/:id",
    [authenticate, validateById()],
    MediaController.delete
  );

  return router;
};
