'use strict';

var pages = {
	getAll : (req, res, next) => {
			console.log('pages.getAll');
			req.jupssenddata = {
				home: global.jupsstate.pages.home,
				orte: global.jupsstate.pages.orte,
				kontakt: global.jupsstate.pages.kontakt,
				downloads: global.jupsstate.pages.downloads,
				archiv: global.jupsstate.pages.archiv
			};
			next();		
	},
	home : {
		get : (req, res, next) => {
			console.log('pages.home.get');
			req.jupssenddata = global.jupsstate.pages.home;
			next();
		},
		update : (req, res, next) => {
			console.log('pages.home.update');
			global.jupsstate.pages.home = req.body.data;
			next();
		}
	},
	orte : {
		get : (req, res, next) => {
			console.log('pages.orte.get');
			req.jupssenddata = global.jupsstate.pages.orte;
			next();
		},
		update : (req, res, next) => {
			console.log('pages.orte.update');
			global.jupsstate.pages.orte = req.body.data;
			next();
		}
	},
	kontakt : {
		get : (req, res, next) => {
			console.log('pages.kontakt.get');
			req.jupssenddata = global.jupsstate.pages.kontakt;			
			next();
		},
		update : (req, res, next) => {
			console.log('pages.kontakt.update');
			global.jupsstate.pages.kontakt = req.body.data;
			next();
		}
	},
	downloads : {
		get : (req, res, next) => {
			console.log('pages.downloads.get');
			req.jupssenddata = global.jupsstate.pages.downloads;
			next();
		},
		update : (req, res, next) => {
			console.log('pages.downloads.update');
			global.jupsstate.pages.downloads = req.body.data;
			next();
		}
	},
	archiv : {
		get : (req, res, next) => {
			console.log('pages.archiv.get');
			req.jupssenddata = global.jupsstate.pages.archiv;
			next();
		},
		update : (req, res, next) => {
			global.jupsstate.pages.archiv = req.body.data;
			console.log('pages.archiv.update');
			next();
		}
	}
}

module.exports = pages;