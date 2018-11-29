import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

import DocumentMeta from 'react-document-meta';

import RouteUser from './RouteUser';
import RouteGuest from './RouteGuest';
import StaticPage from './containers/StaticPage';
import Dialog from './components/common/Dialog';
import { metaObj } from './constants/models';

class App extends Component {


  render = () => {
    const {
      match,
      userInfo,
      isLogin,
      offline,
      dropDownPos,
      t,
    } = this.props;
    return (
      <div id="outer-container" style={{ height: '100%' }}>
        <DocumentMeta {...metaObj} />
        <Router>
          <Switch>
            { offline ? <Route path="*" component={StaticPage} /> : null }
            <Route path="/classroom-manage/:action/:roomId" component={isLogin ? RouteUser : AuthPage} />
            <Route path="/classroom-manage/:action" component={isLogin ? RouteUser : AuthPage} />

            <Route path="/classroom-time" component={isLogin ? RouteUser : AuthPage} />

            <Route path="/classroom-group" component={isLogin ? RouteUser : AuthPage} />

            <Route path="/role-select/:level" component={isLogin ? RouteUser : AuthPage} />

            <Route exact path="/job/:action" component={isLogin ? RouteUser : AuthPage} />

            <Route exact path="/ongoing-course/create/:courseType" component={isLogin ? RouteUser : AuthPage} />
            <Route exact path="/ongoing-course/:action/:courseId" component={isLogin ? RouteUser : AuthPage} />
            <Route exact path="/ongoing-course/:action" component={isLogin ? RouteUser : AuthPage} />

            <Route exact path="/classroom-group/:action" component={isLogin ? RouteUser : AuthPage} />

            <Route exact path="/profile/:action/:courseId" component={isLogin ? RouteUser : AuthPage} />
            <Route exact path="/profile/:action" component={isLogin ? RouteUser : AuthPage} />

            <Route path="/password-setting" component={isLogin ? RouteUser : AuthPage} />





            <Route exact path="/intro/:action/:type" component={RouteGuest} />
            <Route exact path="/intro/:action" component={RouteGuest} />
            <Route exact path="/contact" component={RouteGuest} />
            <Route exact path="/login" component={RouteGuest} />
            <Route exact path="/signup" component={RouteGuest} />
            <Route exact path="/logout"  render={() => <Redirect to='/login' />} />
            <Route exact path="/" component={RouteGuest} />
            <Route exact path="*" component={StaticPage} />
          </Switch>
        </Router>
      </div>
    );
  }
}

const mapStateToProps = ({ Auth, Ui }) => ({
  userInfo: Auth.userInfo,
  isLogin: true,
  dropDownPos: Ui.Dropdown.pos,
  offline: Ui.Status.offline
});

export default compose(
  connect(mapStateToProps),
)(App);
