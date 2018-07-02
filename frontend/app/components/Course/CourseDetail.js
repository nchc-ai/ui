import React from 'react';
import { Container } from 'reactstrap';
import courseBn from '../../../public/images/course/course-bn.png';
import CustomJumbotron from '../common/CustomJumbotron/index';
import ListView from '../common/ListView/index';
import FormButtons from '../common/FormButtons/index';
import { courseDetailList } from '../../constants/listData';
import { courseDetailData } from '../../constants/tempData';
import circleIcon from '../../../public/images/course/course-detail-ai-logo.png';

const CourseDetail = ({ cancelEdit }) => (
  <div className="course-detail-bg">

    <div className="section-bn section-grp">
      {/* <img className="bg-grp" alt="" src={courseBn} /> */}
      <h1>課程細項</h1>
      <img alt="" src={circleIcon} />
    </div>

    <div className="section-01 section-grp">
      <CustomJumbotron>
        <p>本課程是進行有關訊號處理與機器學習整合之課程。In this hands-on lab, you’ll learn how to create a Google Compute Engine virtual machine and understand zones, regions, and machine types.本課程是進行有關訊號處理與機器學習整合之課程</p>
      </CustomJumbotron>

      <ListView
        data={courseDetailList(courseDetailData)}
      />

      <hr className="my-2" />

      {/* 下方按鈕 */}
      <FormButtons
        cancelName="上一頁"
        submitName="開始課程"
        backMethod={cancelEdit}
      />

    </div>
  </div>
);

export default CourseDetail;
