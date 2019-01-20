import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import DocumentMeta from 'react-document-meta';
import Cookies from 'js-cookie';

import RouteUser from './RouteUser';
import RouteGuest from './RouteGuest';
import Global from './containers/Global';
import StaticPage from './containers/StaticPage';
import Dialog from './components/common/Dialog';
import { metaObj } from './constants/models';
import bindActionCreatorHoc from './libraries/bindActionCreatorHoc';


const PrivateRoute = ({ component: Component, isLogin, ...rest }) => (
  <Route exarct {...rest} render={(props) => (
    Cookies.get('is_login') === 'true' ? <Component {...props} /> : <Redirect to='/' />
  )} />
);

class App extends Component {
  render = () => {
    const {
      offline
    } = this.props;
    return (
      <div id="outer-container" style={{ height: '100%' }}>
        <DocumentMeta {...metaObj} />
        <Router>
          <Switch>
            { offline ? <Route path="*" component={StaticPage} /> : null }

            <PrivateRoute path="/user/classroom-manage/:action/:roomId" component={RouteUser} />
            <PrivateRoute path="/user/classroom-manage/:action" component={RouteUser} />
            <PrivateRoute path="/user/classroom-time" component={RouteUser} />
            <PrivateRoute path="/user/role-select/:level" component={RouteUser} />
            <PrivateRoute path="/user/job/list" component={RouteUser} />
            <PrivateRoute path="/user/ongoing-course/create/:courseType" component={RouteUser} />
            <PrivateRoute path="/user/ongoing-course/:action/:courseId" component={RouteUser} />
            <PrivateRoute path="/user/ongoing-course/:action" component={RouteUser} />
            <PrivateRoute path="/user/classroom-group/:action" component={RouteUser} />
            <PrivateRoute path="/user/profile/:action/:courseId" component={RouteUser} />
            <PrivateRoute path="/user/profile/:action" component={RouteUser} />
            <PrivateRoute path="/user/password-setting" component={RouteUser} />

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
  connect(
    mapStateToProps
  ),
  bindActionCreatorHoc
)(App);
