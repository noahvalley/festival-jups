'use strict';

var errors = {
  //Login oder Auth Errors
  notLoggedIn : (subinfo) => {
      return {error : true, number: 1000, message: "Not logged in.", subinfo: subinfo}
  },
  coockieTooOld : (subinfo) => {
    return {error : true, number: 1001, message: "Coockie too old.", subinfo: subinfo}
  },
  loginDataIncorrect : (subinfo) => {
    return {error : true, number: 1002, message: "Username or Password incorrect.", subinfo: subinfo}
  },

  //Events Errors
  eventIdAndRestMissmatch : (subinfo) => {
    return {error: true, number: 2000, message: 'id in data does not match id of REST connection', subinfo: subinfo};
  },

  //Files Errors
  formidableFail : (subinfo) => {
    return {error: true, number: 4000, message: 'something wrong with form Data', subinfo: subinfo}
  },
  renameingFail : (subinfo) => {
    return {error: true, number: 4001, message: 'something wrong with the renaming', subinfo: subinfo}
  },
  deletingFileFail : (subinfo) => {
    return {error: true, number: 4002, message: 'something wrong with deleting Files', subinfo: subinfo}
  },
  
  //Mail Errors
  noMailerApiKey : (subinfo) => {
    return {error: true, number: 6000, message: 'no mailer api key', subinfo: subinfo}
  },
  genMailingFail : (subinfo) => {
    return {error: true, number: 6001, message: 'something wrong with mailing', subinfo: subinfo}
  },
  
  //Database Errors
  DBWriteFile : (subinfo) => {
    return {error: true, number: 8000, message: 'something wrong with DB File writing', subinfo: subinfo}
  },
  DBReadFile : (subinfo) => {
    return {error: true, number: 8001, message: 'something wrong with DB File reading', subinfo: subinfo}
  },
  eventIdNotFound : (subinfo) => {
    return{error: true, number: 8002, message: 'id not found in database', subinfo: subinfo};
  }
  
}

module.exports = errors;