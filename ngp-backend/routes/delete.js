const express = require('express');
const fs = require('fs');
const path = require('path');
const Photo = require('../models/Photos');

const router = express.Router();
const uploadDir = path.join(__dirname, '../uploads');
const thumbsDir = path.join(uploadDir, 'thumbs');

router.delete('/', async (req, res) => {
    const { photoIds } = req.body;
    console.log('Received photo IDs for deletion:', photoIds);

    if (!Array.isArray(photoIds) || photoIds.length === 0) {
        return res.status(400).json({ status: 'error', message: 'No filenames provided.' });
    }
    // TODO: USE createReturnArray from helper.js
    try {
        const failedDeletes = [];

        // get photo names from ids and delete entries
        const photosToBeDeleted = await Photo.query().whereIn('id', photoIds).select('filename');

        for (const photo of photosToBeDeleted) {
            const filePath = path.join(uploadDir, photo.filename);
            const thumbnailPath = path.join(thumbsDir, photo.filename);

            try {
                // Delete original file
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                } else {
                    failedDeletes.push(photo);
                }

                // Delete thumbnail if it exists
                if (fs.existsSync(thumbnailPath)) {
                    fs.unlinkSync(thumbnailPath);
                }
            } catch (err) {
                console.error(`Error deleting file: ${photo}`, err);
                failedDeletes.push(photo);
            }
        }

        // Remove entries from the database
        await Photo.query().delete().whereIn('id', photoIds);

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
