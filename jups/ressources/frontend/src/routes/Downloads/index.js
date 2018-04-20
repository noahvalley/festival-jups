import React, { Component } from 'react';
import Header from '../../components/Header';
import Menu from '../../components/Menu';
import figur from '../../images/figur.png';


class Downloads extends Component {
  render() {
    return (
      <div className="app-wrapper">
        <Header />
        <Menu currentPage="downloads" />

        <div className="main">
          <div className="content downloads">

              <a href=""><img src={''} alt="" /><br/>Flyer Front (.pdf)</a>
              <a href=""><img src={''} alt="" /><br/>Zeitplan Samstag (.jpg)</a>
              <a href=""><img src={''} alt="" /><br/>Zeitplan Sonntag (.jpg)</a>
              <a href=""><img src={''} alt="" /><br/>Flyer Back (.pdf)</a>
              <a href=""><img src={''} alt="" /><br/>Plakat A3 Front (.pdf)</a>
              <a href=""><img src={''} alt="" /><br/>Plakat A3 Back (.pdf)</a>

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
