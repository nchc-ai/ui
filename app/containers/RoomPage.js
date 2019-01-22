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
      nextProps.resetForm('classroom');
      this.fetchData(nextProps);
    }
  }

  componentWillUnmount() {
    this.props.resetForm('classroom');
  }

  fetchData = (nextProps) => {
    const {
      roomAction,
      userInfo,
      token,
      match
    } = nextProps;
    if (/(edit|detail)/.test(match.params.action)) {
      roomAction.getClassroomDetail({
        token,
        id: match.params.roomId,
        onSuccess: this.initializeEditForm
      });
    } else if (match.params.action === 'list') {
      roomAction.getPublicClassrooms({ token });
    }
  }

  /**
   * Initialize edit form for classroom.
   * @param {Object} classroom Classroom object for initialization.
   */
  initializeEditForm = (classroom) => {

    const initialData = {
      ...classroom,
      courses: [],
      teachers: [],
      students: []
    }

    this.props.changeForm(initialData, 'classroom');
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

  /**
   * List - Called when clicking edit buttton of table list drawer.
   * @param {Object} e Event target.
   * @param {Object} datum One assigned datum in table list.
   */
  editClassroom = (e, datum) => {
    this.props.history.push(`/user/classroom-manage/edit/${datum.id}`)
  }

  /**
   * List - Called when clicking delete buttton of table list drawer.
   * @param {Object} e Event target.
   * @param {Object} datum One assigned datum in table list.
   */
  deleteClassroom = (e, datum) => {
    const {
      roomAction,
      token
    } = this.props;

    roomAction.deleteClassroom({ token, id: datum.id, onSuccess: this.onDeleteClassroomSuccess });
  }

  onDeleteClassroomSuccess = () => {
    this.fetchData(this.props);
  }


  /**
   * Edit - Called when clicking return buttton in room edit page.
   */
  onCommonBackMethod = () => {
    this.props.history.push(`/user/classroom-manage/list`)
  }

  onFileSelected = (event) => {
   console.log('onFileSelected', event, event.target);
  }

  uploadStudentCSV = (file) => {
    console.log('uploadStudentCSV');
  }

  /**
   * Edit - List course tags for the form of classroom.
   */
  // 教室課程
  loadCourseTagsCreateRoom = () => this.props.roomAction.loadCourseTagsForRoomCreate(this.props.token);
  // 上課老師
  loadTeacherTagsCreateRoom = () => this.props.roomAction.loadTeacherTagsForRoomCreate(this.props.token);
  // 學生
  loadStudentTagsCreateRoom = () => this.props.roomAction.loadStudentTagsForRoomCreate(this.props.token);

  onCreateClassroomSubmit = (formData) => {
    const {
      roomAction,
      token,
      userInfo
    } = this.props;

    console.log('form', formData)

    const courses =_.get(formData, 'courses', []).map(d => d.value);
    const students = _.get(formData, 'students', []).map(d => d.value);
    const teachers = _.get(formData, 'teachers', []).map(d => d.value);

    const modifiedData = {
      ...formData,
      courses,
      students,
      teachers
    }

    roomAction.createClassroom({
      token,
      userInfo,
      formData: modifiedData,
      next: this.onCreateClassroomSuccess
    });

    Progress.show();
  }

  onCreateClassroomSuccess = () => {
    this.props.history.push('/user/classroom-manage/list');
    notify.show('新建教室成功', 'success', 1800);
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
                editMethod={this.editClassroom}
                deleteMethod={this.deleteClassroom}
                actionMode="edit_delete"
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
                  cancelName="回教室管理"
                  submitName="開始上課"
                  backMethod={this.onCommonBackMethod}
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
                onSubmit={formData => this.onCreateClassroomSubmit(formData)}
              >
                {/* name | description | schedules | courses */}
                <FormGroups
                  targetForm={forms.classroom}
                  formData={classroomFormOne}
                  changeVal={changeValue}
                  loadTagsOptsMethod={this.loadCourseTagsCreateRoom}
                />

                {/* teachers | students */}
                <FormGroups
                  targetForm={forms.classroom}
                  formData={classroomFormTwo}
                  changeVal={changeValue}
                  onFileChange={this.onFileSelected}
                  loadTagsOptsMethod={this.loadTeacherTagsCreateRoom}
                  handleUpload={this.uploadStudentCSV}
                />

                <FormButtons
                  cancelName="回教室管理"
                  submitName="建立教室"
                  backMethod={this.onCommonBackMethod}
                  isForm
                />
              </Form>

            </CommonPageContent>
          </Route>

          {/* 教室編輯 */}
          <Route exact path="/user/classroom-manage/edit/:courseId">
            <CommonPageContent
              className="room-page-bg"
              pageTitle="編輯教室"
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

                <FormButtons
                  cancelName="回教室管理"
                  submitName="修改此教室"
                  backMethod={this.onCommonBackMethod}
                  isForm
                />
              </Form>
            </CommonPageContent>
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
  loading: Classroom.publicList.isLoading,
  roomList: Classroom.publicList.data,
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
