const response = require("../utils/response");

const EventService = require("../services/event");
const RegistrationService = require("../services/registration");

const mailer = require("../utils/mailer");
const logger = require("../config/logger");
const { BadRequestError } = require("../lib/errors");
const { uploadBufferToCloud, deleteFromCloud } = require("../lib/cloudinary");

class EventController {

  async getPublishedEvents(req, res) {
    const events = await EventService.getPublishedEvents();
    res.send(response("Events retrieved successfully", events));
  }

  async getEventById(req, res) {
    const event = await EventService.getEventById(req.params.id, true);
    res.send(response("Event retrieved successfully", event));
  }

  async registerForEvent(req, res) {
    const eventId = req.params.id;

    const event = await EventService.getEventById(eventId, true);

    const registration = await RegistrationService.registerForEvent(
      event,
      req.body
    );

    mailer("event-registration-confirmation", {
      registrant_name: registration.name,
      reg_id: registration.reg_id,
      email: registration.email,
      event,
      responses: registration.responses,
    }).catch((err) => {
      logger.error(
        `Confirmation email failed for reg ${registration.reg_id}: ${err.message}`
      );
    });

    // Respond to the user immediately
    res.status(201).send(
      response("Registration successful! A confirmation email has been sent.", {
        reg_id: registration.reg_id,
        name: registration.name,
        email: registration.email,
        event_name: registration.event_name,
      })
    );


  }


  // _______ ADMIN ROUTES ______________________


  // Supposed to return all events (published and closed)
  async adminGetAllEvents(req, res) {
    const events = await EventService.getAllEvents();
    res.send(response("All events retrieved successfully", events));
  }

  async adminGetEventById(req, res) {
    const event = await EventService.getEventById(req.params.id, false);
    res.send(response("Event retrieved successfully", event));
  }

  // create event
  async createEvent(req, res) {
    const adminId = req.adminUser.id;

    let eventData = { ...req.body };

    if (typeof eventData.custom_fields === "string") {
      try {
        eventData.custom_fields = JSON.parse(eventData.custom_fields);
      } catch (e) {
        throw new BadRequestError(
          "custom_fields must be a valid JSON array. Example: " +
          '[{"label":"Experience","type":"dropdown","required":true,"options":["Beginner","Advanced"]}]'
        );
      }
    }

    if (req.file) {
      const uploaded = await uploadBufferToCloud(
        req.file.buffer,
        req.file.mimetype,
        "events"
      );

      if (!uploaded || !uploaded.url) {
        throw new BadRequestError("Cover image upload failed. Please try again.");
      }

      eventData.cover_image = {
        url: uploaded.url,
        public_id: uploaded.public_id,
      };
    }

    const event = await EventService.createEvent(eventData, adminId);

    res.status(201).send(response("Event created successfully", event));
  }

  // update event
  async updateEvent(req, res) {
    const eventId = req.params.id;
    let updateData = { ...req.body };

    if (typeof updateData.custom_fields === "string") {
      try {
        updateData.custom_fields = JSON.parse(updateData.custom_fields);
      } catch (e) {
        throw new BadRequestError("custom_fields must be a valid JSON array string");
      }
    }

    if (req.file) {
      const currentEvent = await EventService.getEventById(eventId, false);

      const uploaded = await uploadBufferToCloud(
        req.file.buffer,
        req.file.mimetype,
        "events"
      );

      if (!uploaded || !uploaded.url) {
        throw new BadRequestError("Cover image upload failed. Please try again.");
      }

      if (currentEvent.cover_image?.public_id) {
        const deleteResult = await deleteFromCloud(
          currentEvent.cover_image.public_id
        );
        if (deleteResult?.result !== "ok") {
          logger.warn(
            `Could not delete old cover image: ${currentEvent.cover_image.public_id}`
          );
        }
      }

      updateData.cover_image = {
        url: uploaded.url,
        public_id: uploaded.public_id,
      };
    }

    const updatedEvent = await EventService.updateEvent(eventId, updateData);
    res.send(response("Event updated successfully", updatedEvent));
  }

  // event registrations
  async getEventRegistrations(req, res) {
    const eventId = req.params.id;

    const event = await EventService.getEventById(eventId, false);

    const registrations = await RegistrationService.getRegistrationsByEvent(
      eventId
    );

    res.send(
      response(
        `Retrieved ${registrations.length} registration(s) for "${event.event_name}"`,
        {
          event: {
            id: event._id,
            event_name: event.event_name,
            status: event.status,
          },
          count: registrations.length,
          registrations,
        }
      )
    );
  }

  // lookup by regID

  async lookupByRegId(req, res) {
    const { regId } = req.params;

    if (!regId || !regId.toUpperCase().startsWith("REG-")) {
      throw new BadRequestError(
        'Invalid registration ID format. IDs must start with "REG-"'
      );
    }

    const registration = await RegistrationService.findByRegId(
      regId.toUpperCase()
    );
    res.send(response("Registration found", registration));
  }

}

module.exports = new EventController();
