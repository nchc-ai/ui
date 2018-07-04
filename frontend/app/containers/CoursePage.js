import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router';
import { compose } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import CourseDetail from '../components/Course/CourseDetail';
import CourseList from '../components/Course/CourseList';
import CourseIntro from '../components/Course/CourseIntro';
import { courseData } from '../constants/tableData';
import bindActionCreatorHoc from '../libraries/bindActionCreatorHoc';

class CoursePage extends Component {

  componentWillMount() {
    // this.props.userAction.getCourseList('jimmy', token)
    this.fetchData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.url !== this.props.match.url) {
      window.scrollTo(0, 0);
      this.fetchData(nextProps);
    }
  }


  fetchData = (nextProps) => {
    const {
      courseAction,
      token,
      match
    } = nextProps;

    const type = _.get(match, 'params.type');

    if (type === 'basic' || type === 'advance') {
      courseAction.getCourseListByLevel(type);
    } else if (type === 'detail') {
      courseAction.getCourseDetail(match.params.courseId, token);
    }
  }

  cancelEdit = () => {
    this.props.history.push('/user/course');
  }

  render() {
    const {
      match,
      courseList,
      courseDetail
    } = this.props;
    const courseType = _.get(match, 'params.type');
    return (
      <div className="course-bg global-content">
        <Switch>
          {/* 課程介紹 */}
          <Route exact path="/course/intro">
            <CourseIntro />
          </Route>

          {/* 基礎課程 vs 進階課程 */}
          <Route exact path="/course/:type">
            <CourseList
              match={match}
              data={courseList}
              tableData={courseData}
              courseType={courseType}
            />
          </Route>

          {/* 課程細項 */}
          <Route exact path="/course/detail/:courseId">
            <CourseDetail
              detail={courseDetail}
              cancelEdit={this.cancelEdit}
            />
          </Route>
          
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = ({ Auth, Course }) => ({
  token: Auth.token,
  courseList: Course.courseList.data,
  courseDetail: Course.courseDetail.data
});


export default compose(
  connect(mapStateToProps),
  bindActionCreatorHoc,
  withRouter
)(CoursePage);
