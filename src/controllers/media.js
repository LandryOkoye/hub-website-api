const response = require("../utils/response");
const { generateAuthToken } = require("../utils/token");

const {
  NotFoundError,
  BadRequestError,
  UnAuthorizedError,
  DuplicateError,
  InternalServerError,
} = require("../lib/errors");

const mediaService = require("../services/media");
const { uploadToCloud, deleteFromCloud } = require("../lib/cloudinary");
const { omit } = require("lodash");
const { deleteFile } = require("../services/fileService");
const env = require("../config/env");
const getFilePath = require("../utils/getFilePath");

class MediaResourceController {
  async create(req, res) {
    const { body, file } = req;
    if (!file?.path) throw new BadRequestError("Invalid file path");

    const url =
      env.BASE_URL + "/static" + getFilePath(file.destination) + file.filename;

    const typeStartIndex = file.filename.lastIndexOf(".") + 1;
    const type = file.filename.slice(typeStartIndex);

    const fileUpload = {
      size: file.size,
      type,
      filename: file.filename,
      url,
      public_id: getFilePath(file.destination) + file.filename,
    };
    Object.assign(body, fileUpload);

    await mediaService.create(body);
    res.send(response("Media Resource uploaded successfully"));
  }

  async getMediaResource(req, res) {
    const media = await mediaService.findById(req.params.id);
    if (!media) throw new NotFoundError("Invalid MediaResource Item");

    res.send(response("Media Resource uploaded successfully", media));
  }

  async getAllMediaResources(req, res) {
    const media = await mediaService.getAllMediaResources();

    res.send(response("Media Resource uploaded successfully", media));
  }

  async update(req, res) {
    const { body, file } = req;
    const media = await mediaService.findById(req.params.id);
    if (!media) throw new BadRequestError("Invalid Media Resource Item");

    if (file?.path) {
      const url = env.BASE_URL + getFilePath(file.destination) + file.filename;

      const typeStartIndex = file.filename.lastIndexOf(".") + 1;
      const type = file.filename.slice(typeStartIndex);

      const fileUpload = {
        size: file.size,
        type,
        filename: file.filename,
        url,
        public_id: getFilePath(file.destination) + file.filename,
      };
      Object.assign(body, fileUpload);
    }

    const updatedMedia = await mediaService.update(req.params.id, body);

    res.send(response("Media Resource updated successfully", updatedMedia));
  }

  async delete(req, res) {
    const media = await mediaService.findById(req.params.id);
    if (!media) throw new NotFoundError("Invalid Media Resource Item");

    let result;
    if (media.url.includes("cloudinary"))
      result = await deleteFromCloud(media.public_id, "raw");

    if (!media.url.includes("cloudinary"))
      result = await deleteFile(media.public_id);

    if (!result) throw new InternalServerError();

    await mediaService.delete(req.params.id);
    res.send(response("Media Resource deleted successfully"));
  }
}

module.exports = new MediaResourceController();
