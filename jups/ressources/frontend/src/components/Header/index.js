import React, { Component } from 'react';
import headerKlein from '../../images/header-klein.jpg';
import headerGross from '../../images/header-gross.jpg';

class Header extends Component {
  render() {
    return (
      <header>
        <img src={headerKlein} className="header-klein" alt="Festival jups - Junges Publikum Schaffhausen" />
        <img src={headerGross} className="header-gross" alt="Festival jups - Junges Publikum Schaffhausen" />
      </header>
    );
  }
}

export default Header;
