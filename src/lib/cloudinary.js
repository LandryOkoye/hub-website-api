var cloudinary = require("cloudinary");
const env = require("../config/env");

cloudinary.config(env.CLOUDINARY_CONFIG);

exports.uploadToCloud = function (filepath, type) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filepath,
      function (result, err) {
        if (err) console.log(err);
        resolve({ url: result?.secure_url, public_id: result?.public_id });
      },
      { resource_type: type || "image", folder: env.CLOUDINARY_FOLDER }
    );
  });
};

exports.getImageThumbnail = function (uploadResult) {
  return cloudinary.url(uploadResult.public_id, {
    width: 320,
    height: 320,
    crop: "fill",
  });
};

exports.deleteFromCloud = function (publicID, type) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(
      publicID,
      function (result) {
        resolve(result);
      },
      { resource_type: type || "image", folder: env.CLOUDINARY_FOLDER }
    );
  });
};

exports.multipleUpload = async function (filepaths = []) {
  try {
    const result = await Promise.all(filepaths.map(uploadToCloud));
    return result;
  } catch (error) {
    throw error;
  }
};
