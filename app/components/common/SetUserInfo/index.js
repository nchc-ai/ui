import React, { Component } from 'react';
// import ga from 'react-google-analytics';
import { notify } from 'react-notify-toast';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import bindActionCreatorHoc from '../../../libraries/bindActionCreatorHoc';
import { getToken, dayToSecond } from '../../../libraries/utils';
import { withCookies } from 'react-cookie';

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

  retrieveUser = () => {
    const {
      match,
      cookies,
      history,
      authAction
    } = this.props;

    const isLogin = cookies.get('is_login') || false;
    const token = getToken();

    if (token === null || token === '' || token === 'null' || !isLogin) {
      authAction.resetAuth();
    } else {
      // 設定 isLogin > 設定 userToken > 抓取 userInfo
      authAction.setLoginState(isLogin);
      authAction.setUserToken(token);
      authAction.getUserInfo(token, history, this.onGetUserInfoSuccess);
    }
  }

  onGetUserInfoSuccess = () => {
    const maxAge = dayToSecond(1);
    this.props.cookies.set('is_login', true, { path: '/', maxAge});
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
)(withCookies(SetUserInfo));
