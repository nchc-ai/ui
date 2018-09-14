import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router';
import Client from './containers/Client';
import IndexPage from './containers/IndexPage';
import CoursePage from './containers/CoursePage';
import ContactPage from './containers/ContactPage';
import AuthPage from './containers/AuthPage';
import UserPage from './containers/UserPage';
import StaticPage from './containers/StaticPage';
import Logout from './containers/Logout';

// import { isItemExistInLocalStorage } from './libraries/utils';

const routeClient = ({ offline, isLogin }) => (
  <Client>
    <Switch>
      { offline ? <Route path="*" component={StaticPage} /> : null }

      <Route exact path="/course/:type/:courseId" component={CoursePage} />
      <Route exact path="/course/:type" component={CoursePage} />
      <Route exact path="/contact" component={ContactPage} />
      <Route exact path="/login" component={AuthPage} />
      <Route exact path="/signup" component={AuthPage} />
      <Route exact path="/user/:part/:action/:courseId" component={isLogin ? UserPage : AuthPage} />
      <Route exact path="/user/:part/:action" component={isLogin ? UserPage : AuthPage} />
      <Route exact path="/user/:part" component={isLogin ? UserPage : AuthPage} />
      <Route exact path="/logout" component={Logout} />
      <Route exact path="/" component={IndexPage} />
      <Route exact path="*" component={StaticPage} />
    </Switch>
  </Client>
);

const mapStateToProps = ({ Ui, Auth }) => ({
  offline: Ui.Status.offline,
  isLogin: Auth.userInfo.active
});

export default compose(
  connect(mapStateToProps),
)(routeClient);
