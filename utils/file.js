const path = require("path");
const fs = require("fs");

/**
 * It takes a file path as an argument, joins it with the current directory, and then deletes the file
 * @param filePath - The path to the file that we want to delete.
 */
const clearImage = (filePath) => {
    filePath = path.join(__dirname, "..", filePath);
    console.log("file path", filePath);
    fs.unlink(filePath, (err) => console.log(err));
};

exports.clearImage = clearImage;
