const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

const sessions = require('./routes/api/sessions');
const runs = require('./routes/api/runs');

app.use('/api/sessions', sessions);
app.use('/api/runs', runs);

app.listen(5000, () => console.log('Server running on port 5000'))