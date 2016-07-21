'use strict';

require('dotenv').load();

var config = {
  localPort: 8080,
  secrets: {
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    awsRegion: process.env.AWS_REGION,
    awsBucket: process.env.AWS_BUCKET
  },
  param: {
  }
};

module.exports = config;
