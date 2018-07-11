import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router';
import { compose } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import { notify } from 'react-notify-toast';
import Progress from 'react-progress-2';
import CourseDetail from '../components/Course/CourseDetail';
import CourseList from '../components/Course/CourseList';
import CourseIntro from '../components/Course/CourseIntro';
import { courseData } from '../constants/tableData';
import bindActionCreatorHoc from '../libraries/bindActionCreatorHoc';
import courseBasicBn from '../../public/images/course/course-basic-bn.png';
import courseAdvanceBn from '../../public/images/course/course-advance-bn.png';


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

    // console.log('type', match, type);
    if (type === 'basic' || type === 'advance') {
      courseAction.getCourseListByLevel(type);
    } else if (type === 'detail') {
      courseAction.getCourseDetail(match.params.courseId, token);
    } else if (type === 'search') {
      courseAction.searchCourse(match.params.courseId);
    }
  }

  startCourse = () => {
    const {
      userAction,
      token,
      userInfo,
      match
    } = this.props;

    Progress.show();
    userAction.launchJob(userInfo.username, match.params.courseId, token, this.onStartClassSuccess);
  }

  onStartClassSuccess = () => {

    console.log('create job success');
    Progress.hide();
    notify.show('新增工作成功', 'success', 1800);
    this.props.history.push('/user/job');
  }


  backFromCourseDetail = (e) => {
    e.preventDefault();
    this.props.history.goBack();
  }

  render() {
    const {
      match,
      courseList,
      courseDetail,
      searchResult
    } = this.props;
    const courseType = _.get(match, 'params.type');
    return (
      <div className="course-bg global-content">
        <Switch>


          {/* 課程細項 */}
          <Route exact path="/course/detail/:courseId">
            <CourseDetail
              detail={courseDetail}
              submitMethod={this.startCourse}
              cancelEdit={this.backFromCourseDetail}
            />
          </Route>

          {/* 課程搜尋 */}
          <Route exact path="/course/:type/:query">
            <CourseList
              match={match}
              banner={courseBasicBn}
              title={'搜尋課程結果'}
              data={searchResult}
              tableData={courseData}
            />
          </Route>

          {/* 課程介紹 */}
          <Route exact path="/course/intro">
            <CourseIntro />
          </Route>

          {/* 基礎課程 vs 進階課程 */}
          <Route exact path="/course/:type">
            <CourseList
              match={match}
              banner={courseType === 'basic' ? courseBasicBn : courseAdvanceBn}
              title={courseType === 'basic' ? '基礎課程列表' : '進階課程列表'}
              data={courseList}
              tableData={courseData}
              courseType={courseType}
            />
          </Route>


          
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = ({ Auth, Course }) => ({
  token: Auth.token,
  userInfo: Auth.userInfo,
  courseList: Course.courseList.data,
  courseDetail: Course.courseDetail.data,
  searchResult: Course.searchResult.data
});


export default compose(
  connect(mapStateToProps),
  bindActionCreatorHoc,
  withRouter
)(CoursePage);
