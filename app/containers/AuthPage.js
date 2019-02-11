import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Form, actions as formActions } from 'react-redux-form';
import { notify } from 'react-notify-toast';
import Cookies from 'js-cookie';
import { dayToSecond, redirectUrlWithRole } from '../libraries/utils';
import bindActionCreatorHoc from '../libraries/bindActionCreatorHoc';
import { signupForm } from '../constants/formsData';
import Login from '../components/Auth/Login';
import SectionTitle from '../components/common/SectionTitle/index';
import FormGroups from '../components/common/FormGroups/index';
import FormButtons from '../components/common/FormButtons/index';
import logoImg from '../../public/images/auth/login-logo.png';

class AuthPage extends Component {

  componentWillMount() {
    window.scrollTo(0, 0);
    this.props.resetForm();
  }

  componentWillUnmount() {
    this.props.resetForm();
  }

  componentWillReceiveProps(nextProps) {
    // const {
    //   match,
    // } = nextProps;
    // if (this.props.match !== match && match) {
    //   window.scrollTo(0, 0);
    //   this.props.resetForm();
    // }
  }

  /**
   * Get token with code argument after popup closed.
   * @param {Object} codeObj Code passed from popup.
   */
  onGetCodeSuccess = (codeObj) => {
    this.props.authAction.getToken(codeObj, this.onGetTokenSuccess);
  }

  /**
   * Prevent from showing wrong error message.
   * @param {String} err Error message from popup.
   */
  onGetCodeFail = (err) => {
    if (err.toString() !== 'Error: The popup was closed') {
      notify.show('Error: code not found', 'error', 1800);
    }
  }

  /**
   * Set token to cookie and state then get user info.
   * @param {String} token Token to retrieve user info.
   */
  onGetTokenSuccess = (tokenObj) => {
    Cookies.set('token_obj', tokenObj, { path: '/', maxAge: dayToSecond(1) });
    this.props.authAction.getMetaInfo({ token: tokenObj.token, onSuccess: this.onGetMetaInfoSuccess });
  }

  /**
   * Set user info and isLogin state to both cookie and state then redirect by role.
   * @param {String} token Token to retrieve user info.
   */
  onGetMetaInfoSuccess = ({ token, metaInfo }) => {
    const {
      authAction
    } = this.props;

    Cookies.set('user_info', metaInfo, { path: '/', maxAge: dayToSecond(1) });
    Cookies.set('is_login', true, { path: '/', maxAge: dayToSecond(1) });

    authAction.getUserInfo({ token, onSuccess: this.onGetUserInfoSuccess });
  }

  /**
   * Set token to cookie and state then get user info.
   * @param {String} token Token to retrieve user info.
   */
  onGetUserInfoSuccess = () => {
    const {
      history,
      role
    } = this.props;

    const redirectUrl = redirectUrlWithRole({ role });
    history.push(redirectUrl);
  }

  redirect = (payload) => {
    const {
      history,
      authAction
    } = this.props;

    const redirectUrl = redirectUrlWithRole({ role: payload.role });
    history.push(redirectUrl);
  }

  // Signup
  onSignupSubmit = (formData) => {

    const {
      authAction,
      resetForm
    } = this.props;

    const submitData = {
      ...formData,
      role: "student"
    };

    resetForm();

    authAction.register({
      submitData,
      next: this.onAfterSubmit
    });
  }

  onAfterSubmit = (response) => {
    // console.log('[signup] response', response);
    notify.show('註冊成功 請輸入帳號密碼進行登入', 'success', 1800);
    this.props.history.push('/login');
  }

  onSignupCancel = () => {
    this.props.history.push('/login');
  }

  render() {
    const {
      forms,
      changeValue
    } = this.props;

    return (
      <div className="auth-bg global-content">
        <Switch>
          <Route exact path="/login">
            <Login
              onSuccess={this.onGetCodeSuccess}
              onFailure={this.onGetCodeFail}
            />
          </Route>
          <Route exact path="/signup">
            <div className="signup-comp">
              <SectionTitle
                isTitleImg
                titleImgUrl={logoImg}
                subTitle={'歡迎註冊 NCHC.ai 帳戶'}
                isFloatLeft
              />

              <hr />

              <div className="signup-card-bg">
                <div className="signup-container container">
                  <Form
                    model="forms.signup"
                    className="signup-form-comp"
                    onSubmit={formData => this.onSignupSubmit(formData)}
                  >
                    <div className="row-01">
                      <FormGroups
                        targetForm={forms.signup}
                        formData={signupForm}
                        changeVal={changeValue}
                      />

                      {/* 下方按鈕 */}
                      <FormButtons
                        cancelName="取消"
                        submitName="註冊"
                        backMethod={this.onSignupCancel}
                        showMode="submit_back"
                        size={4}
                        isForm
                      />

                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </Route>
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = ({ forms, Auth }) => ({
  forms,
  role: Auth.userInfo.role
});

const mapDispatchToProps = dispatch => ({
  resetForm: () => dispatch(formActions.reset('forms.signup')),
  changeValue: (value, key, target) => dispatch(formActions.change(
    `forms.${target}.${key}`,
    value
  ))
});


export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  bindActionCreatorHoc
)(AuthPage);
