const router = require("express").Router();

const eventController = require("../controllers/event");
const authenticate = require("../middlewares/user-auth");
const validateById = require("../middlewares/validateById");
const requireAdmin = require("../middlewares/admin-auth");
const { handleCoverImageUpload } = require("../middlewares/cloudinary-upload");

const validateBy = require("../middlewares/validator");
const {
  createEventValidation,
  updateEventValidation,
  createRegistrationValidation,
} = require("../validators/event");

module.exports = function () {
  router.get("/events/", eventController.getPublishedEvents); // TODO: make sure the "getPublishedEvents" method is implemented

  router.get(
    "/events/:id",
    eventController.getEventById  // TODO: make sure the "getEventById" method is implemented
  );

  router.post(
    "/events/:id/register",
    [validateBy(createRegistrationValidation)],
    eventController.registerForEvent // TODO: make sure the "registerForEvent" method is implemented
  );


  // _____ ADMIN ROUTES ________

  // gets all published events
  router.get(
    "/admin/events",
    [requireAdmin],
    eventController.adminGetAllEvents
  );

  // This feature is for admins to be able to get a registrants by their registration id
  router.get(
    "/admin/registrations/lookup/:regId",
    [requireAdmin],
    eventController.lookupByRegId
  );

  // creates an event
  router.post(
    "/admin/events",
    [requireAdmin, handleCoverImageUpload, validateBy(createEventValidation)],
    eventController.createEvent
  );

  // updates an event
  router.put(
    "/admin/events/:id",
    [requireAdmin, handleCoverImageUpload, validateBy(updateEventValidation)],
    eventController.updateEvent
  );

  // gets all registrations for an event
  router.get(
    "/admin/events/:id/registrations",
    [requireAdmin],
    eventController.getEventRegistrations
  );


  // router.delete(
  //   "/events/:id",
  //   [authenticate, validateById()],
  //   eventController.delete
  // );

  return router;
};
