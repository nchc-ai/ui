import React from 'react';
import { Form, actions as formActions } from 'react-redux-form';
import { passwordForm } from '../../constants/formsData';
import { passwordsMatch } from '../../libraries/validation';
import FormGroups from '../common/FormGroups/index';
import FormButtons from '../common/FormButtons/index';
import SectionTitle from '../common/SectionTitle/index';

const Password = ({ targetForm, changeValue, onSubmit, onSubmitFailed, cancelEdit }) => {
  // console.log('profileForm', targetForm )
  return (
  <div className="profile-comp">
    <SectionTitle
      title={'密碼設定'}
      subTitle={'您可在此修改密碼。'}
    />
    <Form
      model="forms.password"
      className="signup-form-comp"
      validators={{
        '': {
          passwordsMatch: vals => {
            return vals.password.toString() === vals.confirmPassword.toString() 
          }
        }
      }}
      onSubmitFailed={onSubmitFailed}
      onSubmit={formData => onSubmit(formData)}
    >
      <div className="row-01">
        <FormGroups
          formData={passwordForm}
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
