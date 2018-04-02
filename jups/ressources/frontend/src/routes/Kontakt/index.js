import React, { Component } from 'react';
import Header from '../../components/Header';
import Menu from '../../components/Menu';
import figur from '../../images/figur.png';


class Home extends Component {
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
            <p>Remo Keller
            <br/>Milk And Wodka</p>
            <p>Noah Valley
            <br/>Kontakt: ego@noahvalley.ch</p>

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
