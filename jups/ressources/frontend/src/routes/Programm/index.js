import React, { Component } from 'react';
import Header from '../../components/Header';
import Menu from '../../components/Menu';
import Event from './event.js';
import figur from '../../images/figur.png';
import { connect } from 'react-redux';


class Programm extends Component {

  render() {
    return (
      <div className="app-wrapper">
        <Header />
        <Menu currentPage="programm" />

        <div className="main">
          <div className="content programm">

            {
              !this.props.error &&
              (
                <div className="legende">Farben:
                  &nbsp; <span className="veranstaltung" style={{ padding: 5 + 'px' }}>Veranstaltung</span>
                  &nbsp; <span className="workshop" style={{ padding: 5 + 'px' }}>Workshop</span>
                  &nbsp; <span className="offenesangebot" style={{ padding: 5 + 'px', whiteSpace: 'nowrap' }}>offenes Angebot</span>
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
                    { this.props.events[tag].map( event => {
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
  const events = state.events.map( event => {
    const { zeitVon, zeitBis, ...rest } = event;
    const datumVon = new Date(zeitVon);
    const datumBis = new Date(zeitBis);
    let zeitVonMin = datumVon.getMinutes();
    let zeitBisMin = datumBis.getMinutes();
    if (zeitVonMin<10) zeitVonMin = '0' + zeitVonMin;
    if (zeitBisMin<10) zeitBisMin = '0' + zeitBisMin;
    const monat = datumVon.getMonth()+1;
    const tage = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

    return { ...rest,
      zeitVonStd: datumVon.getHours(),
      zeitVonMin,
      zeitBisStd: datumBis.getHours(),
      zeitBisMin,
      tag: tage[datumVon.getDay()] + ', ' + datumVon.getDate() + '.' + monat + '.' + datumVon.getFullYear()
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
  if ( tage.length > 0 ) return { events: eventsJeTag, tage };
  return { error: 'No events' };
}

export default connect(mapStateToProps)(Programm);
