const express = require('express');
const uploadRoute = require('./routes/upload');
const listRoute = require('./routes/list');
const downloadRoute = require('./routes/download');
const thumbnailRoute = require('./routes/thumbnail');
const deleteRoute = require('./routes/delete');
const viewRoute = require('./routes/view');

const app = express();
app.use('/upload', uploadRoute);
app.use('/list', listRoute);
app.use('/download', downloadRoute);
app.use('/thumbnail', thumbnailRoute);
app.use('/delete', deleteRoute);
app.use('/view', viewRoute);

app.listen(3000, () => console.log('Server started on port 3000'));
