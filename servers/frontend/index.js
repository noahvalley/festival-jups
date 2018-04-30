'use strict';

var connect = require('connect');
var serveStatic = require('serve-static');
var path = require('path');
var fs = require('fs');

var app = connect();

app.use('/static', serveStatic(path.join(__dirname, '../../ressources/frontend/build/static')));
app.use((req, res, next) => {
  fs.readFile(path.join(__dirname, '../../ressources/frontend/build/index.html'), (err, data) => {
    if (err){
	    res.sendStatus(404);
    }else{
      res.end(data);
    }
  });
});


module.exports = app;