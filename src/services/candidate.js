const Candidate = require("../models/candidate");

class CandidateService {
  getAllCandidates() {
    return Candidate.find().select("-__v -public_id");
  }

  create(candidate) {
    return Candidate.create(candidate);
  }

  findByEmail(email) {
    return Candidate.findOne({ email });
  }

  findById(id) {
    return Candidate.findById(id);
  }

  update(id, updateQuery) {
    return Candidate.findByIdAndUpdate(id, updateQuery, { new: true });
  }

  delete(id) {
    return Candidate.findByIdAndDelete(id);
  }
}

module.exports = new CandidateService();
