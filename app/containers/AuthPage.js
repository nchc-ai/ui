import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { actions as formActions } from 'react-redux-form';
import { notify } from 'react-notify-toast';
import Cookies from 'js-cookie';
import { dayToSecond, redirectUrlWithRole } from '../libraries/utils';
import bindActionCreatorHoc from '../libraries/bindActionCreatorHoc';
import Login from '../components/Auth/Login';
import Signup from '../components/Auth/Signup';

class AuthPage extends Component {

  componentWillMount() {
    window.scrollTo(0, 0);
    this.props.resetForm();
  }

  componentWillReceiveProps(nextProps) {
    const {
      match,
    } = nextProps;
    if (this.props.match !== match && match) {
      window.scrollTo(0, 0);
      this.props.resetForm();
    }
  }

  /**
   * Get token with code argument after popup closed.
   * @param {Object} codeObj Code passed from popup.
   */
  onGetCodeSuccess = (codeObj) => {
    this.props.authAction.getToken(codeObj, this.onGetTokenSuccess);
  }

  /**
   * Prevent from showing wrong error message.
   * @param {String} err Error message from popup.
   */
  onGetCodeFail = (err) => {
    if (err.toString() !== 'Error: The popup was closed') {
      notify.show('Error: code not found', 'error', 1800);
    }
  }

  /**
   * Set token to cookie and state then get user info.
   * @param {String} token Token to retrieve user info.
   */
  onGetTokenSuccess = (tokenObj) => {
    Cookies.set('token_obj', tokenObj, { path: '/', maxAge: dayToSecond(1) });
    this.props.authAction.getUserInfo({ token: tokenObj.token, next: this.onGetUserInfoSuccess });
  }

  /**
   * Set user info and isLogin state to both cookie and state then redirect by role.
   * @param {String} token Token to retrieve user info.
   */
  onGetUserInfoSuccess = (userInfo) => {
    const {
      history,
      authAction
    } = this.props;

    Cookies.set('user_info', userInfo, { path: '/', maxAge: dayToSecond(1) });
    Cookies.set('is_login', true, { path: '/', maxAge: dayToSecond(1) });

    const redirectUrl = redirectUrlWithRole({ role: userInfo.role });
    history.push(redirectUrl);
  }

  redirect = (payload) => {
    const {
      history,
      authAction
    } = this.props;

    const redirectUrl = redirectUrlWithRole({ role: payload.role });
    history.push(redirectUrl);
  }

  // Signup
  onSignupSubmit = (formData) => {
    console.log('formData', formData);
    this.props.authAction.signup(formData, this.onAfterSubmit);
  }

  onSignupFailed = (formData) => {
    notify.show('請確認是否填妥表單資料', 'error', 1800);
  }

  onAfterSubmit = (response) => {
    console.log('[signup] response', response);
    if (response.error) {
      notify.show(`註冊失敗 失敗原因：${response.payload.response.message}`, 'error', 2700);
    } else {
      notify.show('註冊成功 請輸入帳號密碼進行登入', 'success', 1800);
      this.props.history.push('/login');
    }
  }

  onSignupCancel = () => {
    this.props.history.push('/login');
  }

  render() {
    const {
      forms,
      changeValue
    } = this.props;

    return (
      <div className="auth-bg global-content">
        <Switch>
          <Route exact path="/login">
            <Login
              onSuccess={this.onGetCodeSuccess}
              onFailure={this.onGetCodeFail}
            />
          </Route>
          <Route exact path="/signup">
            <Signup
              targetForm={forms.signup}
              changeValue={changeValue}
              onSubmit={this.onSignupSubmit}
              onSubmitFailed={this.onSignupFailed}
              backMethod={this.onSignupCancel}
            />
          </Route>
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = ({ forms }) => ({
  forms
});

const mapDispatchToProps = dispatch => ({
  resetForm: () => dispatch(formActions.reset('forms.signup')),
  changeValue: (value, key, target) => dispatch(formActions.change(
    `forms.${target}.${key}`,
    value
  ))
});


export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  bindActionCreatorHoc
)(AuthPage);
