'use strict';

var connect = require('connect');
var serveStatic = require('serve-static');
var path = require('path');
var fs = require('fs');

var app = connect();


var serveIndex = (req, res, next) => {
  fs.readFile(path.join(__dirname, '../../ressources/frontend/build/index.html'), (err, data) => {
    if (err){
	    res.sendStatus(404);
    }else{
      res.end(data);
    }
  });
}

app.use('/static', serveStatic(path.join(__dirname, '../../ressources/frontend/build/static')));
app.use('/', serveStatic(path.join(__dirname, '../../ressources/frontend/build')));
app.use('/home', serveIndex);
app.use('/programm', serveIndex);
app.use('/tickets', serveIndex);
app.use('/kontakt', serveIndex);
app.use('/archiv', serveIndex);
app.use('/orte', serveIndex);
app.use('/downloads', serveIndex);

app.use('/home', serveIndex);

app.use((req, res, next) => {
  res.sendStatus(404);
});

module.exports = app;