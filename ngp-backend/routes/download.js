const express = require('express');
    const path = require('path');
    const fs = require('fs');

    const router = express.Router();
    const uploadDir = path.join(__dirname, '../uploads');

    router.get('/:filename', (req, res) => {
        const filePath = path.join(uploadDir, req.params.filename);
        // TODO: Use createReturnArray from helper.js
        if (!fs.existsSync(filePath)) {
            return res.status(404).send('File not found');
        }

        res.sendFile(filePath);
    });

    module.exports = router;
