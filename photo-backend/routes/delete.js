const express = require('express');
const fs = require('fs');
const path = require('path');
const { loadMetadata, saveMetadata } = require('../utils/metadata');

const router = express.Router();
const uploadDir = path.join(__dirname, '../uploads');
const thumbDir = path.join(uploadDir, 'thumbs');

router.delete('/:filename', (req, res) => {
    const filename = req.params.filename;
    const metadata = loadMetadata();

    if (!metadata.files.includes(filename)) {
        return res.status(404).send('File not found in metadata');
    }

    // Remove photo
    const photoPath = path.join(uploadDir, filename);
    if (fs.existsSync(photoPath)) fs.unlinkSync(photoPath);

    // Remove thumbnail
    const thumbPath = path.join(thumbDir, filename);
    if (fs.existsSync(thumbPath)) fs.unlinkSync(thumbPath);

    // Update metadata
    metadata.files = metadata.files.filter(f => f !== filename);
    saveMetadata(metadata);

    res.send('Deleted successfully');
});

module.exports = router;
