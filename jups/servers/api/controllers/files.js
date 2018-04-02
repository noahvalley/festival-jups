'use strict';

var path = require('path');
var fs = require('fs');


var files = {
	getFileList : function(req, res, next){
		console.log('files.getFileList');
		fs.readdir(path.join(__dirname, '../../../ressources/uploads/asdf'), (err, files) => {
			if (err){
				next({error: true, number: 9999, message: 'something with nodes fs-module', suberror: err});
			}else{
				var fileList = [];
				files.forEach(file => {
					fileList.push(file);
				});
				console.log(fileList);
				req.jupsdata = fileList;
				next();
			}
		});
	},
	upload : function(req, res, next){
		console.log('files.upload');
/*
		app.post('/upload', function(req, res){
		
		  // create an incoming form object
		  var form = new formidable.IncomingForm();
		
		  // specify that we want to allow the user to upload multiple files in a single request
		  form.multiples = true;
		
		  // store all uploads in the /uploads directory
		  form.uploadDir = path.join(__dirname, '/uploads');
		
		  // every time a file has been uploaded successfully,
		  // rename it to it's orignal name
		  form.on('file', function(field, file) {
		    fs.rename(file.path, path.join(form.uploadDir, file.name));
		  });
		
		  // log any errors that occur
		  form.on('error', function(err) {
		    console.log('An error has occured: \n' + err);
		  });
		
		  // once all the files have been uploaded, send a response to the client
		  form.on('end', function() {
		    res.end('success');
		  });
		
		  // parse the incoming request containing the form data
		  form.parse(req);
		

		});
*/	}
}

module.exports = files;