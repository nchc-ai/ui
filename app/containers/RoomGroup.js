import React, { Component } from 'react';
import { Switch, Route, withRouter, Link } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import { notify } from 'react-notify-toast';
import Progress from 'react-progress-2';
import { Form, actions as formActions } from 'react-redux-form';
import bindActionCreatorHoc from '../libraries/bindActionCreatorHoc';
import DataFrame from '../components/common/DataFrame/index';
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
      token
    } = nextProps;
    if (token) {
      roomAction.getPublicClassrooms(token);
    } else {
      notify.show('您 token 有誤，請重新登入', 'error', 1800);
      nextProps.history.push('/login');
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
          <ClassroomGroup
            classrooms={roomList.data}
            startCourse={this.startCourse}
            seditCourse={this.editCourse}
            deleteCourse={this.deleteCourse}
          />
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
