import React from 'react';
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
                <li>
                  <div className="buchstabe">A</div>
                  <strong>Kammgarn &amp; Vebikus</strong> <em>(Festivalzentrum)</em>
                  <br/>Baumgartenstrasse 19
                  <br/><a href="http://www.kammgarn.ch/">www.kammgarn.ch</a>
                </li>

                <li>
                  <div className="buchstabe">B</div>
                  <strong>Musikschule MKS</strong>
                  <br/>Rosengasse 26
                  <br/><a href="http://www.mksh.ch/">www.mksh.ch</a>
                </li>

                <li>
                  <div className="buchstabe">C</div>
                  <strong>Museum zu Allerheiligen</strong>
                  <br/>Klosterstrasse 16
                  <br/><a href="http://www.allerheiligen.ch">www.allerheiligen.ch</a>
                </li>

                <li>
                  <div className="buchstabe">D</div>
                  <strong>Probebühne Cardinal</strong>
                  <br/>Bachstrasse 75
                  <div style={{ clear: 'both' }} />
                </li>

                <li>
                  <div className="buchstabe">E</div>
                  <strong>Herrenacker</strong>
                </li>
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
