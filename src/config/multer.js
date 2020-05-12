const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");

const storageTypes = {
  local: multer.diskStorage({
    destination: (req, file, cd) => {
      cd(null, path.resolve(__dirname, "..", "..", "tmp", "uploads"));
    },
    filename: (req, file, cd) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cd(err);

        file.key = `${hash.toString("hex")}-${file.originalname}`;

        cd(null, file.key);
      });
    },
  }),
  s3: multerS3({
    s3: new aws.S3(),
    bucket: "uploadteste2",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: "public-read",
    key: (req, file, cd) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cd(err);

        const fileName = `${hash.toString("hex")}-${file.originalname}`;

        cd(null, fileName);
      });
    },
  }),
};

module.exports = {
  dest: path.resolve(__dirname, "..", "..", "tmp", "uploads"),
  storage: storageTypes[process.env.STORAGE_TYPE],
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (req, file, cd) => {
    const allowedMimes = [
      "image/jpeg",
      "image/pjpeg",
      "image/png",
      "image/gif",
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cd(null, true);
    } else {
      [cd(new Error("Invalid file type."))];
    }
  },
};
