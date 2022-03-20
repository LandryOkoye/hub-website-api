const router = require("express").Router();

const candidateController = require("../controllers/candidate");
const authenticate = require("../middlewares/user-auth");
const validateById = require("../middlewares/validateById");

const validateBy = require("../middlewares/validator");
const {
  registerCandidateSchema,
  updateCandidateSchema,
} = require("../validators/candidate");

module.exports = function () {
  router.get("/candidates/", authenticate, candidateController.getAll);

  router.post(
    "/candidates/",
    [validateBy(registerCandidateSchema)],
    candidateController.create
  );

  router.put(
    "/candidates/:id",
    [authenticate, validateById(), validateBy(updateCandidateSchema)],
    candidateController.update
  );

  router.delete(
    "/candidates/:id",
    [authenticate, validateById()],
    candidateController.delete
  );

  return router;
};
