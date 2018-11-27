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

// import IconList from './IconList';

class Header extends Component {

  componentWillMount() {
  }

  logout = () => {
    const {
      authAction,
      history,
      token
    } = this.props;
    authAction.logout(token, this.redirect);
  }

  redirect = () => {
    //TODO: 刪除所有token
    removeToken();
    this.props.history.push('/');
  }

  render() {
    const {
      match, steady, t, userInfo, isLogin, offline, dropDownPos, setDropdownPos, offlineWarning
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
                isLogin && steady ?
                  <span className="login-container">
                    <Hover>
                      {({ hovered, bind }) => (
                        <Link to="/classroom-manage/list" className="fl" {...bind}>
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
                !isLogin && steady ?
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
  steady: Auth.steady,
  isLogin: true
});

export default compose(
  connect(
    mapStateToProps
  ),
  bindActionCreatorHoc
)(withRouter(Header));
