import React, { Component } from 'react';
import headerKlein from '../../images/header-klein.jpg';
import headerGross from '../../images/header-gross.jpg';
import { connect } from 'react-redux';
import { fetchEvents } from '../../store/actions';
import { fetchHome } from '../../store/actions';


class Header extends Component {

  componentDidMount() {
    if ( this.props.events.length === 0 ) {
      this.props.dispatch(fetchEvents());
    }
    if ( this.props.home === '' ) {
      this.props.dispatch(fetchHome());
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


const mapStateToProps = (state, props) => {
  return state;
}

export default connect(mapStateToProps)(Header);
