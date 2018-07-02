import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import DocumentMeta from 'react-document-meta';
import { BrowserRouter as Router } from 'react-router-dom';
import { Switch, Route } from 'react-router';
// import { I18nextProvider } from 'react-i18next';


import 'react-select/dist/react-select.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import './assets/styles/style.scss';

// import i18n from './i18n';
import store from './store';
import routeAdmin from './routeAdmin';
import routeClient from './routeClient';
import SideMenu from './components/SideMenu';
import StaticPage from './containers/StaticPage';
import { metaObj } from './constants/models';


ReactDOM.render((
  <Provider store={store}>
    {/* <I18nextProvider i18n={i18n}> */}
      <div id="outer-container" style={{ height: '100%' }}>
        <Router>
          <div>
            {/* <SideMenu /> */}
            <div className="global-bg">
              <DocumentMeta {...metaObj} />
              <Switch>
                <Route path="/manage" component={routeAdmin} />
                <Route path="/" component={routeClient} />
                <Route path="*" component={StaticPage} />
              </Switch>
            </div>
          </div>
        </Router>
      </div>
    {/* </I18nextProvider> */}
  </Provider>
), document.getElementById('body'));
