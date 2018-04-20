import { combineReducers } from 'redux';

import eventReducer from './events';
import pagesReducer from './pages';
import fetchStateReducer from './fetchState';


const reducers = combineReducers({
  events: eventReducer,
  pages: pagesReducer,
  fetchState: fetchStateReducer,
});

export default reducers;
