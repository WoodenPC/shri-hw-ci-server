const { promisify } = require('util');
const fs = require('fs');

// -----------------------------------------------
// FS promisify
exports.fileExistsAsync = promisify(fs.exists);
exports.readFileAsync = promisify(fs.readFile);
exports.writeFileAsync = promisify(fs.writeFile);
exports.getStatAsync = promisify(fs.stat);
exports.mkDirAsync = promisify(fs.mkdir);
