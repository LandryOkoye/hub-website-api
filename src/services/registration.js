const Registration = require("../models/registration");

class RegistrationService {
  getAllRegistrations() {
    return Registration.find().select("-__v");
  }

  create(registration) {
    return Registration.create(registration);
  }

  findByEvent(email, eventName) {
    return Registration.findOne({ email, eventName });
  }

  findById(id) {
    return Registration.findById(id);
  }

  update(id, updateQuery) {
    return Registration.findByIdAndUpdate(id, updateQuery, { new: true });
  }

  delete(id) {
    return Registration.findByIdAndDelete(id);
  }
}

module.exports = new RegistrationService();
