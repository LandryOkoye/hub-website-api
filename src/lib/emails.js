const fs = require("fs");
const path = require("path");
const { resolve } = require("path");
const Handlebars = require("handlebars");
const baseDir = resolve("./public/emails");

let verifyEmail = fs.readFileSync(`${baseDir}/verify-email.html`).toString();

verifyEmail = Handlebars.compile(verifyEmail);


let eventRegistrationConfirmation = fs
  .readFileSync(path.join(baseDir, "event-registration-confirmation.html"))
  .toString();
eventRegistrationConfirmation = Handlebars.compile(
  eventRegistrationConfirmation
);

module.exports = {
  verifyEmail,
  eventRegistrationConfirmation,
};
