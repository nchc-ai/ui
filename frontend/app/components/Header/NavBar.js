import React from 'react';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';

const NavBar = ({ data, offline, t, dropDownPos, offlineWarning }) => (
  <div className="nav-bar-comp">
    <ul className="navbar-main-ul navbar-ul con-grp" >
      {
        data.map(d => (
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
