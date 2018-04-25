const events = (state = [], action) => {
  switch(action.type) {

    case 'setEvents':
      const events = [];
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

        const position = Date.parse(zeitVon) + priority;

        events.push({
          id,
          position,
          typ,
          titel,
          untertitel,
          ort,
          zeitVon,
          zeitBis,
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
