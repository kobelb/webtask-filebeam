'use strict';

var express = require('express');
var Webtask = require('webtask-tools');
var api     = require('./api');

var app = express();
app.set('trust proxy', true);
app.use(api);

module.exports = Webtask.fromExpress(app);
