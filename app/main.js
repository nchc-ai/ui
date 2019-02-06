import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import 'jquery';
import 'react-select/dist/react-select.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import './assets/styles/style.scss';
import 'react-quill/dist/quill.snow.css';
import 'font-awesome/css/font-awesome.min.css';
import "react-datepicker/dist/react-datepicker.css";
import "react-tabs/style/react-tabs.css";

import store from './store';
import App from './App';


ReactDOM.render((
  <Provider store={store}>
      <App />
  </Provider>
), document.getElementById('body'));
