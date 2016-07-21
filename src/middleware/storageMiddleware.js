'use strict';

module.exports = function (req, res, next) {
  const aws = require('aws-sdk');

  const accessKeyId = req.webtaskContext.secrets.awsAccessKeyId;
  const bucket = req.webtaskContext.secrets.awsBucket;
  const secretAccessKey = req.webtaskContext.secrets.awsSecretAccessKey;
  const region = req.webtaskContext.secrets.awsRegion;

  aws.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: region
  });

  req.storage = {
    upload: function (key, stream, done) {
      const s3 = new aws.S3({params: {Bucket: bucket, Key: key}});
      s3.upload({Body: stream})
        .send(function(err) {
          done(err);
      });
    },
    download: function (key) {
      const DownloadTask = function (key) {
        const s3 = new aws.S3();

        // The aws-sdk takes a non-traditional approach to error handling, so we're
        // doing out best to hide the nuances. If we don't subscribe to the error
        // event where we are below, it throws an error crashing the app if something
        // goes wrong.
        let errorCallback = function () {};

        const params = { Bucket: bucket, Key: key };
        const request = s3.getObject(params).on('error', errorCallback);

        return {
          on: function (evt, cb) {
            // we're only propagating the 'error' event at this time
            switch (evt) {
              case 'error':
                errorCallback = cb;
                break;
              default:
                throw new Error('Unsupported event type');
            }
            return this;
          },
          pipe: function (stream) {
            request.createReadStream().on('error', errorCallback).pipe(stream);
            return this;
          }
        };
      };

      return new DownloadTask(key);
    }
  };

  next();
};