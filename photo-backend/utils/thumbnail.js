const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');
const thumbDir = path.join(__dirname, '../uploads/thumbs');

// Ensure thumbs folder exists
if (!fs.existsSync(thumbDir)) fs.mkdirSync(thumbDir);

const createThumbnail = async (filename) => {
    const input = path.join(uploadDir, filename);
    const output = path.join(thumbDir, filename);
    await sharp(input)
        .resize(200) // width 200px, auto height
        .toFile(output);
};

module.exports = { createThumbnail };
