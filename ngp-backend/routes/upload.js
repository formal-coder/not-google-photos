const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { createThumbnail } = require('../utils/thumbnail');
const Photo = require('../models/Photos');
const router = express.Router();

const uploadDir = path.join(__dirname, '../uploads');
const thumbsDir = path.join(uploadDir, 'thumbs');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
if (!fs.existsSync(thumbsDir)) fs.mkdirSync(thumbsDir);

const generateSafeFilename = (originalName) => {
    const ext = path.extname(originalName);
    const base = crypto.randomBytes(8).toString('hex');
    return `${base}${ext}`;
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, generateSafeFilename(file.originalname))
});
const upload = multer({ storage });

router.post('/', upload.single('photo'), async (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded');

    const filename = req.file.filename;
    const size = req.file.size;
    const type = req.file.mimetype;
    const url = `/uploads/${filename}`;
    const thumbnail_url = `/uploads/thumbs/${filename}`;

    const photoData = { url, description: filename, size, type, thumbnail_url };

    const trx = await Photo.startTransaction();
    try {
        const insertedPhoto = await Photo.query(trx).insert(photoData);
        await createThumbnail(filename);
        await trx.commit();
        res.json({ message: 'Upload successful', photo: insertedPhoto });
    } catch (err) {
        await trx.rollback();
        fs.unlinkSync(req.file.path);
        console.error('Upload error:', err);
        res.status(500).send('Upload failed');
    }
});

module.exports = router;
