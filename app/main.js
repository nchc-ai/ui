import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import 'jquery';
import 'react-select/dist/react-select.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import './assets/styles/style.scss';
import 'react-progress-2/main.css';

import store from './store';
import App from './App';


ReactDOM.render((
  <Provider store={store}>
      <App />
  </Provider>
), document.getElementById('body'));
