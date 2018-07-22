import React from 'react';
import { Form, actions as formActions } from 'react-redux-form';
import HeaderBlock from '../common/HeaderBlock';
import FormGroups from '../common/FormGroups/index';

const Profile = () => (
  <div className="profile-comp">
    <HeaderBlock headerArr={['關於我']}>
      <Form
        model="forms.signup"
        className="signup-form-comp"
        onSubmit={formData => this.handleSubmit(formData)}
      >
        <div className="row-01">
          <FormGroups
            formData={signupForm}
            targetForm={signupUser}
            changeVal={changeValue}
          />
        </div>

        <div className="submit-bg">
          <div className="submit-container">
            <button className="submit-btn" type="submit">註冊</button>
          </div>
        </div>
      </Form>
    </HeaderBlock>
  </div>
);


export default Profile;
