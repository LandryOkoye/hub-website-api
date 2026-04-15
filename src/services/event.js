const Event = require("../models/event");
const { NotFoundError, BadRequestError } = require("../lib/errors");
const crypto = require("crypto");

class EventService {

  // get published events
  static async getPublishedEvents() {
    return await Event.find({ status: "published" })
      .sort({ start_datetime: 1 })
      .select("-__v")
      .lean();
  }

  // create event
  static async createEvent(eventData, adminId) {
    const start = new Date(eventData.start_datetime);
    const end = new Date(eventData.end_datetime);

    if (end <= start) {
      throw new BadRequestError(
        "End date/time must be after start date/time"
      );
    }

    const custom_fields = (eventData.custom_fields || []).map((field) => ({
      ...field,
      field_id: field.field_id || `field_${crypto.randomBytes(4).toString("hex")}`,
    }));

    const event = new Event({
      event_name: eventData.event_name,
      description: eventData.description,
      category: eventData.category,
      location: eventData.location,
      start_datetime: start,
      end_datetime: end,
      cover_image: eventData.cover_image || null,
      status: eventData.status || "published",
      custom_fields,
      created_by: adminId,
    });

    return await event.save();
  }

  // get all events
  static async getAllEvents() {
    return await Event.find()
      .sort({ createdAt: -1 })
      .select("-__v")
      .lean();
  }

  // get event by id
  static async getEventById(eventId, publicOnly = false) {
    const event = await Event.findById(eventId).select("-__v").lean();

    if (!event) {
      throw new NotFoundError("Event not found");
    }

    if (publicOnly && event.status !== "published") {
      throw new NotFoundError("Event not found");
    }

    return event;
  }

  // update event
  static async updateEvent(eventId, updateData) {
    if (updateData.start_datetime) {
      updateData.start_datetime = new Date(updateData.start_datetime);
    }
    if (updateData.end_datetime) {
      updateData.end_datetime = new Date(updateData.end_datetime);
    }

    if (updateData.start_datetime && updateData.end_datetime) {
      if (updateData.end_datetime <= updateData.start_datetime) {
        throw new BadRequestError("End date/time must be after start date/time");
      }
    }

    if (updateData.custom_fields) {
      updateData.custom_fields = updateData.custom_fields.map((field) => ({
        ...field,
        field_id: field.field_id || `field_${crypto.randomBytes(4).toString("hex")}`,
      }));
    }

    const updated = await Event.findByIdAndUpdate(
      eventId,
      updateData,
      { new: true, runValidators: true }
    )
      .select("-__v")
      .lean();

    if (!updated) {
      throw new NotFoundError("Event not found");
    }

    return updated;
  }

  // delete event
  static async deleteEvent(eventId) {
    const deleted = await Event.findByIdAndDelete(eventId).lean();
    if (!deleted) {
      throw new NotFoundError("Event not found");
    }
    return deleted;
  }
}

module.exports = EventService;
