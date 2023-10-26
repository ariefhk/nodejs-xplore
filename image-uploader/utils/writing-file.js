import fs from "fs";

const writingFile = (filePath, file, callback = null) => {
    const obj = {};
    return fs.writeFile(filePath, file, (err) => {
        if (err) {
            obj.error = true;
            obj.message = err;
            if (callback && typeof callback === "function") {
                callback(obj);
            }
        } else {
            obj.error = false;
            obj.message = "success writing data";
            if (callback && typeof callback === "function") {
                callback(obj);
            }
        }
    });
};

export { writingFile };
