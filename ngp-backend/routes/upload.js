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

    if (!req.files.every(file => file.mimetype.startsWith('image/'))) {
        return res.status(400).send('Only image files are allowed');
    }
    if (req.files.length > 10) {
        return res.status(400).send('You can upload a maximum of 10 files at a time');
    }

    const response = createReturnArray;
    const failedUploads = [];
    const trx = await Photo.startTransaction();

    try {
        const uploadedPhotos = [];

        for (const file of req.files) {
            const filename = file.filename;
            const size = file.size;
            const type = file.mimetype;
            const description = file.originalname;

            // Limit the upload image size to 5MB
            if (size > 5 * 1024 * 1024) {
                failedUploads.push({
                    description,
                    error: `File exceeds 5MB limit`
                });
                fs.unlinkSync(file.path); // Delete the uploaded file
                continue; // Skip to the next file
            }

            try {
                const photoData = { description, filename, size, type };
                const insertedPhoto = await Photo.query(trx).insert(photoData);
                await createThumbnail(filename);
                uploadedPhotos.push(insertedPhoto);
            } catch (err) {
                failedUploads.push({
                    description,
                    error: err.message
                });
                fs.unlinkSync(file.path); // Delete the uploaded file
            }
        }

        await trx.commit();

        response.success = true;
        response.photos = uploadedPhotos;
        response.failedUploads = failedUploads;
        res.json(response);
    } catch (err) {
        await trx.rollback();
        for (const file of req.files) {
            fs.unlinkSync(file.path);
        }
        response.success = false;
        response.status = 500;
        response.error = err.message;
        response.failedUploads = failedUploads;
        response.message = 'Failed to upload photos';
        res.status(500).json(response);
    }
});

module.exports = router;
