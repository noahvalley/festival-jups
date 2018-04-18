'use strict';

var error = require('../libraries/database.js');
var error = require('../libraries/error.js');

var events = {
	getAll : (req, res, next) => {
		console.log('events.getAll');
		req.jupssenddata = global.jupsstate.events;
		next();
	},
	get : (req, res, next) => {
		console.log('events.get'+req.params.id);
		var event = global.jupsstate.events.find(eventum => eventum.id == req.params.id);
		if (event == undefined){
			req.jupssenddata = event;			
			next(error.eventIdNotFound());
		}else{
			req.jupssenddata = event;			
			next();
		}
	},
	create : (req, res, next) => {
		console.log('events.create');
		var nextid = 1;
		for (var event in global.jupsstate.events){
			if (!(global.jupsstate.events[event].id < nextid)){
				nextid = global.jupsstate.events[event].id+1;
			}
		}
		var event = req.body.data;
		event.id = nextid;

		global.jupsstate.events.push(event);
		
		req.jupssenddata = event;
		next();
		
//		res.jupsdata = {global.jupsstate.events[req.params.id]};

	},
	update : (req, res, next) => {
		console.log('events.update');
		if (req.params.id == req.body.data.id){
			var eventIndex = global.jupsstate.events.findIndex(eventum => eventum.id == req.params.id);
			if (eventIndex === -1){
				next(error.eventIdNotFound());
			}else{
				global.jupsstate.events[eventIndex] = req.body.data;
				req.jupssenddata = event;
				next();
			}
		}else{
			next(error.eventIdAndRestMissmatch());
		}
	},
	delete : (req, res, next) => {
		console.log('events.delete');
		var found = false;
		for (var event in global.jupsstate.events){
			if (global.jupsstate.events[event].id == req.params.id){
				found = global.jupsstate.events[event];
				global.jupsstate.events.splice(event, 1);
			}
		}
		if (found){
			req.jupssenddata = {};
			next();
		}else{
			req.jupssenddata = {};
			next(error.eventIdNotFound());
		}
	}
}

module.exports = events;