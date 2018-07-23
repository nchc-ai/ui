import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { actions as formActions } from 'react-redux-form';
import { setToken } from '../libraries/utils';
import bindActionCreatorHoc from '../libraries/bindActionCreatorHoc';
import Login from '../components/Auth/Login';
import Signup from '../components/Auth/Signup';

class AuthPage extends Component {

  componentWillMount() {
    window.scrollTo(0, 0);
  }

  componentWillReceiveProps(nextProps) {
    const {
      match,
    } = nextProps;
    if (this.props.match !== match && match) {
      window.scrollTo(0, 0);
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
    setToken(token);
    this.props.authAction.setUserToken(token);
    this.props.authAction.getUserInfo(token, this.redirect);
  }

  redirect = () => {
    this.props.history.push('/user/course');
  }

  onLoginFail = (err) => {
    console.log('fail', err);
  }


  // Signup
  onSignupSubmit = (formData) => {
    console.log('formData', formData);
    this.props.authAction.signup(formData);
    // authAction.signup(user, this.onSignupSuccess);
  }


  onSignupSubmitSuccess = (formData) => {
    this.props.history.push('/login');
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
