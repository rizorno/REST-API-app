const multer = require("multer");
const path = require("path");

const { HttpError } = require("../helpers");

const tmpDir = path.join(__dirname, "../", "tmp");

const multerConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tmpDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const maxSizeMegaByte = 1 * 2048 * 2048; // 2Mb in bytes

const upload = multer({
  storage: multerConfig,
  limits: { fileSize: maxSizeMegaByte },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.mimetype)) {
      const error = HttpError(
        400,
        "Invalid file type! Only .PNG, .JPEG or .JPG format allowed."
      );
      return cb(error, false);
    }
    cb(null, true);
  },
});

module.exports = upload;
