'use strict';

const express = require('express');
const logo = require('./logo');
const PassThrough = require('stream').PassThrough;
const storageMiddleware = require('./middleware/storageMiddleware');
const url = require('url');
const urlJoin = require('url-join');
const uuid = require('uuid');
const writeLineMiddleware = require('./middleware/writeLineMiddleware');

const api = express.Router();

const bucket = 'filebeam';

function getScheme(req) {
  return req.secure ? 'https' : 'http';
}

function getUrl(req, key) {
  const host = req.headers.host;
  const requestUrl = url.parse(req.originalUrl);
  const path = requestUrl.pathname;
  const scheme = getScheme(req);
  const baseUrl = scheme + '://' + host + path;
  if (!key) {
    return baseUrl;
  }

  return urlJoin(baseUrl, key);
}

const streams = {};

api.use(writeLineMiddleware);

api.get('/', function (req, res) {
  const key = uuid.v4();

  res.writeLine(logo);
  res.writeLine();
  res.writeLine('First, initiate the receiver: ');
  res.writeLine('curl ' + getUrl(req, key) + ' -o destination.extension');
  res.writeLine();
  res.writeLine('Then, post the file: ');
  res.writeLine('curl -X POST ' + getUrl(req, key) + ' --data-binary @source.extension');
  res.writeLine();
  res.end();
});

api.get('/:key', function (req, res) {
  const key = req.params.key;

  const stream = streams[key] = new PassThrough();
  res.set('Content-Type', 'application/octet-stream');
  stream.pipe(res);
});

api.post('/:key', function (req, res) {
  const key = req.params.key;

  if (parseInt(req.headers['content-length']) === 0) {
    res.status(400).writeLine('This isn\'t a non-empty file').end();
    return;
  }

  const stream = streams[key];
  if (!stream) {
    res.status(404).end();
  }

  req.pipe(stream).on('end', function () {
    res.end();
    delete streams[key];
  });
});

module.exports = api;
