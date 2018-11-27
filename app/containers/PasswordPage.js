import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { notify } from 'react-notify-toast';
import bindActionCreatorHoc from '../libraries/bindActionCreatorHoc';
import Password from '../components/User/Password';
import SectionTitle from '../components/common/SectionTitle';
import TitleIcon from '../assets/images/user/title-icon.png';


class PasswordPage extends Component {
  componentWillMount() {

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

  // Password
  onPasswordUpdateSuccess = () => {
    notify.show('您的密碼已更新成功', 'success', 1800);
  }


  onPasswordUpdate = (formData) => {
    const {
      authAction,
      token,
      userInfo
    } = this.props;
    // console.log('update', userInfo);
    authAction.updatePassword(userInfo.username, formData, token, this.onPasswordUpdateSuccess);
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
      <div className="profile-bg global-content">
        <SectionTitle
          title={'密碼變更'}
          iconImgUrl={TitleIcon}
          isUnderline
          isIcon
        />
        <Password
            targetForm={forms.password}
            changeValue={changeValue}
            onSubmit={this.onPasswordUpdate}
            onSubmitFailed={this.handleSubmitPasswordFailed}
            cancelEdit={this.handleCancel}
        />
      </div>
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
)(PasswordPage);
