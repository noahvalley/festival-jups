'use strict';

var database = require('./database.js');
var cookie = require('cookie');


var events = {
	check : function(req, res, next){
	   next();
	},
	login : function(req, res, next){
	   next();		
	},
	logout : function(req, res, next){
	   next();
	}
}
module.exports = events;