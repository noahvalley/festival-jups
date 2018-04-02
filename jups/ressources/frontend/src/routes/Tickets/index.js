import React, { Component } from 'react';
import Header from '../../components/Header';
import Menu from '../../components/Menu';
import figur from '../../images/figur.png';


class Tickets extends Component {
  render() {
    return (
      <div className="app-wrapper">
        <Header />
        <Menu currentPage="tickets" />

        <div className="main">
          <div className="content tickets">

            ... tic tic tic ...

          </div>

          <footer>
            <img alt="" src={figur} />
          </footer>

        </div>
      </div>
    );
  }
}

export default Tickets;
