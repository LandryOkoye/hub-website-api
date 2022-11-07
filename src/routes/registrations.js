const router = require("express").Router();

const registrationController = require("../controllers/registration");
const authenticate = require("../middlewares/user-auth");
const validateById = require("../middlewares/validateById");

const validateBy = require("../middlewares/validator");
const {
  createRegistrationValidation,
  updateRegistrationValidation,
} = require("../validators/registrations");

module.exports = function () {
  // router.get("/registrations/", authenticate, registrationController.getAll);

  router.post(
    "/registrations/",
    [validateBy(createRegistrationValidation)],
    registrationController.create
  );

  // router.put(
  //   "/registrations/:id",
  //   [authenticate, validateById(), validateBy(updateRegistrationValidation)],
  //   registrationController.update
  // );

  // router.delete(
  //   "/registrations/:id",
  //   [authenticate, validateById()],
  //   registrationController.delete
  // );

  return router;
};
