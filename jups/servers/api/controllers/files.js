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
		form.parse(req);
		next();
	}
}

module.exports = files;