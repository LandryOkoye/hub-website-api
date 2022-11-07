const response = require("../utils/response");
const { generateAuthToken } = require("../utils/token");

const {
  NotFoundError,
  UnAuthorizedError,
  DuplicateError,
} = require("../lib/errors");

const registrationService = require("../services/registration");
const { omit } = require("lodash");

class RegistrationController {
  async create(req, res) {
    const existingRegistration = await registrationService.findByEvent(
      req.body.email,
      req.body.eventName
    );
    if (existingRegistration)
      throw new DuplicateError("User has already registered");

    await registrationService.create(req.body);
    res.send(response("Event Registration created successfully"));
  }
}

module.exports = new RegistrationController();
