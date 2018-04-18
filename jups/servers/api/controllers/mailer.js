'use strict';
var nodemailer = require('nodemailer');
var fs = require('fs');
var path = require('path');
var error = require('../libraries/error.js');

var mailer = {
  checkapikey : (req, res, next) => {
    if (req.body.apikey === process.env.mailerApiKey){
      next();
    }else{
      next(error.noMailerApiKey());
    }
  },
  composemail : (req, res, next) => {
    console.log('mailer.composemail');  
    req.mailReplyTo = req.body.data.email;
    req.mailcontent = 
      "vorname: " + req.body.data.vorname +
      "\nnachname: " + req.body.data.vorname +
      "\nalter: " + req.body.data.alter +
      "\ntelefon: " + req.body.data.telefon +
      "\nemail: " + req.body.data.email +
      "\n\nbemerkung\n: " + req.body.data.bemerkung+
      "\n\nVeranstaltungen";

    for (var event in req.body.data.veranstaltungen){
      req.mailcontent = req.mailcontent + "\n1. " + req.body.data.veranstaltungen[event].veranstaltung;
    }
    console.log('' + new Date() + '\n' + req.mailcontent+'\n\n\n');
    next();
  },
  sendmail : (req, res, next) => {
    console.log('mailer.sendmail');
    nodemailer.createTestAccount((err, account) => {
        let transporter = nodemailer.createTransport({
            host: process.env.mailerServer,
            port: 465,
            secure: true,
            auth: {
                user: process.env.mailerUser,
                pass: process.env.mailerPass
            }
        });
    
        var mailOptions = {
            from: '"Website" <website-mailer@festival-jups.ch>',
            to: process.env.mailerRecipient,
            replyTo: req.mailReplyTo,
            subject: 'Reservation von der Website',
            text: req.mailcontent
        };
    console.log(mailOptions);
        transporter.sendMail(mailOptions, (error, info) => {
            if (err) {
          next(error.genMailingFail());
            }
        next();
        });
    });
  }
}


module.exports = mailer;