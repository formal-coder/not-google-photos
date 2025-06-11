const express = require('express');
const cors = require('cors');
const uploadRoute = require('./routes/upload');
const listRoute = require('./routes/list');
const downloadRoute = require('./routes/download');
const thumbnailRoute = require('./routes/thumbnail');
const deleteRoute = require('./routes/delete');
const viewRoute = require('./routes/view');

const app = express();

// Database setup
const Knex = require("knex");
const {development} = require('./knexfile');

const knex = Knex(development);
const {Model} = require("objection");
Model.knex(knex);

app.use(express.json());
app.use(cors());
app.use('/upload', uploadRoute);
app.use('/list', listRoute);
app.use('/download', downloadRoute);
app.use('/thumbnail', thumbnailRoute);
app.use('/delete', deleteRoute);
app.use('/view', viewRoute);

app.listen(3000, () => console.log('Server started on port 3000'));
