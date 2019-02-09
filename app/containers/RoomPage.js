import React, { Component } from 'react';
import { Switch, Route, withRouter, Link } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Button } from 'reactstrap';
import { notify } from 'react-notify-toast';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import { Form, actions as formActions } from 'react-redux-form';
import CourseDetail from '../components/Course/CourseDetail';
import { roomData, courseInfoData } from '../constants/tableData';
import bindActionCreatorHoc from '../libraries/bindActionCreatorHoc';
import CommonPageContent from '../components/CommonPageContent';
import FormGroups from '../components/common/FormGroups/index';
import DetailGroups from '../components/common/DetailGroups/index';
import FormButtons from '../components/common/FormButtons/index';
import TableList from '../components/common/TableList';
import ListView from '../components/common/ListView/index';
import { classroomFrame } from '../constants/detailFrame';
import { classroomFormOne, classroomFormTwo, classroomFormThree } from '../constants/formsData';
import { classroomDetailTpl } from '../constants/listData';
import { decodeHtml } from '../libraries/utils';
import { setStudentsField } from '../actions/Classroom';

const TableContainer = styled.div`
  width: 550px;
`;



class RoomPage extends Component {

  componentWillMount () {
    window.scrollTo(0, 0);
    this.fetchData(this.props);
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.match.url !== this.props.match.url || nextProps.isSubstituating !== this.props.isSubstituating) {
      // window.scrollTo(0, 0);
      this.fetchData(nextProps);
    }
  }

  componentWillUnmount() {
    this.props.resetForm('classroom');
    this.props.resetForm('classroomCron');
  }

  fetchData = (nextProps) => {
    const {
      roomAction,
      userInfo,
      token,
      match
    } = nextProps;

    const action = _.get(nextProps, 'match.params.action', 'list');

    // reset student
    roomAction.resetStudentsField();


    if (/(edit|detail)/.test(action)) {
      roomAction.getClassroomDetail({
        token,
        id: match.params.roomId,
        onSuccess: this.initializeEditForm
      });
    } else if (action === 'list') {
      roomAction.getPublicClassrooms({ token });
    }
  }

  /**
   * Initialize edit data for classroom form.
   * @param {Object} classroom Classroom object for initialization.
   */
  initializeEditForm = () => {

    const {
      roomAction,
      changeForm,
      roomDetail
    } = this.props;

    const initialData = {
      ...roomDetail.data,
      courses: _.get(roomDetail, 'data.courseInfo', []).map(d => ({ label: d.name, value: d.id })),
      students: [],
      teachers: _.get(roomDetail, 'data.teachers', []),
      public: roomDetail.data.public ? { label: '是', value: true } : { label: '否', value: false },
    }

    const students = _.get(roomDetail, 'data.students', []).map((d, i) => ({ keyItem: d.label, valueItem: d.value })) || [];
    roomAction.setStudentsField({ students })

    changeForm(initialData, 'classroom');
  }

  startCourse = () => {
    const {
      userAction,
      token,
      userInfo,
      match
    } = this.props;

    // Progress.show();
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

  onClassroomSubmit = (formData, formType) => {
    const {
      roomAction,
      token,
      userInfo,
      students,
      roomDetail
    } = this.props;
    if (!students.isLoading) {
      if (formType === 'create') {
        roomAction.createClassroom({
          token,
          students: students.data,
          formData,
          next: this.onClassroomSubmitSuccess
        });
      } else {
        roomAction.updateClassroom({
          token,
          students: students.data,
          formData,
          next: this.onClassroomSubmitSuccess
        });
      }
    } else {
      notify.show("目前還未存取學生清單，請稍候再送出表單", 'error', 1800);
    }
    // Progress.show();
  }

  onClassroomSubmitSuccess = (formType) => {
    const {
      history,
      roomAction,
      resetForm
    } = this.props;

    history.push('/user/classroom-manage/list');
    notify.show(`${formType === 'create' ? '新建' : '更新'}教室成功`, 'success', 1800);

    // reset form
    resetForm();
    roomAction.resetStudentsField();
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
              pageTitle={_.get(roomDetail, 'data.name', '')}
            >
              {/* description */}
              <ReactMarkdown source={_.get(roomDetail, 'data.description')} />

              {/* course */}
              <TableContainer>
                <TableList
                  data={_.get(roomDetail, 'data.courseInfo', [])}
                  tableData={courseInfoData}
                />
              </TableContainer>

              {/* status | scedule | studentCount | teachers */}
              <ListView
                templateData={classroomDetailTpl}
                detailData={roomDetail.data}
                isLoading={roomDetail.isLoading}
              />

              <hr className="my-2" />

              {/* 下方按鈕 */}
              {/* TODO: 需在這判斷是否有開過課程決定submitName */}
              <FormButtons
                cancelName="回教室管理"
                submitName="開始課程"
                backMethod={this.onCommonBackMethod}
                showMode="submit_back"
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
                model="forms.classroom"
                className="room-create-form-comp"
                onSubmit={formData => this.onClassroomSubmit(formData, 'create')}
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
                  showMode="submit_back"
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
                onSubmit={formData => this.onClassroomSubmit(formData, 'update')}
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
                  showMode="submit_back"
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
  roomDetail: {
    data: Classroom.detail.data,
    isLoading: Classroom.detail.isLoading
  },
  students: {
    data: Classroom.students.data,
    isLoading: Classroom.students.isLoading
  },
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
