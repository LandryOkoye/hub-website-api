const response = require("../utils/response");
const { generateAuthToken } = require("../utils/token");

const {
  NotFoundError,
  BadRequestError,
  UnAuthorizedError,
  DuplicateError,
} = require("../lib/errors");

const userService = require("../services/user");
const { omit } = require("lodash");

class UserController {
  async createFirstUser(req, res) {
    const users = await userService.getAllUsers();
    console.log(users);
    if (users && users.length > 0) throw new UnAuthorizedError();

    const user = await userService.create(req.body);
    const authToken = await generateAuthToken(user);
    res.send(response("User created successfully", authToken));
  }

  async getUserFromJwt(req, res) {
    const decodedData = await userService.verifyAuthToken(
      req.headers["x-auth-token"]
    );
    const user = await userService
      .findByEmail(decodedData.email)
      .select("name email");

    res.send(response("Users retrieved successfully", user));
  }

  async getAll(req, res) {
    const users = await userService.getAllUsers();

    res.send(response("Users retrieved successfully", users));
  }

  async create(req, res) {
    const existingUser = await userService.findByEmail(req.body.email);
    if (existingUser) throw new DuplicateError("Email already exists");

    await userService.create(req.body);
    res.send(response("User created successfully"));
  }

  async login(req, res) {
    const user = await userService.findByEmail(req.body.email);
    if (!user) throw new NotFoundError("Invalid email or password");

    const passwords = { input: req.body.password, hash: user.password };
    const validPassword = await userService.validPassword(passwords);
    if (!validPassword)
      throw new UnAuthorizedError("Invalid email or password");

    const authToken = await generateAuthToken(user);
    res.send(response("User login successful", authToken));
  }

  async update(req, res) {
    const user = await userService.findById(req.params?.id);
    if (!user) return res.send(response("User updated successfully"));

    let updatedUser = await userService.update(user.id, req.body);
    updatedUser = omit(updatedUser._doc, ["password", "__v"]);
    res.send(response("User updated successfully", updatedUser));
  }

  async delete(req, res) {
    await userService.delete(req.params?.id, req.body);

    res.send(response("User deleted successfully"));
  }
}

module.exports = new UserController();
