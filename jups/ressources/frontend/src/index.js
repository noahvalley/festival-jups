import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

import store from './store'

import './styles/index.css';

import Home from './routes/Home';
// import Programm from './routes/Programm';
// import Tickets from './routes/Tickets';
// import Kontakt from './routes/Kontakt';
// import Downloads from './routes/Downloads';
import Programm from './routes/Home';
import Tickets from './routes/Home';
import Kontakt from './routes/Home';
import Downloads from './routes/Home';
import Orte from './routes/Orte';
import Archiv from './routes/Home';


ReactDOM.render(
  <Provider store={ store }>
    <Router>
      <Switch>
        <Route exact path="/" component={ Home } />
        <Route exact path="/home" component={ Home } />
        <Route exact path="/programm" component={ Programm } />
        <Route exact path="/tickets" component={ Tickets } />
        <Route exact path="/kontakt" component={ Kontakt } />
        <Route exact path="/downloads" component={ Downloads } />
        <Route exact path="/orte" component={ Orte } />
        <Route exact path="/archiv" component={ Archiv } />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
