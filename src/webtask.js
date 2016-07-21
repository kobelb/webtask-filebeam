'use strict';

const express = require('express');
const Webtask = require('webtask-tools');
const api     = require('./api');

const app = express();
app.set('trust proxy', true);
app.use(api);

module.exports = Webtask.fromExpress(app);
