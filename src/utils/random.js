const random = () => {
  let range = Array.from(Array(10).keys());
  let token = "";
  for (let i = 0; i < 3; i++) {
    let randomIndex = Math.floor(Math.random() * range.length);
    token += range[randomIndex];
  }
  return token;
};

module.exports = random;
