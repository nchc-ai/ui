import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';

import SectionTitle from '../common/SectionTitle/index';
import TableList from '../common/TableList/index';

const CourseList = ({ data, tableData, isDialogOpen, startMethod, editMethod, deleteMethod, isAdmin, addJob }) => (
  <div className="user-course-bg">
    <Row>
      <Col size={12}>
        <SectionTitle
          title={'課程列表'}
        />

        <hr />
      </Col>
     
    </Row>
    <Row>
      <Col className="col-second">
        <Link to="/user/course/add">
          <span className="v-helper" />
          <button
            className="btn-pair add-btn"
            style={{ display: isAdmin ? 'inline' : 'none' }}
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
      addJob={addJob}
    />
  </div>
);

export default CourseList;
