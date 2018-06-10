// -------  Basic  -------- //
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import NotificationBadge, { Effect } from 'react-notification-badge';
import { Hover } from 'react-powerplug';

// import icMember from '../../images/common/NavBar/common-ic-user.png';
// import icCart from '../../images/common/NavBar/common-ic-cart.png';
// import icMemberAfter from '../../images/common/NavBar/common-ic-user-after.png';
// import icCartAfter from '../../images/common/NavBar/common-ic-cart-after.png';

const navList = {
  subLinks: [
    { key: 0, imgUrl: '/', imgUrlAfter: '/', url: '/member/orders', badge: false },
    { key: 1, imgUrl: '/', imgUrlAfter: '/', url: '/cart/1', badge: true }
  ]
};

class IconList extends Component {

  render = () => {
    // const { match } = this.props;
    return (
      <ul className="navbar-vice-ul">
        {
          navList.subLinks.map(d => (
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
