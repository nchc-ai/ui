import React, { Component } from 'react';
import { Switch, Route, withRouter, Link } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import { notify } from 'react-notify-toast';
import Progress from 'react-progress-2';
import { Value } from 'slate';
import { actions as formActions } from 'react-redux-form';
import { ongoingCourseData } from '../constants/tableData';
import { courseConForm, courseVMForm } from '../constants/formsData';
import bindActionCreatorHoc from '../libraries/bindActionCreatorHoc';
import CourseDetail from '../components/Course/CourseDetail';
import TableList from '../components/common/TableList';
import CourseEdit from '../components/User/CourseEdit';
import SectionTitle from '../components/common/SectionTitle';
import TitleIcon from '../assets/images/user/title-icon.png';
import CommonPageContent from '../components/CommonPageContent';

const quillObj = Value.fromJSON({
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
class CoursePage extends Component {

  state = {
    quillObj
  }

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
      courseAction,
      userInfo,
      token,
      match
    } = nextProps;

    const type = _.get(match, 'params.type');

    courseAction.getCourseVMList(userInfo.username, token);
    courseAction.getCourseConList(userInfo.username, token);


    // console.log('type', match, type);
    // if (type === 'basic' || type === 'advance') {
    //   courseAction.getCourseListByLevel(type);
    // } else if (type === 'detail') {
    //   courseAction.getCourseDetail(match.params.courseId, token);
    // } else if (type === 'search') {
    //   courseAction.searchCourse(match.params.courseId);
    // }
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


  // 共用
  handleSubmitFailed = (formData) => {
    notify.show('請確認是否填妥表單資料', 'error', 1800);
  }


  // 新建容器課程

  handleCreateCourse = (formData) => {
    // console.log('[handleSubmit] submit', formData);

    const {
      userAction,
      token,
      userInfo
    } = this.props;
    userAction.createCourse(token, userInfo, formData, this.onCreateCourseSuccess);

    Progress.show();
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
  }


  backFromCourseAdd = () => {
    this.props.history.goBack();
  }


  // 新建 vm 課程



  render() {
    const {
      match,
      forms,
      courseDetail,
      addCourse,
      changeValue,
    } = this.props;
    const courseType = _.get(match, 'params.type');

    const tempData = [
      {
        "createAt": "2018-06-25T09:24:38Z",
        "datasets": [
          "cifar-10",
          "caltech256"
        ],
        "gpu": 1,
        "id": "49a31009-7d1b-4ff2-badd-e8c717e2256c",
        "image": "nginx:1.7.9",
        "introduction": "課程說明",
        "level": "basic",
        "name": "jimmy的課"
      }, {
        "createAt": "2018-06-25T09:24:38Z",
        "datasets": [
          "cifar-10",
          "caltech256"
        ],
        "gpu": 1,
        "id": "49a31009-7d1b-4ff2-badd-e8c717e2256c",
        "image": "nginx:1.7.9",
        "introduction": "課程說明",
        "level": "basic",
        "name": "jimmy的課"
      }
    ];

    return (
      <div className="course-bg">
        <Switch>
          {/* [User] 開課列表 */}
          <Route path="/user/ongoing-course/list">
            <CommonPageContent
              className="ongoing-course-bg"
              pageTitle="開課列表"
            >

              <Link to="/user/ongoing-course/create/container" className="fl add-btn-con">
                <button className="fl add-btn btn-pair" color="success">新增容器課程</button>
              </Link>

              <Link to="/user/ongoing-course/create/vm" className="fl add-btn-con" style={{ marginLeft: '10px' }}>
                <button className="fl add-btn btn-pair" color="success">新增 VM 課程</button>
              </Link>


              <TableList
                data={tempData}
                tableData={ongoingCourseData}
                isDialogOpen={true}
                startMethod={this.startCourse}
                editMethod={this.editCourse}
                deleteMethod={this.deleteCourse}
              />

            </CommonPageContent>
          </Route>

          {/* [User] 課程細項 */}
          <Route exact path="/user/ongoing-course/detail/:courseId">
            <CourseDetail
              detail={courseDetail}
              submitMethod={this.startCourse}
              cancelEdit={this.backFromCourseDetail}
            />
          </Route>

          {/* [User] 課程編輯 */}
          <Route exact path="/user/ongoing-course/edit/:courseId">
          </Route>


          {/* [User] 新建容器課程 */}
          <Route exact path="/user/ongoing-course/create/container">
            <CommonPageContent
              className="profile-page-bg"
              pageTitle="新建容器課程"
            >
              <CourseEdit
                handleSubmit={this.handleCreateCourse}
                handleSubmitFailed={this.handleSubmitFailed}
                state={this.state}
                formData={courseConForm}
                targetForm={forms.courseCon}
                changeVal={changeValue}
                loadOptsMethod={this.loadImagesOpts}
                loadTagsOptsMethod={this.loadTagsOpts}
                onRadioChange={this.changeCourseLevel}
                onMdChange={this.changeCourseIntro}
                backMethod={this.backFromCourseAdd}
              />
            </CommonPageContent>
          </Route>

          {/* [User] 新建 vm 課程 */}
          <Route exact path="/user/ongoing-course/create/vm">
            <CommonPageContent
              className="ongoing-course-bg"
              pageTitle="新建 VM 課程"
            >
              <CourseEdit
                handleSubmit={this.handleCreateCourse}
                handleSubmitFailed={this.handleSubmitFailed}
                state={this.state}
                formData={courseVMForm}
                targetForm={forms.courseVM}
                changeVal={changeValue}
                loadOptsMethod={this.loadImagesOpts}
                loadTagsOptsMethod={this.loadTagsOpts}
                onRadioChange={this.changeCourseLevel}
                onMdChange={this.changeCourseIntro}
                backMethod={this.backFromCourseAdd}
              />
            </CommonPageContent>
          </Route>

        </Switch>
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

const mapStateToProps = ({ forms, Auth, Course }) => ({
  forms,
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
)(CoursePage);
