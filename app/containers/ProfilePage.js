import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { notify } from 'react-notify-toast';
import bindActionCreatorHoc from '../libraries/bindActionCreatorHoc';
import Profile from '../components/User/Profile';
import CommonPageContent from '../components/CommonPageContent';
class ProfilePage extends Component {
  componentWillMount() {

  }

  onProfileUpdateSuccess = () => {
    notify.show('個人資料更新成功', 'success', 1800);
  }

  onProfileUpdate = (formData) => {
    const {
      authAction,
      token
    } = this.props;
    authAction.updateProfile(formData, token, this.onProfileUpdateSuccess);
  }

  handleSubmitFailed = (formData) => {
    // console.log('[handleSubmitFailed] formData', formData);
    notify.show('請確認是否填妥表單資料', 'error', 1800);
  }

  handleSubmitPasswordFailed = (formData) => {
    // console.log('[handleSubmitFailed] formData', formData);
    notify.show('請確認密碼是否相同', 'error', 1800);
  }

  handleCancel = () => {
    this.props.history.push('/user/course');
  }

  render() {
    const {
      forms,
      changeValue
    } = this.props;

    return (
      <CommonPageContent
        className="profile-page-bg"
        pageTitle="個人資料"
      >
        <Profile
          targetForm={forms.profile}
          changeValue={changeValue}
          onSubmit={this.onProfileUpdate}
          onSubmitFailed={this.handleSubmitFailed}
          cancelEdit={this.handleCancel}
        />
      </CommonPageContent>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  resetForm: () => dispatch(formActions.reset('forms.addCourse')),
  changeValue: (value, key, target) => dispatch(formActions.change(
    `forms.${target}.${key}`,
    value
  )),
  changeForm: (formObj, target) => dispatch(formActions.change(
    `forms.${target}`,
    formObj
  ))
});

const mapStateToProps = ({ forms, Auth, Course }) => ({
  forms,
  token: Auth.token,
  userInfo: Auth.userInfo,
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  bindActionCreatorHoc,
  withRouter
)(ProfilePage);
