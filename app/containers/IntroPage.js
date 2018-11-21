import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import bindActionCreatorHoc from '../libraries/bindActionCreatorHoc';

class IntroPage extends Component {
  componentWillMount() {

  }

  render() {
    <div className="room-page-bg global-content">
      <div>123</div>
      {/* <Switch>

        <Route exact path="/course/detail/:courseId">

        </Route>
      </Switch> */}
    </div>
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
)(IntroPage);
