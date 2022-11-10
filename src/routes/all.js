const router = require("express").Router();
const response = require("../utils/response");

const EventService = require("../services/event");
const RegistrationService = require("../services/registration");
const BlogService = require("../services/blog");
const UsersService = require("../services/user");

const authenticate = require("../middlewares/user-auth");

module.exports = function () {
  router.use("/all", authenticate, async (req, res) => {
    const events = await EventService.getAllEvents();
    const blog = await BlogService.getAllBlog();
    const users = await UsersService.getAllUsers();

    const decodedData = await UsersService.verifyAuthToken(
      req.headers["x-auth-token"]
    );
    const user = await UsersService.findByEmail(decodedData.email).select(
      "name email"
    );

    res.send(
      response("All Data retrieved successfully", {
        events,
        registrations,
        blog,
        users,
        currentUser: user,
      })
    );
  });

  router.use("/insights", async (req, res) => {
    // const media = await MediaService.getAllMediaResources();
    const blog = await BlogService.getAllBlog();

    res.send(
      response("All Data retrieved successfully", {
        // media,
        blog,
      })
    );
  });

  return router;
};
