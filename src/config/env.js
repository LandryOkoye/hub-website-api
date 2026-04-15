require("dotenv").config();
const env = process.env.NODE_ENV || "development";

//common environmental variables for all environments
const common = {
  APP_NAME: process.env.APP_NAME || "blockchainhubafrica",
  OFFICE_ADDRESS: process.env.OFFICE_ADDRESS || "123 anytown Enugu",
  EMAILER: process.env.EMAILER,
  BASE_URL: process.env.BASE_URL,
  NODEMAILER_CONFIG: {
    host: process.env.MAILER_HOST,
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASSWORD,
    },
    secure: true,
  },
  MAILER_DOMAIN: process.env.MAILER_DOMAIN,
  SENDINBLUE_API_KEY: process.env.SENDINBLUE_API_KEY,
  PORT: process.env.PORT || 3500,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  SMS_USERNAME: process.env.SMS_USERNAME,
  SMS_API_KEY: process.env.SMS_API_KEY,
  SMS_SENDER: process.env.SMS_SENDER,
  CLOUDINARY_CONFIG: {
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  },
  CLOUDINARY_FOLDER: (() =>
    env === "development"
      ? "blockchainhubafrica_dev"
      : "blockchainhubafrica")(),
};

const development = {
  NODE_ENV: "development",
  DB_URI: process.env.DB_URI || `mongodb://localhost:27017/${common.APP_NAME}`,
  // DB_URI: process.env.DB_URI,
  ...common,
};

const production = {
  NODE_ENV: "production",
  DB_URI: process.env.DB_URI,
  ...common,
};

const test = {
  NODE_ENV: "test",
  DB_URI: `mongodb://localhost:27017/${common.APP_NAME}_test`,
  ...common,
};

const config = {
  development,
  production,
  test,
};

module.exports = config[env];
