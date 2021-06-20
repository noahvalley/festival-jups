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
                  <strong>Haberhaus Bühne</strong>
                  <br/>Neustadt 51
                  <br/><a href="http://www.haberhaus.ch/buehne">www.haberhaus.ch/buehne</a>
                </li>
                <li>
                  <div className="buchstabe">E</div>
                  <strong>Stadtbibliothek</strong>
                  <br/>Münsterplatz 1
                  <br/><a href="http://www.bibliotheken-schaffhausen.ch/">www.bibliotheken-schaffhausen.ch</a>
                </li>
               <li style={{ clear: 'both' }}>
                  <div className="buchstabe">F</div>
                  <strong>Rockn Roll-Club Angeli</strong>
                  <br/>Kronengässchen 3
               </li>
               <li style={{ clear: 'both' }}>
                  <div className="buchstabe">G</div>
                  <strong>Herrenacker</strong>
                </li>
                {/*
               <li style={{ clear: 'both' }}>
                  <div className="buchstabe">F</div>
                  <strong>Stadttheater Schaffhausen</strong>
                  <br/>Herrenacker 23
                  <br/><a href="http://www.stadttheater-sh.ch/">www.stadttheater-sh.ch</a>
                </li>
                <li>
                  <div className="buchstabe">D</div>
                  <strong>Probebühne Cardinal</strong>
                  <br/>Bachstrasse 75
                  <div style={{ clear: 'both' }} />
                </li>
                <li>
                  <div className="buchstabe">D</div>
                  <strong>Kammgarn West</strong>
                  <br/>Baumgartenstrasse 23
                  <div style={{ clear: 'both' }} />
                </li>
                */}
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
