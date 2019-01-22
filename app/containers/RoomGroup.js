import React, { Component } from 'react';
import { Switch, Route, withRouter, Link } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import { notify } from 'react-notify-toast';
import Progress from 'react-progress-2';
import TableList from '../components/common/TableList';
import { Form, actions as formActions } from 'react-redux-form';
import bindActionCreatorHoc from '../libraries/bindActionCreatorHoc';
import DataFrame from '../components/common/DataFrame/index';
import CommonPageContent from '../components/CommonPageContent'
import { classroomGroupData } from '../constants/tableData';

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
      userInfo
    } = nextProps;
    if (token) {
      roomAction.getClassroomList({ token, userInfo, next: this.onGetClassroomListDone });
    } else {
      notify.show('您 token 有誤，請重新登入', 'error', 1800);
    }
  }
  onGetClassroomListDone = (isSuccess) => {
    if (isSuccess) {
      console.log('fail');
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
      addClassroom,
      roomList
    } = this.props;
    const courseType = _.get(match, 'params.type');

    return (
      <CommonPageContent
        className="role-page-bg"
        pageTitle="教室列表"
      >
        <DataFrame
          isLoading={roomList.isLoading}
          data={roomList.data}
          cols={8}
        >
        <div className="classroom-group-comp">
          {
            roomList.data.map((classroom, index) => (
              <div key={index} className="classroom-card">
                <div className="classroom-info">
                  <h3 className="classroom-name">{classroom.name}</h3>
                  <h5 className="classroom-teachers">
                    <span>老師：</span>
                    {
                      _.get(classroom,'teachers', []).length > 0 ?
                        classroom.teachers.map((teacher, index) => (
                          <span key={index}>{index !== 0 ? " , " : ""} {teacher}</span>
                        ))
                        : '暫無安排'
                    }
                  </h5>
                  <h5>學生人數：{classroom.studentCount}</h5>
                </div>
                <div className="course-list">
                  {
                    classroom.courseInfo ?
                      <TableList
                        data={classroom.courseInfo}
                        tableData={classroomGroupData}
                        isLoading={false}
                        isDialogOpen={true}
                        startMethod={this.startCourse}
                        editMethod={this.editCourse}
                        deleteMethod={this.deleteCourse}
                        actionMode="start_only"
                      />
                    : null
                  }
                </div>
              </div>
            ))
          }
        </div>
        </DataFrame>
      </CommonPageContent>
    );
  }
}

const mapStateToProps = ({ Auth, Role, Course, forms, Classroom }) => ({
  addClassroom: forms.addClassroom,
  token: Auth.token,
  userInfo: Role.isSubstituating ? Role.userInfo : Auth.userInfo,
  courseList: Course.courseList.data,
  courseDetail: Course.courseDetail.data,
  searchResult: Course.searchResult.data,
  roomList: {
    isLoading: Classroom.list.isLoading,
    data: Classroom.list.data
  }
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
