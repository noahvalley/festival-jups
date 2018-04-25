var sha256 = require('sha256');
var path = require('path');
var fs = require('fs');
var logger = require('../libraries/logger.js');

var reset = {
  init : () => {
    logger('init.init');
    var upload = path.join(__dirname, '../../../ressources/upload')
    if (!fs.existsSync(upload)){
      fs.mkdirSync(upload);
    }
    var tmp = path.join(__dirname, '../../../ressources/upload/tmp')
    if (!fs.existsSync(tmp)){
      fs.mkdirSync(tmp);
    }
    var files = path.join(__dirname, '../../../ressources/upload/files')
    if (!fs.existsSync(files)){
      fs.mkdirSync(files);
    }
    var images = path.join(__dirname, '../../../ressources/upload/files')
    if (!fs.existsSync(images)){
      fs.mkdirSync(images);
    }
    global.jupsstate = {
      users: [{username: process.env.jupsUser, password: sha256(process.env.jupsPass)}],
      sessions: {}
    }
  },
  sendData : (req,res,next) => {
    logger('sendData');
    var response = {
      error : req.jupserror || {error : false, number : 0, message: 'no error'},
      data : req.jupssenddata || {}
    }
      res.setHeader('Content-Type', 'application/json');
    res.send(response);
  },
  sendError : (err, req,res,next) => {
    logger('sendError');
    var response = {
      error : err,
      data : req.jupssenddata || {}
    }
      res.setHeader('Content-Type', 'application/json');
    res.send(response);
  }
}

module.exports = reset;