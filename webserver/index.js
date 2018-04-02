'use strict';

var express = require('express');
var vhost = require('vhost')

// vhost apps
var frontend = require('../jups/servers/frontend');
var backend = require('../jups/servers/backend');
var api = require('../jups/servers/api');

//start server
var server = express();

// apply the vhost middleware
server.use(vhost('festival-jups.ch', frontend));
server.use(vhost('admin.festival-jups.ch', backend));
server.use(vhost('api.festival-jups.ch', api));

// start server
server.listen(80);