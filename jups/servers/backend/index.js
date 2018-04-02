'use strict';

var connect = require('connect');
var serveStatic = require('serve-static');

var app = connect();

app.use(serveStatic('../jups/ressources/backend/public'));

module.exports = app;