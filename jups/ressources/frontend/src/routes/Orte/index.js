import React, { Component } from 'react';
import Header from '../../components/Header';
import Menu from '../../components/Menu';
import figur from '../../images/figur.png';
import Karte from "./map.js"


const Orte = () => {
  return (
    <div className="app-wrapper">
      <Header />
      <Menu currentPage="orte" />

      <div className="main">
        <div className="content orte">

          <div className="zweispaltig">
            <div className="spielorte">

              <ul>
                <li><div className="buchstabe">A</div>
                <strong>Kammgarn &amp; Vebikus</strong> <em>(Festivalzentrum)</em>
                <br/>Baumgartenstrasse 19
                <br/><a href="http://www.kammgarn.ch/">www.kammgarn.ch</a></li>

                <li><div className="buchstabe">B</div>
                <strong>MKS Musikschule Schaffhausen</strong>
                <br/>Rosengasse 26
                <br/><a href="http://www.mksh.ch/">www.mksh.ch</a></li>

                <li><div className="buchstabe">C</div>
                <strong>Museum zu Allerheiligen</strong>
                <br/>Klosterstrasse 16
                <br/><a href="http://www.allerheiligen.ch">www.allerheiligen.ch</a></li>

                <li><div className="buchstabe">D</div>
                <strong>Stadttheater Schaffhausen</strong>
                <br/>Herrenacker 23
                <br/><a href="http://www.stadttheater-sh.ch">www.stadttheater-sh.ch</a></li>

                <li><div className="buchstabe">E</div>
                <strong>Haberhaus Bühne</strong>
                <br/>Neustadt 51
                <br/><a href="http://www.haberhaus.ch/buehne">www.haberhaus.ch/buehne</a></li>

                <li><div className="buchstabe">F</div>
                <strong>Radio Munot</strong>
                <br/>Stadthausgasse 11
                <br/><a href="http://www.radiomunot.ch">www.radiomunot.ch</a></li>
              </ul>

            </div>
            <div className="karte">
              <Karte />
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

export default Orte;
