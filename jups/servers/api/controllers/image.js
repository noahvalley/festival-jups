'use strict';

var path = require('path');
var fs = require('fs');
var formidable = require('formidable');

var image = {
	getImageList : function(req, res, next){
		console.log('image.getImageList');
		var filesFolderPath = path.join(__dirname, '../../../ressources/upload/file');
		var fileList = {};
		fs.readdir(filesFolderPath, function(err, folders) {
			for (var folder in folders){
				fs.stat(path.join(filesFolderPath, folders[folder]), function(err, stats){
					if (err){
						next({error: true, number: 9001, message: 'something wrong with nodes fs-module', suberror: err});
					}else{
						if (stats.isDirectory()){
							fileList[folders[folder]] = [];
							fs.readdir(path.join(filesFolderPath, folders[folder]), (err, files) => {
								if (err){
									next({error: true, number: 9001, message: 'something wrong with nodes fs-module', suberror: err});
								}else{
									files.forEach(function(file) {
										fileList[folders[folder]].push(file);
									});
								}
							})
						}
					}
				});
			}
			console.log(fileList);
			req.jupssenddata = fileList;
			next();
		});
	},
	upload : function(req, res, next){
		console.log('file.upload');
		var form = new formidable.IncomingForm();
		form.jupsTmpFiles = [];
		form.jupsSession = '';
		form.uploadDir = path.join(__dirname, '../../../ressources/upload/tmp');
		form.uploadDirDef = path.join(__dirname, '../../../ressources/upload/image/' + new Date().getFullYear());
		form.on('file', function(field, file) {
			form.jupsTmpFiles.push(file);
		});
		form.on('field', function(name, value) {
			if (name === 'session'){
				form.jupsSession = value;
			}
		});

		form.on('error', function(err) {
			next({error: true, number: 9000, message: 'something wrong with the form', suberror: err});
		});
		
		form.on('end', function() {
			var sessionID = global.jupsstate.sessions[form.jupsSession];
			if (sessionID != undefined){
				var sessionTimeDiffSec = (global.jupsstate.sessions[sessionID] - new Date())/1000;
				if (sessionTimeDiffSec > 86400){
					next({error : true, number: 101, message: "Coockie too old."});
				}else{
					global.jupsstate.sessions[sessionID] = new Date();
					for (var file in form.jupsTmpFiles){
						fs.rename(form.jupsTmpFiles[file].path, path.join(form.uploadDirDef, form.jupsTmpFiles[file].name), err => {
							if (err){
								next({error: true, number: 9002, message: 'something wrong with the renaming', suberror: err});
							}
						});
					}
					next();
				}
			}else{
				next({error : true, number: 101, message: "Not logged in."});
			}
		});
		form.parse(req);
	},
	delete : function(req, res, next){
		console.log('image.delete');
		fs.unlink(path.join(__dirname, '../../../ressources/upload/image/',req.params.filename), (err) => {
			if (err) next({error: true, number: 9004, message: 'something wrong with deleting', suberror: err});
			next();
		});
	}
}

module.exports = image;