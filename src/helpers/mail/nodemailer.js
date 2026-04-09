const { EMAIL_FROM, EMAIL_NAME } = process.env;

const send = async (to, subject, text, html, from, fromName) => {
  try {
    throw new Error("Yet to be Implemented");
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = { send };
