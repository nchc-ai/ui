import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
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
      match
    } = this.props;

    return (
      <div>
        <Global>
          <SideMenu match={match} />
            <div className="user-node">
              <RoleSelect/>
              <Switch>
                <Route exact path="/classroom-time" component={RoomTime} />
                <Route exact path="/classroom-manage/:action/:roomId" component={RoomPage} />
                <Route exact path="/classroom-manage/:action" component={RoomPage} />
                <Route exact path="/role-select" component={RolePage} />
                <Route exact path="/role-select/:level" component={RolePage} />
                <Route exact path="/ongoing-course/:action/:courseId" component={CoursePage} />
                <Route exact path="/ongoing-course/:action" component={CoursePage} />
                <Route exact path="/classroom-group" component={RoomGroup} />
                <Route exact path="/job/list" component={JobPage} />
                <Route exact path="/password-setting" component={PasswordPage} />
                <Route exact path="/profile/:action/:courseId" component={ProfilePage} />
                <Route exact path="/profile/:action" component={ProfilePage} />
                <Route exact path="*" component={StaticPage} />
              </Switch>
            </div>
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
  withRouter
)(RouteUser);
