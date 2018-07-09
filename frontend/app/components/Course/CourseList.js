import React from 'react';
import _ from 'lodash';
import { Table } from 'reactstrap';
import TableList from '../common/TableList/index';
import courseBasicBn from '../../../public/images/course/course-basic-bn.png';
import courseAdvanceBn from '../../../public/images/course/course-advance-bn.png';

const CourseList = ({ match, title, data, tableData }) => (
  <div className="course-list-comp">
    <div className="section-bn section-grp">
      <img className="bg-grp" alt="" src={courseType === 'basic' ? courseBasicBn : courseAdvanceBn} />
    </div>

    <div className="section-01 section-grp">
      <h4 className="title">{title}</h4>

      <div className="table-container">
        <TableList
          data={data}
          tableData={tableData}
        />
      </div>
    </div>
  </div>
);

export default CourseList;
