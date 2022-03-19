const { UnAuthorizedError } = require("../lib/errors");
const userService = require("../services/user");

const getToken = (req) => req.headers["x-auth-token"];

const authenticate = async function (req, res, next) {
  const token = getToken(req);
  if (!token) throw new UnAuthorizedError();
  try {
    const decoded = await userService.verifyAuthToken(
      req.headers["x-auth-token"]
    );

    const user = await userService.findByEmail(decoded.email);

    if (!user) throw new UnAuthorizedError();

    req.user = user;
    next();
  } catch (error) {
    const errors = ["TokenExpiredError", "NotBeforeError", "JsonWebTokenError"];
    if (errors.includes(error?.name)) {
      throw new UnAuthorizedError();
    }
    next(error);
  }
};

module.exports = authenticate;
