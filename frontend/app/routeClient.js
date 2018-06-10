import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router';
import Client from './containers/Client';
import IndexPage from './containers/IndexPage';
import StaticPage from './containers/StaticPage';

// import { isItemExistInLocalStorage } from './libraries/utils';

const routeClient = ({ offline }) => (
  <Client>
    <Switch>
      { offline ? <Route path="*" component={StaticPage} /> : null }
      <Route exact path="/" component={IndexPage} />
    </Switch>
  </Client>
);

const mapStateToProps = ({ Ui }) => ({
  offline: Ui.Status.offline
});

export default compose(
  connect(mapStateToProps),
)(routeClient);
