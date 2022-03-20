const response = require("../utils/response");
const { generateAuthToken } = require("../utils/token");

const {
  NotFoundError,
  UnAuthorizedError,
  DuplicateError,
} = require("../lib/errors");

const candidateService = require("../services/candidate");
const { omit } = require("lodash");

class CandidateController {
  async getCandidate(req, res) {
    const candidate = await candidateService.findById(req.params.id);
    if (!candidate) throw new NotFoundError("Invalid MediaResource Item");

    res.send(response("Candidate retrieved successfully", candidate));
  }

  async getAll(req, res) {
    const candidates = await candidateService.getAllCandidates();

    res.send(response("Candidates retrieved successfully", candidates));
  }

  async create(req, res) {
    const existingCandidate = await candidateService.findByEmail(
      req.body.email
    );
    if (existingCandidate) throw new DuplicateError("Email already exists");

    await candidateService.create(req.body);
    res.send(response("Candidate created successfully"));
  }

  async update(req, res) {
    const candidate = await candidateService.findById(req.params?.id);
    if (!candidate) return res.send(response("Candidate updated successfully"));

    let updatedCandidate = await candidateService.update(
      candidate.id,
      req.body
    );
    updatedCandidate = omit(updatedCandidate._doc, ["password", "__v"]);
    res.send(response("Candidate updated successfully", updatedCandidate));
  }

  async delete(req, res) {
    await candidateService.delete(req.params?.id, req.body);

    res.send(response("Candidate deleted successfully"));
  }
}

module.exports = new CandidateController();
