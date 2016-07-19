'use strict';
var express = require('express');
var api     = express.Router();
var url = require('url');

function getNewline(req) {
  return '\n';
}

function getUrl(req) {
  var host = req.headers.host;
  var requestUrl = url.parse(req.url);
  var path = req.baseUrl + requestUrl.pathname;
  return 'http://' + host + path;
}

api.get('/', function (req, res) {
  res.send('Usage: curl -X POST -d @file.ext ' + getUrl(req) + getNewline(req));
});

api.post('/', function (req, res) {

});

module.exports = api;
