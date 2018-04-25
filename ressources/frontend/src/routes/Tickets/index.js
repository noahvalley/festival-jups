import React, { Component } from 'react';
import Header from '../../components/Header';
import Menu from '../../components/Menu';
import figur from '../../images/figur.png';
import trash from './button-trash.svg';
import plusImg from './button-plus.svg';
import { connect } from 'react-redux';
import { sendMail } from '../../store/actions';


class Tickets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventWahl: [ {id: props.location.preselectedId, anzahl: '1'} ],
      vorname: '',
      nachname: '',
      email: '',
      telefon: '',
      alter: '',
      bemerkung: '',
      statusMessage: '',
      istVersendet: false
    }
  }

  handleVornameChange = (event) => {
    this.setState({ vorname: event.currentTarget.value });
  }
  handleNachnameChange = (event) => {
    this.setState({ nachname: event.currentTarget.value });
  }
  handleEmailChange = (event) => {
    this.setState({ email: event.currentTarget.value });
  }
  handleTelefonChange = (event) => {
    this.setState({ telefon: event.currentTarget.value });
  }
  handleAlterChange = (event) => {
    this.setState({ alter: event.currentTarget.value });
  }
  handleBemerkungChange = (event) => {
    this.setState({ bemerkung: event.currentTarget.value });
  }

  handleNrOfTicketsChange = (event, index) => {
    const eventWahl = [...this.state.eventWahl];
    eventWahl[index].anzahl = event.currentTarget.value;
    this.setState({ eventWahl });
  }
  handleEventChange = (event, index) => {
    const eventWahl = [...this.state.eventWahl];
    eventWahl[index].id = event.currentTarget.value;
    this.setState({ eventWahl });
  }
  handleAddEvent = () => {
    const eventWahl = [...this.state.eventWahl].concat({id: 'leer', anzahl: 1});
    this.setState({ eventWahl });
  }
  handleRemoveEvent = (index) => {
    const eventWahl = [...this.state.eventWahl];
    eventWahl.splice(index,1);
    if ( eventWahl.length === 0 ) eventWahl.push ({id: 'leer', anzahl: '1'})
    this.setState({ eventWahl });
  }

  handleSend = (event) => {
    event.preventDefault();
    const { vorname, nachname, email, telefon, alter, bemerkung, eventWahl } = this.state;
    if ( vorname === '' || nachname === '' || email === '' || telefon === '' ) {
      this.setState({ statusMessage: 'Bitte alle Felder mit * ausfüllen.' });
    } else {
      this.setState({ statusMessage: '' });

      // id als key; beschreibung als value (zum IDs auflösen nachher)
      const events = {}
      this.props.events.forEach( ({id, text}) => {
        events[id] = text;
      })

      // daten für mail vorbereiten
      const data = {
        vorname, nachname, alter, telefon, email, bemerkung,
        veranstaltungen: eventWahl.map( event => {
          return {
            veranstaltung: events[event.id], // id auflösen
            anz: event.anzahl
          }
        })
        .filter( ({ veranstaltung }) => veranstaltung ) // leere rausfiltern
      }

      if ( data.veranstaltungen.length === 0 ) {
        this.setState({ statusMessage: 'Bitte eine Veranstaltung auswählen.' });
        return;
      }

      // mail versenden
      sendMail(data)
        .then( response => {
          console.log(response);
          if ( response && response.error && response.error.error === false) this.setState({ istVersendet: true });
          else this.setState({ statusMessage: 'Senden ist fehlgeschlagen.' });
        })
    }
  }


  render() {
    return (
      <div className="app-wrapper">
        <Header />
        <Menu currentPage="tickets" />

        <div className="main">
          <div className="content tickets">

            <h1>Infos</h1>

            <p>Tickets und Festivalbändel sind am Infostand erhältlich.</p>
            <p><strong>Einzelticket</strong> für Kinder (jeden Alters) und Erwachsene: Veranstaltung Fr. 15.- / Kurzveranstaltung Fr. 10.- / Workshop Fr. 10.-</p>
            <p><strong>Festivalbändel</strong>: Fr. 35.- (nicht übertragbar), Familienrabatt: 3 für Fr. 90.-, 4 für Fr. 110.-, 5 für Fr. 120.-.</p>
            <p>Offene Angebote sind kostenlos und unangemeldet besuchbar.</p>
            <p><strong>Wir empfehlen eine Reservation, da insbesondere Workshops eine beschränkte Teilnehmerzahl haben.</strong></p>

            <h1>Reservation</h1>
            <p><strong>Reservationen sind verbindlich.</strong></p>

            <div className="reservation">
              { this.props.error
                ? this.props.error === 'loading'
                  ? 'Veranstaltungen laden... ' /* error: loading */
                  : 'Momentan gibt es keine Veranstaltungen mit offener Reservation.' /* events da, aber keine reservierbar */
                : this.state.istVersendet /* nach dem versenden wird formular nicht mehr angezeigt */
                  ? <div className="status">
                      Die Anfrage wurde versendet. Wir werden uns bei Ihnen melden.
                    </div>
                  :
                  <form onSubmit={ this.handleSend }>
                    <div className="erklaerung" style={{ width: 60 + 'px', display: 'inline-box', float: 'left', paddingLeft: 30 + 'px' }}>
                      Anzahl
                    </div>
                    <div className="erklaerung">
                      Veranstaltung
                    </div>
                    { this.state.eventWahl.map( ({id, anzahl}, index) => {
                      return (
                        <div key={'selectgroup-'+index} className="selectgroup">

                          { /* button LÖSCHEN */
                            <button type="button" onClick={ () => this.handleRemoveEvent(index) }>
                              <img style={{ height: 20 + 'px', position: 'relative', top: 5 + 'px', marginLeft: 5 + 'px' }} src={ trash } alt="entfernen" />
                            </button>
                          }

                          { /* drop down ANZAHL */ }
                          <select className="anzahl" onChange={ (event) => this.handleNrOfTicketsChange(event, index) } value={anzahl} >
                            { [1,2,3,4,5,6,7,8,9,10].map( zahl => {
                                return (
                                  <option value={zahl} key={zahl + 'tickets'}>{zahl}</option>
                                )}
                              )
                            }
                          </select>

                          { /* drop down EVENTS */ }
                          <select className="events" onChange={ (e) => this.handleEventChange(e, index) } value={id} >
                            <option value="leer" style={{ display: 'none' }} />
                            { this.props.events.map( event => {
                                return (
                                  <option value={event.id} key={'event-'+event.id}>{event.text}</option>
                                )}
                              )
                            }
                          </select>

                        </div>
                      )
                    })
                  }

                  <button className="weitere-res" type="button" onClick={ this.handleAddEvent }>
                    <img src={plusImg} alt="" />
                    weitere Veranstaltung reservieren
                  </button>

                  <div style={{ clear: 'both', marginTop: 20 + 'px' }} />

                  <div className="formularfeld">
                    <label htmlFor="vorname">Vorname* <span className="erklaerung">bei Workshop: Kind</span></label>
                    <input id="vorname" type="text"
                    onChange={ this.handleVornameChange }
                    value={ this.state.vorname } />
                  </div>

                  <div className="formularfeld">
                    <label htmlFor="nachname">Nachname*</label>
                    <input id="nachname" type="text"
                    onChange={ this.handleNachnameChange }
                    value={ this.state.nachname } />
                  </div>

                  <div style={{ clear: 'both' }} />

                  <div className="formularfeld">
                    <label htmlFor="email">Email*</label>
                    <input id="email" type="email"
                    onChange={ this.handleEmailChange }
                    value={ this.state.email } />
                  </div>

                  <div className="formularfeld">
                    <label htmlFor="telefon">Telefon*</label>
                    <input id="telefon" type="telefon"
                    onChange={ this.handleTelefonChange }
                    value={ this.state.telefon } />
                  </div>

                  <div style={{ clear: 'both' }} />

                  <div className="formularfeld">
                    <label htmlFor="alter">Alter (nur Workshops) <br/><span className="erklaerung">Für die Planung der Workshops brauchen wir die Altersangaben der Teilnehmenden.</span></label>
                    <input id="alter" type="text"
                    onChange={ this.handleAlterChange }
                    value={ this.state.alter } />
                  </div>

                  <div style={{ clear: 'both' }} />

                  <label htmlFor="bemerkung">Bemerkung</label>
                  <textarea id="bemerkung" type="text"
                  onChange={ this.handleBemerkungChange }
                  value={ this.state.bemerkung } />

                  <div style={{ clear: 'both' }} />

                  <button className="send" type="submit" onClick={ this.handleSend }>Senden</button>
                  <div className="status">{this.state.statusMessage}</div>
                </form>
            }
            </div>

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
  if ( !state.fetchState.events ) return {error: 'loading'}

  const events = state.events.map( event => {
    const { zeitVon, zeitBis, titel, position, ausverkauft, id } = event;
    const datumVon = new Date(zeitVon);
    const datumBis = new Date(zeitBis);
    let zeitVonMin = datumVon.getMinutes();
    let zeitBisMin = datumBis.getMinutes();
    if (zeitVonMin<10) zeitVonMin = '0' + zeitVonMin;
    if (zeitBisMin<10) zeitBisMin = '0' + zeitBisMin;
    const monat = datumVon.getMonth()+1;
    const tage = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
    const tag = tage[datumVon.getDay()] + ' ' + datumVon.getDate() + '.' + monat + '.' + datumVon.getFullYear();

    return { titel, position, datumVon, ausverkauft, id,
      text: tag + ', ' + datumVon.getHours() + ':' + zeitVonMin + '–' + datumBis.getHours() + ':' + zeitBisMin + ': ' + titel
    }
  }).filter( event => { // schon vergangene events weg
    return event.datumVon > new Date();
  }).filter( event => { // unreservierbare events weg
    return !event.ausverkauft;
  }).sort( (a, b) => a.position - b.position )

  if ( events.length > 0 ) return { events };

  return { error: 'keine Veranstaltungen mit offener Reservation' };
}

export default connect(mapStateToProps)(Tickets);
