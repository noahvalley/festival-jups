import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import './styles/index.scss';

import DynamicPage from './routes/PagesDynamic';
import Programm from './routes/Programm';
import Tickets from './routes/Tickets';
import Orte from './routes/Orte';

ReactDOM.render(
  <Provider store={ store }>
    <Router>
      <Switch>
        <Route exact path="/" component={ DynamicPage } />
        <Route exact path="/home" component={ DynamicPage } />
        <Route exact path="/programm" component={ Programm } />
        <Route exact path="/tickets" component={ Tickets } />
        <Route exact path="/kontakt" component={ DynamicPage } />
        <Route exact path="/downloads" component={ DynamicPage } />
        <Route exact path="/orte" component={ Orte } />
        <Route exact path="/archiv" component={ DynamicPage } />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('root'),
);

registerServiceWorker();
