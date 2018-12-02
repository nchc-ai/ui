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
import FormCourseEdit from '../components/FormCourse';
import CommonPageContent from '../components/CommonPageContent';


class CoursePage extends Component {

  componentWillMount() {
    window.scrollTo(0, 0);
    this.fetchData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.url !== this.props.match.url) {
      window.scrollTo(0, 0);
      this.fetchData(nextProps);
    }
  }
  
  fetchData = (nextProps) => {
    const {
      courseAction,
      userInfo,
      token
    } = nextProps;

    courseAction.getCourseVMList(userInfo.username, token);
    courseAction.getCourseConList(userInfo.username, token);

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

  // 共用 cb
  handleSubmitFailedCommon = (formData) => {
    notify.show('請確認是否填妥表單資料', 'error', 1800);
  }

  backMethodCommon = () => {
    this.props.history.goBack();
  }
 
  // 新建 container 課程 cb

  handleSubmitCreateCon = (formData) => {
    // const {
    //   userAction,
    //   token,
    //   userInfo
    // } = this.props;
    // userAction.createCourse(token, userInfo, formData, this.onCreateCourseSuccess);

    // Progress.show();
  } 

  loadOptsMethodCreateCon = () => {

    // 載入 image options
    // const {
    //   userAction,
    //   token
    // } = this.props;
    // return userAction.getImagesOpts(token);
  };
 
  loadTagsOptsMethodCreateCon = () => {
    // const {
    //   userAction,
    //   token
    // } = this.props;
    // return userAction.getDatasetsOpts(token); 
  }

  onRadioChangeCreateCon = (e) => {
    console.log('[onRadioChangeCreateCon] val', e.target.value);
  }


  // 新建 VM 課程 cb

  handleSubmitCreateVM = (formData) => {
    // const {
    //   userAction,
    //   token,
    //   userInfo
    // } = this.props;
    // userAction.createCourse(token, userInfo, formData, this.onCreateCourseSuccess);

    // Progress.show();
  } 

  loadOptsMethodCreateVM = () => {

    // 載入 image options
    console.log('load images');
    // const {
    //   userAction,
    //   token
    // } = this.props;
    // return userAction.getImagesOpts(token);
  };
 
  loadTagsOptsMethodCreateVM = () => {
    // const {
    //   userAction,
    //   token
    // } = this.props;
    // return userAction.getDatasetsOpts(token); 
  }

  onRadioChangeCreateVM = (e) => {
    console.log('[onRadioChangeCreateCon] val', e.target.value);
  }


  // --------------------------------------------------------

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

          {/* [User] 新建 container 課程 */}
          <Route exact path="/user/ongoing-course/create/container">
            <CommonPageContent
              className="profile-page-bg"
              pageTitle="新建容器課程"
            >
              <FormCourseEdit
                formName="courseCon"
                targetForm={forms.courseCon}
                formData={courseConForm}
                changeVal={changeValue}
                handleSubmit={this.handleSubmitCreateCon}
                handleSubmitFailed={this.handleSubmitFailedCommon}
                loadOptsMethod={this.loadOptsMethodCreateCon}
                loadTagsOptsMethod={this.loadTagsOptsMethodCreateCon}
                onRadioChange={this.onRadioChangeCreateCon}
                onMdChange={this.onMdChangeCreateCon}
                backMethod={this.backMethodCommon}
              />
            </CommonPageContent>
          </Route>

          {/* [User] 新建 vm 課程 */}
          <Route exact path="/user/ongoing-course/create/vm">
            <CommonPageContent
              className="ongoing-course-bg"
              pageTitle="新建 VM 課程"
            >
              <FormCourseEdit
                formName="courseVM"
                targetForm={forms.courseVM}
                formData={courseVMForm}
                changeVal={changeValue}
                handleSubmit={this.handleSubmitCreateVM}
                handleSubmitFailed={this.handleSubmitFailedCommon}
                loadOptsMethod={this.loadOptsMethodCreateVM}
                loadTagsOptsMethod={this.loadTagsOptsMethodCreateVM}
                onRadioChange={this.onRadioChangeCreateVM}
                onMdChange={this.onMdChangeCreateVM}
                backMethod={this.backMethodCommon}
              />
            </CommonPageContent>
          </Route>

          {/* [User] 課程編輯 */}
          <Route exact path="/user/ongoing-course/edit/:courseId">
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
