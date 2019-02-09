import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Form, actions as formActions } from 'react-redux-form';
import { notify } from 'react-notify-toast';
import bindActionCreatorHoc from '../libraries/bindActionCreatorHoc';
import CommonPageContent from '../components/CommonPageContent';
import FormGroups from '../components/common/FormGroups/index';
import FormButtons from '../components/common/FormButtons/index';
import { profileForm } from '../constants/formsData';

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

  onProfileUpdateSuccess = () => {
    notify.show('個人資料更新成功', 'success', 1800);
    this.fetchData(this.props);
  }

  onProfileSubmit = (formData) => {
    const {
      authAction,
      token
    } = this.props;
    authAction.updateProfile(formData, token, this.onProfileUpdateSuccess);
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
  withRouter
)(ProfilePage);
