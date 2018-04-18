import { combineReducers } from 'redux';

import eventReducer from './events';
import homeReducer from './pages';
import fetchStateReducer from './fetchState';


const reducers = combineReducers({
  events: eventReducer,
  home: homeReducer,
  fetchState: fetchStateReducer,
});

export default reducers;
