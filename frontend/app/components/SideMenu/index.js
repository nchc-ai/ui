import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import BurgerMenu from 'react-burger-menu';
import { notify } from 'react-notify-toast';
import bindActionCreatorHoc from '../../libraries/bindActionCreatorHoc';
import { sideNav } from '../../constants/navData';
import LinkFormat from '../common/LinkFormat/index';

class Index extends Component {
  state = {
    currentMenu: 'push',
    side: 'left',
    isOpen: false
  };

  offlineWarning = () => {
    notify.show('如對商品有興趣，可親洽KNOMO概念店(萬豪酒店中城廣場)', 'success', 1800);
  }

  closeMenu = () => {
    this.setState({
      isOpen: false
    });
  }

  render() {
    const {
      isOpen,
      currentMenu,
      offline
    } = this.state;
    const Menu = BurgerMenu[currentMenu];

    return (
      <Menu
        id={currentMenu}
        width={200}
        isOpen={isOpen}
        pageWrapId="page-wrap"
        outerContainerId="outer-container"
      >
        {
          sideNav.map(d => (
            <li key={d.key}>
              <LinkFormat
                textObj={d}
                isMain={d.isMain}
                offline={offline}
                offlineWarning={this.offlineWarning}
                onClick={this.closeMenu}
              />
            </li>
          ))
        }
      </Menu>
    );
  }
}

const mapStateToProps = ({ Ui }) => ({
  isOpen: Ui.SideNav.isOpen,
  currentMenu: Ui.SideNav.currentMenu,
  isHidden: Ui.SideNav.isWrapHidden,
  offline: Ui.Status.offline
});

export default compose(
  connect(mapStateToProps),
  bindActionCreatorHoc
)(Index);
