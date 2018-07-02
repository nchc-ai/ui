// -------  Basic  -------- //
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import NotificationBadge, { Effect } from 'react-notification-badge';
import { Hover } from 'react-powerplug';
import { subNav } from '../../constants/navData';


class IconList extends Component {

  render = () => {
    // const { match } = this.props;
    return (
      <ul className="navbar-vice-ul">
        {
          subNav.map(d => (
            <Hover key={d.key} >
              {({ isHover, bindHover }) => (
                <li className="navbar-li fl" {...bindHover}>
                  { d.badge ?
                    <NotificationBadge
                      className="notify-badge"
                      count={0}
                      effect={Effect.SCALE}
                    /> : null
                  }
                  <Link to={d.url}>
                    <img alt="" src={isHover ? d.imgUrl : d.imgUrlAfter} />
                  </Link>
                </li>
              )}
            </Hover>
          ))
        }
      </ul>
    );
  }
}

const mapStateToProps = ({}) => ({});

export default compose(
  connect(mapStateToProps),
)(IconList);
