'use strict';
var express = require('express');
var url = require('url');
var uuid = require('uuid');

var api = express.Router();

const bucket = 'filebeam';

// assuming *nix at this point, I wasn't able to determine
// the requestor's OS based on the user-agent because curl doesn't send that part
const newline = '\n';

function getScheme(req) {
  return req.secure ? 'https' : 'http';
}

function getUrl(req) {
  const host = req.headers.host;
  const path = req.originalUrl;
  const scheme = getScheme(req);
  return scheme + '://' + host + path;
}

function awsMiddleware (req, _, next) {
  var aws = require('aws-sdk');
  aws.config.update({accessKeyId: req.webtaskContext.secrets.awsAccessKeyId, secretAccessKey: req.webtaskContext.secrets.awsSecretAccessKey, region: 'us-west-2'});
  req.aws = aws;
  next();
}

api.get('/', function (req, res) {
  res.send('Usage: curl -X POST -d @file.ext ' + getUrl(req) + getNewline(req));
});

api.post('/', awsMiddleware, function (req, res, next) {
  const key = uuid.v4();
  var s3 = new req.aws.S3({params: {Bucket: bucket, Key: key}});
  s3.upload({Body: req}).
    on('httpUploadProgress', function(evt) {
      res.write(evt.toString());
    }).
    send(function(err) {
      if (err) {
        return next (err);
      }

      res.write('File available at: ' + getUrl(req) + key + getNewline(req));
      res.end();
    });
});

api.get('/:key', awsMiddleware, function (req, res, next) {
  const key = req.params.key;
  const params = { Bucket: bucket, Key: key };
  var s3 = new req.aws.S3();
  s3.getObject(params).on('error', function (err) {
    next(err);
  }).createReadStream().pipe(res);
});



module.exports = api;
