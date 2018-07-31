import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { actions as formActions } from 'react-redux-form';
import { notify } from 'react-notify-toast';
import { setToken } from '../libraries/utils';
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

  onClickLogin = () => {
    // console.log('click');
    this.props.authAction.login();
  }

  onLoginSuccess = (data) => {
    this.props.authAction.retrieveToken(data.code, this.setUserInfo);
  }

  setUserInfo = (token) => {
    const { history } = this.props;
    setToken(token);
    this.props.authAction.setUserToken(token);
    this.props.authAction.getUserInfo(token, history, this.redirect);
  }

  redirect = (error) => {
    if(!error) {
      this.props.history.push('/user/course');
    }
  }

  onLoginFail = (err) => {
    console.log('fail', err);
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
    if (response.error) {
      notify.show(`註冊失敗 失敗原因：${response.payload.message}`, 'error', 2500);
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
              onClickLogin={this.onClickLogin}
              onSuccess={this.onLoginSuccess}
              onFailure={this.onLoginFail}
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
