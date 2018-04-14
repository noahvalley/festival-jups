'use strict';

var path = require('path');
var fs = require('fs');
var formidable = require('formidable');

var file = {
	getFileList : function(req, res, next){
		console.log('file.getFileList');
		fs.readdir(path.join(__dirname, '../../../ressources/upload/file'), (err, files) => {
			if (err){
				next({error: true, number: 9001, message: 'something wrong with nodes fs-module', suberror: err});
			}else{
				var fileList = [];
				files.forEach(file => {
					fileList.push(file);
				});
				req.jupssenddata = fileList;
				next();
			}
		});
	},
	upload : function(req, res, next){
		console.log('file.upload');
		var form = new formidable.IncomingForm();
		form.uploadDir = path.join(__dirname, '../../../ressources/upload/file');
		form.on('file', function(field, file) {
			fs.rename(file.path, path.join(form.uploadDir, file.name), err => {
				if (err){
					next({error: true, number: 9002, message: 'something wrong with the renaming', suberror: err});
				}
			});
		});
		
		// log any errors that occur
		form.on('error', function(err) {
			next({error: true, number: 9000, message: 'something wrong with the upload', suberror: err});
		});
		
		// once all the files have been uploaded, send a response to the client
		form.on('end', function() {
			next();
		});
		form.parse(req);
	},
	delete : function(req, res, next){
		console.log('file.delete');
		fs.unlink(path.join(__dirname, '../../../ressources/upload/file/',req.params.filename), (err) => {
			if (err) next({error: true, number: 9004, message: 'something wrong with deleting', suberror: err});
			next();
		});
	}
}

module.exports = file;