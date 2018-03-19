'use strict';


var events = {
	getAll : (req, res, next) => {
		req.jupserror = {error: false, message: ''};
		req.jupsdata = global.jupsstate.events;
		next();
	},
	get : (req, res, next) => {
		var event = global.jupsstate.events.filter(event => event.id == req.params.id)[0];
		if (event == undefined){
			req.jupserror = {error: true, message: 'id not found'};
			req.jupsdata = event;			
		}else{
			req.jupserror = {error: false, message: ''};
			req.jupsdata = event;			
		}
		next();
	},
	create : (req, res, next) => {
		var nextid = 1;
		for (var event in global.jupsstate.events){
			if (!(global.jupsstate.events[event].id < nextid)){
				nextid = global.jupsstate.events[event].id+1;
			}
		}
		var event = req.body;
		event.id = nextid;

		global.jupsstate.events.push(event);
		
		req.jupserror = {error: false, message: ''};
		req.jupsdata = event;
		next();
		
//		res.jupsdata = {global.jupsstate.events[req.params.id]};

	},
	update : (req, res, next) => {
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
				req.jupserror = {error: false, message: ''};
				req.jupsdata = req.body;
			}else{
				req.jupserror = {error: true, message: 'id not found'};
				req.jupsdata = {};
			}
		}else{
			req.jupserror = {error: true, message: 'id in data does not match ip of REST connection'};
			req.jupsdata = {};
		}
	},
	delete : (req, res, next) => {
		var found = false;
		for (var event in global.jupsstate.events){
			if (global.jupsstate.events[event].id == req.params.id){
				found = global.jupsstate.events[event];
				global.jupsstate.events.splice(event, 1);
			}
		}
		if (found){
			req.jupserror = {error: false, message: ''};
			req.jupsdata = {};
		}else{
			req.jupserror = {error: true, message: 'id not found in the system'};
			req.jupsdata = {};
		}
		next();
	}
}
module.exports = events;