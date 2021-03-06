import React, { Component } from 'react';
import Header from '../../components/Header';
import Menu from '../../components/Menu';
import figur from '../../images/figur.png';


class Kontakt extends Component {
  render() {
    return (
      <div className="app-wrapper">
        <Header />
        <Menu currentPage="kontakt" />

        <div className="main">
          <div className="content kontakt">

            <h2>Hauptorganisation</h2>
            <p>Iris Schnurrenberger / Schauwerk Das andere Theater
            <br/>Jups c/o schauwerk
            <br/>Postfach 1532
            <br/>8201 Schaffhausen
            <br/>+41 79 687 33 88
            <br/>info@festival-jups.ch</p>

            <h2>Organisation</h2>
            <ul>
              <li>Stefan Colombo</li>
              <li>Katharina Furrer</li>
              <li>Esther Herrmann</li>
              <li>Hausi Naef</li>
              <li>Barbara Saxer</li>
              <li>Susan Schadow</li>
              <li>Iris Schnurrenberger</li>
              <li>Cornelia Wolf</li>
            </ul>

            <h2>Design & Webumsetzung</h2>
            <ul>
              <li>Remo Keller (Milk And Wodka)</li>
              <li>Noah Valley (Kontakt: ego@noahvalley.ch)</li>
              <li>Martin Jung</li>
              <li>Kim Beyeler</li>
            </ul>

          </div>

          <footer>
            <img alt="" src={figur} />
          </footer>

        </div>
      </div>
    );
  }
}

export default Kontakt;
