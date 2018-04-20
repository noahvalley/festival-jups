import React, { Component } from 'react';
import Header from '../../components/Header';
import Menu from '../../components/Menu';
import figur from '../../images/figur.png';
import { connect } from 'react-redux';


class Page extends Component {
  render() {
    const thisPage = this.props.thisPage;
    console.log('rendern:',thisPage);
    return (
      <div className="app-wrapper">
        <Header />
        <Menu currentPage={thisPage} />

        <div className="main">
          <div className={ 'content ' + thisPage } dangerouslySetInnerHTML={{__html: this.props.html}} />

          <footer>
            <img alt="" src={figur} />
          </footer>

        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {

  const getPageName = () => {
    const path = props.match.path.slice(1);
    if ( path === '' ) return 'home';
    return path;
  }

  const thisPage = getPageName();

  return { thisPage, html: state.pages[thisPage] };
}

export default connect(mapStateToProps)(Page);
