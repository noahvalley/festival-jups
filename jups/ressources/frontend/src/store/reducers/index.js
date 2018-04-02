import { combineReducers } from 'redux';

import eventReducer from './events';
import homeReducer from './pages';


const reducers = combineReducers({
  events: eventReducer,
  home: homeReducer,
});

export default reducers;
