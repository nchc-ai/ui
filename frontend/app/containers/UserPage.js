import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Switch, Route } from 'react-router';
import { actions as formActions } from 'react-redux-form';
import { notify } from 'react-notify-toast';
import { Value } from 'slate';
import Progress from 'react-progress-2';


import bindActionCreatorHoc from '../libraries/bindActionCreatorHoc';
import { userCourseData } from '../constants/tableData';
import { addCourseForm } from '../constants/formsData';
import Profile from '../components/User/Profile';
import Password from '../components/User/Password';
import SideMenu from '../components/SideMenu/index';
import CourseList from '../components/User/CourseList';
import JobList from '../components/User/JobList';
import CourseEdit from '../components/User/CourseEdit';

import DialogHOC from '../HOC/DialogHOC';

const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        kind: 'block',
        type: 'paragraph',
        nodes: 1[
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

class UserPage extends Component {

  state = {
    value: initialValue
  }

  componentWillMount() {
    this.fetchData(this.props);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
   
  }


  componentWillReceiveProps(nextProps) {
    const {
      match,
      changeForm,
      initialEditProfile
    } = nextProps;
    if (this.props.match !== match && match) {
      window.scrollTo(0, 0);
      this.fetchData(nextProps);
    } else if (this.props.initialEditProfile !== initialEditProfile && initialEditProfile) {
      const newInitialEditProfile = {
        ...initialEditProfile,
        password: ''
      };

      console.log('newInitialEditProfile', newInitialEditProfile);
      changeForm(newInitialEditProfile, 'profile');
    }
  }

  fetchData = (props) => {

    const nextProps = props || this.props;


    const {
      authAction,
      userAction,
      token,
      match,
      userInfo
    } = nextProps;

    const part = _.get(match, 'params.part');
    const action = _.get(match, 'params.action');
    // console.log('part', part);
    if (part === 'course' && action === 'add') {
      // TODO:
    } else if (part === 'course' && action === 'edit') {
      // TODO:應在此先change forms 表單
      // 先load 此course資訊(courseDetail)> next > change到formsData裡
      // this.changeForm(formObj, addCourse)
    } else if (part === 'course') {
      this.loadCourseList();
    } else if (part === 'job') {
      userAction.getJobList(userInfo.username, token);
    } else if (part === 'profile') {
      authAction.getProfile(token);
    }

    window.scrollTo(0, 0);
  }

  // common

  loadCourseList = () => {
    const {
      userAction,
      courseAction,
      token,
      userInfo
    } = this.props;

    if (userInfo.role === 'teacher') {
      userAction.getCourseList(userInfo, token);
    } else {
      courseAction.getCourseListAll();
    }
  }

  handleSubmitFailed = (formData) => {
    // console.log('[handleSubmitFailed] formData', formData);
    notify.show('請確認是否填妥表單資料', 'error', 1800);
  }

  handleCancel = () => {
    this.props.history.push('/user/course');
  }

  // CourseList

  startCourse = (course) => {
    this.addJob('e', course.id);
  }

  editCourse = (course) => {
    this.props.history.push(`/user/course/edit/${course.id}`);
    // console.log('[editCourse] course', course);
  }

  deleteSuccess = () => {

    this.props.uiAction.closeDialog();
    notify.show('課程刪除成功', 'success', 1800);
    Progress.hide();
    this.loadCourseList();
  }

  deleteCourse = (course) => {


    const deleteRequest = {
      title: '確認訊息',
      info: `確定要刪除 ${course.name} 嗎？`,
      target: course,
      cancelText: '取消',
      cancelMethod: this.cancelCourseDelete,
      submitText: '確認',
      submitMethod: this.submitCourseDelete
    };
    this.props.uiAction.openDialog(deleteRequest);   
  }

  cancelCourseDelete = () => {
    this.props.uiAction.closeDialog();
  }

  submitCourseDelete = (course) => {

    const {
      userAction,
      token
    } = this.props;

    Progress.show();
    userAction.deleteCourse(course.id, token, this.deleteSuccess);
  }

  // CourseEdit

  redirect = () => {
    const {
      userAction,
      token,
      history,
      userInfo
    } = this.props;
    this.loadCourseList();
    history.push('/user/course');
  }

  handleSubmit = (formData) => {
    // console.log('[handleSubmit] submit', formData);

    const {
      userAction,
      token,
      userInfo
    } = this.props;

    userAction.createCourse(token, userInfo, formData, this.redirect);
  }



  loadImagesOpts = () => {
    const {
      userAction,
      token
    } = this.props;
    return userAction.getImagesOpts(token);
  };

  loadTagsOpts = () => {
    const {
      userAction,
      token
    } = this.props;
    return userAction.getDatasetsOpts(token);
  };

  changeCourseLevel = (e) => {
    console.log('[changeCourseLevel] val', e.target.value);
  }


  changeCourseIntro = ({ value }) => {
    this.setState({ value });
    console.log('[changeCourseIntro] value', value);
  }


  backFromCourseAdd = () => {
    this.props.history.goBack();
  }

  backFromCourseEdit = () => {
    this.props.history.goBack();
  }


  // Job

  addJob = (e, courseId) => {
    const {
      token,
      userInfo,
      userAction
    } = this.props;

    Progress.show();
    userAction.launchJob(userInfo.username, courseId, token, this.onAddJobSuccess);
  }

  onAddJobSuccess = () => {
    this.fetchData();
    Progress.hide();
    notify.show('工作新增成功', 'success', 1800);
    this.props.history.push('/user/job');
  }


  deleteJob = (e, thumb) => {
    const {
      token,
      userAction
    } = this.props;
    Progress.show();
    userAction.deleteJob(thumb.id, token, this.onDeleteJobSuccess);
  }

  onDeleteJobSuccess = () => {
    this.fetchData();
    Progress.hide();
    notify.show('工作刪除成功', 'success', 1800);
  }


    // Profile
  onProfileUpdateSuccess = () => { 
    notify.show('個人資料更新成功', 'success', 1800);
  }


  onProfileUpdate = (formData) => {
    const {
      authAction,
      token
    } = this.props;
    authAction.updateProfile(formData, token, this.onProfileUpdateSuccess);
  }

  onProfileCancel = () => {
    this.props.history.push('/user/course');
  }

  // Password
  onPasswordUpdateSuccess = () => { 
    notify.show('個人資料更新成功', 'success', 1800);
  }


  onPasswordUpdate = (formData) => {
    const {
      authAction,
      token
    } = this.props;
    authAction.updatePassword(formData, token, this.onPasswordUpdateSuccess);
  }

  onPasswordCancel = () => {
    this.props.history.push('/user/course');
  }

  render() {
    const {
      forms,
      match,
      courseAll,
      profile,
      Course,
      Job,
      addCourse,
      changeValue,
      userInfo
    } = this.props;

    const isAdmin = _.get(userInfo, 'role', false) === 'teacher';
    const listData = isAdmin ? Course.list : courseAll;
    // console.log("isTeacher", isTeacher);

    return (
      <div id="page-wrap" className="user-bg global-content">
        <div className="side-menu-wrap fl">
          <SideMenu
            match={match}
          />
        </div>
        <div className="fl user-container">
          <Switch>
            {/* 課程列表 */}
            <Route exact path="/user/course">
              <div>
                {
                  listData ?
                    <CourseList
                      data={listData}
                      tableData={userCourseData}
                      startMethod={this.startCourse}
                      editMethod={this.editCourse}
                      deleteMethod={this.deleteCourse}
                      isAdmin={isAdmin}
                      addJob={this.addJob}
                    /> : null
                }
                
                </div>
            </Route>

            {/* 新增課程 */}
            <Route exact path="/user/course/add">
              <CourseEdit
                title={'新增課程'}
                handleSubmit={this.handleSubmit}
                handleSubmitFailed={this.handleSubmitFailed}
                state={this.state}
                formData={addCourseForm}
                targetForm={addCourse}
                changeVal={changeValue}
                loadOptsMethod={this.loadImagesOpts}
                loadTagsOptsMethod={this.loadTagsOpts}
                onRadioChange={this.changeCourseLevel}
                onMdChange={this.changeCourseIntro}
                backMethod={this.backFromCourseAdd}
              />
            </Route>

            {/* 編輯課程 */}
            <Route exact path="/user/course/edit/:courseId">
              <CourseEdit
                title={'編輯課程'}
                handleSubmit={this.handleSubmit}
                handleSubmitFailed={this.handleSubmitFailed}
                state={this.state}
                formData={addCourseForm}
                targetForm={addCourse}
                changeVal={changeValue}
                loadOptsMethod={this.loadImagesOpts}
                loadTagsOptsMethod={this.loadTagsOpts}
                onRadioChange={this.changeCourseLevel}
                onMdChange={this.changeCourseIntro}
                backMethod={this.backFromCourseEdit}
              />
            </Route>

            {/* 工作清單 */}
            <Route exact path="/user/job">
              <JobList
                data={Job.list}
                addJob={this.addJob}
                deleteJob={this.deleteJob}
              />
            </Route>

            {/* 個人資料 */}
            <Route exact path="/user/profile">
              <Profile
                targetForm={forms.profile}
                changeValue={changeValue}
                onSubmit={this.onProfileUpdate}
                onSubmitFailed={this.handleSubmitFailed}
                cancelEdit={this.handleCancel}
                
              />
            </Route>

            {/* 密碼變更 */}
            <Route exact path="/user/password">
              <Password
                targetForm={forms.password}
                changeValue={changeValue}
                onSubmit={this.onPasswordUpdate}
                onSubmitFailed={this.handleSubmitFailed}
                cancelEdit={this.handleCancel}
                
              />
            </Route>

            {/* 修改個人資料 */}
            {/* <Route exact path="/user/profile/edit">
              <Profile
                targetForm={profile}
                changeValue={changeValue}
                onSubmit={this.onProfileUpdate}
                cancelEdit={this.onProfileCancel}
              />
            </Route> */}


          </Switch>
        </div>
        
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  resetForm: () => dispatch(formActions.reset('forms.addCourse')),
  changeValue: (value, key, target) => dispatch(formActions.change(
    `forms.${target}.${key}`,
    value
  )),
  changeForm: (formObj, target) => dispatch(formActions.change(
    `forms.${target}`,
    formObj
  ))
});

const mapStateToProps = ({ Auth, User, forms, Course }) => ({
  forms,
  profile: forms.profile,
  addCourse: forms.addCourse,
  token: Auth.token,
  userInfo: Auth.userInfo,
  Course: {
    loading: User.course.loading,
    list: User.course.data
  },
  Job: {
    loading: User.job.loading,
    list: User.job.data
  },
  courseAll: Course.courseAll.data,
  courseAllLoading: Course.courseAll.loading,
  initialEditProfile: Auth.profile
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  bindActionCreatorHoc,
  DialogHOC
)(UserPage);
