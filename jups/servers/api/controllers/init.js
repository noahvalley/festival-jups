var sha256 = require('sha256');

var reset = {
	init : () => {
		console.log('init.init');
		global.jupsstate = {
			events: [],
			pages: {
				home: '',
				orte: '',
				kontakt: '',
				archiv: '',
			},
			users: [{username: process.env.jupsUser, password: sha256(process.env.jupsPass)}],
			sessions: {}
		}
	},
	sendData : (req,res,next) => {
		console.log('sendData');
		var response = {
			error : req.jupserror || {error : false, number : 0, message: 'no error'},
			data : req.jupssenddata || {}
		}
	    res.setHeader('Content-Type', 'application/json');
		res.send(response);
	},
	sendError : (err, req,res,next) => {
		console.log('sendError');
		var response = {
			error : err,
			data : req.jupssenddata || {}
		}
	    res.setHeader('Content-Type', 'application/json');
		res.send(response);
	},
	setDemodata : () => {
		console.log('init.setDemodata');
		global.jupsstate.events = [];
		global.jupsstate.pages = [];
		global.jupsstate.sessions = [];
		
		
		global.jupsstate.pages.home = '<p><strong>JUPS findet dieses Jahr von Freitag 7.9. bis Sonntag 9.9. statt&#8230;</strong></p><p>&#8230;mit einem Konzert von <strong>Stärneföifi</strong>, dem Zirkusspektakel von <strong>FahrAwaY</strong>, mit <strong>Margrit Gysin</strong> und ihrem Figurentheater und mit vielen offenen Angeboten sowie neuen und altbekannten Workshops!</p><p>Es lohnt sich also das JUPS Wochenende jetzt schon in die Agenda einzutragen.</p><p>Die Fotos vom jups 2017 können <a href="https://www.facebook.com/pg/festivaljups/photos/?tab=album&amp;album_id=1900167376676972">hier auf Facebook</a> angesehen werden (dazu benötigt man keinen Facebook-Account).</p><p><strong>Save the date:</strong></p><p>jups 2019: 7./8. September</p><p>jups 2020: 12./13. September</p><p>Das Festival JUPS ist ein zweitägiges Schaffhauser Festival mit Veranstaltungen, offenen Angeboten und Workshops verschiedener Kunstsparten (Musik, Theater, Tanz, Literatur, diverse bildende Künste) für Kinder, Jugendliche, Familien und interessierte Erwachsene. Seit 2010 wird das Festival jups einmal jährlich durchgeführt.</p><p><iframe src="https://www.youtube.com/embed/2C5qwYhb4NU" width="820" height="460" frameborder="0" allowfullscreen="allowfullscreen"></iframe></p><hr /><p><strong>Trägerschaft: </strong>Schauwerk Das andere Theater, KiK Kultur im Kammgarn, Vebikus Kunsthalle Schaffhausen, Musikschule MKS, KJM Ostschweiz, Theater Sgaramusch</p><p><strong>Danke!</strong></p><p><strong><br />Hauptsponsoren:</strong></p><p><a href="http://kulturraum.sh/"><img class="alignnone wp-image-707 size-full" src="http://festival-jups.ch/wp-content/uploads/kulturraum_-2.png" alt="" width="175" height="70" /></a> <img class="alignnone size-full wp-image-708" src="http://festival-jups.ch/wp-content/uploads/amsler_-2.png" alt="" width="175" height="70" /> <a href="sig.biz"><img class="alignnone wp-image-709 size-full" src="http://festival-jups.ch/wp-content/uploads/SIG_-1.png" alt="" width="175" height="70" /></a><a href="http://www.migros-kulturprozent.ch/de/home"><img class="alignnone wp-image-758 size-full" src="http://festival-jups.ch/wp-content/uploads/migros.png" alt="" width="175" height="70" /></a></p>';

		global.jupsstate.pages.orte = '<div id="adressen1"><h3>Spielorte:</h3><p class="adressea">Kammgarn & Vebikus (Festivalzentrum)<br>Baumgartenstrasse 19<br>8200 Schaffhausen<br><a href="http://www.kammgarn.ch/">www.kammgarn.ch</a></p><p class="adresseb">MKS Musikschule Schaffhausen<br>Rosengasse 26<br>8200 Schaffhausen<br><a href="http://www.mksh.ch/">www.mksh.ch</a></p><p class="adressec">Museum zu Allerheiligen<br>Klosterstrasse 16<br>8200 Schaffhausen<br><a href="http://www.allerheiligen.ch">www.allerheiligen.ch</a></p><p class="adressed">Stadttheater Schaffhausen<br>Herrenacker 23<br>8200 Schaffhausen<br><a href="http://www.stadttheater-sh.ch">www.stadttheater-sh.ch</a></p><p class="adressee">Haberhaus Bühne<br>Neustadt 51<br>8200 Schaffhausen<br><a href="http://www.haberhaus.ch/buehne">www.haberhaus.ch/buehne</a></p><p class="adressef">Radio Munot<br>Stadthausgasse 11<br>8200 Schaffhausen<br><a href="http://www.radiomunot.ch">www.radiomunot.ch</a></p></div><div id="adressen2"><h3>Hauptorganisation:</h3><p class="schauwerk"><b>Iris Schnurrenberger / Schauwerk Das andere Theater</b><br>Jups c/o schauwerk<br>Postfach 1532<br>8201 Schaffhausen<br>+41 79 687 33 88<br><a href="mailto:info@festival-jups.ch">info@festival-jups.ch</a></p></div><div id="adressen3"><h3>Design:</h3><p>Remo Keller<br><a href="http://www.cookieluck.ch/milkandwodka/">Milk And Wodka</a></p><p>Noah Valley (Webumsetzung)<br><!--<a href="http://www.boeggsli.ch">boeggsli.ch</a><br>--><strong>Kontakt: </strong><a href="mailto:ego@noahvalley.ch">ego@noahvalley.ch</a></p></div><p class="organisation">Organisation: Stefan Colombo, Katharina Furrer, Esther Herrmann, Hausi Naef, Barbara Saxer, Susan Schadow, Iris Schnurrenberger, Cornelia Wolf</p>';

		global.jupsstate.pages.kontakt = 'div id="adressen1"><h3>Spielorte:</h3><p class="adressea">Kammgarn & Vebikus (Festivalzentrum)<br>Baumgartenstrasse 19<br>8200 Schaffhausen<br><a href="http://www.kammgarn.ch/">www.kammgarn.ch</a></p><p class="adresseb">MKS Musikschule Schaffhausen<br>Rosengasse 26<br>8200 Schaffhausen<br><a href="http://www.mksh.ch/">www.mksh.ch</a></p><p class="adressec">Museum zu Allerheiligen<br>Klosterstrasse 16<br>8200 Schaffhausen<br><a href="http://www.allerheiligen.ch">www.allerheiligen.ch</a></p><p class="adressed">Stadttheater Schaffhausen<br>Herrenacker 23<br>8200 Schaffhausen<br><a href="http://www.stadttheater-sh.ch">www.stadttheater-sh.ch</a></p><p class="adressee">Haberhaus Bühne<br>Neustadt 51<br>8200 Schaffhausen<br><a href="http://www.haberhaus.ch/buehne">www.haberhaus.ch/buehne</a></p><p class="adressef">Radio Munot<br>Stadthausgasse 11<br>8200 Schaffhausen<br><a href="http://www.radiomunot.ch">www.radiomunot.ch</a></p></div><div id="adressen2"><h3>Hauptorganisation:</h3><p class="schauwerk"><b>Iris Schnurrenberger / Schauwerk Das andere Theater</b><br>Jups c/o schauwerk<br>Postfach 1532<br>8201 Schaffhausen<br>+41 79 687 33 88<br><a href="mailto:info@festival-jups.ch">info@festival-jups.ch</a></p></div><div id="adressen3"><h3>Design:</h3><p>Remo Keller<br><a href="http://www.cookieluck.ch/milkandwodka/">Milk And Wodka</a></p><p>Noah Valley (Webumsetzung)<br><!--<a href="http://www.boeggsli.ch">boeggsli.ch</a><br>--><strong>Kontakt: </strong><a href="mailto:ego@noahvalley.ch">ego@noahvalley.ch</a></p></div><p class="organisation">Organisation: Stefan Colombo, Katharina Furrer, Esther Herrmann, Hausi Naef, Barbara Saxer, Susan Schadow, Iris Schnurrenberger, Cornelia Wolf</p>';

		global.jupsstate.pages.downloads = '<div id="downloads"><div class="downloadsklasse"><a target="_blank" href="http://www.festival-jups.ch/wp-content/uploads/eigeneuploads/2017/j_17_flyer_front.pdf"><img src="http://www.festival-jups.ch/wp-content/uploads/eigeneuploads/2017/j_17_flyer_front_th.jpg"><p>Flyer Front (.pdf)</p></a></div><div class="downloadsklasse"><a target="_blank" href="http://www.festival-jups.ch/wp-content/uploads/eigeneuploads/2017/j_17_zeitplan_samstag.pdf"><img src="http://www.festival-jups.ch/wp-content/uploads/eigeneuploads/2017/j_17_zeitplan_samstag_th.jpg"><p>Zeitplan Samstag (.jpg)</p></a></div><div class="downloadsklasse"><a target="_blank" href="http://www.festival-jups.ch/wp-content/uploads/eigeneuploads/2017/j_17_zeitplan_sonntag.pdf"><img src="http://www.festival-jups.ch/wp-content/uploads/eigeneuploads/2017/j_17_zeitplan_sonntag_th.jpg"><p>Zeitplan Sonntag (.jpg)</p></a></div><div class="downloadsklasse"><a target="_blank" href="http://www.festival-jups.ch/wp-content/uploads/eigeneuploads/2017/j_17_flyer_back.pdf"><img src="http://www.festival-jups.ch/wp-content/uploads/eigeneuploads/2017/j_17_flyer_back_th.jpg"><p>Flyer Back (.pdf)</p></a></div><div class="downloadsklasse"><a target="_blank" href="http://www.festival-jups.ch/wp-content/uploads/eigeneuploads/2017/j_17_poster_front_A3.pdf"><img src="http://www.festival-jups.ch/wp-content/uploads/eigeneuploads/2017/j_17_poster_front_A3_th.jpg"><p>Plakat A3 Front (.pdf)</p></a></div><div class="downloadsklasse"><a target="_blank" href="http://www.festival-jups.ch/wp-content/uploads/eigeneuploads/2017/j_17_poster_back_A3.pdf"><img src="http://www.festival-jups.ch/wp-content/uploads/eigeneuploads/2017/j_17_poster_back_A3_th.jpg"><p>Plakat A3 Back (.pdf)</p></a></div><a class="archivdownloads1" href="http://festival-jups.ch/downloads-2016">Archiv von 2016</a><a class="archivdownloads2" href="http://festival-jups.ch/downloads-2015">Archiv von 2015</a><a class="archivdownloads2" href="http://festival-jups.ch/downloads-2014">Archiv von 2014</a><a class="archivdownloads2" href="http://festival-jups.ch/downloads-2013">Archiv von 2013</a><a class="archivdownloads2" href="http://festival-jups.ch/downloads-2012">Archiv von 2012</a><a class="archivdownloads2" href="http://festival-jups.ch/downloads-2011">Archiv von 2011</a><a class="archivdownloads2" href="http://festival-jups.ch/downloads-2010">Archiv von 2010</a></div>';
			
		global.jupsstate.pages.archiv = '<p><strong>JUPS findet dieses Jahr von Freitag 7.9. bis Sonntag 9.9. statt&#8230;</strong></p><p>&#8230;mit einem Konzert von <strong>Stärneföifi</strong>, dem Zirkusspektakel von <strong>FahrAwaY</strong>, mit <strong>Margrit Gysin</strong> und ihrem Figurentheater und mit vielen offenen Angeboten sowie neuen und altbekannten Workshops!</p><p>Es lohnt sich also das JUPS Wochenende jetzt schon in die Agenda einzutragen.</p><p>Die Fotos vom jups 2017 können <a href="https://www.facebook.com/pg/festivaljups/photos/?tab=album&amp;album_id=1900167376676972">hier auf Facebook</a> angesehen werden (dazu benötigt man keinen Facebook-Account).</p><p><strong>Save the date:</strong></p><p>jups 2019: 7./8. September</p><p>jups 2020: 12./13. September</p><p>Das Festival JUPS ist ein zweitägiges Schaffhauser Festival mit Veranstaltungen, offenen Angeboten und Workshops verschiedener Kunstsparten (Musik, Theater, Tanz, Literatur, diverse bildende Künste) für Kinder, Jugendliche, Familien und interessierte Erwachsene. Seit 2010 wird das Festival jups einmal jährlich durchgeführt.</p><p><iframe src="https://www.youtube.com/embed/2C5qwYhb4NU" width="820" height="460" frameborder="0" allowfullscreen="allowfullscreen"></iframe></p><hr /><p><strong>Trägerschaft: </strong>Schauwerk Das andere Theater, KiK Kultur im Kammgarn, Vebikus Kunsthalle Schaffhausen, Musikschule MKS, KJM Ostschweiz, Theater Sgaramusch</p><p><strong>Danke!</strong></p><p><strong><br />Hauptsponsoren:</strong></p><p><a href="http://kulturraum.sh/"><img class="alignnone wp-image-707 size-full" src="http://festival-jups.ch/wp-content/uploads/kulturraum_-2.png" alt="" width="175" height="70" /></a> <img class="alignnone size-full wp-image-708" src="http://festival-jups.ch/wp-content/uploads/amsler_-2.png" alt="" width="175" height="70" /> <a href="sig.biz"><img class="alignnone wp-image-709 size-full" src="http://festival-jups.ch/wp-content/uploads/SIG_-1.png" alt="" width="175" height="70" /></a><a href="http://www.migros-kulturprozent.ch/de/home"><img class="alignnone wp-image-758 size-full" src="http://festival-jups.ch/wp-content/uploads/migros.png" alt="" width="175" height="70" /></a></p>';

		global.jupsstate.events.push({
			id : 1,
			type : 'workshop',
			titel : 'KICK OFF',
			untertitel : 'mit Hanna Stoll',
			ort : 'Kammgarn',
			zeitVon : '2018-02-08T14:00',
			zeitBis : '2018-02-08T16:00',
			priority : 1,
			bild : 'example.jpg',
			logo : 'example.jpg',
			text : 'Jedes Kind baut sich eine Kuckucksflöte aus <b>Bambus</b> und verziert sie anschliessend.<br><br>Bei fünf- oder sechsjährigen Kindern ist die Mitwirkung eines Erwachsenen hilfreich.<br>Leitung: Hanna Stoll, Musikschule MKS, www.mksh.ch',
			ausverkauft : false,
			ausverkauftText : 'Es gibt noch Stehplätze an der Abendkasse',
			abAlter : '5+',
			tuerOeffnung :  '',
			preis : '20.- / 15.-'
		});
		global.jupsstate.events.push({
			id : 2,
			type : 'workshop',
			titel : 'Graffiti',
			untertitel : 'mit Alice Marugg',
			ort : 'Cardinal',
			zeitVon : '2018-09-09T14:00',
			zeitBis : '2018-09-09T16:00',
			priority : 2,
			bild : 'example.jpg',
			logo : 'example.jpg',
			text : 'Graffiti: modern, bunt, knallig und einfach cool! Möchtest du selbst mal mit Spraydosen ein Bild gestalten? Du lernst die Technik vom Sprayen kennen und gestaltest deinen eigenen Schriftzug. Ein tolles Bild zum Nachhausenehmen ist dann deine Belohnung!<b>Zusätzlich 10.- für Materialkosten.</b>',
			ausverkauft : true,
			ausverkauftText : 'Es gibt noch Stehplätze an der Abendkasse',
			abAlter : '',
			tuerOeffnung :  '',
			preis : 'frei'
		});
		global.jupsstate.events.push({
			id : 3,
			type : 'veranstaltung',
			titel : 'Theater Sgaramusch: Knapp e Familie',
			untertitel : 'Stefan und Nora',
			ort : 'Kammgarn',
			zeitVon : '2018-09-09T10:00',
			zeitBis : '2018-09-09T12:00',
			priority : 1,
			bild : 'example.jpg',
			logo : 'example.jpg',
			text : '"Irgendöppis fählt.<br> Was?<br> Es Chind."<br> Wie wäre es, wenn man eins hätte?<br> Schön, lustig, streng, ernst?<br> Möchte man wirklich eins?<br> Eine Frau und ein Mann stellen sich vor, dass sie zusammen ein Kind hätten. Dabei entsteht ein ganzes Familienleben mit Geschrei, Ferien und was halt so dazu gehört.<br> Sgaramusch gibt den Zuschauerkindern die Gelegenheit, Erwachsene zu beobachten, wie sie über Kinder reden, wenn die Kinder nicht dabei sind.<br> Und sich einzumischen!<br> Mindestalter 7 Jahre.<br> www.sgaramusch.ch',
			ausverkauft : false,
			ausverkauftText : 'Keine Plätze mehr',
			abAlter : '5+',
			tuerOeffnung :  '15min vor Beginn',
			preis : '20.- / 15.-'
		});
		global.jupsstate.events.push({
			id : 4,
			type : 'offenesangebot',
			titel : 'Dini Mueter',
			untertitel : 'chunt ims de Kamm - prio5',
			ort : 'Kamm',
			zeitVon : '2018-09-08T13:00',
			zeitBis : '2018-09-08T15:00',
			priority : 5,
			bild : 'example.jpg',
			logo : 'example.jpg',
			text : '"Irgendöppis fählt.<br> Was?<br> Dini Mueter."',
			ausverkauft : false,
			ausverkauftText : 'Keine Plätze mehr',
			abAlter : '5+',
			tuerOeffnung :  '15min vor Beginn',
			preis : '20.- / 15.-'
		});
		global.jupsstate.events.push({
			id : 5,
			type : 'offenesangebot',
			titel : 'D\'Iris vertellt allne dumme Chinde e Guetnachgschicht',
			untertitel : 'vom de Leu und sind Fründe im Dschuneglz - prio3',
			ort : 'Kamm',
			zeitVon : '2018-09-08T13:00',
			zeitBis : '2018-09-08T15:00',
			priority : 3,
			bild : 'example.jpg',
			logo : 'example.jpg',
			text : '"Jedes Kind baut sich eine Kuckucksflöte aus <b>Bambus</b> und verziert sie anschliessend.<br><br>Bei fünf- oder sechsjährigen Kindern ist die Mitwirkung eines Erwachsenen hilfreich.<br>Leitung: Hanna Stoll, Musikschule MKS, www.mksh.ch Jedes Kind baut sich eine Kuckucksflöte aus <b>Bambus</b> und verziert sie anschliessend.<br><br>Bei fünf- oder sechsjährigen Kindern ist die Mitwirkung eines Erwachsenen hilfreich.<br>Leitung: Hanna Stoll, Musikschule MKS, www.mksh.ch Jedes Kind baut sich eine Kuckucksflöte aus <b>Bambus</b> und verziert sie anschliessend.<br><br>Bei fünf- oder sechsjährigen Kindern ist die Mitwirkung eines Erwachsenen hilfreich.<br>Leitung: Hanna Stoll, Musikschule MKS, www.mksh.ch Jedes Kind baut sich eine Kuckucksflöte aus <b>Bambus</b> und verziert sie anschliessend.<br><br>Bei fünf- oder sechsjährigen Kindern ist die Mitwirkung eines Erwachsenen hilfreich.<br>Leitung: Hanna Stoll, Musikschule MKS, www.mksh.ch Jedes Kind baut sich eine Kuckucksflöte aus <b>Bambus</b> und verziert sie anschliessend.<br><br>Bei fünf- oder sechsjährigen Kindern ist die Mitwirkung eines Erwachsenen hilfreich.<br>Leitung: Hanna Stoll, Musikschule MKS, www.mksh.ch ."',
			ausverkauft : false,
			ausverkauftText : 'Keine Plätze mehr',
			abAlter : '5+',
			tuerOeffnung :  '15min vor Beginn',
			preis : '20.- / 15.-'
		});
		global.jupsstate.events.push({
			id : 6,
			type : 'offenesangebot',
			titel : 'Dini Mueter - prio1',
			untertitel : 'chunt ims de Kamm',
			ort : 'Kammgarnistas on da Pistas im Museum',
			zeitVon : '2018-09-08T13:00',
			zeitBis : '2018-09-08T15:00',
			priority : 1,
			bild : 'example.jpg',
			logo : 'example.jpg',
			text : '"Irgendöppis fählt.<br> Was?<br> Dini Mueter."',
			ausverkauft : false,
			ausverkauftText : 'Keine Plätze mehr',
			abAlter : '5+',
			tuerOeffnung :  '15min vor Beginn',
			preis : '20.- / 15.-'
		});
	}
}


module.exports = reset;