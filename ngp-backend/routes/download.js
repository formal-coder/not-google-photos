const express = require('express');
const path = require('path');
const fs = require('fs');
const {createReturnArray} = require("../utils/helper");
const Photo = require('../models/Photos');

const router = express.Router();
const uploadDir = path.join(__dirname, '../uploads');
const response = createReturnArray;

router.get('/:photoId', async (req, res) => {
    const photoId = req.params.photoId;
    const filename = await Photo.query().where('id', photoId).select('filename').first().then(photo => photo ? photo.filename : null);
    if (!filename) {
        response.success = false;
        response.status = 404;
        response.error = 'Photo not found';
        return res.status(404).json(response);
    }

    const filePath = path.join(uploadDir, filename);

    if (!fs.existsSync(filePath)) {
        response.success = false;
        response.status = 404;
        response.error = 'File not found';
        return res.status(404).json(response);
    }

    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            response.success = false;
            response.status = 500;
            response.error = 'Error sending file';
            return res.status(500).end();
        }
    });
});

module.exports = router;
