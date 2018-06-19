import React from 'react';
import _ from 'lodash';
import { Table, Button } from 'reactstrap';
import courseBasicBn from '../../../public/images/course/course-basic-bn.png';
import courseAdvanceBn from '../../../public/images/course/course-advance-bn.png';
import { courseList } from '../../constants/fakeData';

const itemsHeaders = ['課程名稱', '講師名稱', '訓練資料', '建立日期'];

const CourseList = ({ match }) => (
  <div className="course-list-comp">
    <div className="section-bn">
      <img alt="" src={_.get(match, 'params.type') === 'basic' ? courseBasicBn : courseAdvanceBn} />
    </div>

    <div className="section-01">
      <h4 className="title">{_.get(match, 'params.type') === 'basic' ? '基礎課程列表' : '進階課程列表' }</h4>

      <div className="table-container">
        <Table hover>
          <thead>
            <tr>
              { itemsHeaders.map((d, i) => <th key={i}>{d}</th>)}</tr>
          </thead>
          <tbody>
            {
              courseList.map((d, j) => (
                <tr key={j}>
                  <td>{d.courseName}</td>
                  <td>{d.teacher}</td>
                  <td>{d.data}</td>
                  <td>{d.date}</td>
                </tr>
              ))
            }
          </tbody>
        </Table>
      </div>
    </div>





  </div>
);

export default CourseList;
