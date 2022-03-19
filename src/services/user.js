const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class UserService {
  getAllUsers() {
    return User.find().select("name email id");
  }

  create(user) {
    return User.create(user);
  }

  verifyAuthToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
  }

  findByEmail(email) {
    return User.findOne({ email });
  }

  findById(id) {
    return User.findById(id);
  }

  update(id, updateQuery) {
    return User.findByIdAndUpdate(id, updateQuery, { new: true });
  }

  delete(id) {
    return User.findByIdAndDelete(id);
  }

  async validPassword({ input, hash }) {
    return await bcrypt.compare(input, hash || "");
  }
}

module.exports = new UserService();
