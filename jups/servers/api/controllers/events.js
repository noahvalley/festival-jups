'use strict';


var events = {
	getAll : (req, res, next) => {
		console.log('events.getAll');
		req.jupsdata = global.jupsstate.events;
		next();
	},
	get : (req, res, next) => {
		console.log('events.get');
		var event = global.jupsstate.events.filter(event => event.id == req.params.id)[0];
		if (event == undefined){
			req.jupsdata = event;			
			next({error: true, number: 201, message: 'id not found'});
		}else{
			req.jupsdata = event;			
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
		var event = req.body;
		event.id = nextid;

		global.jupsstate.events.push(event);
		
		req.jupsdata = event;
		next();
		
//		res.jupsdata = {global.jupsstate.events[req.params.id]};

	},
	update : (req, res, next) => {
		console.log('events.update');
		var event = req.body;
		if (req.params.id === event.id){
			var found = false;
			for (var event in global.jupsstate.events){
				if (global.jupsstate.events[event].id === req.params.id){
					global.jupsstate.events[event] = req.body;
					found = true;
				}
			}
			if (found){
				req.jupsdata = req.body;
			}else{
				next({error: true, number: 201, message: 'id not found'});
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
			req.jupsdata = {};
			next();
		}else{
			req.jupsdata = {};
			next({error: true, number: 201, message: 'id not found in the system'});
		}
	}
}

module.exports = events;