'use strict';

var connect = require('connect');
var serveStatic = require('serve-static');

var app = connect();

app.use(serveStatic('../jups/ressources/frontend'));

module.exports = app;