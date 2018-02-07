'use strict';

var connect = require('connect');
var serveStatic = require('serve-static');

var app = connect();

app.use(serveStatic('../../frontend'));

module.exports = app;