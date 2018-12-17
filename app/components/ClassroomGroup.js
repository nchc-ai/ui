import React from 'react';
import TableList from './common/TableList';
import { classroomGroupData } from '../constants/tableData';

const ClassroomGroup = ({ classrooms, startCourse, editCourse, deleteCourse }) => (
  <div className="classroom-group-comp">
    {
      classrooms.map((classroom) => (
        <div key={classroom.key} className="classroom-card">
          <div className="classroom-info">
            <h3 className="classroom-name">{classroom.name}</h3>
            <h5 className="classroom-teachers">
              <span>老師：</span>
              {
                classroom.teachers.map((teacher, index) => (
                  <span key={index}>{index !== 0 ? " , " : ""} {teacher}</span>
                ))
              }
            </h5>
            <h5>學生人數：{classroom.studentCount}</h5>
          </div>
          <div className="course-list">
            <TableList
              data={classroom.courseInfo}
              tableData={classroomGroupData}
              isLoading={false}
              isDialogOpen={true}
              startMethod={startCourse}
              editMethod={editCourse}
              deleteMethod={deleteCourse}
            />
          </div>
        </div>
      ))
    }
  </div>
);

export default ClassroomGroup;