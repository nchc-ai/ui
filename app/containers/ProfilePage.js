import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import bindActionCreatorHoc from '../libraries/bindActionCreatorHoc';

class ProfilePage extends Component {
  componentWillMount() {

  }

  render() {
    return (
      <div className="room-page-bg global-content">
        <div>123</div>
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
  withRouter
)(ProfilePage);
