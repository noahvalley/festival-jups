'use strict';

var pages = {
	home : {
		get : function(req, res, next){
			console.log('pages.home.get');
			req.jupsdata = global.jupsstate.pages.home;
		},
		update : function(req, res, next){
			console.log('pages.home.update');
			global.jupsstate.pages.home = req.body;
		}
	},
	orte : {
		get : function(req, res, next){
			console.log('pages.orte.get');
			req.jupsdata = global.jupsstate.pages.orte;
		},
		update : function(req, res, next){
			console.log('pages.orte.update');
			global.jupsstate.pages.orte = req.body;
		}
	},
	kontakt : {
		get : function(req, res, next){
			console.log('pages.kontakt.get');
			req.jupsdata = global.jupsstate.pages.kontakt;			
		},
		update : function(req, res, next){
			console.log('pages.kontakt.update');
			global.jupsstate.pages.kontakt = req.body;
		}
	},
	downloads : {
		get : function(req, res, next){
			console.log('pages.downloads.get');
			req.jupsdata = global.jupsstate.pages.downloads;
		},
		update : function(req, res, next){
			console.log('pages.downloads.update');
			global.jupsstate.pages.downloads = req.body;
		}
	},
	archiv : {
		get : function(req, res, next){
			console.log('pages.archiv.get');
			req.jupsdata = global.jupsstate.pages.archiv;
		},
		update : function(req, res, next){
			global.jupsstate.pages.archiv = req.body;
			console.log('pages.archiv.update');
		}
	}
}

module.exports = pages;