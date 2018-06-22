import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as Auth from '../actions/Auth';
import * as Course from '../actions/Course';
import * as Ui from '../actions/Ui';
import * as Result from '../actions/Result';

export default function bindActionCreatorHoc(WrappedComponent) {
  class Wrapper extends React.Component {
    render = () => (<WrappedComponent {...this.props} />);
  }

  const mapDispatchToProps = dispatch => ({
    authAction: bindActionCreators(Auth, dispatch),
    courseAction: bindActionCreators(Course, dispatch),
    uiAction: bindActionCreators(Ui, dispatch),
    resultAction: bindActionCreators(Result, dispatch)
  });
  return connect(null, mapDispatchToProps)(Wrapper);
}
