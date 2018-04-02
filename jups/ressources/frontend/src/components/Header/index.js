import React, { Component } from 'react';
import headerKlein from '../../images/header-klein.jpg';
import headerGross from '../../images/header-gross.jpg';
import { connect } from 'react-redux';
import { fetchEvents } from '../../store/actions';


class Header extends Component {

  componentDidMount() {
    // checken ob nicht schon da
    this.props.dispatch(fetchEvents());
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
  // if ( state.bath.current === -1 ) return { user: state.user }; // not ready yet
  //
  // else if ( state.bath.finished ) {
  //   return { user: state.user, finished: true };
  // }
  //
  // else {
  //   const sentence = state.bath.sentences[state.bath.current];
  //   const { correct, wrong, total } = state.bath.progress
  //
  //   return {
  //     user: state.user,
  //     lexeme: sentence.lexeme,
  //     lexemeId: sentence.lexemeId,
  //     a: sentence.task.a,
  //     q: sentence.task.q,
  //     img: sentence.task.img,
  //     correctPercent: correct / total * 100,
  //     wrongPercent: wrong / total * 100,
  //   };
  // }
  return state;
}

export default connect(mapStateToProps)(Header);
