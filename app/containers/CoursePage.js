import React, { Component } from 'react';
import { Switch, Route, withRouter, Link } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import { notify } from 'react-notify-toast';
import Progress from 'react-progress-2';
import { Button } from 'reactstrap';
import { actions as formActions } from 'react-redux-form';
import CourseDetail from '../components/Course/CourseDetail';
import CourseList from '../components/Course/CourseList';
import CourseIntro from '../components/Course/CourseIntro';
import { ongoingCourseData } from '../constants/tableData';
import bindActionCreatorHoc from '../libraries/bindActionCreatorHoc';
import TableList from '../components/common/TableList';

import courseSearchBn from '../../public/images/course/course-search-bn.png';
import courseBasicBn from '../../public/images/course/course-basic-bn.png';
import courseAdvanceBn from '../../public/images/course/course-advance-bn.png';

import SectionList from '../components/common/SectionList/index';
import { courseListBasic, courseListAdvance, courseDetailBasic, courseDetailAdvance } from '../constants/listData';


import SectionTitle from '../components/common/SectionTitle';
import TitleIcon from '../assets/images/user/title-icon.png';


class CoursePage extends Component {

  componentWillMount() {
    
    // this.props.userAction.getCourseList('jimmy', token)
    window.scrollTo(0, 0);
    this.fetchData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.url !== this.props.match.url) {
      window.scrollTo(0, 0);
      this.fetchData(nextProps);
      if(nextProps.match.params.type !== 'search') {
        nextProps.resetForm('globalSearch');
      }
    }
  }

  componentWillUnmount() {
    this.props.resetForm('globalSearch');
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

    // console.log('create job success');
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

    const tempData = [
      {
        "createAt": "2018-06-25T09:24:38Z",
        "datasets": [
          "cifar-10",
          "caltech256"
        ],
        "gpu": 1,
        "id": "49a31009-7d1b-4ff2-badd-e8c717e2256c",
        "image": "nginx:1.7.9",
        "introduction": "課程說明",
        "level": "basic",
        "name": "jimmy的課"
      }, {
        "createAt": "2018-06-25T09:24:38Z",
        "datasets": [
          "cifar-10",
          "caltech256"
        ],
        "gpu": 1,
        "id": "49a31009-7d1b-4ff2-badd-e8c717e2256c",
        "image": "nginx:1.7.9",
        "introduction": "課程說明",
        "level": "basic",
        "name": "jimmy的課"
      }
    ];

    return (
      <div className="course-bg global-content">
        <Switch>

          
          {/* [User] 課程列表 */}
          <Route path="/ongoing-course/list">
            <div class="ongoing-course__list ongoing-course__grp">
              <SectionTitle
                title='開課列表'
                iconImgUrl={TitleIcon}
                isUnderline
                isIcon
              />

              <Link to="/classroom-manage/create" className="fl add-btn-con">
                <Button className="fl add-btn" color="success">新增容器課程</Button>
              </Link>

              <Link to="/classroom-manage/create" className="fl add-btn-con" style={{ marginLeft: '10px' }}>
                <Button className="fl add-btn" color="success">新增 VM 課程</Button>
              </Link>


              <TableList
                data={tempData}
                tableData={ongoingCourseData}
                isDialogOpen={true}
                startMethod={this.startCourse}
                editMethod={this.editCourse}
                deleteMethod={this.deleteCourse}
              />
            </div>
          </Route>

          {/* [User] 課程細項 */}
          <Route exact path="/ongoing-course/detail/:courseId">
            <CourseDetail
              detail={courseDetail}
              submitMethod={this.startCourse}
              cancelEdit={this.backFromCourseDetail}
            />
          </Route>

          {/* [User] 課程編輯 */}
          <Route exact path="/ongoing-course/edit/:courseId">
          </Route>


          
          {/* [User] 新建課程 */}
          <Route exact path="/ongoing-course/create">
            <div>
              <span>編輯課程</span>
            </div>
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

const mapDispatchToProps = dispatch => ({
  resetForm: targetForm => dispatch(formActions.reset(`forms.${targetForm}`))
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  bindActionCreatorHoc,
  withRouter
)(CoursePage);
