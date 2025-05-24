const fs = require('fs');
const express = require('express');
const multer = require('multer');
const logger = require('../utils/logger');
const path = require('path');
const { loadMetadata, saveMetadata } = require('../utils/metadata');

const router = express.Router();
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

const { createThumbnail } = require('../utils/thumbnail');
router.post('/', upload.single('photo'), async (req, res) => {
    const metadata = loadMetadata();
    const filename = req.file.originalname;

    if (metadata.files.includes(filename)) {
        return res.status(409).send('File already exists');
    }

    metadata.files.push(filename);
    saveMetadata(metadata);
    res.send('Upload successful');

    createThumbnail(filename).catch(err => logger.error(`Thumbnail error: ${err.message}`));
});

module.exports = router;
