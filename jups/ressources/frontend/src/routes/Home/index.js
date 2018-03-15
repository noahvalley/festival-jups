import React, { Component } from 'react';
import Header from '../../components/Header';
import Menu from '../../components/Menu';
// import './Home.css';

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
            <p>JUPS findet dieses Jahr von Freitag 7.9. bis Sonntag 9.9. statt!</p>
            <p>Die Fotos vom jups 2017 können <a href="">hier</a> auf Facebook angesehen werden (dazu benötigt man keinen Facebook-Account).</p>
            <p>Der Radio Munot Beitrag aus dem Workshop „Radiosendung“:</p>
            <p>Save the date:</p>
            <p>jups 2019: 7./8. September</p>
            <p>jups 2020: 12./13. September</p>
            <p>Das Festival JUPS ist ein zweitägiges Schaffhauser Festival mit Veranstaltungen, offenen Angeboten und Workshops verschiedener Kunstsparten (Musik, Theater, Tanz, Literatur, diverse bildende Künste) für Kinder, Jugendliche, Familien und interessierte Erwachsene. Seit 2010 wird das Festival jups einmal jährlich durchgeführt.</p>
              <p>JUPS findet dieses Jahr von Freitag 7.9. bis Sonntag 9.9. statt!</p>
              <p>Die Fotos vom jups 2017 können hier auf Facebook angesehen werden (dazu benötigt man keinen Facebook-Account).</p>
              <p>Der Radio Munot Beitrag aus dem Workshop „Radiosendung“:</p>
              <p>Save the date:</p>
              <p>jups 2019: 7./8. September</p>
              <p>jups 2020: 12./13. September</p>
              <p>Das Festival JUPS ist ein zweitägiges Schaffhauser Festival mit Veranstaltungen, offenen Angeboten und Workshops verschiedener Kunstsparten (Musik, Theater, Tanz, Literatur, diverse bildende Künste) für Kinder, Jugendliche, Familien und interessierte Erwachsene. Seit 2010 wird das Festival jups einmal jährlich durchgeführt.</p>
          </div>

          <footer>
            <img alt="" />
          </footer>

        </div>
      </div>
    );
  }
}

export default Home;
