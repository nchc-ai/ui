import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { actions as formActions, Form } from 'react-redux-form';
import { notify } from 'react-notify-toast';
import { passwordForm } from '../constants/formsData';
import { TOAST_TIMING } from '../constants';
import bindActionCreatorHoc from '../libraries/bindActionCreatorHoc';
import CommonPageContent from '../components/CommonPageContent';
import FormGroups from '../components/common/FormGroups/index';
import FormButtons from '../components/common/FormButtons/index';
class PasswordPage extends Component {

  isPasswordValid = (formData) => {
    return formData.password === formData.confirmPassword
  }

  onPasswordSubmitSuccess = () => {
    this.props.resetForm('password');
    notify.show('個人密碼更新成功', 'success', 1800);
  }

  onPasswordSubmit = (formData) => {
    const {
      authAction,
      token,
      username
    } = this.props;

    const isPasswordValid = this.isPasswordValid(formData);

    if (isPasswordValid) {
      authAction.updatePassword({
        token,
        username,
        formData,
        onSuccess: this.onPasswordSubmitSuccess
      });
    } else {
      notify.show('請確認 "新密碼欄位" 與 "新密碼確認欄位" 是否一致', 'error', TOAST_TIMING);
    }
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
          onSubmit={submitData => this.onPasswordSubmit(submitData)}
        >
          <FormGroups
            formData={passwordForm}
            targetForm={forms.password}
            changeVal={changeValue}
          />

          <FormButtons
            submitName="更新密碼"
            showMode="submit_only"
            isForm
          />
        </Form>
      </CommonPageContent>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  resetForm: (formName) => dispatch(formActions.reset(
    `forms.${formName}`
  )),
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
  username: Auth.userInfo.username,
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  bindActionCreatorHoc,
  withRouter
)(PasswordPage);
