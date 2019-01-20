import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Cookies from 'js-cookie';
import bindActionCreatorHoc from '../../../libraries/bindActionCreatorHoc';
import { getToken, dayToSecond } from '../../../libraries/utils';

class SetUserInfo extends Component {

  static propTypes = {
  }

  componentWillMount() {
    const {
      authAction,
    } = this.props;

    const userInfo = Cookies.getJSON('user_info');
    const token = Cookies.get('token');
    const isLogin = Cookies.get('is_login') === 'true';

    console.log('[cookie] userInfo', userInfo);

    // 1. 置入 GA
    // ga('create', 'UA-112418828-2', 'auto');
    // ga('send', 'pageview');

    // 2. DB health check
    authAction.checkDatabase()

    // 3. 同步 cookie 到登入 state
    authAction.setLoginState({ isLogin });

    // 4. 若已登入則線上更新 userInfo
    if (isLogin) {
      this.syncCookieToState({ token, userInfo });
    }
  }

  /**
   * Sync userinfo and token from cookie to state
   */
  syncCookieToState = ({ token, userInfo }) => {
    const {
      history,
      authAction
    } = this.props;

    if (token === null || token === '' || token === 'null') {
      // 可能 token 過期，renew
    } else {
      // 更新到 state
      authAction.setLoginState(true);
      authAction.setUserToken({ token });
      authAction.setUserInfo({ userInfo });
    }
  }

  // onGetUserTokenSuccess = (payload) => {
  //   const maxAge = dayToSecond(1);
  //   // Cookies.set('token', , { path: '/', maxAge});
  // }

  // onGetUserInfoSuccess = (payload) => {
  //   const maxAge = dayToSecond(1);
  //   Cookies.set('is_login', true, { path: '/', maxAge});
  //   // 匯入 cookie
  //   Cookies.set('user_info', {
  //     username: payload.username,
  //     role: payload.role
  //   });
  // }

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
)(SetUserInfo);
