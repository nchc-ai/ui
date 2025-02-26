import React, { Component } from 'react';
import { Switch, Route, withRouter, Link } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import { notify } from 'components/common/NotifyToast';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import { Form, actions as formActions } from 'react-redux-form';
import { roomData, courseInfoData } from '../constants/tableData';
import bindActionCreatorHOC from '../libraries/bindActionCreatorHOC';
import CommonPageContent from '../components/CommonPageContent';
import FormGroups from '../components/common/FormGroups/index';
import { CronInputs } from 'components'
import FormButtons from '../components/common/FormButtons/index';
import TableList from '../components/common/TableList';
import ListView from '../components/common/ListView/index';
import { classroomFormOne, classroomFormTwo, cronFormData } from '../constants/formsData';
import { classroomDetailTpl } from '../constants/listData';
import bindProgressBarHOC from 'libraries/bindProgressBarHOC';
import bindDialogHOC from 'libraries/bindDialogHOC';
import * as dialogTypes from 'constants/dialogTypes';
import { TOAST_TIMING } from '../constants';
import Job from '../store/reducers/Job';


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
      this.resetForm();
      this.fetchData(nextProps);
    }
  }

  componentWillUnmount() {
    this.resetForm();
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
      roomDetail,
      match
    } = this.props;

    const initialData = {
      ...roomDetail.data,
      courses: _.get(roomDetail, 'data.courseInfo', []).map(d => ({ label: d.name, value: d.id })),
      students: _.get(roomDetail, 'data.students', []),
      schedule: _.get(roomDetail, 'data.schedule', {}),
      teachers: _.get(roomDetail, 'data.teachers', []),
      public: roomDetail.data.public ? { label: '是', value: true } : { label: '否', value: false },
    }
    const students = _.get(roomDetail, 'data.students', []).map((d, i) => ({ keyItem: d.label, valueItem: d.value })) || [];

    if (_.get(match,'params.action') !== 'create') {
      roomAction.setStudentsField({ students })
      changeForm(initialData, 'classroom');
    } else {
      this.resetForm();
    }
  }

  resetForm = () => {
    this.props.resetForm('classroom');
    this.props.resetForm('schedule');
  }

  backFromCourseDetail = (e) => {
    e.preventDefault();
    this.props.history.goBack();
  }

  changeRoomValue() {
  }

  onStudentsChange = (students, key, formName) => {

    const {
      changeValue,
      roomAction
    } = this.props;

    console.log('students', students);

    // change redux state
    roomAction.setStudentsField({ students });
    // change form
    // changeValue(students, key, formName);
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
      token,
      roomAction,
      startProgressBar,
      endPorgressBar,
      openCustomDialog,
      toggleDialog,
      status
    } = this.props;

    if (status.isDeleteClassroomLoading) {
      notify.show(`尚有課程刪除中，請稍後再試`, 'error', TOAST_TIMING);
      return;
    }

    openCustomDialog({
      type: dialogTypes.DELETE,
      title: '刪除教室',
      info: '請問確定要刪除此教室嗎？',
      submitMethod: () => {
        toggleDialog();
        startProgressBar();
        roomAction.deleteClassroom({
          token,
          id: datum.id,
          next: (isSuccess) => {
            endPorgressBar();
            this.fetchData(this.props);
            if (isSuccess) {
              notify.show('教室刪除成功', 'success', TOAST_TIMING);
            }
          }
        });
      },
      cancelMethod: () => {
        toggleDialog();
      }
    });
  }

  /**
   * Edit - Called when clicking return buttton in room edit page.
   */
  onCommonBackMethod = () => {
    this.props.history.push(`/user/classroom-manage/list`)
  }

  onFileSelected = (event) => {
  //  console.log('onFileSelected', event, event.target);
  }

  uploadStudentCSV = (file) => {
    // console.log('uploadStudentCSV');
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
      token,
      history,
      roomAction,
      resetForm,
      students,
      startProgressBar,
      endPorgressBar,
      openCustomDialog,
      toggleDialog,
      status
    } = this.props;

    // console.log('formData', formData);
    if (formData.schedule.cronFormat.length === 0) {
      notify.show(`此教室無時間格式無法建立（請確認是否已按下 "產生時間格式" 按鈕）`, 'error', TOAST_TIMING);
      return;
    } else if (formData.schedule.selectedType === 1 && formData.schedule.selectedOption.length === 0) {
      notify.show(`請確認是否填妥 "固定期間每週開課" 欄位`, 'error', TOAST_TIMING);
      return;
    } else if (status.isCreateClassroomLoading || status.isUpdateClassroomLoading) {
      notify.show(`尚有教室動作執行中，請稍後再試`, 'error', TOAST_TIMING);
      return;
    }
    console.log('formData', formData);
    openCustomDialog({
      type: dialogTypes.CREATE,
      title: `${formType === 'create' ? '建立' : '修改' }教室`,
      info: `請問確定要${formType === 'create' ? '建立' : '修改' }教室嗎？`,
      submitMethod: () => {
        toggleDialog();
        startProgressBar();

        if (!students.isLoading) {
          if (formType === 'create') {
            roomAction.createClassroom({
              token,
              formData,
              rawStudents: students.data,
              next: (formType, isSuccess) => {

                endPorgressBar();

                history.push('/user/classroom-manage/list');
                if (isSuccess){
                    notify.show(`${formType === 'create' ? '新建' : '更新'}教室成功`, 'success', TOAST_TIMING);
                }
                resetForm();
                roomAction.resetStudentsField();
              }
            });
          } else {
            roomAction.updateClassroom({
              token,
              formData,
              rawStudents: students.data,
              next: (formType,isSuccess) => {

                endPorgressBar();

                history.push('/user/classroom-manage/list');
                if (isSuccess) {
                    notify.show(`${formType === 'create' ? '新建' : '更新'}教室成功`, 'success', TOAST_TIMING);
                }
                resetForm();
                roomAction.resetStudentsField();
              }
            });
          }
        } else {
          notify.show("目前還未存取學生清單，請稍候再送出表單", 'error', TOAST_TIMING);
        }
      },
      cancelMethod: () => {
        toggleDialog();
      }
    });
  }

  render() {
    const {
      forms,
      match,
      loading,
      roomList,
      roomDetail,
      isSubstituating,
      changeValue,
      resetForm,
      status
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
                backMethod={this.onCommonBackMethod}
                showMode="back_only"
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
                {/* name | description | courses */}
                <FormGroups
                  targetForm={forms.classroom}
                  formData={classroomFormOne}
                  changeVal={changeValue}
                  loadTagsOptsMethod={this.loadCourseTagsCreateRoom}
                />

                {/* schedule */}
                <CronInputs
                  targetForm={forms.classroom.schedule}
                  template={cronFormData}
                  changeValue={changeValue}
                  resetForm={resetForm}
                />

                {/* teachers | students */}
                <FormGroups
                  targetForm={forms.classroom}
                  formData={classroomFormTwo}
                  changeVal={changeValue}
                  onFileListChange={this.onStudentsChange}
                  loadTagsOptsMethod={this.loadTeacherTagsCreateRoom}
                />

                <FormButtons
                  cancelName="回教室管理"
                  submitName="建立教室"
                  backMethod={this.onCommonBackMethod}
                  showMode="submit_back"
                  isLoading={status.isCreateClassroomLoading}
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
                {/* name | description | schedule | courses */}
                <FormGroups
                  targetForm={forms.classroom}
                  formData={classroomFormOne}
                  changeVal={changeValue}
                  loadTagsOptsMethod={this.loadCourseTagsCreateRoom}
                />

                {/* schedule */}
                <CronInputs
                  targetForm={forms.classroom.schedule}
                  template={cronFormData}
                  changeValue={changeValue}
                  resetForm={resetForm}
                />

                {/* teachers | students */}
                <FormGroups
                  targetForm={forms.classroom}
                  formData={classroomFormTwo}
                  changeVal={changeValue}
                  onFileListChange={this.onStudentsChange}
                  loadTagsOptsMethod={this.loadTeacherTagsCreateRoom}
                />

                <FormButtons
                  cancelName="回教室管理"
                  submitName="修改此教室"
                  backMethod={this.onCommonBackMethod}
                  showMode="submit_back"
                  isLoading={status.isUpdateClassroomLoading}
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
  changeValue: (value, key, formName) =>  dispatch(formActions.change(
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
  searchResult: Course.searchResult.data,
  status: {
    isCreateClassroomLoading: Classroom.status.isCreateClassroomLoading,
    isUpdateClassroomLoading: Classroom.status.isUpdateClassroomLoading,
    isDeleteClassroomLoading: Classroom.status.isDeleteClassroomLoading
  }
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  bindActionCreatorHOC,
  bindProgressBarHOC,
  bindDialogHOC,
  withRouter
)(RoomPage);
