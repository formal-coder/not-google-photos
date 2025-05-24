const express = require('express');
const path = require('path');
const router = express.Router();

const uploadDir = path.join(__dirname, '../uploads');

router.get('/:filename', (req, res) => {
    const file = path.join(uploadDir, req.params.filename);
    res.download(file, (err) => {
        if (err) res.status(404).send('File not found');
    });
});

module.exports = router;
