import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { HashLink } from "react-router-hash-link";
// import { translate } from 'react-i18next';
import _ from 'lodash';

const NavBar = ({ match, data, offline, t, dropDownPos, offlineWarning }) => (
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
                  >
                    {t(d.name)}
                  </span>
                </div>
              :
                <div className="navbar-li fl">
                  {
                    d.isAnchor ?
                      <HashLink
                        to="/#index-intro"
                        className="main-link"
                      >{d.nameCh}</HashLink>
                    :
                      <span>
                        {
                          d.isOuter ?
                            <a
                              href={d.url}
                              rel="noopener noreferrer"
                              target="_blank"
                              className={d.url === _.get(match, 'url') ? 'main-link li-active' : 'main-link'}
                            >
                              {d.nameCh}
                            </a>
                          :
                            <Link
                              to={d.url}
                              className={d.url === _.get(match, 'url') ? 'main-link li-active' : 'main-link'}
                            >
                              {d.nameCh}
                            </Link>
                        }
                      </span>
                  }
                </div>
            }
          </li>
        ))
      }
    </ul>
  </div>
);


export default (withRouter(NavBar));


 // <ScrollLink
//   to={d.anchorTarget}
//   className="main-link"
//   duration={1000}
//   offset={d.offset}
//   smooth
// >
//   {d.nameCh}
// </ScrollLink>
