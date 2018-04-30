'use strict';
var fs = require('fs');
var path = require('path');
var jimp = require('jimp');
var logger = require('../libraries/logger.js');

var images = {
  resize : (filename, subfolder, callback) => {
    var imageRawPath = path.join(path.join(__dirname, '../../../ressources/upload/images/'), subfolder);
    var imageH60PathOhneSub = path.join(path.join(__dirname, '../../../ressources/upload/images/'), 'H60/');
    var imageW600PathOhneSub = path.join(path.join(__dirname, '../../../ressources/upload/images/'), 'W600/');
    var imageH60Path = path.join(imageH60PathOhneSub, subfolder);
    var imageW600Path = path.join(imageW600PathOhneSub, subfolder);

    if (!fs.existsSync(imageH60PathOhneSub)){
      fs.mkdirSync(imageH60PathOhneSub);
    }
    if (!fs.existsSync(imageW600PathOhneSub)){
      fs.mkdirSync(imageW600PathOhneSub);
    }
    if (!fs.existsSync(imageH60Path)){
      fs.mkdirSync(imageH60Path);
    }
    if (!fs.existsSync(imageW600Path)){
      fs.mkdirSync(imageW600Path);
    }

    jimp.read(path.join(imageRawPath, filename), function (err, data) {
      logger('resizeing: ' + filename);
      if (err){
        callback(err);
      }else{
        callback();
      }
      data.resize(jimp.AUTO, 60).write(path.join(imageH60Path, filename));
      data.resize(600, jimp.AUTO).write(path.join(imageW600Path, filename));
    });
  }
}
module.exports = images;