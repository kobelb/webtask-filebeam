module.exports = function (req, res, next) {
  const aws = require('aws-sdk');
  const bucket = 'filebeam';

  var accessKeyId = req.webtaskContext.secrets.awsAccessKeyId;
  var secretAccessKey = req.webtaskContext.secrets.awsSecretAccessKey;

  aws.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: 'us-west-2'
  });

  req.storage = {
    upload: function (key, stream, done) {
      var s3 = new aws.S3({params: {Bucket: bucket, Key: key}});
      s3.upload({Body: stream})
        .on('httpUploadProgress', function (evt) {

        })
        .send(function(err) {
          done(err);
      });
    },
    download: function (key) {
      const params = { Bucket: bucket, Key: key };
      var s3 = new aws.S3();

      // all the nonsense below is so we can receive error events and if we don't subscribe
      // to them everywhere below, aws-sdk is throwing exceptions that crash the app :/
      var errorCallback = function () {};

      var request = s3.getObject(params).on('error', errorCallback);

      var result =  {
        on: function (evt, cb) {
          // we're only propagating the 'error' event at this time
          switch (evt) {
            case 'error':
              errorCallback = cb;
              break;
            default:
              throw new Error('Unsupported event type');
          }
          return result;
        },
        pipe: function (stream) {
          request.createReadStream().on('error', errorCallback).pipe(stream);
          return result;
        }
      };

      return result;
    }
  };

  next();
};