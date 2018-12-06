import React, { Component } from 'react';
import { Switch, Route, withRouter, Link } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Button } from 'reactstrap';
import { notify } from 'react-notify-toast';
import Progress from 'react-progress-2';
import { Value } from 'slate';
import { Form, actions as formActions } from 'react-redux-form';
import CourseDetail from '../components/Course/CourseDetail';
import { roomData } from '../constants/tableData';
import bindActionCreatorHoc from '../libraries/bindActionCreatorHoc';
import CommonPageContent from '../components/CommonPageContent';
import FormGroups from '../components/common/FormGroups/index';
import FormButtons from '../components/common/FormButtons/index';

import TableList from '../components/common/TableList';
import { classroomFormOne, classroomFormTwo, classroomFormThree } from '../constants/formsData';

const initialMdValue = Value.fromJSON({
  document: {
    nodes: [
      {
        kind: 'block',
        type: 'paragraph',
        nodes: [
          {
            kind: 'text',
            ranges: [
              {
                text: 'A line of text in a paragraph.'
              }
            ]
          }
        ]
      }
    ]
  }
});

class RoomPage extends Component {

  state = {
    mdValue: initialMdValue
  }

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
    console.log('userInfo', userInfo);
    roomAction.getClassroomList(userInfo.username, token);

    // console.log('type', match, type);
    // if (type === 'basic' || type === 'advance') {
    //   courseAction.getCourseListByLevel(type);
    // } else if (type === 'detail') {
    //   courseAction.getCourseDetail(match.params.courseId, token);
    // } else if (type === 'search') {
    //   courseAction.searchCourse(match.params.courseId);
    // }
  }

  // startCourse = () => {
  //   const {
  //     userAction,
  //     token,
  //     userInfo,
  //     match
  //   } = this.props;

  //   Progress.show();
  //   userAction.launchJob(userInfo.username, match.params.courseId, token, this.onStartClassSuccess);
  // }

  // onStartClassSuccess = () => {

  //   // console.log('create job success');
  //   Progress.hide();
  //   notify.show('新增工作成功', 'success', 1800);
  //   this.props.history.push('/user/job');
  // }


  // 新建 classroom 課程 cb

  handleSubmitCreateClassroom () {

  }

  handleSubmitFailed () {

  }


  loadCourseTagsRoomCreate = () => this.props.roomAction.loadCourseTagsRoomCreate(this.props.token)

  loadTeacherTagsRoomCreate = () => this.props.roomAction.loadTeacherTagsRoomCreate(this.props.token)

  loadStudentTagsRoomCreate = () => this.props.roomAction.loadStudentTagsRoomCreate(this.props.token)

  cancelRoomCreate () {

  }


  // -----------------
  backFromCourseDetail = (e) => {
    e.preventDefault();
    this.props.history.goBack();
  }



  render() {
    const {
      match,
      forms,
      roomList,
      courseDetail,
      searchResult,
      addClassroom,
      list
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
              <Link to="/user/classroom-manage/create" className="fl add-btn-con">
                <button className="add-btn btn-pair" color="success">新增教室</button>
              </Link>

              <TableList
                data={roomList}
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
                model="forms.classroom"
                className="create-classroom-comp"
                onSubmit={submitData => this.handleSubmitCreateClassroom(submitData)}
                onSubmitFailed={submitData => this.handleSubmitFailed(submitData)}
              >
                {/* name | description | schedules | courses */} 
                <FormGroups
                  state={this.state.mdValue}
                  targetForm={forms.classroom}
                  formData={classroomFormOne}
                  changeVal={this.changeValue}
                  loadTagsOptsMethod={this.loadCourseTagsRoomCreate}
                />

                {/* teachers */}
                <FormGroups
                  targetForm={forms.classroom}
                  formData={classroomFormTwo}
                  changeVal={this.changeValue}
                  loadTagsOptsMethod={this.loadTeacherTagsRoomCreate}
                />

                {/* students */}
                <FormGroups
                  targetForm={forms.classroom}
                  formData={classroomFormThree}
                  changeVal={this.changeValue}
                  loadTagsOptsMethod={this.loadStudentTagsRoomCreate}
                />
                
                <FormButtons
                  cancelName="回課程列表"
                  submitName="修改"
                  backMethod={this.cancelRoomCreate}
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


const mapStateToProps = ({ Auth, Course, forms, Classroom }) => ({
  forms,
  loading: Classroom.list.loading,
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
