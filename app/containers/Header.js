import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';

import { Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import { Hover } from 'react-powerplug';
// import TopBar from './TopBar.js';


import bindActionCreatorHoc from '../libraries/bindActionCreatorHoc';
import NavBar from '../components/Header/NavBar';
import IconList from '../components/Header/IconList';
import { mainNav } from '../constants/navData';
import logoImg from '../../public/images/header/header-logo.png';
import GlobalSearch from '../components/Header/GlobalSearch';

import { removeToken } from '../libraries/utils';

import iconMemberBefore from '../../public/images/common/ic-nav-member-default.png';
import iconMemberAfter from '../../public/images/common/ic-nav-member-hover.png';
import iconLogoutBefore from '../../public/images/common/ic-nav-logout-default.png';
import iconLogoutAfter from '../../public/images/common/ic-nav-logout-hover.png';
import { withCookies } from 'react-cookie';

// import IconList from './IconList';

class Header extends Component {

  componentWillMount() {
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
      cookies
    } = this.props;
    // 重置 state > 重置 cookie > 重置 token

    authAction.resetAuth();
    cookies.set('is_login', false);
    removeToken();
    history.push('/');
  }

  render() {
    const {
      t, loading, isLogin, offline, dropDownPos, setDropdownPos, offlineWarning
    } = this.props;

    return (
      <div className="header-comp">

        <Link to="/" className="logo-con con-grp fl">
          <span className="v-helper" />
          <img alt="AI_LAB" className="logo-svg" src={logoImg} />
        </Link>

        <div className="header-container">
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
                        <Link to="/user/classroom-manage/list" className="fl" {...bind}>
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
                !isLogin && !loading ?
                  <Link to="/login">
                    <button className="login-btn">登入</button>
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
  loading: Auth.loading
});

export default compose(
  connect(
    mapStateToProps
  ),
  bindActionCreatorHoc
)(withRouter(withCookies(Header)));
