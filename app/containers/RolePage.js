import React, { Component } from 'react';
import { Switch, Route, withRouter, Link } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Select from 'react-select';
import bindActionCreatorHoc from '../libraries/bindActionCreatorHoc';
import CommonPageContent from '../components/CommonPageContent'

const options = [
  { value: 'chocolate', label: 'Serena' },
  { value: 'strawberry', label: 'Jimmy' },
  { value: 'vanilla', label: 'Allen' }
]

class RolePage extends Component {
  componentWillMount() {

  }

  render() {
    return (
      <CommonPageContent
        className="role-page-bg"
        pageTitle="視角切換"
      >
        <Select options={options} />

      </CommonPageContent>
    );
  }
}

const mapStateToProps = ({ Auth, Course }) => ({
  token: Auth.token,
  userInfo: Auth.userInfo,
});

const mapDispatchToProps = dispatch => ({

});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  bindActionCreatorHoc,
)(RolePage);
