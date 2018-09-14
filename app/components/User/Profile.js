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
    <SectionTitle
      title={'個人資料'}
      subTitle={'以下是您的個人資料，可修改上傳。'}
    />

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
        isForm
      />
    </Form>
  </div>
)};


export default Profile;
