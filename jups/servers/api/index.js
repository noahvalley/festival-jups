'use strict';

var res = require('dotenv').config({path: __dirname+'/data.env'});  

var connect = require('connect');
var serveStatic = require('serve-static');
var connectRoute = require('connect-route');
var bodyParser = require('body-parser');
var cors = require('cors')
var path = require('path');

var init = require('./controllers/init.js');
var events = require('./controllers/events.js');
var pages = require('./controllers/pages.js');
var file = require('./controllers/files.js');
var auth = require('./controllers/auth.js');
var mailer = require('./controllers/mailer.js');

init.init();
init.setDemodata();
var sendData = init.sendData;
var sendError = init.sendError;

var app = connect();

/*
var corsWhitelist = ['http://festival-jups.ch', 'http://admin.festival-jups.ch','https://festival-jups.ch', 'https://admin.festival-jups.ch'];
var corsOptionsDelegate = (req, callback) => {
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
app.use(connectRoute((router) => {
  router.get('/events',
    connect()
    .use(events.getAll)
    .use(sendData)
    .use(sendError)  
  );
  router.post('/events',
    connect()
    .use(auth.check)
    .use(events.create)
    .use(sendData)
    .use(sendError)  
  );

  router.get('/events/:id',
    connect()
    .use(events.get)
    .use(sendData)
    .use(sendError)  
  );
  router.put('/events/:id', 
    connect()
    .use(auth.check)
    .use(events.update)
    .use(sendData)
    .use(sendError)
  );
  router.delete('/events/:id', 
    connect()
    .use(auth.check)
    .use(events.delete)
    .use(sendData)
    .use(sendError)
  );
  
  router.get('/pages', 
    connect()
    .use(pages.getAll)
    .use(sendData)
    .use(sendError)
  );
  router.get('/pages/home', 
    connect()
    .use(pages.home.get)
    .use(sendData)
    .use(sendError)
  );
  router.get('/pages/orte', 
    connect()
    .use(pages.orte.get)
    .use(sendData)
    .use(sendError)
  );
  router.get('/pages/kontakt', 
    connect()
    .use(pages.kontakt.get)
    .use(sendData)
    .use(sendError)
  );
  router.get('/pages/archiv', 
    connect()
    .use(pages.archiv.get)
    .use(sendData)
    .use(sendError)
  );
  router.get('/pages/downloads', 
    connect()
    .use(pages.downloads.get)
    .use(sendData)
    .use(sendError)
  );

  router.put('/pages/home',
    connect()
    .use(auth.check)
    .use(pages.home.update)
    .use(sendData)
    .use(sendError)
  );
  router.put('/pages/orte',
    connect()
    .use(auth.check)
    .use(pages.orte.update)
    .use(sendData)
    .use(sendError)
  );
  router.put('/pages/kontakt',
    connect()
    .use(auth.check)
    .use(pages.kontakt.update)
    .use(sendData)
    .use(sendError)
  );
  router.put('/pages/archiv',
    connect()
    .use(auth.check)
    .use(pages.archiv.update)
    .use(sendData)
    .use(sendError)
  );
  router.put('/pages/downloads',
    connect()
    .use(auth.check)
    .use(pages.downloads.update)
    .use(sendData)
    .use(sendError)
  );

  router.get('/files',
    connect()
    .use(file.setPathFiles)
    .use(file.getFileList)
    .use(sendData)
    .use(sendError)
  );
  router.post('/files',
    connect()
    .use(file.setPathFiles)
    .use(file.upload)
    .use(file.getFileList)
    .use(sendData)
    .use(sendError)
  );
  router.delete('/files/:filename',
    connect()
    .use(auth.check)
    .use(file.setPathFiles)
    .use(file.delete)
    .use(file.getFileList)
    .use(sendData)
    .use(sendError)
  );

  router.get('/images',
    connect()
    .use(file.setPathImages)
    .use(file.getFileList)
    .use(sendData)
    .use(sendError)
  );
  router.post('/images',
    connect()
    .use(file.setPathImages)
    .use(file.upload)
    .use(file.getFileList)
    .use(sendData)
    .use(sendError)
  );
  router.delete('/images/:filename',
    connect()
    .use(auth.check)
    .use(file.setPathImages)
    .use(file.delete)
    .use(file.getFileList)
    .use(sendData)
    .use(sendError)
  );

  router.post('/login', 
    connect()
    .use(auth.login)
    .use(sendData)
    .use(sendError)
  );
  router.post('/logincheck', 
    connect()
    .use(auth.check)
    .use(sendData)
    .use(sendError)
  );

  router.post('/sendmail',
    connect()
    .use(mailer.checkapikey)
    .use(mailer.composemail)
    .use(mailer.sendmail)
    .use(sendData)
    .use(sendError)
  );
}));

app.use('/images', serveStatic(path.join(__dirname,'../../ressources/upload/image')));
app.use('/files', serveStatic(path.join(__dirname,'../../ressources/upload/file')));

module.exports = app;