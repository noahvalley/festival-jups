'use strict';

function logger(message){
	var datum = new Date();
	var day = datum.getDate();
    var month = datum.getMonth() + 1;
    var year = datum.getFullYear();
	var hours = datum.getHours();
	var min = datum.getMinutes();
    if (hours < 10) {hours = "0" + hours;}
    if (min < 10) {min = "0" + min;}
    if (day < 10) {day = "0" + day;}
    if (month < 10) {month = "0" + month;}
    var datum_anzeig = year + "-" + month + "-" + day + " " + hours + ":" + min;
	console.log(datum_anzeig + ": " + message);
}

module.exports = logger;