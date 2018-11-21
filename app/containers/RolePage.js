import React, { Component } from 'react';
import { Switch, Route, withRouter, Link } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import bindActionCreatorHoc from '../libraries/bindActionCreatorHoc';

class RolePage extends Component {
  componentWillMount() {

  }

  render() {
    return (
      <div className="room-page-bg global-content">
        <Switch>
          <Route path=""></Route>
        </Switch>
        <Link to="/">12345</Link>
      </div>
    );
  }
}

const mapStateToProps = ({ Auth, Course }) => ({
  token: Auth.token,
  userInfo: Auth.userInfo,
});

const mapDispatchToProps = dispatch => ({

});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  bindActionCreatorHoc,
)(RolePage);
