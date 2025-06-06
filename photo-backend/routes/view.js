const express = require('express');
const path = require('path');

const router = express.Router();
const uploadDir = path.join(__dirname, '../uploads');

router.get('/:filename', (req, res) => {
    const filePath = path.join(uploadDir, req.params.filename);
    res.sendFile(filePath);
});

module.exports = router;
