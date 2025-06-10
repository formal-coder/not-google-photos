const express = require('express');
const path = require('path');
const router = express.Router();

const uploadDir = path.join(__dirname, '../uploads');

router.get('/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(uploadDir, filename);
    const Photo = require('../models/Photos');

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
        return res.status(404).send('File not found');
    }

    // Send the file to the client
    res.sendFile(filePath);
});

module.exports = router;
