import React, { Component } from 'react';
// import ga from 'react-google-analytics';
import { notify } from 'react-notify-toast';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { actions as formActions } from 'react-redux-form';
import bindActionCreatorHoc from '../../../libraries/bindActionCreatorHoc';
import { getToken, getLocalStorageItem, isItemExistInLocalStorage } from '../../../libraries/utils';


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

    // authAction.healthCheck();
    authAction.checkDatabase();
    // const userInfo = getLocalStorageItem('userInfo');
    // const isLogin = isItemExistInLocalStorage('userInfo');
    // authAction.setUserInfo(userInfo, isLogin);

    this.retrieveUser();

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

  retrieveUser = () => {
    const {
      match,
      history,
      authAction
    } = this.props;
    const token = getToken();
    // console.log('token', token, match);
    if (token === null || token === '' || token === 'null') {
      // console.log('A');
      // history.push('/login');
      authAction.resetAuth();
    } else {
      // console.log('B');
      authAction.setUserToken(token);
      authAction.getUserInfo(token, history, this.afterGetUserInfo);
      
    }
  }

  afterGetUserInfo = error => {
    if (error) {
      notify.show('您尚未登入', 'error', 1800);
      // this.props.history.push('/login');
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
  bindActionCreatorHoc
)(withRouter(SetUserInfo));
