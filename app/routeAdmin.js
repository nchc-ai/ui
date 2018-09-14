import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router';
// import Admin from './containers/Admin';

class routeAdmin extends Component {
  render = () => {
    const { isLogin } = this.props;
    return (
      <Admin>
        <Switch>
          {/* <Route exact path='/manage' render={() => <Redirect to='/' />} />
          <Route exact path='/manage/cate' component={TabView} />
          <Route exact path='/manage/intro' component={TabView} />
          <Route path='/manage/:type/add' component={Edit} />
          <Route path='/manage/:type/:itemId/edit' component={Edit} />
          <Route path='/manage/:type/:itemId' component={Detail} />
          <Route path='/manage/:type' component={List} /> */}
        </Switch>
      </Admin>
    );
  }
}

const mapStateToProps = ({ Auth }) => ({
  isLogin: Auth.isLogin,
});

export default compose(
  connect(mapStateToProps),
)(routeAdmin);
