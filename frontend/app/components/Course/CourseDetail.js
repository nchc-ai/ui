import React from 'react';
import _ from 'lodash';
import { Container } from 'reactstrap';
import courseBn from '../../../public/images/course/course-bn.png';
import CustomJumbotron from '../common/CustomJumbotron/index';
import ListView from '../common/ListView/index';
import FormButtons from '../common/FormButtons/index';
import { courseDetailList } from '../../constants/listData';
import { courseDetailData } from '../../constants/tempData';
import circleIcon from '../../../public/images/course/course-detail-ai-logo.png';

const CourseDetail = ({ submitMethod, cancelEdit, detail }) => (
  <div className="course-detail-bg">

    <div className="section-bn section-grp">
      {/* <img className="bg-grp" alt="" src={courseBn} /> */}
      <h1>課程細項</h1>
      <img alt="" src={circleIcon} />
    </div>

    <div className="section-01 section-grp">
      <CustomJumbotron
        tag={_.get(detail, 'level')}
        title={_.get(detail, 'name')}
        sideTitle={`開課講師：${_.get(detail, 'user')}`}
        info={_.get(detail, 'introduction')}
      />

     
      <ListView
        data={courseDetailList(detail)}
      />
        

      <hr className="my-2" />

      {/* 下方按鈕 */}
      {/* TODO: 需在這判斷是否有開過課程決定submitName */}
      <FormButtons
        cancelName="上一頁"
        submitName="開始課程"
        backMethod={cancelEdit}
        submitMethod={submitMethod}
      />

    </div>
  </div>
);

export default CourseDetail;
