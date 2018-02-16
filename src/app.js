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

const cache = {};
const history = [];
const capture = {};

const fetchData = (URL, res) => {
  return fetch(URL)
    .then(response => response.json())
    .then(
      data =>
        URL.includes('currentprice')
          ? (capture.current = data.bpi.USD.rate_float)
          : (capture.previous = Object.values(data.bpi)[0]),
    )
    .then(
      _ =>
        res
          ? res.status(status.OK).send({
              diff:
                Math.round((capture.current - capture.previous) * 100) / 100,
              current: capture.current,
              previous: capture.previous,
            })
          : null,
    )
    .catch(err => res.status(status.USER_ERROR).send(err));
};

server.get('/compare', (req, res) => {
  fetchData(currentPriceURL).then(_ => {
    fetchData(yesterdayPriceURL, res);
  });
});

// server.get('/c', (req, res) => {
//   fetch(currentPriceURL)
//     .then(response => response.json())
//     .then(data => res.status(200).send(data))
//     .catch(err => res.status(422).send(err));
// });

// server.get('/c1', (req, res) => {
//   fetch(yesterdayPriceURL)
//     .then(response => response.json())
//     .then(data => res.status(200).send(data))
//     .catch(err => res.status(422).send(err));
// });

server.listen(port);
