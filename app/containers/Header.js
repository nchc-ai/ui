import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';

import MyoauthButton from '../components/Auth/MyoauthButton';
import { Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import { Hover } from 'react-powerplug';
import { notify } from 'components/common/NotifyToast';
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
import { TOAST_TIMING } from '../constants';

class Header extends Component {


  /**
   * Get token with code argument after popup closed.
   * @param {Object} codeObj Code passed from popup.
   */
  onGetCodeSuccess = (codeObj) => {
    this.props.authAction.getToken(codeObj, this.onGetTokenSuccess);
  }

  /**
   * Prevent from showing wrong error message.
   * @param {String} err Error message from popup.
   */
  onGetCodeFail = (err) => {
    if (err.toString() !== 'Error: The popup was closed') {
      notify.show('Error: code not found', 'error', TOAST_TIMING);
    }
  }

  /**
   * Set token to cookie and state then get user info.
   * @param {String} token Token to retrieve user info.
   */
  onGetTokenSuccess = (tokenObj) => {
    Cookies.set('token_obj', tokenObj, { path: '/', maxAge: dayToSecond(1) });
    this.props.authAction.getMetaInfo({ token: tokenObj.token, onSuccess: this.onGetMetaInfoSuccess });
  }

  /**
   * Set user info and isLogin state to both cookie and state then redirect by role.
   * @param {String} token Token to retrieve user info.
   */
  onGetMetaInfoSuccess = ({ token, metaInfo }) => {
    const {
      authAction
    } = this.props;

    Cookies.set('user_info', metaInfo, { path: '/', maxAge: dayToSecond(1) });
    Cookies.set('is_login', true, { path: '/', maxAge: dayToSecond(1) });

    authAction.getUserInfo({ token, onSuccess: this.onGetUserInfoSuccess });
  }

  /**
   * Set token to cookie and state then get user info.
   * @param {String} token Token to retrieve user info.
   */
  onGetUserInfoSuccess = () => {
    const {
      history,
      role
    } = this.props;

    const redirectUrl = redirectUrlWithRole({ role });
    history.push(redirectUrl);
  }


  /**
   * Sync userinfo and token from cookie to state.
   */
  syncCookieToState = () => {
    const userInfo = Cookies.getJSON('user_info');
    const tokenObj = Cookies.getJSON('token_obj');

    this.props.authAction.retrieveAuthFromSession({
      tokenObj,
      userInfo,
      isLogin: true,
    });
  }

  /**
   * Refresh token and set in cookie.
   * Todo: Caculate the expired time of token.
   */
  refreshToken = () => {
    const tokenObj = Cookies.getJSON('token_obj');
    this.props.authAction.refreshToken({
      refresh_token: _.get(tokenObj, "refresh_token"),
      next: () => this.props.syncCookieToState,
      fail: () => this.props.authAction.setLoginState(false)
    });
  }


  logout = () => {
    const {
      authAction,
      token
    } = this.props;

    authAction.logout({ token, next: this.afterLogout });
  }

  afterLogout = () => {
    const {
      authAction,
      roleAction,
      history,
    } = this.props;

    authAction.resetAuth();
    roleAction.toggleSubstituating(false);

    Cookies.set('is_login', false);
    Cookies.set('user_info', {});
    Cookies.set('token_obj', {});

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
          <SetUserInfo
            history={history}
            syncCookieToState={this.syncCookieToState}
            refreshToken={this.refreshToken}
          />
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
                !isLogin || (isLogin && loading)?
                  <Link to="/login">
                    <button>登入 / 註冊</button>
                  </Link>
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
