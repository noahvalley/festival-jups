'use strict';

var database = require('../libraries/database.js');
var logger = require('../libraries/logger.js');
var error = require('../libraries/error.js');

var pages = {
  checkPage : (req, res, next) => {
    var guetligePages = ['home', 'programm', 'tickets', 'downloads', 'archiv', 'orte', 'kontakt'];
    var pageIndex = guetligePages.findIndex(page => page == req.params.pageName);
    if (pageIndex === -1){
      next(error.pageNotExisting());
    }else{
      next();
    }
  },
  getAll : (req, res, next) => {
      logger('pages.getAll');
      database.getPages((pages,err) => {
        if (err){
          next(err);
        }else{
          req.jupssenddata = pages;
          next();
        }
    });
  },
  getOne : (req, res, next) => {
    logger('pages.home.get');
    database.getPageByName(req.params.pageName, (page,err) => {
      logger(page);
      if (err){
        next(err);
      }else{
        req.jupssenddata = page;
        next();
      }
    });
  },
  updateOne : (req, res, next) => {
    database.updatePageByName(req.params.pageName, req.body.data, (page, err)=>{
      req.jupssenddata = page;
      if (err){
        next(err);
      }else{
        next();
      }
    });
  }
}

module.exports = pages;