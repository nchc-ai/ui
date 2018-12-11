import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { actions as formActions, Form } from 'react-redux-form';
import { roleForm } from '../constants/formsData';
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

  loadUserOptsMethodRole = () => {
    const {
      roleAction,
      match
    } = this.props;
    roleAction.getUserListByRole(match.params.level || 'admin')
  }

  render() {
    const {
      forms,
      changeValue,
    } = this.props;

    return (
      <CommonPageContent
        className="role-page-bg"
        pageTitle="視角切換"
      >
         <Form
          model={`forms.role`}
          className={`role-select`}
          onSubmit={submitData => this.handleSubmitCreateVM(submitData)}
          onSubmitFailed={submitData => this.handleSubmitFailedCommon(submitData)}
        >
          <FormGroups
            targetForm={forms.role}
            formData={roleForm}
            changeVal={changeValue}
            loadOptsMethod={this.loadUserOptsMethodRole}
          />

          {/* 下方按鈕 */}
          <FormButtons
            cancelName="上一頁"
            submitName="確定"
            backMethod={this.backMethodCommon}
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
