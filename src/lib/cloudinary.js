var cloudinary = require("cloudinary");
const env = require("../config/env");

cloudinary.config(env.CLOUDINARY_CONFIG);

exports.uploadToCloud = function (filepath, type) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filepath,
      function (result, err) {
        if (err) console.log(err);
        if (result?.error) console.log(result.error);
        resolve({ url: result?.secure_url, public_id: result?.public_id });
      },
      { resource_type: type || "image", folder: env.CLOUDINARY_FOLDER }
    );
  });
};

exports.uploadBufferToCloud = function (buffer, mimetype, folder = "events") {
  return new Promise((resolve, reject) => {

    const base64 = buffer.toString("base64");
    const dataUri = `data:${mimetype};base64,${base64}`;


    const destinationFolder = `${env.CLOUDINARY_FOLDER}/${folder}`;

    cloudinary.uploader.upload(
      dataUri,
      function (result, err) {
        if (err) {
          return reject(
            new Error(`Cloudinary network error: ${err.message || JSON.stringify(err)}`)
          );
        }
        if (result?.error) {
          return reject(
            new Error(`Cloudinary API error: ${result.error.message || JSON.stringify(result.error)}`)
          );
        }
        resolve({
          url: result?.secure_url,   // HTTPS URL to use in <img src="">
          public_id: result?.public_id, // ID needed to delete this image later
        });
      },
      {
        resource_type: "image",
        folder: destinationFolder,
      }
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
