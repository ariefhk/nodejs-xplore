import "dotenv/config";
import express from "express";
import { memoryStorageUploader } from "./utils/memory-storage.js";
import path from "path";
import fs from "fs";
import { writingFile } from "./utils/writing-file.js";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.static(path.resolve("public")));

app.get("/", (req, res) => {
    res.json({
        msg: "Hello world",
    });
});

app.post("/post-memory", memoryStorageUploader, (req, res) => {
    const file = req.file;
    if (!file) {
        return res.json({
            msg: "File not found",
        });
    } else {
        const fileBase64 = req.file.buffer.toString("base64"); //convert buffer to base64
        const filesBase64Data = `data:${req.file.mimetype};base64,${fileBase64}`;

        // saving to local
        const ext = file.originalname.split(".").pop();
        const fileName = `img-${+new Date()}.${ext}`;
        const filePath = path.resolve("uploads", "images", fileName);
        const filePathPublic = path.resolve("public", "images", fileName);
        const imgFile = Buffer.from(filesBase64Data.split(",")[1], "base64");

        writingFile(filePath, imgFile, (data) => {
            if (data.error) {
                console.log("Error saving the file:", data.message);
            } else {
                console.log(data.message);
            }
        });

        writingFile(filePathPublic, imgFile);

        return res.json({
            msg: "File found",
            data: filesBase64Data,
        });
    }
});

app.get("/image/:filename", (req, res) => {
    const filename = req.params.filename;
    const filePath = path.resolve("uploads", "images", filename);

    return res.sendFile(filePath, (err) => {
        if (err) {
            return res.json({
                msg: "File not found",
            });
        }
    });
});

app.listen(PORT, () => {
    console.log(`running on port ${PORT}`);
});
