// Multer middleware configured to receive an image file in the request,
// save it temporarily to disk, then let the controller upload it to Cloudinary.
const multer = require("multer");
const { BadRequestError } = require("../lib/errors");


const storage = multer.memoryStorage();

const imageFileFilter = (req, file, callback) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

    if (allowedMimeTypes.includes(file.mimetype)) {
        callback(null, true);
    } else {
        callback(
            new BadRequestError(
                "Invalid file type. Event cover images must be JPEG, PNG, or WebP."
            ),
            false
        );
    }
};

const uploadCoverImage = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB —
    },
    fileFilter: imageFileFilter,
}).single("cover_image");

const handleCoverImageUpload = (req, res, next) => {
    uploadCoverImage(req, res, (err) => {
        if (!err) return next();

        if (err.code === "LIMIT_FILE_SIZE") {
            return next(
                new BadRequestError("Cover image is too large. Maximum size is 5MB.")
            );
        }

        if (err.isOperational) return next(err);

        next(err);
    });
};

module.exports = { handleCoverImageUpload };