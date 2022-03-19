const nodemailer = require("nodemailer");

const { NODEMAILER_CONFIG, APP_NAME, MAILER_DOMAIN } = require("./env");

const transporter = nodemailer.createTransport(NODEMAILER_CONFIG);

const sendMail = transporter.sendMail.bind(transporter);

module.exports = sendMail;
