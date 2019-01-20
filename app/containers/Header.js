import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';

import MyoauthButton from '../components/Auth/MyoauthButton';
import { Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import { Hover } from 'react-powerplug';
import { notify } from 'react-notify-toast';
import Cookies from 'js-cookie';
import SetUserInfo from '../components/common/SetUserInfo/index';
import bindActionCreatorHoc from '../libraries/bindActionCreatorHoc';
import NavBar from '../components/Header/NavBar';
import { mainNav } from '../constants/navData';
import logoImg from '../../public/images/header/header-logo.png';
import GlobalSearch from '../components/Header/GlobalSearch';

import { removeToken, dayToSecond, redirectUrlWithRole } from '../libraries/utils';

import iconMemberBefore from '../../public/images/common/ic-nav-member-default.png';
import iconMemberAfter from '../../public/images/common/ic-nav-member-hover.png';
import iconLogoutBefore from '../../public/images/common/ic-nav-logout-default.png';
import iconLogoutAfter from '../../public/images/common/ic-nav-logout-hover.png';
// import IconList from './IconList';

class Header extends Component {

  componentWillMount() {
  }

  onGetCodeSuccess = (codeObj) => {
    const {
      authAction,
      history
    } = this.props;

    console.log('onGetCodeSuccess', codeObj);
    authAction.getToken(codeObj, this.onGetTokenSuccess);
  }

  onGetCodeFail = (err) => {
    notify.show('Error: code not found', 'error', 1800);
  }

  onGetTokenSuccess = (token) => {
    console.log('onGetTokenSuccess', token);
    const {
      history,
      authAction
    } = this.props;
    // 寫入 token 到 cookie 跟 state ， 打 api 獲取 userInfo
    Cookies.set('token', token, { path: '/', maxAge: dayToSecond(1) });
    authAction.setUserToken({ token });

    authAction.getUserInfo({ token, next: this.onGetUserInfoSuccess });
  }

  onGetUserInfoSuccess = (userInfo) => {
    const {
      history,
      authAction
    } = this.props;
    // 寫入 userInfo & isLogin 到 cookie 跟 state
    console.log('[userInfo] userInfo', userInfo);
    Cookies.set('user_info', userInfo, { path: '/', maxAge: dayToSecond(1) });
    Cookies.set('is_login', true, { path: '/', maxAge: dayToSecond(1) });

    authAction.setUserInfo({ userInfo });
    authAction.setLoginState(true);

    const redirectUrl = redirectUrlWithRole({ role: userInfo.role });
    history.push(redirectUrl);
  }

  logout = () => {
    const {
      authAction,
      token
    } = this.props;
    authAction.logout(token, this.onLogoutSuccess);
  }

  onLogoutSuccess = () => {
    const {
      authAction,
      history,
    } = this.props;
    // 重置 state > 重置 cookie > 重置 token

    authAction.resetAuth();
    Cookies.set('is_login', false);
    Cookies.set('user_info', {});
    removeToken();
    history.push('/');
  }

  render() {
    const {
      t, loading, isLogin, offline, dropDownPos, setDropdownPos, offlineWarning, role
    } = this.props;

    return (
      <div className="header-comp">

        <Link to="/" className="logo-con con-grp fl">
          <span className="v-helper" />
          <img alt="AI_LAB" className="logo-svg" src={logoImg} />
        </Link>

        <div className="header-container">
          <SetUserInfo history={history} />
          {/* <TopBar userInfo={userInfo} isLogin={isLogin} offline={offline} /> */}
          <Row>
            <Col md={{ size: 7 }} >
              <NavBar
                data={mainNav}
                offline={offline}
                dropDownPos={dropDownPos}
                setDropdownPos={setDropdownPos}
                offlineWarning={offlineWarning}
                t={t}
              />
            </Col>
            {/* <Col md={2} >
              { offline ? null : <IconList />}
            </Col> */}

            <Col md={{ size: 5 }} >
              <GlobalSearch />
              {
                isLogin && !loading ?
                  <span className="login-container">
                    <Hover>
                      {({ hovered, bind }) => (
                        <Link to={redirectUrlWithRole({ role })} className="fl" {...bind}>
                          <img alt="" src={hovered ? iconMemberAfter : iconMemberBefore} />
                        </Link>
                      )}
                    </Hover>

                    <Hover>
                      {({ hovered, bind }) => (
                        <span onClick={this.logout} className="fl" {...bind}>
                          <img alt="" src={hovered ? iconLogoutAfter : iconLogoutBefore} />
                        </span>
                      )}
                    </Hover>
                  </span>
                :
                  null
              }

              {
                !isLogin?
                  <MyoauthButton
                    onSuccess={this.onGetCodeSuccess}
                    onFailure={this.onGetCodeFail}
                  ></MyoauthButton>
                :
                  null
              }
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ Auth }) => ({
  token: Auth.token,
  isLogin: Auth.isLogin,
  loading: Auth.loading,
  role: Auth.userInfo.role
});

export default compose(
  connect(
    mapStateToProps
  ),
  bindActionCreatorHoc,
  withRouter
)(Header);
