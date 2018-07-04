import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router';

import { Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
// import TopBar from './TopBar.js';


import bindActionCreatorHoc from '../libraries/bindActionCreatorHoc';
import NavBar from '../components/Header/NavBar';
import IconList from '../components/Header/IconList';
import { mainNav } from '../constants/navData';
import logoImg from '../../public/images/header/header-logo.png';
import GlobalSearch from '../components/Header/GlobalSearch';

import iconMember from '../../public/images/common/ic-nav-member-default.png';
import iconLogout from '../../public/images/common/ic-nav-logout-default.png';

// import IconList from './IconList';

class Header extends Component {

  componentWillMount() {
  }

  logout = () => {
    console.log('logout');
    this.props.authAction.logout();
    this.props.history.push('/');
  }

  render() {
    const {
      match, t, userInfo, isLogin, offline, dropDownPos, setDropdownPos, offlineWarning
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
                isLogin ?
                  <span className="login-container">
                    <Link to="/user/course" className="fl">
                      <img alt="" src={iconMember} />
                    </Link>
                    <span onClick={this.logout} className="fl">
                      <img alt="" src={iconLogout} />
                    </span>
                  </span>
                :
                  <Link to="/login">
                    <button className="login-btn">登入</button>
                  </Link>
              }
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ Auth }) => ({
  isLogin: Auth.userInfo.active
});

export default compose(
  connect(
    mapStateToProps
  ),
  bindActionCreatorHoc
)(withRouter(Header));
