
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
// import { translate } from 'react-i18next';
import Notifications, { notify } from 'components/common/NotifyToast';
// import ga from 'react-google-analytics';
import LoadingBar from "react-top-loading-bar";
import Header from './Header';
import Dialog from 'components/common/Dialog/index';

import bindActionCreatorHoc from 'libraries/bindActionCreatorHoc';

import bindDialogHOC from 'libraries/bindDialogHOC';

import { TOAST_TIMING } from '../constants';

// const GAInitiailizer = ga.Initializer;

class Global extends Component {

  setDropdownPos = (pos) => {
    this.props.uiAction.setDropdownPos(pos);
  }

  offlineWarning = () => {
    notify.show('如對課程有興趣，可親洽NCHC-AI', 'success', TOAST_TIMING);
  }

  render() {
    const {
      match,
      userInfo,
      isLogin,
      offline,
      dropDownPos,
      children,
      isLoading,
      progressBar,
      dialog,
      t,
    } = this.props;
    return (
      <div className="normal-outer-bg">
        {/* <GAInitiailizer /> */}
        <Header
          userInfo={userInfo}
          isLogin={isLogin}
          dropDownPos={dropDownPos}
          setDropdownPos={this.setDropdownPos}
          offline={offline}
          offlineWarning={this.offlineWarning}
          match={match}
          t={t}
        />
        {
          progressBar.isActive ?
            <LoadingBar
              progress={progressBar.progress}
              height={3}
              color="red"
              onLoaderFinished={() => {}}
            />
          : null
        }
        <Notifications />
        <div className="global-body">
          {children}
        </div>
        <Dialog
          dialog={dialog}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ Auth, Ui }) => ({
  userInfo: Auth.userInfo,
  isLogin: Auth.isLogin,
  dropDownPos: Ui.Dropdown.pos,
  offline: Ui.Status.offline,
  progressBar: {
    isActive: Ui.ProgressBar.isActive,
    progress: Ui.ProgressBar.progress
  },
  dialog: Ui.Dialog
});

export default compose(
  connect(mapStateToProps),
  bindActionCreatorHoc,
  bindDialogHOC
)(Global);

