import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';
import bindActionCreatorHoc from '../../../libraries/bindActionCreatorHoc';

class SetUserInfo extends Component {

  static propTypes = {
  }

  componentWillMount() {
    const {
      authAction,
      match
    } = this.props;

    const isLogin = Cookies.get('is_login') === 'true';
    const tokenObj = Cookies.getJSON('token_obj');
    // 1. 置入 GA
    // ga('create', 'UA-112418828-2', 'auto');
    // ga('send', 'pageview');

    // 2. DB health check
    authAction.checkDatabase()

    // 3. 同步 cookie 到登入 state
    authAction.setLoginState(isLogin);

    // 4. 試探性的驗證 token
    if (match.url !== '/') {
      this.props.authAction.getUserInfo({ token: tokenObj.token, failCb: this.onTokenFail });
    }

    // 4. 若已登入則線上更新 userInfo && 更新 token
    if (isLogin) {
      this.props.syncCookieToState();
      // this.props.refreshToken();
    }
  }

  onTokenFail = () => {
    const {
      history,
      authAction
    } = this.props;

    // 形同登出
    authAction.resetAuth();
    Cookies.set('is_login', false);
    Cookies.set('user_info', {});
    Cookies.set('token_obj', {});
    if (match.url !== '/') {
      history.push('/login');
    }
  }

  render = () => (<span className="dn" />);
}

const mapStateToProps = ({ Auth }) => ({
  userInfo: Auth.userInfo
});

export default compose(
  connect(
    mapStateToProps
  ),
  bindActionCreatorHoc,
  withRouter
)(SetUserInfo);
