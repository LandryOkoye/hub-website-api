const env = require("../config/env");
const logger = require("../config/logger");

const sendMail = require("../config/mail");

const { verifyEmail } = require("../lib/emails");
const { InternalServerError } = require("../lib/errors");

const getHtml = {
  "verify-email": ({ name, token }) => {
    const year = new Date().getFullYear();
    return {
      subject: "Email Verification",
      html: verifyEmail({
        name,
        token,
        year,
        APP_NAME: env.APP_NAME,
        OFFICE_ADDRESS: env.OFFICE_ADDRESS,
      }),
    };
  },
};

module.exports = async (type, meta) => {
  const { subject, html } = getHtml[type](meta);

  const Email = {
    from: `${env.APP_NAME}<${env.EMAILER}>`,
    to: meta.email,
    subject,
    html,
  };

  try {
    return await sendMail(Email);
  } catch (error) {
    let message = `Something went wrong. ${subject} mail could not be sent`;
    logger.error(error);
    throw new InternalServerError(message);
  }
};
