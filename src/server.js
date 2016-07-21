'use strict';

const _       = require('lodash');
const express = require('express');
const http    = require('http');
const config  = require('../config/server.config.js');
const api     = require('./api');

const app  = express();

// inject context into all requests when running locally
app.use(function (req, res, next) {
  req.webtaskContext = {data: _.assign(config.param, config.secrets, {policies: config.policies}), secrets: config.secrets};
  next();
});

// no favicon at the moment
app.use('/favicon.ico', function (req, res) {
  res.send();
});

app.use(api);

console.log('Listening on port ' + config.localPort);
app.server = http.createServer(app);
app.server.listen(config.localPort);
