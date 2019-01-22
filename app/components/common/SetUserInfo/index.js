import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Cookies from 'js-cookie';
import bindActionCreatorHoc from '../../../libraries/bindActionCreatorHoc';

class SetUserInfo extends Component {

  static propTypes = {
  }

  componentWillMount() {
    const {
      authAction,
    } = this.props;

    const isLogin = Cookies.get('is_login') === 'true';

    // 1. 置入 GA
    // ga('create', 'UA-112418828-2', 'auto');
    // ga('send', 'pageview');

    // 2. DB health check
    authAction.checkDatabase()

    // 3. 同步 cookie 到登入 state
    authAction.setLoginState(isLogin);

    // 4. 若已登入則線上更新 userInfo && 更新 token
    if (isLogin) {
      this.props.syncCookieToState();
      // this.props.refreshToken();
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
)(SetUserInfo);
