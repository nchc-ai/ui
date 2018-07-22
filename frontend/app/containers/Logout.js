
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { removeToken } from '../libraries/utils';
import bindActionCreatorHoc from '../libraries/bindActionCreatorHoc';

class Logout extends Component {

  componentWillMount() {
    this.doLogout();
  }

  doLogout = () => {
    const {
      authAction,
      history,
      token
    } = this.props;
    authAction.logout(token, this.redirect);
  }

  redirect = () => {
    removeToken();
    this.props.history.push('/');
  }

  render = () => (<span className="dn" />);
}

const mapStateToProps = ({ Auth }) => ({
  token: Auth.token
});

export default compose(
  connect(
    mapStateToProps
  ),
  bindActionCreatorHoc
)(Logout);
