const Registration = require("../models/registration");
const { NotFoundError, BadRequestError } = require("../lib/errors");
const crypto = require("crypto");

class RegistrationService {

  static generateRegId() {
    const randomPart = crypto.randomBytes(3).toString("hex").toUpperCase();
    return `REG-${randomPart}`;
  }


  static validateResponses(customFields, responses) {
    if (!customFields || customFields.length === 0) return;

    for (const field of customFields) {
      const answer = responses[field.field_id];

      const hasAnswer =
        answer !== undefined &&
        answer !== null &&
        answer !== "" &&
        !(Array.isArray(answer) && answer.length === 0);

      // Check required fields
      if (field.required && !hasAnswer) {
        throw new BadRequestError(`"${field.label}" is a required field`);
      }

      if (!hasAnswer) continue;

      if (field.type === "dropdown") {
        if (!field.options.includes(answer)) {
          throw new BadRequestError(
            `Invalid answer for "${field.label}". ` +
            `Must be one of: ${field.options.join(", ")}`
          );
        }
      }

      if (field.type === "checkbox") {
        if (!Array.isArray(answer)) {
          throw new BadRequestError(
            `Answer for "${field.label}" must be an array of selected options`
          );
        }
        const invalidChoices = answer.filter(
          (val) => !field.options.includes(val)
        );
        if (invalidChoices.length > 0) {
          throw new BadRequestError(
            `Invalid option(s) for "${field.label}": ${invalidChoices.join(", ")}. ` +
            `Valid options are: ${field.options.join(", ")}`
          );
        }
      }
    }
  }

  // register event
  static async registerForEvent(event, registrantData) {
    if (event.status !== "published") {
      throw new BadRequestError(
        "This event is not currently accepting registrations"
      );
    }

    const existing = await Registration.findOne({
      event_id: event._id,
      email: registrantData.email.toLowerCase(),
    });

    if (existing) {
      throw new BadRequestError(
        "This email address is already registered for this event"
      );
    }

    RegistrationService.validateResponses(
      event.custom_fields || [],
      registrantData.responses || {}
    );

    const reg_id = RegistrationService.generateRegId();

    const registration = new Registration({
      reg_id,
      event_id: event._id,
      event_name: event.event_name,
      name: registrantData.name,
      email: registrantData.email.toLowerCase(),
      phone: registrantData.phone,
      responses: registrantData.responses || {},
    });

    return await registration.save();
  }


  // get all registrations for an event
  static async getRegistrationsByEvent(eventId) {
    return await Registration.find({ event_id: eventId })
      .sort({ createdAt: -1 })
      .select("-__v")
      .lean();
  }

  // find by reg ID
  static async findByRegId(regId) {
    const registration = await Registration.findOne({ reg_id: regId })
      .populate("event_id", "event_name location start_datetime end_datetime status")
      .select("-__v")
      .lean();

    if (!registration) {
      throw new NotFoundError(`No registration found with ID: ${regId}`);
    }

    return registration;
  }


  static async getRegistrationCount(eventId) {
    return await Registration.countDocuments({ event_id: eventId });
  }


}

module.exports = RegistrationService;
