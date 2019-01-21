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
import { courseConForm, courseConFormTwo, courseVMFormOne, courseVMFormTwo, courseVMFormThree } from '../constants/formsData';
import { courseDetailList } from '../constants/listData'
import bindActionCreatorHoc from '../libraries/bindActionCreatorHoc';
import CustomJumbotron from '../components/common/CustomJumbotron/index';
import CourseDetail from '../components/Course/CourseDetail';
import TableList from '../components/common/TableList';
import ListView from '../components/common/ListView/index';
import FormGroups from '../components/common/FormGroups/index';
import FormButtons from '../components/common/FormButtons/index';
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
  // 啟動課程
  launchCourseJob = (e, data) => {
    const {
      jobAction,
      token,
      userInfo
    } = this.props;
    // Progress.show();
    jobAction.launchCourseJob({
      user: userInfo.username,
      courseId: data.id,
      token,
      next: () => this.onLaunchCourseJobSuccess()
    });
  }

  onLaunchCourseJobSuccess = () => {
    // Progress.hide();
    this.props.history.push('/user/job/list');
    notify.show('課程啟動成功', 'success', 1800);
  }

  editCourse = (e, datum) => {
    this.props.history.push(`/user/ongoing-course/detail/${datum.id}`)
  }

  deleteCourse = (e, datum) => {
    const {
      courseAction,
      token,
      userInfo
    } = this.props;
    courseAction.deleteCourseContainer({
      courseId: datum.id,
      token,
      next: () => this.onDeleteCourseSuccess()
    });
  }

  onDeleteCourseSuccess = () => {
    // Progress.hide();
    this.fetchData(this.props);
    notify.show('課程刪除成功', 'success', 1800);
  }

  // 共用 cb
  handleSubmitFailedCommon = (formData) => {
    notify.show('請確認是否填妥表單資料', 'error', 1800);
  }

  backMethodCommon = () => {
    this.props.history.goBack();
  }

  onSubmitCourseSuccessCommon = () => {
    // Progress.hide();
    this.fetchData(this.props);
    this.props.history.push('/user/ongoing-course/list');
    notify.show('課程建立成功', 'success', 1800);
  }

  /**
   * Called when clicking submit button to create container course.
   * @param {Object} formData - The required token for calling API.
   */
  handleSubmitCreateCon = (formData) => {
    const {
      courseAction,
      token,
      userInfo
    } = this.props;

    console.log('[formData]', formData);
    courseAction.createContainerCourse(
      token,
      userInfo,
      formData,
      this.onSubmitCourseSuccessCommon
    );

    // Progress.show();
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

    // Progress.show();

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
      isLoading,
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
                isLoading={isLoading}
                isDialogOpen={true}
                startMethod={this.launchCourseJob}
                editMethod={this.editCourse}
                deleteMethod={this.deleteCourse}
                actionMode="edit_delete"
              />

            </CommonPageContent>
          </Route>

          {/* [User] 課程細項 */}
          <Route exact path="/user/ongoing-course/detail/:courseId">
            <CommonPageContent
              className="profile-page-bg"
              pageTitle="課程細項"
            >
              <CustomJumbotron
                tag={_.get(courseDetail, 'level')}
                title={_.get(courseDetail, 'name')}
                sideTitle={`開課講師：${_.get(courseDetail, 'user')}`}
                info={_.get(courseDetail, 'introduction')}
              />

              <ListView
                data={courseDetailList(courseDetail)}
              />


              <hr className="my-2" />

              {/* 下方按鈕 */}
              {/* TODO: 需在這判斷是否有開過課程決定submitName */}
              <FormButtons
                cancelName="上一頁"
                submitName="開始課程"
                backMethod={this.backFromCourseDetail}
                nextMethod={this.startCourse}
              />
            </CommonPageContent>
          </Route>

          {/* [User] 新建 container 課程 */}
          <Route exact path="/user/ongoing-course/create/container">
            <CommonPageContent
              className="profile-page-bg"
              pageTitle="新建容器課程"
            >
              <div className="user-course-edit-bg">

                <Form
                  model={`forms.courseCon`}
                  className={`course-edit-comp`}
                  onSubmit={submitData => this.handleSubmitCreateCon(submitData)}
                  onSubmitFailed={submitData => this.handleSubmitFailedCommon(submitData)}
                >
                  {/* name | introduction | level | image | GPU | datasets */}
                  <FormGroups
                    formData={courseConForm}
                    targetForm={forms.courseCon}
                    changeVal={changeValue}
                    loadOptsMethod={this.loadOptsMethodCreateCon}
                    loadTagsOptsMethod={this.loadTagsOptsMethodCreateCon}
                  />

                  {/* accessType | port | writablePath */}
                  <FormGroups
                    formData={courseConFormTwo}
                    targetForm={forms.courseCon}
                    changeVal={changeValue}
                    loadOptsMethod={this.loadOptsMethodCreateCon}
                    loadTagsOptsMethod={this.loadTagsOptsMethodCreateCon}
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
                    targetForm={forms.courseVM}
                    formData={courseVMFormOne}
                    changeVal={changeValue}
                    loadOptsMethod={this.loadImagesOptsCreateVM}
                  />

                  {/* flavor | associate */}

                  <FormGroups
                    targetForm={forms.courseVM}
                    formData={courseVMFormTwo}
                    changeVal={changeValue}
                    loadOptsMethod={this.loadFlavorsOptsCreateVM}
                  />

                  {/* extra port | ssh key | mount | volume */}
                  <FormGroups
                    targetForm={forms.courseVM}
                    formData={courseVMFormThree}
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

const mapStateToProps = ({ forms, Auth, Role, Course }) => ({
  forms,
  token: Auth.token,
  userInfo: Role.isSubstituating ? Role.userInfo : Auth.userInfo,
  isLoading: Course.courseCon.isLoading,
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
