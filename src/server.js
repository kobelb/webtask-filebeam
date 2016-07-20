'use strict';

var _       = require('lodash');
var express = require('express');
var http    = require('http');
var config  = require('../config/server.config.js');
var api     = require('./api');

var app  = express();

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
