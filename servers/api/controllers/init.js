var sha256 = require('sha256');
var logger = require('../libraries/logger.js');
var logger = require('../libraries/logger.js');

var reset = {
  init : () => {
    logger('init.init');
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