
import React from 'react';
import { Form } from 'react-redux-form';
import { signupForm } from '../../constants/formsData';
import Title from '../common/Title';
import FormGroups from '../common/FormGroups/index';

const Signup = ({ targetForm, changeValue, onSubmit }) => (
  <div className="signup-bg global-content">
    <Title
      title="SIGNUP | 註冊KNOMO TAIWAN"
      subTitle="您還不是 KNOMO TAIWAN 會員嗎？立刻註冊"
    />

    <div className="signup-card-bg">
      <div className="signup-container">
        <Form
          model="forms.signup"
          className="signup-form-comp"
          onSubmit={formData => onSubmit(formData)}
        >
          <div className="row-01">
            <FormGroups
              formData={signupForm}
              targetForm={targetForm}
              changeVal={changeValue}
            />
          </div>

          <div className="submit-bg">
            <div className="submit-container">
              <button className="submit-btn" type="submit">註冊</button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  </div>
);

export default Signup;
