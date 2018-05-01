import React, { Component } from 'react';
import Header from '../../components/Header';
import Menu from '../../components/Menu';
import figur from '../../images/figur.png';


class Downloads extends Component {
  render() {

    return (
      <div className="app-wrapper">
        <Header />
        <Menu currentPage="archiv" />

        <div className="main">
          <div className="content archiv">

            <div>
              <h1>2015</h1>
              <div>
                <a href=""><img src={figur} alt="" /><br/>Flyer Front (.pdf)</a>
                <a href=""><img src={figur} alt="" /><br/>Zeitplan Samstag (.jpg)</a>
                <a href=""><img src={figur} alt="" /><br/>Zeitplan Sonntag (.jpg)</a>
                <a href=""><img src={figur} alt="" /><br/>Flyer Back (.pdf)</a>
                <a href=""><img src={figur} alt="" /><br/>Plakat A3 Front (.pdf)</a>
                <a href=""><img src={figur} alt="" /><br/>Plakat A3 Back (.pdf)</a>
              </div>
            </div>



          </div>

          <br/><div style={{ clear: 'both' }}>&nbsp;</div>

          <footer>
            <img alt="" src={figur} />
          </footer>

        </div>
      </div>
    );
  }
}

export default Downloads;
