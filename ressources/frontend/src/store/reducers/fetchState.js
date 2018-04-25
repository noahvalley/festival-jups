const fetchState = (state = { pages: false, events: false }, action) => {
  switch(action.type) {

    case 'setPages': {
      const events = state.events;
      return { events, pages: true }
    }

    case 'setEvents': {
      const pages = state.pages;
      return { pages, events: true }
    }

    default:
      return state;
  }
}

export default fetchState;
