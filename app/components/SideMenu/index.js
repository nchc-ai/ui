import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import BurgerMenu from 'react-burger-menu';
import { notify } from 'components/common/NotifyToast';
import bindActionCreatorHOC from '../../libraries/bindActionCreatorHOC';
import { sideNavAdmin, sideNavTeacher, sideNavStudent, sideNavCommon } from '../../constants/navData';
import LinkFormat from '../common/LinkFormat/index';
import DogTag from '../common/DogTag';
import { selfInfo } from '../../constants/models';
import { TOAST_TIMING } from '../../constants';

class Index extends Component {

  offlineWarning = () => {
    notify.show('如對課程有興趣，可親洽AI_LAB', 'success',  TOAST_TIMING);
  }

  render() {
    const {
      match,
      userInfo,
      isSubstituating
    } = this.props;

    const roleObj = {
      'superuser': sideNavAdmin,
      'teacher': sideNavTeacher,
      'student': sideNavStudent,
      'default': []
    };

    return (
      <div
        className="side-menu-comp"
        width={200}
      >
        <div>
          <DogTag
            userInfo={userInfo}
            isSubstituating={isSubstituating}
          />
          {/* 各自版本 */}
          {
            roleObj[userInfo.role || 'default'].map(d => (
              <li
                key={d.key}
                className={match.url.includes(d.urlPrefix) ? 'side-menu-li active' : 'side-menu-li'}
              >
                <LinkFormat
                  textObj={d}
                  isMain={d.isMain}
                  offline={false}
                  offlineWarning={this.offlineWarning}
                  onClick={this.closeMenu}
                />
              </li>
            ))
          }
          {/* 共用版本 */}
          { !isSubstituating ?
            sideNavCommon.map(d => (
              <li
                key={d.key}
                className={match.url.includes(d.urlPrefix) ? 'side-menu-li active' : 'side-menu-li'}
              >
                <LinkFormat
                  textObj={d}
                  isMain={d.isMain}
                  offline={false}
                  offlineWarning={this.offlineWarning}
                  onClick={this.closeMenu}
                />
              </li>
            ))
            : null
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ Ui, Auth, Role }) => ({
  userInfo: Role.isSubstituating ? Role.userInfo : Auth.userInfo,
  isSubstituating: Role.isSubstituating,
  isOpen: Ui.SideNav.isOpen,
  currentMenu: Ui.SideNav.currentMenu,
  isHidden: Ui.SideNav.isWrapHidden,
  offline: Ui.Status.offline
});

export default compose(
  connect(mapStateToProps),
  bindActionCreatorHOC
)(Index);
