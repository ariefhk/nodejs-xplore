import multer, { MulterError } from "multer";
import path from "path";
import { ApplicationError } from "./error-message.js";

const imgFilter = (req, file, callback) => {
    const extFile = path.extname(file.originalname);
    const acceptedExt = extFile === ".png" || extFile === ".jpg" || extFile === ".jpeg";

    if (!acceptedExt) {
        callback(null, false); //declining file
        callback(new ApplicationError(400, "Filetype must be PNG/JPG/JPEG"));
    } else {
        callback(null, true); //accepting file
    }
};

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    fileFilter: imgFilter,
    limits: {
        fileSize: 2 * 1024 * 1024,
    },
}).single("image");

const memoryStorageUploader = (req, res, next) => {
    return upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            return res.status(400).json({
                status: "FAIL",
                message: err.message,
            });
        } else if (err instanceof ApplicationError) {
            // An unknown error occurred when uploading.
            return res.status(err.statusCode).json({
                status: "FAIL",
                message: err.message,
            });
        } else if (err) {
            next(err);
        } else {
            next();
        }
    });
};

export { memoryStorageUploader };
