'use strict';

var database = require('../libraries/database.js');
var error = require('../libraries/error.js');
var logger = require('../libraries/logger.js');

var events = {
  getAll : (req, res, next) => {
    logger('events.getAll');
    database.getEvents((events,err) => {
      if (err){
        logger('DataBaseReadEventsError: ' + err);
      }else{
        req.jupssenddata = events;
        next();
      }
    });
  },
  get : (req, res, next) => {
    logger('events.get '+req.params.id);
    database.getEventById(req.params.id, (event,err) => {
      logger(event);
      if (err){
        next(err);
      }else{
        req.jupssenddata = event;
        next();
      }
    });
  },
  create : (req, res, next) => {
    logger('events.create');
    database.createEvent(req.body.data, (event, err)=>{
      req.jupssenddata = event;
      if (err){
        next(err);
      }else{
        next();
      }
    });
  },
  update : (req, res, next) => {
    logger('events.update');
    if (req.params.id == req.body.data.id){
      database.updateEvent(req.body.data, (event, err)=>{
        req.jupssenddata = event;
        if (err){
          next(err);
        }else{
          next();
        }
      });
    }else{
      next(error.eventIdAndRestMissmatch());
    }
  },
  delete : (req, res, next) => {
    logger('events.delete');
    database.deleteEventById(req.params.id, (err)=>{
      req.jupssenddata = {};
      if (err){
        next(err);
      }else{
        next();
      }
    });
  }
}

module.exports = events;