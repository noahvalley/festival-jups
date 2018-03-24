import React, { Component } from 'react';
import Header from '../../components/Header';
import Menu from '../../components/Menu';
import figur from '../../images/figur.png';


class Home extends Component {
  render() {
    return (
      <div className="app-wrapper">
        <Header />

        <div className="main">
          <Menu active="home" />
        </div>

        <div className="main">
          <div className="content">
            <p><strong>JUPS findet dieses Jahr von Freitag 7.9. bis Sonntag 9.9. statt…</strong></p>
            <p>…mit einem Konzert von <strong>Stärneföifi</strong>, dem Zirkusspektakel von <strong>FahrAwaY</strong>, mit <strong>Margrit Gysin</strong> und ihrem Figurentheater und mit vielen offenen Angeboten sowie neuen und altbekannten Workshops!</p>
            <p>Es lohnt sich also das JUPS Wochenende jetzt schon in die Agenda einzutragen.</p>
            <p>Die&nbsp;Fotos vom jups 2017 können&nbsp;<a href="https://www.facebook.com/pg/festivaljups/photos/?tab=album&amp;album_id=1900167376676972">hier auf Facebook</a>&nbsp;angesehen werden (dazu benötigt man keinen Facebook-Account).</p>
            <p><strong>Save the date:</strong></p>
            <p>jups 2019: 7./8. September</p>
            <p>jups 2020: 12./13. September</p>
            <p>Das Festival JUPS ist ein zweitägiges Schaffhauser Festival mit Veranstaltungen, offenen Angeboten und Workshops verschiedener Kunstsparten (Musik, Theater, Tanz, Literatur, diverse bildende Künste) für Kinder, Jugendliche, Familien und interessierte Erwachsene.&nbsp;Seit 2010 wird das Festival jups einmal jährlich durchgeführt.</p>
            <p>
              <div className="video-container">
                <iframe src="https://www.youtube.com/embed/2C5qwYhb4NU" className="video" frameborder="0" allowfullscreen="allowfullscreen"></iframe>
              </div>
            </p>

            <hr/>
            <div className="zweispaltig kleiner">

              <div className="spalte-links">
                <h2>Trägerschaft</h2>
                <p>
                  <ul>
                    <li>Schauwerk Das andere Theater</li>
                    <li>KiK Kultur im Kammgarn</li>
                    <li>Vebikus Kunsthalle Schaffhausen</li>
                    <li>Musikschule MKS</li>
                    <li>KJM Ostschweiz</li>
                    <li>Theater Sgaramusch</li>
                  </ul>
                </p>
                <p><strong>Danke!</strong></p>
              </div>

              <div className="spalte-rechts sponsoren">
              <p><h2>Hauptsponsoren</h2></p>
                <a href="http://kulturraum.sh/"><img src="http://festival-jups.ch/wp-content/uploads/kulturraum_-2.png" alt="" width="175" height="70" /></a>
                <img src="http://festival-jups.ch/wp-content/uploads/amsler_-2.png" alt="" width="175" height="70" />
                <br/>
                <a href="sig.biz"><img src="http://festival-jups.ch/wp-content/uploads/SIG_-1.png" alt="" width="175" height="70" /></a>
                <a href="http://www.migros-kulturprozent.ch/de/home"><img src="http://festival-jups.ch/wp-content/uploads/migros.png" alt="" width="175" height="70" /></a>
              </div>
            </div>
          </div>

          <footer>
            <img alt="" src={figur} />
          </footer>

        </div>
      </div>
    );
  }
}

export default Home;
