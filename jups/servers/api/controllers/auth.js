'use strict';

var error = require('../libraries/error.js');
var sha256 = require('sha256');

var auth = {
  check : (req, res, next) => {
    console.log('auth.check');
    var sessionID = req.body.session;
    var session = global.jupsstate.sessions[sessionID];
    if (session != undefined){
      var sessionTimeDiffSec = (global.jupsstate.sessions[sessionID] - new Date())/1000;
      if (sessionTimeDiffSec > 86400){
        next(error.coockieTooOld());
      }else{
        global.jupsstate.sessions[sessionID] = new Date();
        next();
      }
    }else{
      next(error.notLoggedIn());
    }
  },
  login : (req, res, next) => {
    if (req.body.data === undefined){
      next({error : true, number: 110, message: "No Data."});
    }else{

    var user = global.jupsstate.users.find(user => user.username === req.body.data.username && user.password === sha256(req.body.data.password));
    if (user === undefined){
      next(error.loginDataIncorrect());
    }else{
      var found = false;
      var sessionID;
      while (!found){
        sessionID = sha256('random:' + Math.random());
        if (global.jupsstate.sessions[sessionID] === undefined){
          found = true;
          global.jupsstate.sessions[sessionID] = new Date();
        }
      }
      req.jupssenddata = {session: sessionID};
      next();  
    }}
  },
  logout : (req, res, next) => {
    console.log('auth.logout');
    next();
  }
}

module.exports = auth;