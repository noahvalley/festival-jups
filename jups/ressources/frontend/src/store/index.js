import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import reducers from './reducers'
import thunk from 'redux-thunk';

const logger = createLogger({
  duration: true,
});

const store = createStore(
  reducers,
  applyMiddleware(thunk, logger)
);

export default store;
