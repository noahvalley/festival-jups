import React, { Component } from 'react';
import header from './header.jpg';

class Header extends Component {
  render() {
    return (
      <header>
        <img src={header} className="header" alt="Festival jups - Junges Publikum Schaffhausen" />
      </header>
    );
  }
}

export default Header;
