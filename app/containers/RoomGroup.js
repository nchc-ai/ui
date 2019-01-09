import React, { Component } from 'react';
import { Switch, Route, withRouter, Link } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import { notify } from 'react-notify-toast';
import Progress from 'react-progress-2';
import { Form, actions as formActions } from 'react-redux-form';
import bindActionCreatorHoc from '../libraries/bindActionCreatorHoc';
import TableList from '../components/common/TableList';
import CommonPageContent from '../components/CommonPageContent'
import ClassroomGroup from '../components/ClassroomGroup';

class RoomGroup extends Component {

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

    roomAction.getClassroomList();

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

  startCourse () {
    console.log('start course');
  }

  editCourse () {
    console.log('start course');
  }

  deleteCourse () {
    console.log('start course');
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

    const classRooms = [
      {
        "key": 1,
        "courseInfo": [
          {
            "createAt": "2018-06-25T09:24:38Z",
            "id": "49a31009-7d1b-4ff2-badd-e8c717e2256c",
            "level": "basic",
            "name": "jimmy的課"
          }, {
            "createAt": "2018-06-25T09:24:38Z",
            "id": "49a31009-7d1b-4ff2-badd-e8c717e2256c",
            "level": "basic",
            "name": "jimmy的課2"
          }
        ],
        "id": "default",
        "name": "Public Course",
        "public": true,
        "schedules": [
          "* * * * * *"
        ],
        "studentCount": 18,
        "teachers": [
          "teacher1@gmail.com",
          "teacher2@nchc.org.tw"
        ]
      }, {
        "key": 2,
        "courseInfo": [
          {
            "createAt": "2018-06-25T09:24:38Z",
            "id": "49a31009-7d1b-4ff2-badd-e8c717e2256c",
            "level": "basic",
            "name": "jimmy的課"
          }, {
            "createAt": "2018-06-25T09:24:38Z",
            "id": "49a31009-7d1b-4ff2-badd-e8c717e2256c",
            "level": "basic",
            "name": "jimmy的課2"
          }
        ],
        "id": "default",
        "name": "Public Course",
        "public": true,
        "schedules": [
          "* * * * * *"
        ],
        "studentCount": 18,
        "teachers": [
          "teacher1@gmail.com",
          "teacher2@nchc.org.tw"
        ]
      }
    ];

    return (
      <CommonPageContent
        className="role-page-bg"
        pageTitle="教室列表"
      >
        <ClassroomGroup
          classrooms={classRooms}
          startCourse={this.startCourse}
          seditCourse={this.editCourse}
          deleteCourse={this.deleteCourse}
        />
      </CommonPageContent>
    );
  }
}

const mapStateToProps = ({ Auth, Role, Course, forms }) => ({
  addClassroom: forms.addClassroom,
  token: Auth.token,
  userInfo: Role.isSubstituating ? Role.userInfo : Auth.userInfo,
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
)(RoomGroup);
