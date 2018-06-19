import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
// import TopBar from './TopBar.js';
import NavBar from './NavBar.js';
import IconList from './IconList';
import { mainNav } from '../../constants/navData';
import logoImg from '../../../public/images/header/header-logo.png';
import GlobalSearch from './GlobalSearch';
// import IconList from './IconList';

const Index = ({ match, t, userInfo, isLogin, offline, dropDownPos, setDropdownPos, offlineWarning }) => (
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

          <button className="login-btn">登入</button>
        </Col>
       
        
      </Row>
    </div>
  </div>
);

export default Index;
