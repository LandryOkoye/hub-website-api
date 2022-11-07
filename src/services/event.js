const Event = require("../models/event");

class EventService {
  getAllEvents() {
    return Event.find().select("-__v");
  }

  create(event) {
    return Event.create(event);
  }

  findById(id) {
    return Event.findById(id);
  }

  update(id, updateQuery) {
    return Event.findByIdAndUpdate(id, updateQuery, { new: true });
  }

  delete(id) {
    return Event.findByIdAndDelete(id);
  }
}

module.exports = new EventService();
