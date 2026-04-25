const env = require("../config/env");
const logger = require("../config/logger");

const sendMail = require("../config/mail");

const { verifyEmail, eventRegistrationConfirmation } = require("../lib/emails");
const { InternalServerError } = require("../lib/errors");


const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Africa/Lagos",
  });
};

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Africa/Lagos",
  });
};

const formatResponsesForEmail = (customFields, responses) => {
  if (!customFields || customFields.length === 0) return [];
  if (!responses || Object.keys(responses).length === 0) return [];

  return customFields
    .filter((field) => {
      const answer = responses[field.field_id];
      return (
        answer !== undefined &&
        answer !== null &&
        answer !== "" &&
        !(Array.isArray(answer) && answer.length === 0)
      );
    })
    .map((field) => {
      const answer = responses[field.field_id];
      return {
        label: field.label,
        // Join checkbox array answers into a readable comma-separated string
        // e.g. ["DeFi", "NFTs"] → "DeFi, NFTs"
        answer: Array.isArray(answer) ? answer.join(", ") : String(answer),
      };
    });
};

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

  "event-registration-confirmation": ({
    registrant_name,
    reg_id,
    event,
    responses,
  }) => {
    const year = new Date().getFullYear();

    const eventDate = formatDate(event.start_datetime);
    const startTime = formatTime(event.start_datetime);
    const endTime = formatTime(event.end_datetime);
    const eventTime = `${startTime} – ${endTime} (WAT)`;

    const formattedResponses = formatResponsesForEmail(
      event.custom_fields || [],
      responses || {}
    );

    return {
      subject: `Registration Confirmed: ${event.event_name}`,
      html: eventRegistrationConfirmation({
        registrant_name,
        reg_id,
        event_name: event.event_name,
        event_location: event.location,
        event_date: eventDate,
        event_time: eventTime,
        has_responses: formattedResponses.length > 0,
        responses: formattedResponses,
        year,
        APP_NAME: env.APP_NAME,
        OFFICE_ADDRESS: env.OFFICE_ADDRESS || "",
      }),
    };
  },
};


const mailer = async (type, meta) => {
  if (!getHtml[type]) {
    throw new InternalServerError(`Unknown email type: "${type}"`);
  }

  const { subject, html } = getHtml[type](meta);

  const emailOptions = {
    from: `${env.APP_NAME} <${env.EMAILER}>`,
    to: meta.email,
    subject,
    html,
  };

  try {
    const result = await sendMail(emailOptions);
    logger.info(`✅ Email sent to ${meta.email} [type: ${type}]`);
    return result;
  } catch (error) {
    logger.error(
      `❌ Failed to send "${type}" email to ${meta.email}: ${error.message}`
    );
    throw new InternalServerError(
      "Confirmation email could not be sent. Please contact support if you need a copy."
    );
  }
};

// Export helpers so the controller can use them without re-importing mailer
mailer.formatResponsesForEmail = formatResponsesForEmail;


module.exports = mailer;
