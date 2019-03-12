
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Cookies from 'js-cookie';
import { removeToken } from '../libraries/utils';
import bindActionCreatorHOC from '../libraries/bindActionCreatorHOC';

class Logout extends Component {

  componentWillMount() {
    const {
      authAction,
      token
    } = this.props;
    authAction.logout({ token, next: this.afterLogout });
  }

  afterLogout = () => {

    const {
      authAction,
      history,
    } = this.props;

    authAction.resetAuth();

    Cookies.set('is_login', false);
    Cookies.set('user_info', {});
    Cookies.set('token_obj', {});

    history.push('/');
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
  bindActionCreatorHOC
)(Logout);
