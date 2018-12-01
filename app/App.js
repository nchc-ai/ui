import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import DocumentMeta from 'react-document-meta';

import RouteUser from './RouteUser';
import RouteGuest from './RouteGuest';

import SetUserInfo from './components/common/SetUserInfo/index';
import AuthPage from './containers/AuthPage';
import StaticPage from './containers/StaticPage';
import Dialog from './components/common/Dialog';
import { metaObj } from './constants/models';

const PrivateRoute = ({ component: Component, isLogin, ...rest }) => (
  <Route {...rest} render={(props) => {
    console.log('isLogin', isLogin, props);
    return (
      isLogin ? <Component {...props} /> : <Redirect to='/login' />
  )}} />
);
class App extends Component {
  render = () => {
    const {
      isLogin,
      offline,
    } = this.props;
    return (
      <div id="outer-container" style={{ height: '100%' }}>
        <DocumentMeta {...metaObj} />
        <SetUserInfo />
        <Router>
          <Switch>
            { offline ? <Route path="*" component={StaticPage} /> : null }
            <PrivateRoute path='/user' isLogin={isLogin} component={RouteUser} />
            <Route path="/" component={RouteGuest} />

            <Route exact path="*" component={StaticPage} />
          </Switch>
        </Router>
      </div>
    );
  }
}

const mapStateToProps = ({ Auth, Ui }) => ({
  userInfo: Auth.userInfo,
  isLogin: Auth.isLogin,
  dropDownPos: Ui.Dropdown.pos,
  offline: Ui.Status.offline
});

export default compose(
  connect(mapStateToProps),
)(App);
