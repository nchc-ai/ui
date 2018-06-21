import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router';
import _ from 'lodash';
import CourseIntro from '../components/Course/CourseIntro';
import CourseList from '../components/Course/CourseList';
import { courseList } from '../constants/fakeData';
import { courseData } from '../constants/tableData';

class CoursePage extends Component {
  render() {
    const {
      match
    } = this.props;
    const courseType = _.get(match, 'params.type');
    return (
      <div className="course-bg global-content">
        <Switch>
          <Route exact path="/course/:type">
            <CourseList
              match={match}
              data={courseList}
              tableData={courseData}
              courseType={courseType}
            />
          </Route>
          <Route exact path="/course" component={CourseIntro} />
        </Switch>
      </div>
    );
  }
}

export default (withRouter(CoursePage));
