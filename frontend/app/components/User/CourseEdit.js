import React from 'react';
// import _ from 'lodash';
import { Row, Col } from 'reactstrap';
import { Form } from 'react-redux-form';


import SectionTitle from '../common/SectionTitle/index';
import FormGroups from '../common/FormGroups/index';
import FormButtons from '../common/FormButtons/index';
// import courseBn from '../../../public/images/course/course-bn.png';
// import CustomJumbotron from '../common/CustomJumbotron/index';
// import ListView from '../common/ListView/index';
// import FormButtons from '../common/FormButtons/index';
// import { courseDetailList } from '../../constants/listData';
// import { courseDetailData } from '../../constants/tempData';
// import circleIcon from '../../../public/images/course/course-detail-ai-logo.png';

const CourseEdit = ({ handleSubmit, handleSubmitFailed, state, formData, targetForm, changeVal, loadTagsOptsMethod, onRadioChange, onMdChange, backMethod }) => (
  <div className="user-course-edit-bg">
    <SectionTitle
      title={'新增課程'}
    />

    <hr />

    <Form
      model="forms.addCourse"
      className="add-course-comp"
      onSubmit={submitData => handleSubmit(submitData)}
      onSubmitFailed={submitData => handleSubmitFailed(submitData)}
    >
      <FormGroups
        state={state}
        formData={formData}
        targetForm={targetForm}
        changeVal={changeVal}
        loadTagsOptsMethod={loadTagsOptsMethod}
        onRadioChange={onRadioChange}
        onMdChange={onMdChange}
      />

      {/* 下方按鈕 */}
      <FormButtons
        cancelName="上一頁"
        submitName="儲存"
        backMethod={backMethod}
      />

    </Form>

  </div>
);

export default CourseEdit;
