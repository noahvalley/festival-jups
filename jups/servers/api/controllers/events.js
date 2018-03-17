'use strict';

var auth = require('./auth.js');
var database = require('./database.js');

var events = {
	get : function(req, res, next){
	    res.setHeader('Content-Type', 'application/json');
//	    res.end(database.events.getall);
		next();
	},
	getOne : function(req, res, next){
	    res.setHeader('Content-Type', 'application/json');
	    res.end(database.events.getone(req.params.id));
	},
	update : function(req, res, next){
		aut.check(req, res, function(){
			
		});
	},
	delete : function(req, res, next){
		aut.check(req, res, function(){
			
		});
	}
}
module.exports = events;