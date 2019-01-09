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
import DetailGroups from '../components/common/DetailGroups/index';
import FormButtons from '../components/common/FormButtons/index';
import TableList from '../components/common/TableList';
import { classroomFrame } from '../constants/detailFrame';
import { classroomFormOne, classroomFormTwo, classroomFormThree } from '../constants/formsData';

class RoomPage extends Component {

  componentWillMount () {
    window.scrollTo(0, 0);
    this.fetchData(this.props);
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.match.url !== this.props.match.url || nextProps.isSubstituating !== this.props.isSubstituating) {
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
    if (match.params.action === 'detail') {
      roomAction.getClassroomDetail(match.params.roomId, token);
    } else if (match.params.action === 'list') {
      roomAction.getClassroomList(userInfo.username, token);
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
  // 教室課程
  loadCourseTagsCreateRoom = () => this.props.roomAction.loadCourseTagsForRoomCreate(this.props.token);
  // 上課老師
  loadTeacherTagsCreateRoom = () => this.props.roomAction.loadTeacherTagsForRoomCreate(this.props.token);
  // 學生
  loadStudentTagsCreateRoom = () => this.props.roomAction.loadStudentTagsForRoomCreate(this.props.token);

  handleSubmitClassroomCreate = (formData) => {
    const {
      roomAction,
      token,
      userInfo
    } = this.props;

    roomAction.createClassroom(
      token,
      userInfo,
      formData,
      this.onCreateClassroomSuccess
    );

    Progress.show();
  }

  onCreateClassroomSuccess = () => {
    console.log('success create');
  }

  cancelClassroomDetail = () => {

  }

  submitClassroomDetail = () => {

  }

  render() {
    const {
      forms,
      match,
      loading,
      roomList,
      roomDetail,
      isSubstituating,
      changeValue
    } = this.props;
    const courseType = _.get(match, 'params.type');
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
              {
                isSubstituating ?
                null :
                <Link to="/user/classroom-manage/create" className="fl add-btn-con">
                  <button className="add-btn btn-pair" color="success">新增教室</button>
                </Link>
              }

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
              <div className="classroom-detail-bg">

                <DetailGroups
                  frameData={classroomFrame}
                  detailData={{ roomDetail }}
                />

                <hr className="my-2" />

                <FormButtons
                  cancelName="上一頁"
                  submitName="開始上課"
                  backMethod={this.cancelClassroomDetail}
                  nextMethod={this.submitClassroomDetail}
                />
              </div>
            </CommonPageContent>
          </Route>

          {/* 教室新建 */}
          <Route path="/user/classroom-manage/create">
            <CommonPageContent
              className="room-page-bg"
              pageTitle="新增教室"
            >

              <Form
                model="forms.classroom"
                className="room-create-form-comp"
                onSubmit={formData => this.handleSubmitClassroomCreate(formData)}
              >

                <FormGroups
                  targetForm={forms.classroom}
                  formData={classroomFormOne}
                  changeVal={changeValue}
                  loadTagsOptsMethod={this.loadCourseTagsCreateRoom}
                />

                <FormGroups
                  targetForm={forms.classroom}
                  formData={classroomFormTwo}
                  changeVal={changeValue}
                  loadTagsOptsMethod={this.loadTeacherTagsCreateRoom}
                />

                <FormGroups
                  targetForm={forms.classroom}
                  formData={classroomFormThree}
                  changeVal={changeValue}
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

const mapStateToProps = ({ forms, Auth, Role, Course, Classroom }) => ({
  forms,
  loading: Classroom.list.isLoading,
  roomList: Classroom.list.data,
  roomDetail: Classroom.detail.data,
  addClassroom: forms.addClassroom,
  token: Auth.token,
  userInfo: Role.isSubstituating ? Role.userInfo : Auth.userInfo,
  isSubstituating: Role.isSubstituating,
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
