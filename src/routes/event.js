const router = require("express").Router();

const eventController = require("../controllers/event");
const authenticate = require("../middlewares/user-auth");
const validateById = require("../middlewares/validateById");

const validateBy = require("../middlewares/validator");
const {
  createEventValidation,
  updateEventValidation,
} = require("../validators/event");

module.exports = function () {
  router.get("/events/", eventController.getAll);

  router.post(
    "/events/",
    [authenticate, validateBy(createEventValidation)],
    eventController.create
  );

  router.put(
    "/events/:id",
    [authenticate, validateById(), validateBy(updateEventValidation)],
    eventController.update
  );

  // router.delete(
  //   "/events/:id",
  //   [authenticate, validateById()],
  //   eventController.delete
  // );

  return router;
};
