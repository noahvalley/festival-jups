'use strict';
var nodemailer = require('nodemailer');

var mailer = {
	composemail : function(req, res, next){
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
		;
		for (var event in req.body.data.veranstalungen){
			req.mailcontent = req.mailcontent + "\n1. " + req.body.data.veranstalungen[event].veranstalung;
		}

	},
	sendmail : function(req, res, next){
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
					next({error: true, number: 9050, message: 'something wrong with mailing', suberror: err});
		        }
				next();
		    });
		});
	}
}


module.exports = mailer;