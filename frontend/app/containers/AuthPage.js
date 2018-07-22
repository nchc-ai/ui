import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { actions as formActions } from 'react-redux-form';
import { setToken } from '../libraries/utils';
import bindActionCreatorHoc from '../libraries/bindActionCreatorHoc';
import Login from '../components/Auth/Login';
import Signup from '../components/Auth/Signup';
import Profile from '../components/Auth/Profile';

class AuthPage extends Component {

  componentWillMount() {
    window.scrollTo(0, 0);
  }

  onClickLogin = () => {
    // console.log('click');
    this.props.authAction.login();
  }

  onSuccess = (data) => {
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

  onFailure = (err) => {
    console.log('fail', err);
  }


  // Signup
  onSignupSubmit = (formData) => {
     // authAction.signup(user, this.onSignupSuccess);
  }


  onSignupSubmitSuccess = (formData) => {
    
  }

  // Profile
  onProfileSubmit = (formData) => {
    // console.log('formData', formData);
  }


  onProfileSubmitSuccess = (formData) => {
    // console.log('formData', formData);
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
              onSuccess={this.onSuccess}
              onFailure={this.onFailure}
            />
          </Route>
          <Route exact path="/signup">
            <Signup
              targetForm={forms.signup}
              changeValue={changeValue}
              onSubmit={this.onSignupSubmit}
            />
          </Route>

          <Route exact path="/profile">
            <Profile
              targetForm={forms.profile}
              changeValue={changeValue}
              onSubmit={this.onProfileSubmit}
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
