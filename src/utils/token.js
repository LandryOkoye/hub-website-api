const jwt = require("jsonwebtoken");
const env = require("../config/env");

const generateToken = ({ length, range, prefix }) => {
  prefix = prefix || "";
  let token = "";
  for (let i = 0; i < length; i++) {
    let randomIndex = Math.floor(Math.random() * range.length);
    token += range[randomIndex];
  }
  return prefix + token;
};

const generateSignUpToken = (token = null) => {
  let range = Array.from(Array(10).keys());
  let tokenOptions = {
    length: 5,
    range,
    prefix: "SZ-"
  };
  let newToken = generateToken(tokenOptions);

  return newToken;
};

// Including 'Role' in the jwt payload

const generateAuthToken = (user) => {
  const dataToSign = {
    id: user.id,
    email: user.email,
    role: user.role
  };

  return jwt.sign({ ...dataToSign },
    env.JWT_SECRET_KEY,
    { expiresIn: "24h" });
};

module.exports = { generateSignUpToken, generateAuthToken };
