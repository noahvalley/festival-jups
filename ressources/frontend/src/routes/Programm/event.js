import React, { Component } from 'react';
import expand from './arrow-bottom-circle.svg';
import collapse from './arrow-top-circle.svg';
import { Collapse } from 'react-collapse';
import { API_BASE_URL } from '../../constants/apiBaseURL';
import { Link } from 'react-router-dom';


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
      id,
      zeitVonStd,
      zeitVonMin,
      zeitBisStd,
      zeitBisMin,
      typ,
      ort,
      titel,
      untertitel,
      bild,
      beschreibung,
      alter,
      beginn,
      preis,
      reservierbar,
      ausverkauft,
      ausverkauftText,
      sponsorImg,
    } = this.props;
    const bildURL = API_BASE_URL + '/images/' + bild;
    const sponsorImgURL = API_BASE_URL + '/images/' + sponsorImg;

    return (
      <li className={ typ }>
        <div className="zeit" >{zeitVonStd}<span className="minuten">{zeitVonMin}</span> – {zeitBisStd}<span className="minuten">{zeitBisMin}</span></div>
        <div className="ort">{ort}
        </div>

        <div className="infos">

          <button onClick={ () => this.toggle() }>
            <img
              className="ausfahr-button"
              src={expanded ? collapse : expand}
              alt={expanded ? 'weniger Infos' : 'mehr Infos'}
              />
          </button>
          <div className="titel" onClick={ () => this.toggle() }>
            {titel}
            <span className="untertitel">{untertitel}</span>
          </div>

          <div style={{ clear: 'both' }} />

          <Collapse isOpened={ expanded } springConfig={{ stiffness: 250 }} >
            <div className="details" >
              { bild &&
                <img className="bild" src={ bildURL } alt="" />
              }

              <div className="beschreibung" dangerouslySetInnerHTML={{__html: beschreibung}} />

              { alter &&
                <div className="alter"><strong className="farbig">Zielpublikum:</strong> {alter}</div>
              }
              { beginn &&
                <div className="beginn"><strong className="farbig">Türöffnung:</strong> {beginn}</div>
              }
              { preis &&
                <div className="preis"><strong className="farbig">Kosten:</strong> {preis}</div>
              }
              { reservierbar &&
                ( ausverkauft /* false = reservation offen (ergo link darauf), true = geschlossen */
                  ? <div className="ausverkauft"><strong className="farbig">{ausverkauftText}</strong></div>
                  : <div className="ausverkauft">
                      <Link to={{ pathname: '/tickets', preselectedId: id }}>Reservation</Link>
                    </div>
                )
              }
              {
                sponsorImg &&
                <div className="sponsoring">Patronat: <img src={ sponsorImgURL } alt="Patronat" /></div>
              }
              <div style={{ clear: 'both', paddingBottom: 30 + 'px' }} />
            </div>
          </Collapse>

        </div>

      </li>
    );
  }
}

export default Event;
