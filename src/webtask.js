'use strict';

var _       = require('lodash');
var express = require('express');
var http    = require('http');
var Webtask = require('webtask-tools');
var config  = require('../config/webtask.config');
var api     = require('./api');

var app = express();
app.set('trust proxy', true);
app.use(api);

module.exports = Webtask.fromExpress(app);
