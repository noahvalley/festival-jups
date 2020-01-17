import React, { Component } from 'react';
import headerKlein from '../../images/header-klein.jpg';
import headerGross from '../../images/header-gross.jpg';
import { connect } from 'react-redux';
import { fetchEvents } from '../../store/actions';
import { fetchPages } from '../../store/actions';


class Header extends Component {

  componentDidMount() {
    if ( !this.props.events ) {
      this.props.dispatch(fetchEvents());
    }
    if ( !this.props.pages ) {
      this.props.dispatch(fetchPages());
    }
  }

  render() {
    return (
      <header>
        <img src={headerKlein} className="header-klein" alt="Festival jups - Junges Publikum Schaffhausen" />
        <img src={headerGross} className="header-gross" alt="Festival jups - Junges Publikum Schaffhausen" />
      </header>
    );
  }
}


const mapStateToProps = (state) => {
  const { pages, events } = state.fetchState;
  return { pages, events };
}

export default connect(mapStateToProps)(Header);
