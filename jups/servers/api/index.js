'use strict';

var connect = require('connect');
var serveStatic = require('serve-static');
var connectRoute = require('connect-route');

var events = require('./controllers/events.js');
var pages = require('./controllers/pages.js');

var app = connect();

var $events = connect();
$events.use(events.get);
$events.use((req, res, next) => {
	console.log('One event delivered');
	res.end();
});


app.use(connectRoute(function (router) {

	router.get('/events', $events);
	
	router.get('/events/:id', events.getOne);

	router.put('/events/:id', events.update);
	router.delete('/events/:id', events.delete);
	
	router.get('/pages/home', pages.home.get);
	router.get('/pages/orte', pages.orte.get);
	router.get('/pages/kotakt', pages.kontakt.get);
	router.get('/pages/archiv', pages.archiv.get);

	router.put('/pages/home', pages.home.update);
	router.put('/pages/orte', pages.orte.update);
	router.put('/pages/kontakt', pages.kontakt.update);
	router.put('/pages/archiv', pages.archiv.update);
}));

app.use(serveStatic('../jups/ressources/uploads'));

module.exports = app;