const getFilePath = (destination) => {
  if (destination.includes("/docs")) return "/docs/";
  if (destination.includes("/images")) return "/images/";
};

module.exports = getFilePath;
