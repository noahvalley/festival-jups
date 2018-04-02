import React, { Component } from 'react';
import Header from '../../components/Header';
import Menu from '../../components/Menu';
import figur from '../../images/figur.png';
import { connect } from 'react-redux';
import { fetchHome } from '../../store/actions';


class Page extends Component {

  componentDidMount() {
    // checken ob nicht schon da
    this.props.dispatch(fetchHome())
  }

  constructor(props) {
    super(props)
    this.state = {
      thisPage: this.getPageName()
    }
  }

  getPageName = () => {
    const path = this.props.match.path.slice(1);
    if ( path==='' ) return 'home';
    return path;
  }

  render() {
    const thisPage = this.state.thisPage;
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

const mapStateToProps = (state) => {
  console.log(state);
  return { html: state.home };
}

export default connect(mapStateToProps)(Page);
