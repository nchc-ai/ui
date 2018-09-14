
import React, { Component } from 'react';
import createReactClass from 'create-react-class';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { compose } from 'redux';
// import { translate } from 'react-i18next';
import { notify } from 'react-notify-toast';
// import ga from 'react-google-analytics';
import Notifications from 'react-notify-toast';
import Progress from 'react-progress-2';

import SetUserInfo from '../components/common/SetUserInfo/index';
import Header from './Header';
import Footer from '../components/Footer/Index';
import Dialog from '../components/common/Dialog/index';

import bindActionCreatorHoc from '../libraries/bindActionCreatorHoc';

// const GAInitiailizer = ga.Initializer;

class Client extends Component {

  setDropdownPos = (pos) => {
    this.props.uiAction.setDropdownPos(pos);
  }

  offlineWarning = () => {
    notify.show('如對課程有興趣，可親洽NCHC-AI', 'success', 1800);
  }
  
  render() {
    const {
      match,
      userInfo,
      isLogin,
      offline,
      dropDownPos,
      children,
      t,
    } = this.props;
    return (
      <div className="normal-outer-bg">
        {/* <GAInitiailizer /> */}
        <SetUserInfo />
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
        <Progress.Component/>
        <Notifications />
        {children}
        <Footer
          offline={offline}
          offlineWarning={this.offlineWarning}
        />
        <Dialog />
      </div>
    );
  }
}

const mapStateToProps = ({ Auth, Ui }) => ({
  userInfo: Auth.userInfo,
  isLogin: Auth.isLogin,
  dropDownPos: Ui.Dropdown.pos,
  offline: Ui.Status.offline
});

export default compose(
  connect(mapStateToProps),
  bindActionCreatorHoc
)(withRouter(Client));

