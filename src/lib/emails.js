const fs = require("fs");
const { resolve } = require("path");
const Handlebars = require("handlebars");
const baseDir = resolve("./public/emails");

let verifyEmail = fs.readFileSync(`${baseDir}/verify-email.html`).toString();

verifyEmail = Handlebars.compile(verifyEmail);

module.exports = {
  verifyEmail,
};
