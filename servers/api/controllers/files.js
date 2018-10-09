'use strict';

var path = require('path');
var fs = require('fs');
var formidable = require('formidable');
var images = require('../libraries/images.js');
var error = require('../libraries/error.js');
var logger = require('../libraries/logger.js');

var file = {
  setPathFiles : (req, res, next) => {
    logger('setPathFiles');
    req.jupsfilepath = path.join(__dirname, '../../../ressources/upload/files');
    req.jupsfilepathtmp = path.join(__dirname, '../../../ressources/upload/tmp');
    next();
  },
  setPathImages : (req, res, next) => {
    logger('setPathImages');
    req.jupsfilepath = path.join(__dirname, '../../../ressources/upload/images');
    req.jupsfilepathtmp = path.join(__dirname, '../../../ressources/upload/tmp');
    next();
  },
  getFileList : (req, res, next) => {
    logger('getFileList');
    var fileList = {};
    var folders = fs.readdirSync(req.jupsfilepath);
    folders.forEach((folder) => {
      var stats = fs.statSync(path.join(req.jupsfilepath, folder));
      if (stats.isDirectory() && !isNaN(parseInt(folder))){
        fileList[folder] = [];
        var files = fs.readdirSync(path.join(req.jupsfilepath,folder));
        files.forEach((file) => {
          fileList[folder].push(file);
        });
      }
    });
    req.jupssenddata = fileList;
    next();
  },
  upload : (req, res, next) => {
    logger('upload');
    var form = new formidable.IncomingForm();
    form.jupsTmpFiles = [];
    form.jupsSession = '';
    form.uploadDir = req.jupsfilepathtmp;
    form.uploadDirDef = path.join(req.jupsfilepath, new Date().getFullYear().toString());
    if (!fs.existsSync(form.uploadDirDef)){
      fs.mkdirSync(form.uploadDirDef);
    }
    form.on('file', (field, file) => {
      form.jupsTmpFiles.push(file);
    });
    form.on('field', (name, value) => {
      if (name === 'session'){
        form.jupsSession = value;
      }
    });

    form.on('error', (err) => {
      next(error.formidableFail(err));
    });
    
    form.on('end', () => {
      var sessionID = global.jupsstate.sessions[form.jupsSession];
      if (sessionID != undefined){
        var sessionTimeDiffSec = (global.jupsstate.sessions[sessionID] - new Date())/1000;
        if (sessionTimeDiffSec > 86400){
          next(error.coockieTooOld());
        }else{
          global.jupsstate.sessions[sessionID] = new Date();
          req.jupsUploadedFiles = [];
          for (var file in form.jupsTmpFiles){
			fs.rename(form.jupsTmpFiles[file].path,
			  path.join(form.uploadDirDef, form.jupsTmpFiles[file].name
			    .replace('ö','oe').replace('ä','ae').replace('ü','ue')
				.replace('è','e').replace('é','e').replace('ê','e')
				.replace('Ö','oe').replace('Ä','ae').replace('Ü','ue')
				.replace('È','e').replace('É','e').replace('Ê','e')
			  ),
			err => {
                next(error.renameingFail(err));
              }
            );
            req.jupsUploadedFiles.push(form.jupsTmpFiles[file].name);
          }
          next();
        }
      }else{
        next(error.notLoggedIn());
      }
    });
    form.parse(req);
  },
  resizeImg : (req, res, next) => {
    logger('resizeImg');
    logger(req.jupsUploadedFiles);
    try {
      for (var file in req.jupsUploadedFiles){
        images.resize(req.jupsUploadedFiles[file], new Date().getFullYear().toString(), () =>{
        });
      }
      next();
    }
    catch(err) {
      next(error.resizeError(err));
    }
  },
  delete : (req, res, next) => {
    logger('delete');
    fs.unlink(path.join(path.join(req.jupsfilepath, req.params.fileyear), req.params.filename), (err) => {
      if (err) next(error.deletingFileFail(err));
      var W600Path = path.join(path.join(path.join(req.jupsfilepath, 'W600/'), req.params.fileyear), req.params.filename);
      if (fs.existsSync(W600Path)){
        fs.unlink(W600Path), (err) => {
          if (err) next(error.deletingFileFail(err));
        }
      }
      var H60 = path.join(path.join(path.join(req.jupsfilepath, 'H60/'), req.params.fileyear), req.params.filename);
      if (fs.existsSync(H60)){
        fs.unlink(H60), (err) => {
          if (err) next(error.deletingFileFail(err));
        }
      }
      next();
    });
  }
}

module.exports = file;