'use strict';

var connect = require('connect');
var serveStatic = require('serve-static');
var connectRoute = require('connect-route');
var bodyParser = require('body-parser');

var events = require('./controllers/events.js');
var pages = require('./controllers/pages.js');
var auth = require('./controllers/auth.js');
var reset = require('./controllers/reset.js');

var app = connect();
global.jupsstate = {
	events: [],
	pages: {
		home: '',
		orte: '',
		kontakt: '',
		archiv: '',
	},
	users: [],
	sessions: {}
}

var sendData = (req,res,next) => {
	var response = {
		error : req.jupserror,
		data : req.jupsdata
	}
	console.log('test');
    res.setHeader('Content-Type', 'application/json');
	res.send(response);
}

var get$events = connect();
get$events.use(events.getAll);
get$events.use(sendData);

var post$events = connect();
post$events.use(auth.check);
post$events.use(events.create);
post$events.use(sendData);

var get$eventsId = connect();
get$eventsId.use(events.get);
get$eventsId.use(sendData);

var put$eventsId = connect();
put$eventsId.use(auth.check);
put$eventsId.use(events.update);
put$eventsId.use(sendData);

var delete$eventsId = connect();
delete$eventsId.use(auth.check);
delete$eventsId.use(events.delete);
delete$eventsId.use(sendData);


app.use(bodyParser.json());
app.use(connectRoute(function (router) {
	router.get('/events', get$events);
	router.post('/events', post$events);

	router.get('/events/:id', get$eventsId);
	router.put('/events/:id', put$eventsId);
	router.delete('/events/:id', delete$eventsId);
	
	router.get('/pages/home', pages.home.get);
	router.get('/pages/orte', pages.orte.get);
	router.get('/pages/kotakt', pages.kontakt.get);
	router.get('/pages/kotakt', pages.downloads.get);
	router.get('/pages/archiv', pages.archiv.get);

	router.put('/pages/home', pages.home.update);
	router.put('/pages/orte', pages.orte.update);
	router.put('/pages/kontakt', pages.kontakt.update);
	router.put('/pages/kontakt', pages.downloads.update);
	router.put('/pages/archiv', pages.archiv.update);


	router.post('/login', function(){});
	router.post('/createuser', function(){});
	router.get('/files', function(){});
	router.delete('/files/:filename', function(){});



	router.get('/resetstate', reset.reset);
}));

app.use(serveStatic('../jups/ressources/uploads'));

module.exports = app;