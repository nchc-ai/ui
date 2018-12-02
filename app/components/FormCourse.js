import React from 'react';
import { Form } from 'react-redux-form';
import FormGroups from './common/FormGroups/index';
import FormButtons from './common/FormButtons/index';

const FormCourseEdit = ({ className, formName, handleSubmit, handleSubmitFailed, state, formData, targetForm, changeVal, loadOptsMethod, loadTagsOptsMethod, onRadioChange, onMdChange, backMethod }) => (
  <div className="user-course-edit-bg">

    <Form
      model={`forms.${formName}`}
      className={`course-edit-comp ${className}`}
      onSubmit={submitData => handleSubmit(submitData)}
      onSubmitFailed={submitData => handleSubmitFailed(submitData)}
    >
      <FormGroups
        state={state}
        formData={formData}
        targetForm={targetForm}
        changeVal={changeVal}
        loadOptsMethod={loadOptsMethod}
        loadTagsOptsMethod={loadTagsOptsMethod}
        onRadioChange={onRadioChange}
        onMdChange={onMdChange}
      />

      {/* 下方按鈕 */}
      <FormButtons
        cancelName="上一頁"
        submitName="儲存"
        backMethod={backMethod}
        isForm
      />

    </Form>

  </div>
);

export default FormCourseEdit;
