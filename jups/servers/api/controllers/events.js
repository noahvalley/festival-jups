'use strict';


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
			next({error: true, number: 201, message: 'id not found'});
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
			var event = global.jupsstate.events.find(eventum => eventum.id == req.params.id);
			if (event){
				event = req.body.data;
				req.jupssenddata = event;
				next();
			}else{
				next({error: true, number: 201, message: 'id not found'+req.body.data.id});
			}
		}else{
			next({error: true, number: 202, message: 'id in data does not match id of REST connection'});
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
			next({error: true, number: 201, message: 'id not found in the system'});
		}
	}
}

module.exports = events;