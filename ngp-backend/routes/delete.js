const express = require('express');
const fs = require('fs');
const path = require('path');
const Photo = require('../models/Photos');

const router = express.Router();
const uploadDir = path.join(__dirname, '../uploads');
const thumbsDir = path.join(uploadDir, 'thumbs');

router.delete('/', async (req, res) => {
    const { filenames } = req.body;

    if (!Array.isArray(filenames) || filenames.length === 0) {
        return res.status(400).json({ status: 'error', message: 'No filenames provided.' });
    }
    // TODO: USE createReturnArray from helper.js
    try {
        const failedDeletes = [];

        for (const filename of filenames) {
            const filePath = path.join(uploadDir, filename);
            const thumbnailPath = path.join(thumbsDir, filename);

            try {
                // Delete original file
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                } else {
                    failedDeletes.push(filename);
                }

                // Delete thumbnail if it exists
                if (fs.existsSync(thumbnailPath)) {
                    fs.unlinkSync(thumbnailPath);
                }
            } catch (err) {
                console.error(`Error deleting file: ${filename}`, err);
                failedDeletes.push(filename);
            }
        }

        // Remove entries from the database
        await Photo.query().delete().whereIn('url', filenames.map(f => `/uploads/${f}`));

        if (failedDeletes.length > 0) {
            return res.status(500).json({
                status: 'partial_success',
                message: 'Some files could not be deleted.',
                failed: failedDeletes
            });
        }

        res.json({ status: 'success', message: 'Files deleted successfully.' });
    } catch (err) {
        console.error('Error deleting files:', err);
        res.status(500).send('Error deleting files');
    }
});

module.exports = router;
