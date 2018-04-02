'use strict';

var database = require('./database.js');
var cookie = require('cookie');
var sha256 = require('sha256');

var events = {
	check : function(req, res, next){
		console.log('auth.check');
		var cookies = cookie.parse(req.headers.cookie || '');
		var sessionID = cookies.jupsadmin;
		var loggedin = false;
		var session = global.jupsstate.sessions[sessionID];
		var sessionTimeDiffSec = (global.jupsstate.sessions[sessionID] - new Date())/1000;
		if (session != undefined){
			if (sessionTimeDiffSec > 86400){
				next({error : true, number: 101, message: "Coockie too old."});
			}else{
				next();
			}
		}else{
			next({error : true, number: 101, message: "Not logged in."});
		}
	},
	login : function(req, res, next){
		console.log('auth.login');
		var user = global.jupsstate.users.find(user => user.username === req.body.username && user.password === sha256(req.body.password));
		console.log(req.body.username);
		console.log(req.body.password);
		if (user === undefined){
			next({error : true, number: 102, message: "Username or Password incorrect."});
		}else{
			var found = false;
			var sessionID;
			while (!found){
				sessionID = sha256('random:' + Math.random());
				if (global.jupsstate.sessions[sessionID] === undefined){
					found = true;
					global.jupsstate.sessions[sessionID] = new Date();
				}
			}
			res.setHeader('Set-Cookie', cookie.serialize('jupsadmin', sessionID));
			next();	
		}
	},
	logout : function(req, res, next){
		console.log('auth.logout');
		next();
	}
}

module.exports = events;