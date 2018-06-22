import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { setToken, getToken } from '../libraries/utils';
import bindActionCreatorHoc from '../libraries/bindActionCreatorHoc';
import Login from '../components/Auth/Login';
import Signup from '../components/Auth/Signup';

class AuthPage extends Component {

  componentWillMount() {
    window.scrollTo(0, 0);
  }

  onClickLogin = () => {
    // console.log('click');
    this.props.authAction.login();

  }

  onSuccess = (data) => {
    
    setToken(data.code);

    console.log('success', data, getToken());
    this.props.history.push('/user/course');
  }

  onFailure = (err) => {
    console.log('fail', err);
  }

  render() {
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
          <Route exact path="/signup" component={Signup} />
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = ({  }) => ({
});

export default compose(
  connect(mapStateToProps),
  bindActionCreatorHoc
)(AuthPage);
