const crypto = require("crypto");

const random = () => {
  let range = Array.from(Array(10).keys());
  let token = "";
  for (let i = 0; i < 3; i++) {
    let randomIndex = Math.floor(Math.random() * range.length);
    token += range[randomIndex];
  }
  return token;
};

const getRandomKey = (length = 7) => {
  return crypto.randomBytes(length).toString("hex");
};

module.exports = { random, getRandomKey };
