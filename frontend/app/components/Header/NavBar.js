import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { Link as ScrollLink } from 'react-scroll';
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
                  >{t(d.name)}</span>
                </div>
              :
                <div className="navbar-li fl">
                  {
                    d.isAnchor ?
                      <ScrollLink
                        to={d.anchorTarget}
                        className="main-link"
                        duration={1000}
                        offset={d.offset}
                        smooth
                      >
                        {d.nameCh}
                      </ScrollLink>
                    :
                      <Link
                        to={d.url}
                        className={d.url === _.get(match, 'url') ? 'main-link li-active' : 'main-link'}
                      >
                        {d.nameCh}
                      </Link>
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
