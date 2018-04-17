import { API_BASE_URL } from '../constants/apiBaseURL';
import { apikey } from '../constants/apikey';


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
    .then( pages => {
      // console.log(page)
      if (!pages.error.error) dispatch( setHome(pages.data) )
    })
    .catch( error => { } );
}



export const sendMail = (data) => {
  const url = `${API_BASE_URL}/sendmail`;
  const params = {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify({apikey, data})
  }

  return fetch(url, params)
    .then( response => response.json() )
    .catch( error => { } );
}
