const fs = require('fs');
const path = require('path');
const metadataFile = path.join(__dirname, '../uploads/metadata.json');

const loadMetadata = () => {
    if (fs.existsSync(metadataFile)) return JSON.parse(fs.readFileSync(metadataFile));
    return { files: [] };
};

const saveMetadata = (metadata) => {
    fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 2));
};

module.exports = { loadMetadata, saveMetadata };
