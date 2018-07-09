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
import { jobs } from '../constants/tempData';
import { groupArray } from '../libraries/utils';
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
    } = nextProps;
    if (this.props.match !== match && match) {
      window.scrollTo(0, 0);
    }
  }

  fetchData = (nextProps) => {
    const {
      userAction,
      token,
      match
    } = nextProps;

    const part = _.get(match, 'params.part');
    const action = _.get(match, 'params.action');

    if (part === 'course' && action === 'add') {
      
    } else if (part === 'course' && action === 'edit') {
      
    } else if (part === 'course') {
      this.loadCourseList();
    } else if (part === 'job') {
      userAction.getJobList('jimmy', token);
    }

    window.scrollTo(0, 0);
  }

  // common

  loadCourseList = () => {
    const {
      userAction,
      token,
      userInfo
    } = this.props;

    userAction.getCourseList(userInfo, token);
  }

  // CourseList
  editCourse = (course) => {
    console.log('[editCourse] course', course);
  }

  deleteSuccess = () => {

    this.props.updateState({ open: !open });
    notify.show('課程刪除成功', 'success', 1800);
    Progress.hide();
    this.loadCourseList();
  }

  deleteCourse = (course) => {
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

  handleSubmitFailed = (formData) => {
    // console.log('[handleSubmitFailed] formData', formData);
    notify.show('請確認是否填妥表單資料', 'error', 1800);
  }

  loadTagsOpts = () => {
    const {
      userAction,
      token
    } = this.props;
    return userAction.getDatasetsOpts('jimmy', token);
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

  deleteJob = (e, thumb) => {
    const {
      token,
      userAction
    } = this.props;

    userAction.deleteJob(thumb.id, token);
  }

  render() {
    const {
      match,
      Course,
      addCourse,
      changeValue
    } = this.props;

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
              <CourseList
                data={Course.list}
                tableData={userCourseData}
                editMethod={this.editCourse}
                deleteMethod={this.deleteCourse}
              />
            </Route>

            {/* 新增課程 */}
            <Route exact path="/user/course/add">
              <CourseEdit
                handleSubmit={this.handleSubmit}
                handleSubmitFailed={this.handleSubmitFailed}
                state={this.state}
                formData={addCourseForm}
                targetForm={addCourse}
                changeVal={changeValue}
                loadTagsOptsMethod={this.loadTagsOpts}
                onRadioChange={this.changeCourseLevel}
                onMdChange={this.changeCourseIntro}
                backMethod={this.backFromCourseAdd}
              />
            </Route>

            {/* 編輯課程 */}
            <Route exact path="/user/course/edit/:courseId">
              <CourseEdit
                handleSubmit={this.handleSubmit}
                handleSubmitFailed={this.handleSubmitFailed}
                state={this.state}
                formData={addCourseForm}
                targetForm={addCourse}
                changeVal={changeValue}
                loadTagsOptsMethod={this.loadTagsOpts}
                onRadioChange={this.changeCourseLevel}
                onMdChange={this.changeCourseIntro}
                backMethod={this.backFromCourseEdit}
              />
            </Route>

            {/* 工作清單 */}
            <Route exact path="/user/job">
              <JobList
                data={jobs}
              />
            </Route>

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
  ))
});

const mapStateToProps = ({ Auth, User, forms }) => ({
  addCourse: forms.addCourse,
  token: Auth.token,
  userInfo: Auth.userInfo,
  Course: {
    loading: User.course.loading,
    list: User.course.data
  }
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  bindActionCreatorHoc,
  DialogHOC
)(UserPage);
