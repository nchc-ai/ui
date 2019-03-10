import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Form, actions as formActions } from 'react-redux-form';
import { notify } from 'components/common/NotifyToast';
import bindActionCreatorHoc from '../libraries/bindActionCreatorHoc';
import CommonPageContent from '../components/CommonPageContent';
import FormGroups from '../components/common/FormGroups/index';
import FormButtons from '../components/common/FormButtons/index';
import { profileForm } from '../constants/formsData';
import bindProgressBarHoc from 'libraries/bindProgressBarHoc';
import bindDialogHOC from 'libraries/bindDialogHOC';
import * as dialogTypes from 'constants/dialogTypes';
class ProfilePage extends Component {
  componentWillMount() {
    this.fetchData(this.props);
  }

  fetchData = (nextProps) => {
    const {
      authAction,
      userInfo,
      token,
    } = nextProps;
    authAction.getUserInfo({
      token,
      onSuccess: () => {}
    })
    authAction.getProfile({
      token,
      onSuccess: this.initializeEditForm
    });
  }

  initializeEditForm = ({ profile }) => {
    this.props.changeForm(profile, 'profile');
  }

  onProfileSubmit = (formData) => {
    const {
      token,
      authAction,
      startProgressBar,
      endPorgressBar,
      openCustomDialog,
      toggleDialog
    } = this.props;

    openCustomDialog({
      type: dialogTypes.UPDATE,
      title: '更新個人資料',
      info: '請問確定要更新嗎？',
      submitMethod: () => {
        toggleDialog();
        startProgressBar();
        authAction.updateProfile(
          formData,
          token,
          () => {
            endPorgressBar();
            notify.show('個人資料更新成功', 'success', 180000);
            this.fetchData(this.props);
          }
        );
      },
      cancelMethod: () => {
        toggleDialog();
      }
    });
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
        <div className="profile-comp">
          <Form
            model="forms.profile"
            className="signup-form-comp"
            onSubmit={submitData => this.onProfileSubmit(submitData)}
          >
            <div className="row-01">
              <FormGroups
                targetForm={forms.profile}
                formData={profileForm}
                changeVal={changeValue}
              />
            </div>

            <FormButtons
              submitName="更新個人資訊"
              showMode="submit_only"
              isForm
            />
          </Form>
        </div>
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
  profile: Auth.profile
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  bindActionCreatorHoc,
  bindProgressBarHoc,
  bindDialogHOC,
  withRouter
)(ProfilePage);
