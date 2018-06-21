import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import BurgerMenu from 'react-burger-menu';
import { notify } from 'react-notify-toast';
import bindActionCreatorHoc from '../../libraries/bindActionCreatorHoc';
import { sideNav } from '../../constants/navData';
import LinkFormat from '../common/LinkFormat/index';
import DogTag from '../common/DogTag';
import { selfInfo } from '../../constants/models';

class Index extends Component {
  state = {
    currentMenu: 'slide',
    side: 'left',
    isOpen: true
  };

  offlineWarning = () => {
    notify.show('如對課程有興趣，可親洽AI_LAB', 'success', 1800);
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

    const {
      match
    } = this.props;
    console.log('match', match);

    return (
      <div
        className="side-menu-comp"
        id={currentMenu}
        width={200}
        isOpen={isOpen}
        pageWrapId="page-wrap"
        outerContainerId="outer-container"
      >
        <DogTag data={selfInfo} />

        {
          sideNav.map(d => (
            <li
              key={d.key}
              className={d.url === match.url ? 'side-menu-li active' : 'side-menu-li'}
            >
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
      </div>
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
