import React, { Component } from 'react';
// import ga from 'react-google-analytics';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { actions as formActions } from 'react-redux-form';
import bindActionCreatorHoc from '../../../libraries/bindActionCreatorHoc';
import { getLocalStorageItem, isItemExistInLocalStorage } from '../../../libraries/utils';


class SetUserInfo extends Component {

  static propTypes = {
  }
  componentWillMount() {
    const {
      authAction,
      orderAction,
      categoryAction,
    } = this.props;

    // ga('create', 'UA-112418828-2', 'auto');
    // ga('send', 'pageview');

    authAction.healthCheck();
    authAction.checkDatabase();

    const userInfo = getLocalStorageItem('userInfo');
    const isLogin = isItemExistInLocalStorage('userInfo');
    authAction.setUserInfo(userInfo, isLogin);
    // 可以做一些初始動作
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
  render = () => (<span className="dn" />);
}

const mapStateToProps = ({ Auth }) => ({
  userInfo: Auth.userInfo
});


export default compose(
  connect(mapStateToProps),
  bindActionCreatorHoc
)(SetUserInfo);
