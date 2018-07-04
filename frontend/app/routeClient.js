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

// import { isItemExistInLocalStorage } from './libraries/utils';

const routeClient = ({ offline }) => (
  <Client>
    <Switch>
      { offline ? <Route path="*" component={StaticPage} /> : null }
      <Route exact path="/" component={IndexPage} />
      <Route exact path="/course/:type" component={CoursePage} />
      <Route exact path="/course" component={CoursePage} />
      <Route exact path="/contact" component={ContactPage} />
      <Route exact path="/login" component={AuthPage} />
      <Route exact path="/signup" component={AuthPage} />
      <Route exact path="/user/:part/:action" component={UserPage} />
      <Route exact path="/user/:part" component={UserPage} />
    </Switch>
  </Client>
);

const mapStateToProps = ({ Ui }) => ({
  offline: Ui.Status.offline
});

export default compose(
  connect(mapStateToProps),
)(routeClient);
