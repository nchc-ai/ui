import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { actions as formActions, Form } from 'react-redux-form';
import { notify } from 'react-notify-toast';
import { passwordForm } from '../constants/formsData';
import bindActionCreatorHoc from '../libraries/bindActionCreatorHoc';
import CommonPageContent from '../components/CommonPageContent';
import FormGroups from '../components/common/FormGroups/index';
import FormButtons from '../components/common/FormButtons/index';
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
      <CommonPageContent
        className="password-page-bg"
        pageTitle="密碼變更"
      >
        <Form
          model="forms.password"
          className="signup-form-comp"
          onSubmitFailed={this.handleSubmitPasswordFailed}
          onSubmit={this.onPasswordUpdate}
        >
          <div className="row-01">
            <FormGroups
              formData={passwordForm}
              targetForm={forms.password}
              changeVal={changeValue}
            />
          </div>

          <FormButtons
            cancelName="回課程列表"
            submitName="修改"
            backMethod={this.handleCancel}
            isForm
          />
        </Form>
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
)(PasswordPage);
