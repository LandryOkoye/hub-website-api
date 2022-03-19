const Media = require("../models/media");
const fs = require("fs/promises");
const { BadRequestError } = require("../lib/errors");

class UploadService {
  UploadFile(filePath) {
    return Media.find()
      .select("name url type size")
      .sort({ createdAt: "desc" });
  }

  async deleteFile(filePath) {
    try {
      const path = "./uploads" + filePath;
      await fs.unlink(path);
      return true;
    } catch (error) {
      if (error.code === "ENOENT")
        throw new BadRequestError("This file does not exist");
    }
  }
}

module.exports = new UploadService();
