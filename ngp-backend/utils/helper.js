const path = require('path');
const crypto = require("crypto");

const generateSafeFilename = (originalName) => {
    const ext = path.extname(originalName);
    const base = crypto.randomBytes(8).toString('hex');
    return `${base}${ext}`;
};

const createReturnArray = {
    'success': true,
    'status': 200,
    'error': null,
    'message': 'File uploaded successfully',
}

module.exports = { generateSafeFilename, createReturnArray };
