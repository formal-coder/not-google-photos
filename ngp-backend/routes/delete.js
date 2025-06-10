const express = require('express');
const fs = require('fs');
const path = require('path');
const { loadMetadata, saveMetadata } = require('../utils/metadata');

const router = express.Router();
const uploadDir = path.join(__dirname, '../uploads');
const thumbsDir = path.join(uploadDir, 'thumbs');

router.delete('/:filename', (req, res) => {
    const filename = req.params.filename;
    const metadata = loadMetadata();

    if (!metadata.files.includes(filename)) {
        return res.status(404).send('File not found');
    }

    fs.unlinkSync(path.join(uploadDir, filename));
    fs.unlinkSync(path.join(thumbsDir, filename));
    metadata.files = metadata.files.filter(f => f !== filename);
    saveMetadata(metadata);

    res.send('File deleted');
});

module.exports = router;
