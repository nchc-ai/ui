import React, { Component } from 'react';
import { Switch, Route, withRouter, Link } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import { notify } from 'react-notify-toast';
import TableList from '../components/common/TableList';
import ListView from '../components/common/ListView/index';
import { Form, actions as formActions } from 'react-redux-form';
import bindActionCreatorHoc from '../libraries/bindActionCreatorHoc';
import DataFrame from '../components/common/DataFrame/index';
import CommonPageContent from '../components/CommonPageContent'
import { classroomGroupData } from '../constants/tableData';
import { classroomGroupTpl } from '../constants/listData';

class RoomGroup extends Component {

  componentWillMount() {
    window.scrollTo(0, 0);
    this.fetchData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.url !== this.props.match.url) {
      window.scrollTo(0, 0);
      this.fetchData(nextProps);
    }
  }

  componentWillUnmount() {
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

  /**
   * Launch course job.
   * @param {Object} e - .
   * @param {Object} data - .
   */
  launchCourseJob = (e, data) => {
    const {
      jobAction,
      token,
      userInfo,
      myUserInfo
    } = this.props;
    // Progress.show();
    jobAction.launchCourseJob({
      user: myUserInfo.username,
      classroomId: data.roomId,
      courseId: data.id,
      token,
      next: () => this.onLaunchCourseJobSuccess()
    });
  }

  onLaunchCourseJobSuccess = () => {
    // Progress.hide();
    this.props.history.push('/user/job/list');
    notify.show('已發出啟動課程訊號', 'success', 1800);
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
                  <ListView
                    templateData={classroomGroupTpl}
                    detailData={classroom}
                  />
                </div>
                <div className="course-list">
                  {
                    classroom.courseInfo ?
                      <TableList
                        data={classroom.courseInfo}
                        tableData={classroomGroupData}
                        isLoading={false}
                        isDialogOpen={true}
                        startMethod={this.launchCourseJob}
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
  myUserInfo: Auth.userInfo,
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
