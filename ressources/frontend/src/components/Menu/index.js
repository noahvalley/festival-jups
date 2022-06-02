import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import figur from '../../images/figur.png';
import ausschreibung from '../../images/ausschreibung.jpg';
import openMenu from './arrow-bottom-circle.svg';
import closeMenu from './arrow-top-circle.svg';


class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuIsSticky: false,
      menuIsOpen: false,
      windowHeight: 0
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    if (window.scrollY > this.menuDiv.offsetTop) { //sticky
      this.setState({ menuIsSticky: true });
    } else { // not sticky
      this.setState({ menuIsSticky: false });
    }
  }

  blockScroll = event => event.preventDefault();

  showMenu = () => {
    document.body.classList.add('noScrolling');
    document.body.addEventListener( 'touchmove', this.blockScroll ); // iOS
    this.setState({ menuIsOpen: true });
  }

  hideMenu = () => {
    document.body.classList.remove('noScrolling');
    document.body.removeEventListener( 'touchmove', this.blockScroll ); // iOS
    this.setState({ menuIsOpen: false });
  }

  render() {
    const currentPage = this.props.currentPage;
    const showMenu = this.state.menuIsOpen;
    const menupunkte = ["Home", "Programm", "Tickets", "Orte", "Kontakt", "Downloads", "Archiv"];
    return (
      <div className="main">
        <div className="menuWrapper" ref={el => this.menuDiv = el} >
          <div className={ this.state.menuIsSticky ? 'menu sticky' : 'menu'}>

            { /* kleiner bildschirm: statt menu wird aktive seite + icon angezeigt */ }
            <div className="title">
              <div className="open-menu"
                onClick={ () => this.showMenu() } >
                <img src={openMenu} alt="show menu" />
              </div>
              <h1>{currentPage}</h1>
            </div>

            { /* menu anzeigen */ }
            <div className={ showMenu ? 'overlay active' : 'overlay' } onClick={ () => this.hideMenu() } >
              <ul>
                <li className="close-menu"
                  onClick={ () => this.hideMenu() } >
                  <img src={closeMenu} alt="close menu" />
                </li>
                { menupunkte.map( menupunkt => {
                  if (menupunkt.toLowerCase() === currentPage) return ( <li className="current" key={menupunkt}>{menupunkt}</li> )
                  else return ( <li key={menupunkt}><Link to={ "/" + menupunkt.toLowerCase() }>{menupunkt}</Link></li> )
                }) }
              </ul>
            </div>

            {/* nur angezeigt im desktop */}
            <a style={{ margin: 0, padding: 0, }} href="http://api.festival-jups.ch/files/2022/2022_hauptleitung_ausschreibung.pdf">
	            <img src={ausschreibung} width={150} style={{ maxWidth: 150, width: 150, margin: 0, paddingTop: 20 }} alt="" />
            </a>
            {/* <img src={figur} width={180} style={{ marginTop: 40 }}  alt="" /> */}
          </div>
        </div>
      </div>
    );
  }
}

export default Menu;
