import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';

// import logoImg from '../../images/common/knomo-logo.svg';
// import TopBar from './TopBar.js';
import NavBar from './NavBar.js';
import IconList from './IconList';

// import IconList from './IconList';

const Index = ({ userInfo, isLogin, offline, dropDownPos, setDropdownPos, offlineWarning }) => (
  <div className="header-comp">

    <Link to="/" className="logo-con con-grp fl">
      <span className="v-helper" />
      {/* <embed className="logo-svg" src={logo} /> */}
    </Link>

    <div className="header-container">
      {/* <TopBar userInfo={userInfo} isLogin={isLogin} offline={offline} /> */}
      <Row>
        <Col md={8} >
          <NavBar
            offline={offline}
            dropDownPos={dropDownPos}
            setDropdownPos={setDropdownPos}
            offlineWarning={offlineWarning}
          />
        </Col>
        <Col md={2} >
          { offline ? null : <IconList />}
        </Col>
      </Row>
    </div>
  </div>
);

export default Index;
