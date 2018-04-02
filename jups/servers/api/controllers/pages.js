'use strict';

var pages = {
	home : {
		get : function(req, res, next){
			req.jupsdata = global.jupsstate.pages.home;
		},
		update : function(req, res, next){
			global.jupsstate.pages.home = req.body;
		}
	},
	orte : {
		get : function(req, res, next){
			req.jupsdata = global.jupsstate.pages.orte;
		},
		update : function(req, res, next){
			global.jupsstate.pages.orte = req.body;
		}
	},
	kontakt : {
		get : function(req, res, next){
			req.jupsdata = global.jupsstate.pages.kontakt;			
		},
		update : function(req, res, next){
			global.jupsstate.pages.kontakt = req.body;
		}
	},
	downloads : {
		get : function(req, res, next){
			req.jupsdata = global.jupsstate.pages.downloads;
		},
		update : function(req, res, next){
			global.jupsstate.pages.downloads = req.body;
		}
	},
	archiv : {
		get : function(req, res, next){
			req.jupsdata = global.jupsstate.pages.archiv;
		},
		update : function(req, res, next){
			global.jupsstate.pages.archiv = req.body;
		}
	}
};


module.exports = pages;