const pages = (state = {}, action) => {
  switch(action.type) {

    case 'setPages':
      const {
        home: { content: home },
        kontakt: { content: kontakt },
        archiv: { content: archiv },
        downloads: { content: downloads },
        tickets,
        programm
      } = action.payload;

      return { home, kontakt, archiv, downloads, tickets, programm }

    default:
      return state;
  }
}

export default pages;
