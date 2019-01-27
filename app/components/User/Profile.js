import React from 'react';
import { Form, actions as formActions } from 'react-redux-form';
import { profileForm } from '../../constants/formsData';
import FormGroups from '../common/FormGroups/index';
import FormButtons from '../common/FormButtons/index';
import SectionTitle from '../common/SectionTitle/index';

const Profile = ({ targetForm, changeValue, onSubmit, cancelEdit }) => {
  // console.log('profileForm', targetForm )
  return (
  <div className="profile-comp">
    <Form
      model="forms.profile"
      className="signup-form-comp"
      onSubmit={formData => onSubmit(formData)}
    >
      <div className="row-01">
        <FormGroups
          formData={profileForm}
          targetForm={targetForm}
          changeVal={changeValue}
        />
      </div>

      <FormButtons
        cancelName="回課程列表"
        submitName="修改"
        backMethod={cancelEdit}
        showMode="submit_back"
        isForm
      />
    </Form>
  </div>
)};


export default Profile;
