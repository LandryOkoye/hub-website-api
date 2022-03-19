const multer = require("multer");
const fs = require("fs");
const { BadRequestError } = require("../lib/errors");

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];

//adjust how files are stored
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dir = process.cwd();
    console.log(file.mimetype);
    //Sets destination for fileType
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg"
    ) {
      dir = dir + `/uploads/images`;
    } else {
      dir = dir + `/uploads/docs`;
    }

    fs.mkdir(dir, { recursive: true }, (err) => cb(err, dir));
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + "_" + file.originalname);
  },
});

const fileFilter = function (req, file, callback) {
  console.log(file.mimetype);
  if (allowedMimeTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(
      new BadRequestError(
        "Image upload failed. Supports only jpeg, png, documents and pdf files"
      ),
      false
    );
  }
};

const fileSize = function () {
  const size = 1024 * 1024 * 15;
  if (
    file.mimetype === "application/pdf" ||
    file.mimetype === "application/msword"
  ) {
    size = 1024 * 1024 * 250;
    return size;
  } else return size;
};

const multerLib = multer({
  storage: storage,
  limits: {
    fileSize: fileSize,
  },
  fileFilter: fileFilter,
});

module.exports = multerLib;
