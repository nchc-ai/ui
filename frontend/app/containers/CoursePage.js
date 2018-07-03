import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router';
import { compose } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import CourseDetail from '../components/Course/CourseDetail';
import CourseList from '../components/Course/CourseList';
import CourseIntro from '../components/Course/CourseIntro';
import { courseList } from '../constants/fakeData';
import { courseData } from '../constants/tableData';
import bindActionCreatorHoc from '../libraries/bindActionCreatorHoc';

class CoursePage extends Component {

  componentWillMount() {
    // this.props.userAction.getCourseList('jimmy', token)
    const {
      courseAction,
      token,
      match
    } = this.props;
    courseAction.getCourseDetail(match.params.courseId, token);

  }

  cancelEdit = () => {
    console.log('cancel');
  }

  render() {
    const {
      match,
      courseDetail
    } = this.props;
    const courseType = _.get(match, 'params.type');
    return (
      <div className="course-bg global-content">
        <Switch>
          <Route exact path="/course/intro">
            <CourseIntro />
          </Route>
          <Route exact path="/course/:type">
            <CourseList
              match={match}
              data={courseList}
              tableData={courseData}
              courseType={courseType}
            />
          </Route>
          <Route exact path="/course/detail/:courseId">
            <CourseDetail detail={courseDetail} cancelEdit={this.cancelEdit} />
          </Route>
          
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = ({ Auth, Course }) => ({
  token: Auth.token,
  courseDetail: Course.courseDetail.data
});


export default compose(
  connect(mapStateToProps),
  bindActionCreatorHoc,
  withRouter
)(CoursePage);
