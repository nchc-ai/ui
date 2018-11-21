import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import SideMenu from './components/SideMenu';
import RoomPage from './containers/RoomPage';
import RolePage from './containers/RolePage';
import CoursePage from './containers/CoursePage';
import JobPage from './containers/JobPage';
import ProfilePage from './containers/ProfilePage';
import StaticPage from './containers/StaticPage';
import Global from './containers/Global';

class RouteUser extends Component {
  render = () => {
    return (
      <div>
        <Global>
          {/* <SideMenu /> */}
          <Switch>
            <Route exact path="/classroom/:action/:roomId" component={RoomPage} />
            <Route exact path="/classroom/:action" component={RoomPage} />
            <Route exact path="/role/select" component={RolePage} />
            <Route exact path="/course/:action/:courseId" component={CoursePage} />
            <Route exact path="/course/:action" component={CoursePage} />
            <Route exact path="/job/list" component={JobPage} />
            <Route exact path="/profile/:action/:courseId" component={ProfilePage} />
            <Route exact path="/profile/:action" component={ProfilePage} />
            <Route exact path="*" component={StaticPage} />
          </Switch>
        </Global>
      </div>
    );
  }
}

const mapStateToProps = ({ Auth }) => ({
  isLogin: Auth.isLogin,
});

export default compose(
  connect(mapStateToProps),
)(RouteUser);
