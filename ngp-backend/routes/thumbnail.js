const express = require('express');
const path = require('path');
const router = express.Router();

const thumbDir = path.join(__dirname, '../uploads/thumbs');

router.get('/:filename', (req, res) => {
    const file = path.join(thumbDir, req.params.filename);

    // TODO: USE createReturnArray from helper.js
    res.sendFile(file, (err) => {
        if (err) res.status(404).send('Thumbnail not found');
    });
});

module.exports = router;

