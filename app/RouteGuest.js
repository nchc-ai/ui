import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';


import IntroPage from './containers/IntroPage';
import ContactPage from './containers/ContactPage';
import AuthPage from './containers/AuthPage';
import Logout from './containers/Logout';
import IndexPage from './containers/IndexPage';
import StaticPage from './containers/StaticPage';
import Footer from './components/Footer/Index';

class RouteGuest extends Component {

  setDropdownPos = (pos) => {
    this.props.uiAction.setDropdownPos(pos);
  }

  offlineWarning = () => {
    notify.show('如對課程有興趣，可親洽NCHC-AI', 'success', 1800);
  }

  render = () => {
    const {
      match,
      userInfo,
      isLogin,
      dropDownPos,
      offline,
      t
    } = this.props;

    return (
      <div>
        <Switch>
          <Route exact path="/intro/:page/:type" component={IntroPage} />
          <Route exact path="/intro/:page" component={IntroPage} />
          <Route exact path="/contact" component={ContactPage} />
          <Route exact path="/login" component={AuthPage} />
          <Route exact path="/signup" component={AuthPage} />
          <Route exact path="/logout" component={Logout} />
          <Route exact path="/" component={IndexPage} />
          <Route exact path="*" component={StaticPage} />
        </Switch>
        <Footer
          offline={offline}
          offlineWarning={this.offlineWarning}
        />
      </div>
    )
  }
};

const mapStateToProps = ({ Auth, Ui }) => ({
  userInfo: Auth.userInfo,
  isLogin: Auth.isLogin,
  dropDownPos: Ui.Dropdown.pos,
  offline: Ui.Status.offline
});

export default compose(
  connect(mapStateToProps),
)(RouteGuest);
