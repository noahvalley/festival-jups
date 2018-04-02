// import API_BASE_URL from '../../resources/API_URL';
const API_BASE_URL = 'http://api.festival-jups.ch';


export const setEvents = (events) => ({
  type: 'setEvents',
  payload: events
});

export const fetchEvents = () => (dispatch) => {
  const url = `${API_BASE_URL}/events`;
  const params = { method: 'GET' }

  return fetch(url, params)
    .then( response => response.json() )
    .then( events => {
      if (!events.error.error) dispatch( setEvents(events.data) )
    })
    .catch( error => { } );
}



export const setHome = (page) => ({
  type: 'setHome',
  payload: page
});

export const fetchHome = () => (dispatch) => {
  const url = `${API_BASE_URL}/pages/home`;
  const params = { method: 'GET' }

  return fetch(url, params)
    .then( response => response.json() )
    .then( page => {
      console.log(page)
      if (!page.error.error) dispatch( setHome(page.data) )
    })
    .catch( error => { } );
}
