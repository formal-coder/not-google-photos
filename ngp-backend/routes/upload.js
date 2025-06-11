const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { createThumbnail } = require('../utils/thumbnail');
const Photo = require('../models/Photos');
const router = express.Router();
const { generateSafeFilename, createReturnArray} = require('../utils/helper');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, generateSafeFilename(file.originalname))
});
const upload = multer({ storage });

router.post('/', upload.array('photos', 10), async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).send('No files uploaded');
    }

    const response = createReturnArray;

    const trx = await Photo.startTransaction();
    try {
        const uploadedPhotos = [];

        for (const file of req.files) {
            const filename = file.filename;
            const size = file.size;
            const type = file.mimetype;
            const description = file.originalname; // original filename

            const photoData = { description, filename, size, type };

            const insertedPhoto = await Photo.query(trx).insert(photoData);
            await createThumbnail(filename);
            uploadedPhotos.push(insertedPhoto);
        }

        await trx.commit();

        response.photos = uploadedPhotos;
        res.json(response);
    } catch (err) {
        await trx.rollback();
        for (const file of req.files) {
            fs.unlinkSync(file.path);
        }
        response.success = false;
        response.status = 500;
        response.error = err.message;
        response.message = 'Failed to upload photos';
        res.status(500).json(response);
    }
});

module.exports = router;
