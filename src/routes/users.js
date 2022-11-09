const router = require("express").Router();

const userController = require("../controllers/user");
const authenticate = require("../middlewares/user-auth");
const validateById = require("../middlewares/validateById");

const validateBy = require("../middlewares/validator");
const { signUp, login, updateUser } = require("../validators/user");

module.exports = function () {
  router.get("/users/", authenticate, userController.getAll);
  
  router.get("/users/me", userController.getUserFromJwt);

  router.post(
    "/users/",
    [validateBy(signUp)],
    userController.create
  );

  router.post(
    "/users/signup",
    validateBy(signUp),
    userController.createFirstUser
  );

  router.post("/users/login", validateBy(login), userController.login);

  router.put(
    "/users/:id",
    [validateById(), validateBy(updateUser)],
    userController.update
  );

  router.delete(
    "/users/:id",
    [authenticate, validateById()],
    userController.delete
  );

  return router;
};
