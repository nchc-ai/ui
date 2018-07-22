import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';

import SectionTitle from '../common/SectionTitle/index';
import TableList from '../common/TableList/index';

const CourseList = ({ data, tableData, isDialogOpen, startMethod, editMethod, deleteMethod, isEditable }) => (
  <div className="user-course-bg">
    <Row>
      <Col>
        <SectionTitle
          title={'課程列表'}
        />
        <hr />
      </Col>
      <Col>
        <Link to="/user/course/add">
          <span className="v-helper" />
          <button
            className="btn-pair add-btn"
            style={{ display: isEditable ? 'block' : 'none' }}
          >
          + 新增
          </button>
        </Link>
      </Col>
    </Row>
    <TableList
      data={data}
      tableData={tableData}
      isDialogOpen={isDialogOpen}
      startMethod={startMethod}
      editMethod={editMethod}
      deleteMethod={deleteMethod}
      isEditable={isEditable}
    />
  </div>
);

export default CourseList;
