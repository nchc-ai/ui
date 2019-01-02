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
import { roomData } from '../constants/tableData';
import bindActionCreatorHoc from '../libraries/bindActionCreatorHoc';
import CommonPageContent from '../components/CommonPageContent';
import FormGroups from '../components/common/FormGroups/index';
import FormButtons from '../components/common/FormButtons/index';
import TableList from '../components/common/TableList';
import { classroomFormOne, classroomFormTwo, classroomFormThree } from '../constants/formsData';

class RoomPage extends Component {

  componentWillMount() {
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
      userInfo,
      token,
      match
    } = nextProps;

    const type = _.get(match, 'params.type');
    roomAction.getClassroomList(userInfo.username, token);
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
  // TODO: 
  loadCourseTagsCreateRoom = () => {

  }

  loadTeacherTagsCreateRoom = () => {

  }

  loadStudentTagsCreateRoom = () => {

  }

  render() {
    const {
      forms,
      match,
      loading,
      roomList,
      courseDetail,
      searchResult,
      addClassroom,
      list
    } = this.props;
    const courseType = _.get(match, 'params.type');
    console.log('loading', loading);
    // console.log('match', match);
    return (
      <div className="classroom-bg">
        <Switch>

          {/* 教室列表 */}
          <Route exact path="/user/classroom-manage/list">
            <CommonPageContent
              className="room-page-bg"
              pageTitle="教室管理"
            >
              <Link to="/user/classroom-manage/create" className="fl add-btn-con">
                <button className="add-btn btn-pair" color="success">新增教室</button>
              </Link>

              <TableList
                data={roomList}
                prefixUrl="/user/classroom-manage/detail/"
                tableData={roomData}
                isLoading={loading}
                isDialogOpen={true}
                startMethod={this.startRoom}
                editMethod={this.editRoom}
                deleteMethod={this.deleteRoom}
                isAdmin
              />
            </CommonPageContent>
          </Route>

          {/* 教室細項 */}
          <Route exact path="/user/classroom-manage/detail/:courseId">
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
          <Route path="/user/classroom-manage/create">
            <CommonPageContent
              className="room-page-bg"
              pageTitle="新增教室"
            >

              <Form
                model="forms.profile"
                className="signup-form-comp"
                onSubmit={formData => onSubmit(formData)}
              >

                <FormGroups
                  targetForm={forms.classroom}
                  formData={classroomFormOne}
                  changeVal={this.changeRoomValue}
                  loadTagsOptsMethod={this.loadCourseTagsCreateRoom}
                />

                <FormGroups
                  targetForm={forms.classroom}
                  formData={classroomFormTwo}
                  changeVal={this.changeRoomValue}
                  loadTagsOptsMethod={this.loadTeacherTagsCreateRoom}
                />

                <FormGroups
                  targetForm={forms.classroom}
                  formData={classroomFormThree}
                  changeVal={this.changeRoomValue}
                  loadTagsOptsMethod={this.loadStudentTagsCreateRoom}
                />


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
          <Route exact path="/user/classroom-manage/edit/:courseId">

          </Route>
        </Switch>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  resetForm: (formName) => dispatch(formActions.reset(
    `forms.${formName}`
  )),
  changeValue: (value, key, formName) => dispatch(formActions.change(
    `forms.${formName}.${key}`,
    value
  )),
  changeForm: (formObj, formName) => dispatch(formActions.change(
    `forms.${formName}`,
    formObj
  ))
});

const mapStateToProps = ({ forms, Auth, Course, Classroom }) => ({
  forms,
  loading: Classroom.list.isLoading,
  roomList: Classroom.list.data,
  addClassroom: forms.addClassroom,
  token: Auth.token,
  userInfo: Auth.userInfo,
  courseList: Course.courseList.data,
  courseDetail: Course.courseDetail.data,
  searchResult: Course.searchResult.data
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  bindActionCreatorHoc,
  withRouter
)(RoomPage);
