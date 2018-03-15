import React, { Component } from 'react';
import meitli from './meitli.png';
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

  triggerMenu = () => {
    // const height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    // console.log(height);

    //block scrolling
    if (this.state.menuIsOpen) { //menu ist offen, wird geschlossen
      document.body.classList.remove('noScrolling');
      document.body.removeEventListener( 'touchmove', this.blockScroll ); // iOS
      this.setState({ menuIsOpen: false });
    } else {
      document.body.classList.add('noScrolling');
      document.body.addEventListener( 'touchmove', this.blockScroll ); // iOS
      this.setState({ menuIsOpen: true });
    }
  }

  render() {
    const showMenu = this.state.menuIsOpen;
    return (
      <div className="menuWrapper" ref={el => this.menuDiv = el} >
        <div className={ this.state.menuIsSticky ? 'menu sticky' : 'menu'}>

          { /* kleiner bildschirm: statt menu wird aktive seite + icon angezeigt */ }
          <div className="title">
            <div className="open-menu"
              onClick={ () => this.triggerMenu() } >
              <img src={openMenu} alt="show menu" />
            </div>
            <h1>Home</h1>
          </div>

          { /* menu anzeigen */ }
          <div className={ showMenu ? 'overlay active' : 'overlay' } onClick={ () => this.triggerMenu() } >
            <ul>
              <li className="close-menu"
                onClick={ () => this.triggerMenu() } >
                <img src={closeMenu} alt="close menu" />
              </li>
              <li className="current">Home</li>
              <li><a href="">Programm</a></li>
              <li><a href="">Tickets</a></li>
              <li><a href="">Orte</a></li>
              <li><a href="">Kontakt</a></li>
              <li><a href="">Downloads</a></li>
              <li><a href="">Archiv</a></li>
            </ul>
          </div>

          {/* nur angezeigt im desktop */}
          <img src={meitli} width={180} style={{ marginTop: 40 }}  alt="" />
        </div>
      </div>
    );
  }
}

export default Menu;
