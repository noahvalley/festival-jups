'use strict';

var pages = {
	home : {
		get : function(req, res, next){
			console.log('pages.home.get');
			req.jupssenddata = global.jupsstate.pages.home;
			next();
		},
		update : function(req, res, next){
			console.log('pages.home.update');
			global.jupsstate.pages.home = req.body.data;
			next();
		}
	},
	orte : {
		get : function(req, res, next){
			console.log('pages.orte.get');
			req.jupssenddata = global.jupsstate.pages.orte;
			next();
		},
		update : function(req, res, next){
			console.log('pages.orte.update');
			global.jupsstate.pages.orte = req.body.data;
			next();
		}
	},
	kontakt : {
		get : function(req, res, next){
			console.log('pages.kontakt.get');
			req.jupssenddata = global.jupsstate.pages.kontakt;			
			next();
		},
		update : function(req, res, next){
			console.log('pages.kontakt.update');
			global.jupsstate.pages.kontakt = req.body.data;
			next();
		}
	},
	downloads : {
		get : function(req, res, next){
			console.log('pages.downloads.get');
			req.jupssenddata = global.jupsstate.pages.downloads;
			next();
		},
		update : function(req, res, next){
			console.log('pages.downloads.update');
			global.jupsstate.pages.downloads = req.body.data;
			next();
		}
	},
	archiv : {
		get : function(req, res, next){
			console.log('pages.archiv.get');
			req.jupssenddata = global.jupsstate.pages.archiv;
			next();
		},
		update : function(req, res, next){
			global.jupsstate.pages.archiv = req.body.data;
			console.log('pages.archiv.update');
			next();
		}
	}
}

module.exports = pages;