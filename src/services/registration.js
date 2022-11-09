const Registration = require("../models/registration");

class RegistrationService {
  getAllRegistrations() {
    return Registration.find().select("-__v");
  }

  create(registration) {
    return Registration.create(registration);
  }

  findByEvent(eventId, email) {
    return Registration.findOne({ email, event: eventId });
  }

  findById(id) {
    return Registration.findById(id);
  }

  update(id, updateQuery) {
    return Registration.findByIdAndUpdate(id, updateQuery, { new: true });
  }

  findAndUpdate = async (filter, updateQuery) => {
    return Registration.findOneAndUpdate(filter, updateQuery, {
      new: true,
    });
  };

  delete(id) {
    return Registration.findByIdAndDelete(id);
  }
}

module.exports = new RegistrationService();
