'use strict';

var connect = require('connect');
var serveStatic = require('serve-static');
var connectRoute = require('connect-route');
var bodyParser = require('body-parser');
var cors = require('cors')

var events = require('./controllers/events.js');
var pages = require('./controllers/pages.js');
var files = require('./controllers/files.js');
var auth = require('./controllers/auth.js');
var reset = require('./controllers/reset.js');

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
	console.log('sendData');
	var response = {
		error : req.jupserror || {error : false, number : 0, message: 'no error'},
		data : req.jupsdata || {}
	}
    res.setHeader('Content-Type', 'application/json');
	res.send(response);
}

var sendError = (err, req,res,next) => {
	console.log('sendError');
	var response = {
		error : err,
		data : req.jupsdata || {}
	}
    res.setHeader('Content-Type', 'application/json');
	res.send(response);
}

var get$events = connect();
get$events.use(events.getAll);
get$events.use(sendData);
get$events.use(sendError);

var post$events = connect();
post$events.use(auth.check);
post$events.use(events.create);
post$events.use(sendData);
post$events.use(sendError);

var get$eventsId = connect();
get$eventsId.use(events.get);
get$eventsId.use(sendData);
get$eventsId.use(sendError);

var put$eventsId = connect();
put$eventsId.use(auth.check);
put$eventsId.use(events.update);
put$eventsId.use(sendData);
put$eventsId.use(sendError);

var delete$eventsId = connect();
delete$eventsId.use(auth.check);
delete$eventsId.use(events.delete);
delete$eventsId.use(sendData);
delete$eventsId.use(sendError);



var get$pagesHome = connect();
get$pagesHome.use(pages.home.get);
get$pagesHome.use(sendData);
get$pagesHome.use(sendError);

var get$pagesOrte = connect();
get$pagesOrte.use(pages.orte.get);
get$pagesOrte.use(sendData);
get$pagesOrte.use(sendError);

var get$pagesKontakt = connect();
get$pagesKontakt.use(pages.kontakt.get);
get$pagesKontakt.use(sendData);
get$pagesKontakt.use(sendError);

var get$pagesArchiv = connect();
get$pagesArchiv.use(pages.archiv.get);
get$pagesArchiv.use(sendData);
get$pagesArchiv.use(sendError);

var get$pagesDownloads = connect();
get$pagesDownloads.use(pages.downloads.get);
get$pagesDownloads.use(sendData);
get$pagesDownloads.use(sendError);


var post$pagesHome = connect();
post$pagesHome.use(auth.check);
post$pagesHome.use(pages.home.update);
post$pagesHome.use(sendData);
post$pagesHome.use(sendError);

var post$pagesOrte = connect();
post$pagesOrte.use(auth.check);
post$pagesOrte.use(pages.orte.update);
post$pagesOrte.use(sendData);
post$pagesOrte.use(sendError);

var post$pagesKontakt = connect();
post$pagesKontakt.use(auth.check);
post$pagesKontakt.use(pages.kontakt.update);
post$pagesKontakt.use(sendData);
post$pagesKontakt.use(sendError);

var post$pagesArchiv = connect();
post$pagesArchiv.use(auth.check);
post$pagesArchiv.use(pages.archiv.update);
post$pagesArchiv.use(sendData);
post$pagesArchiv.use(sendError);

var post$pagesDownloads = connect();
post$pagesDownloads.use(auth.check);
post$pagesDownloads.use(pages.downloads.update);
post$pagesDownloads.use(sendData);
post$pagesDownloads.use(sendError);


var get$files = connect();
get$files.use(files.getFileList)
get$files.use(sendData);
get$files.use(sendError);

var post$login = connect();
post$login.use(auth.login);
post$login.use(sendData);
post$login.use(sendError);

var get$logincheck = connect();
get$logincheck.use(auth.check);
get$logincheck.use(sendData);
get$logincheck.use(sendError);


var app = connect();
/*
var corsWhitelist = ['http://festival-jups.ch', 'http://admin.festival-jups.ch','https://festival-jups.ch', 'https://admin.festival-jups.ch'];
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (corsWhitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response 
  }else{
    corsOptions = { origin: false } // disable CORS for this request 
  }
  callback(null, corsOptions) // callback expects two parameters: error and options 
}
app.use(cors(corsOptionsDelegate));
*/

app.use(cors());
app.use(bodyParser.json());
app.use(connectRoute(function (router) {
	router.get('/events', get$events);
	router.post('/events', post$events);

	router.get('/events/:id', get$eventsId);
	router.put('/events/:id', put$eventsId);
	router.delete('/events/:id', delete$eventsId);
	
	router.get('/pages/home', get$pagesHome);
	router.get('/pages/orte', get$pagesOrte);
	router.get('/pages/kontakt', get$pagesKontakt);
	router.get('/pages/archiv', get$pagesArchiv);
	router.get('/pages/downloads', get$pagesDownloads);

	router.put('/pages/home', post$pagesHome);
	router.put('/pages/orte', post$pagesOrte);
	router.put('/pages/kontakt', post$pagesKontakt);
	router.put('/pages/archiv', post$pagesArchiv);
	router.put('/pages/downloads', post$pagesDownloads);

	router.get('/files', get$files);


	router.post('/login', post$login);
	router.get('/logincheck', get$logincheck);

/*
	router.post('/createuser', function(){});
	router.delete('/files/:filename', function(){});
*/

	router.get('/resetstate', reset.reset);
}));

app.use(serveStatic('../jups/ressources/uploads'));

module.exports = app;