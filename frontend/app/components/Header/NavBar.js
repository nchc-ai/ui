import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import { translate } from 'react-i18next';

import { mainNav } from '../../constants/navData';
// import logo from '../../images/common/knomo-logo.svg';

const NavBar = ({ offline, t, dropDownPos, offlineWarning }) => (
  <div className="nav-bar-comp">
    <ul className="navbar-main-ul navbar-ul con-grp fl" >
      {
        mainNav.map(d => (
          <li key={d.key}>
            {
              offline ?
                <div className="navbar-li navbar-li-disabled">
                  <span
                    className="main-link"
                    onClick={offlineWarning}
                  >{t(d.name)}</span>
                </div>
              :
                <div className="navbar-li fl">
                  <Link
                    to={d.url}
                    className="main-link"
                  >
                    {d.nameCh}
                  </Link>
                </div>
            }
          </li>
        ))
      }
    </ul>
  </div>
);


export default (translate())(NavBar);
