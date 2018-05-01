const events = (state = [], action) => {
  switch(action.type) {

    case 'setEvents':
      const events = [];

      // workaround because interpretation of Date() varies from browser to browser
      let offset = 0
      if ( action.payload.length > 0 ) {
        const beispiel = action.payload[0].zeitVon;
        const stundenBrowser = new Date(beispiel).getHours();
        const stundenRichtig = beispiel.slice(11,13);
        offset = 3600000 * (stundenRichtig - stundenBrowser);
      }

      action.payload.forEach( event => {
        const {
          id,
          type: typ,
          titel,
          untertitel,
          ort,
          zeitVon,
          zeitBis,
          priority,
          bild,
          logo: sponsorImg,
          text: beschreibung,
          abAlter: alter,
          ausverkauft,
          ausverkauftText,
          tuerOeffnung: beginn,
          preis,
        } = event;

        let position = Date.parse(zeitVon);
        if (priority) position = position + parseInt(priority, 10) ;

        events.push({
          id,
          position,
          typ,
          titel,
          untertitel,
          ort,
          zeitVon: new Date( Date.parse(zeitVon) + offset ),
          zeitBis: new Date( Date.parse(zeitBis) + offset ),
          bild,
          sponsorImg,
          beschreibung,
          alter,
          ausverkauft,
          ausverkauftText,
          beginn,
          preis,
        });
      })

      return events;

    default:
      return state;
  }
}

export default events;
