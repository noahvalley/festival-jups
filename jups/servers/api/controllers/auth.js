'use strict';

var database = require('./database.js');
var cookie = require('cookie');
var sha256 = require('sha256');


var events = {
	check : function(req, res, next){
		var cookies = cookie.parse(req.headers.cookie || '');
		var sessionID = cookies.jupsadmin;
		var loggedin = false;
		var session = global.jupsstate.sessions[sessionID];
		var sessionTimeDiffSec = (global.jupsstate.sessions[sessionID] - new Date())/1000;
		console.log('auth.check');
		next();
/*		if (session != undefined){
			if (sessionTimeDiffSec > 86400){
				var response = {
					error : {error = true, number: 101, message: "Coockie too old"},
					data : {}
				}
			    res.setHeader('Content-Type', 'application/json');
				res.send(response);
			}else{
				next();
			}
		}else{
				var response = {
					error : {error = true, number: 100, message: "Not logged in"},
					data : {}
				}
			    res.setHeader('Content-Type', 'application/json');
				res.send(response);

		}
*/	},
	login : function(req, res, next){
		var found = false;
		var sessionID;
		while (!found){
			sessionID = sha256('random: ' + Math.random());
			if (global.jupsstate.sessions[sessionID] === undefined){
				found = true;
				global.jupsstate.sessions[sessionID] = new Date();
			}
		}
		res.setHeader('Set-Cookie', cookie.serialize('jupsadmin', sessionID));
		res.send('session: '+sessionID)
		next();	
	},
	logout : function(req, res, next){
		next();
	}
}
module.exports = events;