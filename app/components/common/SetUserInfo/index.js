import React, { Component } from 'react';
// import ga from 'react-google-analytics';
import { notify } from 'react-notify-toast';
import { withRouter } from 'react-router-dom';
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
    // 1. 置入 GA
    // ga('create', 'UA-112418828-2', 'auto');
    // ga('send', 'pageview');


    // 2. DB health check
    // authAction.healthCheck();
    authAction.checkDatabase();

    // 3. 同步 local session
    this.syncUserInfo();

    // 3. 檢查 userInfo
    this.retrieveUser();
  }

  componentWillReceiveProps(nextProps) {
    const {
      orderAction,
      userInfo,
      isLogin,
    } = nextProps;
    if (this.props.isLogin !== isLogin && isLogin) {
      // do something
    } else if (this.props.isLogin !== isLogin && !isLogin) {
      // logout
    }
  }


  syncUserInfo () {
    // 匯出 userInfo
    const userObj = Cookies.getJSON('user_info');
    this.props.authAction.setUserInfo(userObj, Cookies.get('is_login'));
  }

  retrieveUser = () => {
    const {
      history,
      authAction
    } = this.props;

    const token = getToken();

    if (token === null || token === '' || token === 'null') {
      authAction.resetAuth();
    } else {
      // 設定 isLogin > 設定 userToken > 抓取 userInfo
      // 先同步 cookie

      authAction.setUserToken(token);
      authAction.getUserInfo(token, history, this.onGetUserInfoSuccess);
    }
  }

  onGetUserInfoSuccess = (payload) => {
    const maxAge = dayToSecond(1);
    Cookies.set('is_login', true, { path: '/', maxAge});
    // 匯入 cookie
    Cookies.set('user_info', {
      username: payload.username,
      role: payload.role
    });
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
  bindActionCreatorHoc
)(SetUserInfo);
