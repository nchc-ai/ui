import React, { Component } from 'react';
import { Switch, Route, withRouter, Link } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import { notify } from 'react-notify-toast';
import Progress from 'react-progress-2';
import { Value } from 'slate';
import { actions as formActions, Form } from 'react-redux-form';
import { ongoingCourseData } from '../constants/tableData';
import { courseConForm, courseVMFormOne, courseVMFormTwo, courseVMFormThree } from '../constants/formsData';
import bindActionCreatorHoc from '../libraries/bindActionCreatorHoc';
import CourseDetail from '../components/Course/CourseDetail';
import TableList from '../components/common/TableList';
import FormGroups from '../components/common/FormGroups/index';
import FormButtons from '../components/common/FormButtons/index';
import FormCourseEdit from '../components/FormCourseEdit';
import CommonPageContent from '../components/CommonPageContent';

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

class CoursePage extends Component {

  state = {
    mdValueVM: initialMdValue
  }

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

    courseAction.getCourseListVM(userInfo.username, token);
    courseAction.getCourseListCon(userInfo.username, token);
    // TODO: 要 merge 成一起的 list

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
  
  onSubmitCourseSuccessCommon = () => {
    Progress.hide();
    this.fetchData(this.props);
    this.props.history.push('/user/ongoing-course/list');
  }

  // 新建 container 課程 cb

  handleSubmitCreateCon = (formData) => {
    const {
      courseAction,
      token,
      userInfo
    } = this.props;
    
    courseAction.submitCourseContainer(
      token,
      userInfo,
      formData,
      this.onSubmitCourseSuccessCommon
    );

    Progress.show();

    // TODO: 須送出 loading 時 disable submit button
  } 

  loadOptsMethodCreateCon = () => this.props.courseAction.getConImagesOpts(this.props.token)
  loadTagsOptsMethodCreateCon = () => this.props.courseAction.getConDatasetsOpts(this.props.token)
  
  // 新建 VM 課程 cb
  handleSubmitCreateVM = (formData) => {
    const {
      courseAction,
      token,
      userInfo
    } = this.props;
    
    courseAction.submitCourseVM(
      token,
      userInfo,
      formData,
      this.onSubmitCourseSuccessCommon
    );

    Progress.show();

    // TODO: 須送出 loading 時 disable submit button
  } 

  loadImagesOptsCreateVM = () => this.props.courseAction.getImagesOptsVM(this.props.token)
  loadFlavorsOptsCreateVM = () => this.props.courseAction.getFlavorsOptsVM(this.props.token)
  loadSshKeysOptsCreateVM = () => this.props.courseAction.getSshKeysOptsVM(this.props.token)

  // --------------------------------------------------------

  render() {
    const {
      match,
      forms,
      courseDetail,
      courseList,
      changeValue,
    } = this.props;
    const courseType = _.get(match, 'params.type');

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
                data={courseList}
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

              <div className="user-course-edit-bg">

                <Form
                  model={`forms.courseVM`}
                  className={`course-edit-comp`}
                  onSubmit={submitData => this.handleSubmitCreateVM(submitData)}
                  onSubmitFailed={submitData => this.handleSubmitFailedCommon(submitData)}
                >
                  {/* name | intro | level | image */}
                  <FormGroups
                    state={this.state.mdValueVM}
                    formData={courseVMFormOne}
                    targetForm={forms.courseVM}
                    changeVal={changeValue}
                    loadOptsMethod={this.loadImagesOptsCreateVM}
                  />

                  {/* flavor | associate */}

                  <FormGroups
                    formData={courseVMFormTwo}
                    targetForm={forms.courseVM}
                    changeVal={changeValue}
                    loadOptsMethod={this.loadFlavorsOptsCreateVM}
                  />

                  {/* extra port | ssh key | mount | volume */}
                  <FormGroups
                    formData={courseVMFormThree}
                    targetForm={forms.courseVM}
                    changeVal={changeValue}
                    loadOptsMethod={this.loadSshKeysOptsCreateVM}
                  />

                  {/* 下方按鈕 */}
                  <FormButtons
                    cancelName="上一頁"
                    submitName="儲存"
                    backMethod={this.backMethodCommon}
                    isForm
                  />

                </Form>

              </div>
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
  courseList: Course.courseCon.data,
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
