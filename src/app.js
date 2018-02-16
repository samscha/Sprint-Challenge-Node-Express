const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const config = require('../config.js');

const status = config.STATUS;

const port = config.port;

const URL = config.coindesk.URL;

const server = express();
server.use(bodyParser.json());

server.get('/compare', (req, res) => {
  res.send('compare');
});

server.listen(port);
