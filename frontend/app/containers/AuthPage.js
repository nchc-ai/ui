import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import Login from '../components/Auth/Login';
import Signup from '../components/Auth/Signup';

class AuthPage extends Component {
  render() {
    return (
      <div className="auth-bg global-content">
        <Switch>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/signup" component={Signup} />
        </Switch>
      </div>
    );
  }
}

export default AuthPage;
