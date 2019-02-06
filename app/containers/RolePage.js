import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { actions as formActions, Form } from 'react-redux-form';
import { roleTeacherForm, roleStudentForm } from '../constants/formsData';
import { redirectUrlWithRole } from '../libraries/utils';
import FormGroups from '../components/common/FormGroups/index';
import FormButtons from '../components/common/FormButtons/index';
import bindActionCreatorHoc from '../libraries/bindActionCreatorHoc';
import CommonPageContent from '../components/CommonPageContent'

const options = [
  { value: 'student1@gmail.com', label: 'student1@gmail.com' },
  { value: 'teacher@gmail.com', label: 'teacher@gmail.com' },
  { value: 'jimmy@gmail.com', label: 'jimmy@gmail.com' }
]

class RolePage extends Component {
  componentWillMount() {

  }

  componentWillUnmount() {
    this.props.resetForm('role');
  }

  loadUserOptsMethodRole = () => {
    const {
      roleAction,
      match,
      token
    } = this.props;

    return roleAction.getUserListByRole(match.params.level || 'admin', token);
  }
  loadStudentOpts = () => {
    const {
      roleAction,
      match,
      token
    } = this.props;

    return roleAction.getUserListByRole('student', token);
  }

  changeRole = (submitData) => {
    const {
      roleAction,
      history
    } = this.props;
    roleAction.startSubstituating(submitData.role)

    const redirectUrl = redirectUrlWithRole({ role: submitData.role.role });
    history.push(redirectUrl);
  }

  render() {
    const {
      forms,
      changeValue,
      match,
    } = this.props;

    return (
      <CommonPageContent
        className="role-page-bg"
        pageTitle="視角切換"
      >
        <Form
          model={`forms.role`}
          className={`role-select`}
          onSubmit={submitData => this.changeRole(submitData)}
          onSubmitFailed={submitData => this.handleSubmitFailedCommon(submitData)}
        >
          <FormGroups
            targetForm={forms.role}
            formData={match.params.level === "teacher" ? roleTeacherForm : roleStudentForm}
            asyncSelectKey={match.params.level}
            changeVal={changeValue}
            loadOptsMethod={this.loadUserOptsMethodRole}
          />

          {/* 下方按鈕 */}
          <FormButtons
            cancelName="上一頁"
            submitName="確定"
            backMethod={this.backMethodCommon}
            showMode="submit_back"
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
  changeValue: (value, key, formName) => dispatch(formActions.change(
    `forms.${formName}.${key}`,
    value
  )),
  changeForm: (formObj, formName) => dispatch(formActions.change(
    `forms.${formName}`,
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
)(RolePage);
