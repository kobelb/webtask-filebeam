'use strict';
var express = require('express');
var logo = require('./logo');
var storageMiddleware = require('./middleware/storageMiddleware');
var url = require('url');
var urlJoin = require('url-join');
var uuid = require('uuid');
var writeLineMiddleware = require('./middleware/writeLineMiddleware');

var api = express.Router();

const bucket = 'filebeam';

function getScheme(req) {
  return req.secure ? 'https' : 'http';
}

function getUrl(req) {
  const host = req.headers.host;
  const requestUrl = url.parse(req.originalUrl);
  const path = requestUrl.pathname;
  const scheme = getScheme(req);
  return scheme + '://' + host + path;
}

api.use(storageMiddleware);
api.use(writeLineMiddleware);

api.get('/', function (req, res) {
  res.writeLine(logo);
  res.writeLine();
  res.writeLine('Example using cURL:');
  res.writeLine('curl -X POST --data-binary @filename.extension ' + getUrl(req));
  res.writeLine();
  res.end();
});

api.post('/', function (req, res, next) {
  const key = uuid.v4();

  req.storage.upload(key, req, function (err) {
    if (err) {
      return next(err);
    }

    res.writeLine();
    res.writeLine('Here\'s your file:');
    res.writeLine(urlJoin(getUrl(req), key));
    res.writeLine();
    res.end();
  });
});

api.get('/:key', function (req, res, next) {
  const key = req.params.key;
  res.set('Content-Type', 'application/octet-stream');
  req.storage.download(key)
    .on('error', function (err) {
      next(err);
    })
    .pipe(res);
});



module.exports = api;
