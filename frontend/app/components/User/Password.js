import React from 'react';
import { Form, actions as formActions } from 'react-redux-form';
import { profileForm } from '../../constants/formsData';
import FormGroups from '../common/FormGroups/index';
import FormButtons from '../common/FormButtons/index';
import SectionTitle from '../common/SectionTitle/index';

const Password = ({ targetForm, changeValue, onSubmit, cancelEdit }) => {
  // console.log('profileForm', targetForm )
  return (
  <div className="profile-comp">
    <SectionTitle
      title={'密碼變更'}
      subTitle={'您可在此修改密碼。'}
    />

    <Form
      model="forms.password"
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


export default Password;
