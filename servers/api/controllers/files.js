'use strict';

var path = require('path');
var fs = require('fs');
var formidable = require('formidable');
var images = require('../libraries/images.js');
var error = require('../libraries/error.js');

var file = {
  setPathFiles : (req, res, next) => {
    req.jupsfilepath = path.join(__dirname, '../../../ressources/upload/files');
    req.jupsfilepathtmp = path.join(__dirname, '../../../ressources/upload/tmp');
    next();
  },
  setPathImages : (req, res, next) => {
    req.jupsfilepath = path.join(__dirname, '../../../ressources/upload/images');
    req.jupsfilepathtmp = path.join(__dirname, '../../../ressources/upload/tmp');
    next();
  },
  getFileList : (req, res, next) => {
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
          req.jupsFiles = [];
          for (var file in form.jupsTmpFiles){
            fs.rename(form.jupsTmpFiles[file].path, path.join(form.uploadDirDef, form.jupsTmpFiles[file].name), err => {
              if (err){
                next(error.renameingFail(err));
              }
              req.jupsUploadedFiles.push(form.jupsTmpFiles[file].name);
            });
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
    try {
      for (var file in req.jupsUploadedFiles){
        filename, subfolder, callback
        images.resize(file, new Date().getFullYear().toString(), () =>{
        
        });
      }
    }
    catch(err) {
      next(error.resizeError(err));
    }
  },
  delete : (req, res, next) => {
    fs.unlink(path.join(path.join(req.jupsfilepath, req.params.fileyear), req.params.filename), (err) => {
      if (err) next(error.deletingFileFail(err));
      next();
    });
  }
}

module.exports = file;