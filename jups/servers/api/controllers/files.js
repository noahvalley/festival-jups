'use strict';

var path = require('path');
var fs = require('fs');
var formidable = require('formidable');

var files = {
	getFileList : function(req, res, next){
		console.log('files.getFileList');
		fs.readdir(path.join(__dirname, '../../../ressources/uploads/'), (err, files) => {
			if (err){
				next({error: true, number: 9000, message: 'something with nodes fs-module', suberror: err});
			}else{
				var fileList = [];
				files.forEach(file => {
					fileList.push(file);
				});
				console.log(fileList);
				req.jupssenddata = fileList;
				next();
			}
		});
	},
	upload : function(req, res, next){
		console.log('files.upload');
		var form = new formidable.IncomingForm();
		form.uploadDir = path.join(__dirname, '../../../ressources/uploads/');
		form.on('file', function(field, file) {
			fs.rename(file.path, path.join(form.uploadDir, file.name), err => {
				if (err){
					console.log(err);
				}
			});
		});
		
		// log any errors that occur
		form.on('error', function(err) {
			next({error: true, number: 9001, message: 'something with the upload', suberror: err});
		});
		
		// once all the files have been uploaded, send a response to the client
		form.on('end', function() {
			next();
		});
		form.parse(req);
	}
}

module.exports = files;