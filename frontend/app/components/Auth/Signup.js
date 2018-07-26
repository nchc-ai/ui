
import React from 'react';
import { Form } from 'react-redux-form';
import { signupForm } from '../../constants/formsData';
import SectionTitle from '../common/SectionTitle/index';
import logoImg from '../../../public/images/auth/login-logo.png';
import FormGroups from '../common/FormGroups/index';
import FormButtons from '../common/FormButtons/index';

const Signup = ({ targetForm, changeValue, onSubmit, onSubmitFailed, backMethod }) => (
  <div className="signup-comp">
    <SectionTitle
      isTitleImg
      titleImgUrl={logoImg}
      subTitle={'歡迎註冊 NCHC.ai 帳戶'}
    />

    <hr />

    <div className="signup-card-bg">
      <div className="signup-container container">
        <Form
          model="forms.signup"
          className="signup-form-comp"
          onSubmit={formData => onSubmit(formData)}
          onSubmitFailed={submitData => onSubmitFailed(submitData)}
        >
          <div className="row-01">
            <FormGroups
              formData={signupForm}
              targetForm={targetForm}
              changeVal={changeValue}
            />
          

            {/* 下方按鈕 */}
            <FormButtons
              cancelName="取消"
              submitName="註冊"
              backMethod={backMethod}
              size={4}
              isForm
            />

          </div>
        </Form>
      </div>
    </div>
  </div>
);

export default Signup;
