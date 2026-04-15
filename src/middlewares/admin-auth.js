// Middleware that protects admin-only routes using JWT + role checking.

const jwt = require("jsonwebtoken");
const env = require("../config/env");
const { UnAuthorizedError, ForbiddenError } = require("../lib/errors");

/**
 * requireAdmin
 * -------------
 * Express middleware that:
 *   1. Reads the JWT from the x-auth-token header
 *   2. Verifies its signature using JWT_SECRET_KEY
 *   3. Checks the decoded payload has role === "admin"
 *   4. Attaches the decoded payload to req.adminUser
 *
 * Usage in a route file:
 *   const requireAdmin = require("../middlewares/admin-auth");
 *   router.post("/events", [requireAdmin], eventController.create);
 *
 * @throws {UnAuthorizedError} if no token, invalid token, or expired token
 * @throws {ForbiddenError}    if token is valid but user is not an admin
 */
const requireAdmin = (req, res, next) => {
    const token = req.headers["x-auth-token"];

    if (!token) {
        return next(new UnAuthorizedError("Access denied. No token provided."));
    }

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET_KEY);

        if (decoded.role !== "admin") {
            return next(
                new ForbiddenError(
                    "Access denied. Admin privileges required."
                )
            );
        }

        req.adminUser = decoded;

        next();

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return next(
                new UnAuthorizedError("Session expired. Please log in again.")
            );
        }
        if (
            error.name === "JsonWebTokenError" ||
            error.name === "NotBeforeError"
        ) {
            return next(new UnAuthorizedError("Invalid token. Please log in again."));
        }

        next(error);
    }
};

module.exports = requireAdmin;