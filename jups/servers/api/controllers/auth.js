'use strict';

var database = require('./database.js');
var sha256 = require('sha256');
var formidable = require('formidable');

var auth = {
	check : function(req, res, next){
		console.log('auth.check');
		var sessionID = req.body.session;
		var session = global.jupsstate.sessions[sessionID];
		if (session != undefined){
			var sessionTimeDiffSec = (global.jupsstate.sessions[sessionID] - new Date())/1000;
			if (sessionTimeDiffSec > 86400){
				next({error : true, number: 101, message: "Coockie too old."});
			}else{
				global.jupsstate.sessions[sessionID] = new Date();
				next();
			}
		}else{
			next({error : true, number: 101, message: "Not logged in."});
		}
	},
	checkMultipart : function(req, res, next){
		console.log('auth.checkMultipart');
		var form = new formidable.IncomingForm();
		form.on('field', function(name, value) {
			if (name == 'session'){
				var sessionID = value;
				var session = global.jupsstate.sessions[sessionID];
				if (session != undefined){
					var sessionTimeDiffSec = (global.jupsstate.sessions[sessionID] - new Date())/1000;
					if (sessionTimeDiffSec > 86400){
						next({error : true, number: 101, message: "Coockie too old."});
					}else{
						global.jupsstate.sessions[sessionID] = new Date();
						next();
					}
				}else{
					next({error : true, number: 101, message: "Not logged in."});
				}
			}
		});		
		form.parse(req);
	},
	login : function(req, res, next){
		console.log('auth.login');
		if (req.body.data === undefined){
			next({error : true, number: 110, message: "No Data."});
		}else{

		var user = global.jupsstate.users.find(user => user.username === req.body.data.username && user.password === sha256(req.body.data.password));
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
			req.jupssenddata = {session: sessionID};
			next();	
		}}
	},
	logout : function(req, res, next){
		console.log('auth.logout');
		next();
	}
}

module.exports = auth;