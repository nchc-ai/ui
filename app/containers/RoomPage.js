import React, { Component } from 'react';
import { Switch, Route, withRouter, Link } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Button } from 'reactstrap';
import { notify } from 'react-notify-toast';
import Progress from 'react-progress-2';
import { Form, actions as formActions } from 'react-redux-form';
import CourseDetail from '../components/Course/CourseDetail';
import CourseList from '../components/Course/CourseList';
import CourseIntro from '../components/Course/CourseIntro';
import { roomData } from '../constants/tableData';
import bindActionCreatorHoc from '../libraries/bindActionCreatorHoc';
import CommonPageContent from '../components/CommonPageContent';
import FormGroups from '../components/common/FormGroups/index';
import FormButtons from '../components/common/FormButtons/index';

import TableList from '../components/common/TableList';
import { addRoomForm } from '../constants/formsData';
import courseSearchBn from '../../public/images/course/course-search-bn.png';
import courseBasicBn from '../../public/images/course/course-basic-bn.png';
import courseAdvanceBn from '../../public/images/course/course-advance-bn.png';

import SectionList from '../components/common/SectionList/index';
import { courseListBasic, courseListAdvance, courseDetailBasic, courseDetailAdvance } from '../constants/listData';

import SectionTitle from '../components/common/SectionTitle';
import TitleIcon from '../assets/images/user/title-icon.png';

class RoomPage extends Component {

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
      roomAction,
      token,
      match
    } = nextProps;

    const type = _.get(match, 'params.type');

    // roomAction.getClassroomList();

    // console.log('type', match, type);
    // if (type === 'basic' || type === 'advance') {
    //   courseAction.getCourseListByLevel(type);
    // } else if (type === 'detail') {
    //   courseAction.getCourseDetail(match.params.courseId, token);
    // } else if (type === 'search') {
    //   courseAction.searchCourse(match.params.courseId);
    // }
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

  changeRoomValue() {

  }

  startRoom() {
    console.log('start');
  }

  editRoom() {
    console.log('start');
  }

  deleteRoom() {
    console.log('start');
  }
  cancelRoomEdit() {
    console.log('cancel');
  }


  render() {
    const {
      match,
      courseList,
      courseDetail,
      searchResult,
      addClassroom
    } = this.props;
    const courseType = _.get(match, 'params.type');

    // console.log('match', match);

    const tempData = [
      {
        "id": "default",
        "name": "Public Course",
        "public": true,
        "teachers": [
          "teacher1@gmail.com",
          "teacher2@nchc.org.tw"
        ]
      }, {
        "id": "default",
        "name": "Public Course",
        "public": true,
        "teachers": [
          "teacher1@gmail.com",
          "teacher2@nchc.org.tw"
        ]
      },
    ];

    return (
      <div className="classroom-bg">
        <Switch>

          {/* 教室列表 */}
          <Route path="/classroom-manage/list">
            <CommonPageContent
              className="room-page-bg"
              pageTitle="教室管理"
            >
              <Link to="/classroom-manage/create" className="fl add-btn-con">
                <button className="add-btn btn-pair" color="success">新增教室</button>
              </Link>

              <TableList
                data={tempData}
                prefixUrl="/classroom-manage/detail/"
                tableData={roomData}
                isDialogOpen={true}
                startMethod={this.startRoom}
                editMethod={this.editRoom}
                deleteMethod={this.deleteRoom}
              />
            </CommonPageContent>
          </Route>

          {/* 教室細項 */}
          <Route exact path="/classroom-manage/detail/:courseId">
            <CommonPageContent
              className="room-page-bg"
              pageTitle="教室細項"
            >

              <CourseDetail
                detail={courseDetail}
                submitMethod={this.startCourse}
                cancelEdit={this.backFromCourseDetail}
                isBanner={false}
              />
            </CommonPageContent>
          </Route>

          {/* 教室新建 */}
          <Route path="/classroom-manage/create">
            <CommonPageContent
              className="room-page-bg"
              pageTitle="新增教室"
            >

              <Form
                model="forms.profile"
                className="signup-form-comp"
                onSubmit={formData => onSubmit(formData)}
              >
                <div className="row-01">
                  <FormGroups
                    formData={addRoomForm}
                    targetForm={addClassroom}
                    changeVal={this.changeRoomValue}
                  />
                </div>

                <FormButtons
                  cancelName="回課程列表"
                  submitName="修改"
                  backMethod={this.cancelRoomEdit}
                  isForm
                />
              </Form>

            </CommonPageContent>
          </Route>

          {/* 教室編輯 */}
          <Route exact path="/classroom-manage/edit/:courseId">

          </Route>
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = ({ Auth, Course, forms }) => ({
  addClassroom: forms.addClassroom,
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
)(RoomPage);
