import React, { Component } from 'react';
import Header from '../../components/Header';
import Menu from '../../components/Menu';
import Event from './event.js';
import figur from '../../images/figur.png';
import { connect } from 'react-redux';


class Programm_Preview extends Component {

  constructor(props) {
    super(props);
    this.state = {
      filterText: '',
      filterTextLowerCase: '',
      zeigeVeranstaltungen: true,
      zeigeWorkshops: true,
      zeigeOffeneAngebote: true,
    }
  }

  handleInput = (event) => {
    const filterText = event.currentTarget.value;
    this.setState({ filterText, filterTextLowerCase: filterText.toLowerCase() });
  }
  handleFilterVeranstaltungen = () => {
    this.setState({ zeigeVeranstaltungen: !this.state.zeigeVeranstaltungen });
  }
  handleFilterWorkshops = () => {
    this.setState({ zeigeWorkshops: !this.state.zeigeWorkshops });
  }
  handleFilterOffeneAngebote = () => {
    this.setState({ zeigeOffeneAngebote: !this.state.zeigeOffeneAngebote });
  }

  render() {
    const {zeigeWorkshops, zeigeOffeneAngebote, zeigeVeranstaltungen, filterTextLowerCase} = this.state;
    return (
      <div className="app-wrapper">
        <Header />
        <Menu currentPage="programm" />

        <div className="main">
          <div className="content programm">

            { this.props.text &&
              <div dangerouslySetInnerHTML={{__html: this.props.text}} />
            }

            {
              !this.props.error &&
              (

                <div className="filter">
                  <div className="legende">Anzeigen:
                    &nbsp; <button className={ zeigeVeranstaltungen ? 'veranstaltung active' : 'veranstaltung' } onClick={ this.handleFilterVeranstaltungen }>Veranstaltungen</button>
                    &nbsp; <button className={ zeigeWorkshops ? 'workshop active' : 'workshop' } onClick={ this.handleFilterWorkshops }>Workshops</button>
                    &nbsp; <button className={ zeigeOffeneAngebote ? 'offenesangebot active' : 'offenesangebot' } onClick={ this.handleFilterOffeneAngebote }>offene Angebote</button>
                  </div>

                  <div className="textfilter">Durchsuchen: &nbsp;
                    <input className="textfilter" type="text" value={ this.state.filterText } onChange={ this.handleInput } />
                  </div>
                </div>
              )
            }

            {
              this.props.events &&
              this.props.tage.map( tag => {
                return (
                  <span key={tag}>
                    <h1>{tag}</h1>
                    <ul>
                    { this.props.events[tag]
                        .filter( event => {
                          if ( event.titel && event.titel.toLowerCase().indexOf(filterTextLowerCase) >= 0 ) return true;
                          if ( event.untertitel && event.untertitel.toLowerCase().indexOf(filterTextLowerCase) >= 0 ) return true;
                          if ( event.ort && event.ort.toLowerCase().indexOf(filterTextLowerCase) >= 0 ) return true;
                          if ( event.beschreibung && event.beschreibung.toLowerCase().indexOf(filterTextLowerCase) >= 0 ) return true;
                          return false;
                        }
                        ) // textsuche
                        .filter( event => { // typen von events
                          switch (event.typ) {
                            case 'veranstaltung':
                              return zeigeVeranstaltungen;
                            case 'workshop':
                              return zeigeWorkshops;
                            case 'offenesangebot':
                              return zeigeOffeneAngebote;
                            default:
                              return true
                          }
                        })
                        .map( event => {
                          return (
                            <Event
                              key={event.id}
                              id={event.id}
                              zeitVonStd={event.zeitVonStd}
                              zeitVonMin={event.zeitVonMin}
                              zeitBisStd={event.zeitBisStd}
                              zeitBisMin={event.zeitBisMin}
                              ort={event.ort}
                              titel={event.titel}
                              untertitel={event.untertitel}
                              bild={event.bild}
                              beschreibung={event.beschreibung}
                              alter={event.alter}
                              beginn={event.beginn}
                              preis={event.preis}
                              reservierbar={event.reservierbar}
                              ausverkauft={event.ausverkauft}
                              ausverkauftText={event.ausverkauftText}
                              sponsorImg={event.sponsorImg}
                              typ={event.typ}
                            />
                          )
                        })
                    }
                    </ul>
                  </span>
                )
              })
            }

          </div>

          <footer>
            <img alt="" src={figur} />
          </footer>

        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {

  if ( !state.fetchState.pages) return { error: 'loading' }

  const { content, showText, showProgramm } = state.pages.programm;
  let text = '';
  if ( showText ) text = content;


  const reservationOffen = state.pages.tickets.showForm;

  const events = state.events.map( event => {
    const { zeitVon, zeitBis, ...rest } = event;
    let zeitVonMin = zeitVon.getMinutes();
    let zeitBisMin = zeitBis.getMinutes();
    if (zeitVonMin<10) zeitVonMin = '0' + zeitVonMin;
    if (zeitBisMin<10) zeitBisMin = '0' + zeitBisMin;
    const monat = zeitVon.getMonth()+1;
    const tage = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

    const reservierbar = reservationOffen && event.typ !== 'offenesangebot' && new Date() < zeitVon;

    return { ...rest,
      reservierbar,
      zeitVonStd: zeitVon.getHours(),
      zeitVonMin,
      zeitBisStd: zeitBis.getHours(),
      zeitBisMin,
      tag: tage[zeitVon.getDay()] + ', ' + zeitVon.getDate() + '.' + monat + '.' + zeitVon.getFullYear()
    }
  })

  // events ordnen
  events.sort( (a, b) => a.position - b.position )

  // in tage einteilen
  const eventsJeTag = {};
  events.forEach( event => {
    if (!eventsJeTag[event.tag]) { eventsJeTag[event.tag] = [] };
    eventsJeTag[event.tag].push(event);
  })

  const tage =  Object.keys(eventsJeTag);
  if ( tage.length > 0 ) return { events: eventsJeTag, tage, text };
  return { error: 'No events' };
}

export default connect(mapStateToProps)(Programm_Preview);
