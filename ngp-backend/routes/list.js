const express = require('express');
const Photo = require('../models/Photos');
const router = express.Router();

router.get('/', (req, res) => {
    // TODO: Use createReturnArray from helper.js
    Photo.query()
        .select('id', 'updated_at', 'filename', 'description', 'size')
        .orderBy('updated_at', 'desc')
        .then(photos => {
            res.json({ status: 'success', photos });
        })
        .catch(err => {
            console.error('Error fetching photos:', err);
            res.status(500).json({ status: 'error', message: 'Failed to fetch photos.' });
        });
});

module.exports = router;
