import React, { Component } from 'react';
import expand from './arrow-bottom-circle.svg';
import collapse from './arrow-top-circle.svg';

// dev
import eventpic from '../../images/event-platzhalter.png';
import sponsor from '../../images/event-sponsor.png';


class Event extends Component {

  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    }
  }

  toggle = () => {
    this.setState({ expanded: !this.state.expanded })
  }

  render() {
    const expanded = this.state.expanded;
    const {
      zeitVonStd,
      zeitVonMin,
      zeitBisStd,
      zeitBisMin,
      typ,
      ort,
      titel,
      untertitel,
      beschreibung,
      alter,
      beginn,
      preis,
      ausverkauft,
      ausverkauftText,
      sponsorImg,
    } = this.props;

    return (
      <li className={ typ }>
        <div className="zeit" >{zeitVonStd}<span className="minuten">{zeitVonMin}</span> – {zeitBisStd}<span className="minuten">{zeitBisMin}</span></div>
        <div className="ort">{ort}</div>
        <div className="infos">

          <div className="titel" onClick={ () => this.toggle() }>
            <img src={expanded ? collapse : expand} alt={expanded ? 'weniger Infos' : 'mehr Infos'} style={{ height: 20 + 'px', marginRight: 8 + 'px', position: 'relative', top: 4 + 'px' }} />
            {titel}
            <span className="untertitel">{untertitel}</span>
          </div>
          <div style={{ clear: 'both' }} />

          <div className={ expanded ? 'details' : 'details hide' } >
            <img className="bild" src={eventpic} alt="" />
            <div className="beschreibung" dangerouslySetInnerHTML={{__html: beschreibung}} />
            { alter &&
              <div className="alter"><strong className="farbig">Zielpublikum:</strong> {alter}</div>
            }
            { beginn &&
              <div className="beginn"><strong className="farbig">Türöffnung:</strong> {beginn}</div>
            }
            {
              preis &&
              <div className="preis"><strong className="farbig">Kosten:</strong> {preis}</div>
            }
            { ausverkauft &&
              <div className="ausverkauft"><strong className="farbig">{ausverkauftText}</strong></div>
            }
            <div className="sponsoring">Patronat: <img src={sponsor} alt="Patronat" /></div>
            <div style={{ clear: 'both', paddingBottom: 30 + 'px' }} />
          </div>
        </div>
      </li>
    );
  }
}

export default Event;
