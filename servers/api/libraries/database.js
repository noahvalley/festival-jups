'use strict';
var fs = require('fs');
var path = require('path');
var error = require('../libraries/error.js');
var databasePath = path.join(__dirname, '../../../ressources/database/');
var evntsPath = path.join(databasePath, 'events.txt');
var pagesPath = path.join(databasePath, 'pages.txt');

var database = {
  init : (callback) => {
    global.jupsstate.events = [];
    global.jupsstate.pages = {home: '',orte: '',kontakt: '',archiv: '',};
    if (!fs.existsSync(databasePath)){
      fs.mkdirSync(databasePath);
    }
    if (!fs.existsSync(evntsPath)){
      fs.writeFileSync(evntsPath, '[]');
    }
    if (!fs.existsSync(pagesPath)){
      fs.writeFileSync(pagesPath, '[]');
    }
    
    fs.readFile(evntsPath, (err, data) => {
      if (err){
		      callback(error.DBReadFile(err));
      }else{
        global.jupsstate.events = JSON.parse(data);
        fs.readFile(pagesPath, (err, data) => {
          if (err){
    		    callback(error.DBReadFile(err));
          }else{
            global.jupsstate.pages = JSON.parse(data);
          }
        });
      }
    });
  },
  dumpEvents : (callback) => {
		fs.writeFile(evntsPath, JSON.stringify(global.jupsstate.events, null, '  '), function(err) {
		    if(err) {
		      callback(error.DBWriteFile(err));
		    }else{
          callback();
    		}
		});
  },
  dumpPages : (callback) => {
		fs.writeFile(pagesPath, JSON.stringify(global.jupsstate.pages, null, '  '), function(err) {
		    if(err) {
		      callback(error.DBWriteFile(err));
		    }else{
  		    callback();
		    }
		});
  },
  getEvents : (callback) => {
    callback(global.jupsstate.events);
  },
  getEventById : (id, callback) => {
    var event = global.jupsstate.events.find(event => event.id == id);
    if (event === undefined){
      callback(event, error.eventIdNotFound());
    }else{
      callback(event);
    }
  },
  createEvent : (event, callback) => {
    var nextid = 1;
    for (var eventum in global.jupsstate.events){
      if (!(global.jupsstate.events[eventum].id < nextid)){
        nextid = global.jupsstate.events[eventum].id+1;
      }
    }
    event.id = nextid;
    global.jupsstate.events.push(event);
    database.dumpEvents((err)=>{
      if (err){
        callback(event, err);
      }else{
        callback(event);
      }
    });
  },
  updateEvent : (event, callback) => {
    var eventIndex = global.jupsstate.events.findIndex(eventum => eventum.id == event.id);
    if (eventIndex === -1){
      next(error.eventIdNotFound());
    }else{
      global.jupsstate.events[eventIndex] = event;
      database.dumpEvents((err)=>{
        if (err){
          callback(event, err);
        }else{
          callback(event);
        }
      });
    }
  },
  deleteEventById : (id, callback) => {
    var found = false;
    for (var event in global.jupsstate.events){
      if (global.jupsstate.events[event].id == id){
        found = global.jupsstate.events[event];
        global.jupsstate.events.splice(event, 1);
      }
    }
    if (found){
      database.dumpEvents((err)=>{
        if (err){
          callback(err);
        }else{
          callback();
        }
      });
    }else{
      callback(error.eventIdNotFound());
    }
  },
  getPages : (callback) => {
    callback(global.jupsstate.pages);
  },
  getPageByName : (name, callback) => {
    callback(global.jupsstate.pages[name]);
  },
  updatePageByName : (name, page, callback) => {
    global.jupsstate.pages[name] = page;
    database.dumpPages((err)=>{
      if (err){
        callback(global.jupsstate.pages[name], err);
      }else{
        callback(global.jupsstate.pages[name]);
      }
    });
  } 
}

module.exports = database;