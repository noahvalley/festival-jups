'use strict';

var connect = require('connect');
var connectRest = require('connect-rest');
var serveStatic = require('serve-static');

var app = connect();



var options = {
    context: '/',
    logger:{ file: 'mochaTest.log', level: 'debug' },
	apiKeys: [ '849b7648-14b8-4154-9ef2-8d1dc4c2b7e9' ],
    // discover: { path: 'discover', secure: true },
    // proto: { path: 'proto', secure: true }
}
var rest = connectRest.create(options);
 
// adds connect-rest middleware to connect
app.use(rest.processRequest());


// app.post('/events, db.createProject);
// app.delete('/events/:project_id', db.deleteEvent);
// app.put('/events/:project_id', db.updateEvent);
// app.get('/events', function(res, req){});
// app.use(express.static('./uploads'));


app.use(serveStatic('../../uploads'));

module.exports = app;