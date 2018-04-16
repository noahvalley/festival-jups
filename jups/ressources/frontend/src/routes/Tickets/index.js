import React, { Component } from 'react';
import Header from '../../components/Header';
import Menu from '../../components/Menu';
import figur from '../../images/figur.png';
import { connect } from 'react-redux';


class Tickets extends Component {

  constructor(props) {
    super(props);
    this.state = {
      veranstaltungen: [],
      name: '',
      email: '',
      kommentar: '',
      statusMessage: '',
      sentDialogToggled: false
    }
  }

  handleNameChange = (event) => {
    this.setState({ name: event.currentTarget.value });
  }

  handleEmailChange = (event) => {
    this.setState({ email: event.currentTarget.value });
  }


  handleKommentarChange = (event) => {
    this.setState({ kommentar: event.currentTarget.value });
  }

  getVeranstaltungen = (event) => {
    var options = event.target.options;
    var value = [];
    for (var i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    // [...event.target.options].filter(opt => opt.selected).map(o => o.value)
    this.setState({ veranstaltungen: value });
  }

  handleSend = (event) => {
    event.preventDefault();
    const { name, email, kommentar, veranstaltungen } = this.state;
    if ( name !== '' && email !== '' && veranstaltungen ) {
      this.setState({ statusMessage: '' });
      console.log(name);
      console.log(email);
      console.log(kommentar);
      console.log(veranstaltungen);
      this.setState({ toggleSentDialog: true });
    } else {
      this.setState({ statusMessage: 'Bitte Email & Name angeben und eine Veranstaltung auswählen!' });
    }
  }

  toggleSentDialog = () => {
    this.setState({ sentDialogToggled: !this.state.sentDialogToggled });
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
              <p>
                Eine Veranstaltung (oder mehrere) wählen:<br/>
                { this.props.error
                  ? 'keine Veranstaltungen mit offener Reservation'
                  : (
                    <select multiple size={this.props.events.length}
                      onChange={ this.getVeranstaltungen } defaultValue={[0]} >
                      <option style={{ display: 'none' }} />
                      { this.props.events.map( event => {
                            if (event.istTag) {
                              return (
                                <option disabled key={event.text}>{event.text}</option>
                              )
                            } else {
                              return (
                                <option key={event.text}>{event.text}</option>
                              )
                            }
                          }
                        )
                      }
                    </select>
                  )
                }
              </p>

              <label htmlFor="email">Email:</label>
              <input id="email" type="email" placeholder="Email"
              onChange={ this.handleEmailChange }
              value={ this.state.email } />

              <div style={{ clear: 'both', marginTop: 12 + 'px' }}>&nbsp;</div>

              <label htmlFor="email">Name:</label>
              <input id="name" type="text" placeholder="Vorname Nachname"
              onChange={ this.handleNameChange }
              value={ this.state.name } />

              <div style={{ clear: 'both', marginTop: 12 + 'px' }}>&nbsp;</div>

              <label htmlFor="email">Kommentar:</label>
              <textarea id="kommentar" type="text" placeholder="Platz für Anmerkungen"
              onChange={ this.handleKommentarChange }
              value={ this.state.kommentar } />

              <div style={{ clear: 'both', marginTop: 12 + 'px' }}>&nbsp;</div>

              <button type="submit" onClick={ this.handleSend }>Senden</button>
              <div className="status">{this.state.statusMessage}</div>
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
  const events = state.events.map( event => {
    const { zeitVon, zeitBis, titel, position, ausverkauft, id } = event;
    const datumVon = new Date(zeitVon);
    const datumBis = new Date(zeitBis);
    let zeitVonMin = datumVon.getMinutes();
    let zeitBisMin = datumBis.getMinutes();
    if (zeitVonMin<10) zeitVonMin = '0' + zeitVonMin;
    if (zeitBisMin<10) zeitBisMin = '0' + zeitBisMin;
    const monat = datumVon.getMonth()+1;
    const tage = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

    return { titel, position, datumVon, ausverkauft, id,
      zeitVon: datumVon.getHours() + ':' + zeitVonMin,
      zeitBis: datumBis.getHours() + ':' + zeitBisMin,
      tag: tage[datumVon.getDay()] + ', ' + datumVon.getDate() + '.' + monat + '.' + datumVon.getFullYear()
    }
  }).filter( event => { // schon vergangene events weg
    return event.datumVon > new Date();
  }).filter( event => { // unreservierbare events weg
    return !event.ausverkauft;
  }).sort( (a, b) => a.position - b.position )

  // in tage einteilen
  const eventsJeTag = {};
  events.forEach( event => {
    if (!eventsJeTag[event.tag]) { eventsJeTag[event.tag] = [] };
    eventsJeTag[event.tag].push(event);
  })

  // hierarchie mit tagen wieder flach machen
  const tage = Object.keys(eventsJeTag);
  const tageUndEvents = [];
  tage.forEach( ( tag, index ) => {
    // e.g. "Sonntag, 1.2.1345"
    tageUndEvents.push( { text: tag, istTag: true } )

    // alle events an diesem tag
    eventsJeTag[tag].forEach( event => {
      tageUndEvents.push({
        text: event.zeitVon + '–' + event.zeitBis + ': ' + event.titel,
        istTag: false
      })
    })

    // abstand, falls noch ein tag nachher
    if ( index < tage.length-1 ) {
      tageUndEvents.push( { text: '', istTag: true} )
    }
  })

  if ( tage.length > 0 ) return { events: tageUndEvents };
  return { error: 'No events' };
}

export default connect(mapStateToProps)(Tickets);
