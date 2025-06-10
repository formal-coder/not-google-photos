const express = require('express');
const { loadMetadata } = require('../utils/metadata');

const router = express.Router();

router.get('/', (req, res) => {
    const metadata = loadMetadata();
    res.json(metadata.files);
});

module.exports = router;
