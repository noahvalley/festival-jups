const events = (state = [], action) => {
  switch(action.type) {

    case 'setEvents':
      const events = [];

      // workaround because interpretation of Date() varies from browser to browser -> let's make a test drill!
      const beispiel = '2018-09-07T12:00';
      const stundenRichtig = 12;
      const stundenBrowser = new Date(beispiel).getHours();
      const offset = 3600000 * (stundenRichtig - stundenBrowser);

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
