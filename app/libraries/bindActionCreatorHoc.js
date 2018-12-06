import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as Auth from '../actions/Auth';
import * as Classroom from '../actions/Classroom';
import * as Course from '../actions/Course';
import * as User from '../actions/User';
import * as Ui from '../actions/Ui';

export default function bindActionCreatorHoc(WrappedComponent) {
  class Wrapper extends React.Component {
    render = () => (<WrappedComponent {...this.props} />);
  }

  const mapDispatchToProps = dispatch => ({
    authAction: bindActionCreators(Auth, dispatch),
    roomAction: bindActionCreators(Classroom, dispatch),
    courseAction: bindActionCreators(Course, dispatch),
    userAction: bindActionCreators(User, dispatch),
    uiAction: bindActionCreators(Ui, dispatch)
  });
  return connect(null, mapDispatchToProps)(Wrapper);
}
