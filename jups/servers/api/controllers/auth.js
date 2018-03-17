'use strict';

var database = require('./database.js');
var cookie = require('cookie');


var events = {
	check : function(req, res, next){
	    res.setHeader('Content-Type', 'application/json');
	    res.send(JSON.stringify({ a: 1 }));
	},
	login : function(req, res, next){
		
	},
	logout : function(req, res, next){
		
	}
}
module.exports = events;