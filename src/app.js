const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const config = require('../config.js');

const status = config.STATUS;

const port = config.port;

const currentPriceURL = config.coindesk.URL.currentPrice;
const yesterdayPriceURL = config.coindesk.URL.previousDayPrice;

const server = express();
server.use(bodyParser.json());

const capture = {};

const fetchCurrentPrice = new Promise((resolve, reject) => {
  fetch(currentPriceURL)
    .then(response => response.json())
    .then(data => (capture.current = data.bpi.USD.rate_float))
    .then(_ => resolve())
    .catch(err => reject(err));
});

const fetchYesterdayPrice = new Promise((resolve, reject) => {
  fetch(yesterdayPriceURL)
    .then(response => response.json())
    .then(data => (capture.previous = Object.values(data.bpi)[0]))
    .then(_ => resolve())
    .catch(err => reject(err));
});

server.get('/compare', (req, res) => {
  Promise.all([fetchYesterdayPrice, fetchCurrentPrice]).then(_ => {
    res.status(status.OK).send({
      diff: Math.round((capture.current - capture.previous) * 100) / 100,
      current: capture.current,
      previous: capture.previous,
    });
  });
});

// server.get('/c', (req, res) => {
//   fetch(currentPriceURL)
//     .then(response => response.json())
//     .then(data => res.status(200).send(data))
//     .catch(err => res.status(422).send(err));
// });

// server.get('/p', (req, res) => {
//   fetch(yesterdayPriceURL)
//     .then(response => response.json())
//     .then(data => res.status(200).send(data))
//     .catch(err => res.status(422).send(err));
// });

server.listen(port);
