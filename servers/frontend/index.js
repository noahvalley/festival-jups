'use strict';

var connect = require('connect');
var serveStatic = require('serve-static');
var path = require('path');

var app = connect();

app.use(serveStatic(path.join(__dirname, '../../ressources/frontend/build')));

module.exports = app;