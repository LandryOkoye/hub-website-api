const response = require("../utils/response");

const eventService = require("../services/event");
const registrationService = require("../services/registration");

class EventController {
  async getAll(req, res) {
    const events = await eventService.getAllEvents();
    res.send(response("All Events retrieved successfully", events));
  }
  async create(req, res) {
    await eventService.create(req.body);
    res.send(response("Event was created successfully"));
  }
  async update(req, res) {
    const event = await eventService.findById(req.params?.id);
    if (!event) return res.send(response("Event updated successfully"));

    let updatedEvent = await eventService.update(event.id, req.body);
    res.send(response("Event updated successfully", updatedEvent));
  }
  async getEventRegistrations(req, res) {
    const registrations = await registrationService.findEventRegistrations(
      req.params.eventId
    );

    res.send(
      response("Event Registrations retrieved successfully", registrations)
    );
  }
}

module.exports = new EventController();
