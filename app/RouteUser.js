import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Switch, Route, withRouter } from 'react-router-dom';
import SideMenu from './components/SideMenu';
import RoomPage from './containers/RoomPage';
import RoomTime from './containers/RoomTime';
import RolePage from './containers/RolePage';
import CoursePage from './containers/CoursePage';
import RoomGroup from './containers/RoomGroup';
import JobPage from './containers/JobPage';
import ProfilePage from './containers/ProfilePage';
import StaticPage from './containers/StaticPage';
import PasswordPage from './containers/PasswordPage';
import Global from './containers/Global';
import RoleSelect from './components/common/RoleSelect';

class RouteUser extends Component {
  render = () => {
    const {
      match,
      role
    } = this.props;

    return (
      <Global>
        <SideMenu match={match} />
        <div className="user-node">
          { role === "superuser" ? <RoleSelect /> : null }
          <Switch>
            <Route exact path="/user/classroom-manage" component={RoomPage} />
            <Route exact path="/user/classroom-manage/:action/:roomId" component={RoomPage} />
            <Route exact path="/user/classroom-manage/:action" component={RoomPage} />

            <Route exact path="/user/classroom-time" component={RoomTime} />

            <Route exact path="/user/role-select/:level" component={RolePage} />

            <Route exact path="/user/job/list" component={JobPage} />

            <Route exact path="/user/ongoing-course/create/:courseType" component={CoursePage} />
            <Route exact path="/user/ongoing-course/:action/:courseId/:courseType" component={CoursePage} />
            <Route exact path="/user/ongoing-course/:action" component={CoursePage} />

            <Route exact path="/user/classroom-group/:action" component={RoomGroup} />

            <Route exact path="/user/profile/:action/:courseId" component={ProfilePage} />
            <Route exact path="/user/profile/:action" component={ProfilePage} />

            <Route exact path="/user/password-setting" component={PasswordPage} />

            <Route exact path="*" component={StaticPage} />
          </Switch>
        </div>
      </Global>
    );
  }
}

const mapStateToProps = ({ Auth }) => ({
  role: Auth.userInfo.role,
  isLogin: Auth.isLogin
});

export default compose(
  withRouter,
  connect(mapStateToProps)
)(RouteUser);
