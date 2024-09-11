const express = require('express');
const user = require('./api/users');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// กำหนด middleware ก่อน route
app.use(cors());
app.use(bodyParser.text());
app.use(bodyParser.json());

app.use("/users", user);

module.exports = app;