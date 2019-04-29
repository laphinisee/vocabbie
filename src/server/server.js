const express = require('express');
const app = express();

const bodyParser = require('body-parser');

const query = require('../db/query');

app.use(express.static('client/public')); 
app.set('view engine', 'html');

module.exports.app = app;
module.exports.query = query;