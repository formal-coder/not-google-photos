const express = require('express');
const fs = require('fs');
const path = require('path');
const { loadMetadata, saveMetadata } = require('../utils/metadata');
const Photo = require("../models/Photos");

const router = express.Router();
const uploadDir = path.join(__dirname, '../uploads');
const thumbsDir = path.join(uploadDir, 'thumbs');

router.delete('/:filename', (req, res) => {
    const filename = req.params.filename;

    const response = {
        status: 'success',
        message: 'File deleted successfully.',
    };

    if (!fs.existsSync(path.join(uploadDir, filename))) {
        response.status = 'error';
        response.message = 'File not found.';
        return res.status(404).json(response);
    }
    fs.unlinkSync(path.join(uploadDir, filename));

    const Photo = require('../models/Photos');
    Photo.query()
        .delete()
        .where('url', `uploads/${filename}`)
        .then(() => {
            console.log('Photo metadata deleted successfully');
        })
        .catch((err) => {
            console.error('Error deleting photo metadata:', err);
            return res.status(500).send('Error deleting photo metadata');
        });

    if (!fs.existsSync(path.join(thumbsDir, filename))) {
        response.status = 'error';
        response.message += ' Thumbnail not found.';
        return res.status(404).json(response);
    }
    fs.unlinkSync(path.join(thumbsDir, filename));


    res.send('File deleted');
});

module.exports = router;
