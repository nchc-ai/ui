import React, { Component } from 'react';
import { Switch, Route, withRouter, Link } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import { notify } from 'react-notify-toast';
import { Value } from 'slate';
import { actions as formActions, Form } from 'react-redux-form';
import { ongoingCourseData } from '../constants/tableData';
import { courseConForm, courseConFormTwo, courseVMFormOne, courseVMFormTwo, courseVMFormThree, courseVMFormFour, courseVMFormFive } from '../constants/formsData';
import { courseCONTAINERDetailTpl, courseVMDetailTpl } from '../constants/listData'
import bindActionCreatorHoc from '../libraries/bindActionCreatorHoc';
import CustomJumbotron from '../components/common/CustomJumbotron/index';
import CourseDetail from '../components/Course/CourseDetail';
import TableList from '../components/common/TableList';
import ListView from '../components/common/ListView/index';
import FormGroups from '../components/common/FormGroups/index';
import FormButtons from '../components/common/FormButtons/index';
import CommonPageContent from '../components/CommonPageContent';
import { COURSE_CONTAINER } from '../constants';
import { decodeHtml } from '../libraries/utils';
import { initialCourseConState, initialCourseVMState } from '../constants/initialState';

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

    const params = _.get(nextProps, 'match.params', {
      action: '',
      courseType: '',
      courseId: ''
    });

    this.resetBothForm(nextProps);

    if (/(detail)|(edit)/.test(params.action) && /(container)/.test(params.courseType)) {
      courseAction.getContainerCourseDetail({
        token,
        actionType: params.action,
        courseId: params.courseId,
        onSuccess: this.initializeEditForm
      });
    } else if (/(detail)|(edit)/.test(params.action) && /(vm)/.test(params.courseType)) {
      courseAction.getVMCourseDetail({
        token,
        actionType: params.action,
        courseId: params.courseId,
        onSuccess: this.initializeEditForm
      });
    } else if (params.action === 'list') {
      courseAction.getCourseListAll({
        token,
        user: userInfo.username
      });
    }
  }

  /**
   * Initialize edit data for classroom form.
   * @param {Object} course Classroom object for initialization.
   */
  initializeEditForm = ({ course, actionType, courseType }) => {
    // TODO: image and flavor
    // console.log('[initializeEditForm]', course, courseType);
    const confObj = {
      CONTAINER: {
        formName: 'courseCon',
        formData: {
          ...initialCourseConState,
          ...course,
          datasets: _.get(course,'datasets',[]).map(d => ({ label: d, value: d })),
          ports: _.get(course,'ports',[]).map(d => ({ keyItem: d.name, valueItem: d.port })),
          level: { value: course.level },
          accessType: { value: course.accessType }
        }
      },
      VM: {
        formName: 'courseVM',
        formData: {
          ...initialCourseVMState,
          ...course,
          level: { value: course.level },
          image: { value: course.image },
          flavor: { value: course.flavor },
          sshKey: { label: course.sshkey, value: course.sshkey },
        }
      }
    }

    if (actionType === 'edit') {
      // console.log('a,b', confObj[courseType].formData, courseType === confObj[courseType].formName);
      this.props.changeForm(confObj[courseType].formData, confObj[courseType].formName);
    } else {
      this.resetBothForm(this.props);
    }
  }

  /**
   * Launch course job.
   * @param {Object} e - .
   * @param {Object} data - .
   */
  launchCourseJob = (e, data) => {
    const {
      jobAction,
      token,
      userInfo
    } = this.props;
    // Progress.show();
    jobAction.launchCourseJob({
      user: userInfo.username,
      classroomId: '',
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
    this.props.history.push(`/user/ongoing-course/edit/${datum.id}/${datum.type.toLowerCase()}`)
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

  /**
   * Back to previous page when clicking cancel button.
   */
  backMethodCommon = () => {
    this.props.history.goBack();
  }

  resetBothForm = (nextProps) => {
    nextProps.resetForm('courseCon');
    nextProps.resetForm('courseVM');
  }

  onSubmitCourseFail = ({ actionType, courseType }) => {
    this.resetBothForm(this.props);
  }

  onSubmitCourseSuccess = ({ actionType, courseType }) => {
    // Progress.hide();
    const {
      history
    } = this.props;

    // reset all form
    this.resetBothForm(this.props);

    this.fetchData(this.props);
    this.props.history.push('/user/ongoing-course/list');

    const actionName = actionType === 'create' ? '建立' : '更新';
    notify.show(`課程${actionName}成功`, 'success', 1800);
  }

  /**
   * Container Course
   * Called when clicking submit button to create container course.
   * @param {Object} formData - The submit object.
   */
  onCourseSubmit = ({ submitData, actionType, courseType }) => {
    const {
      courseAction,
      token,
      userInfo
    } = this.props;

    if (courseType === 'container') {
      courseAction.submitContainerCourse({
        token,
        userInfo,
        submitData,
        actionType,
        onFail: this.onSubmitCourseFail,
        onSuccess: this.onSubmitCourseSuccess
      });
    } else if (courseType === 'vm') {
      courseAction.submitVMCourse({
        token,
        userInfo,
        submitData,
        actionType,
        onFail: this.onSubmitCourseFail,
        onSuccess: this.onSubmitCourseSuccess
      });
    }
  }

  loadOptsMethodCreateCon = () => this.props.courseAction.getConImagesOpts(this.props.token)
  loadTagsOptsMethodCreateCon = () => this.props.courseAction.getConDatasetsOpts(this.props.token)

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
          {/* [common] 開課列表 */}
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
                actionMode="full"
              />

            </CommonPageContent>
          </Route>

          {/* [container] 課程細項 */}
          <Route exact path="/user/ongoing-course/detail/:courseId/container">
            <CommonPageContent
              className="course-detail-bg"
              pageTitle={_.get(courseDetail, 'data.name', '')}
            >
              <h5 className="course-detail__intro">
                {decodeHtml(_.get(courseDetail, 'data.introduction', ''))}
              </h5>

              <ListView
                templateData={courseCONTAINERDetailTpl}
                detailData={courseDetail.data}
                isLoading={courseDetail.isLoading}
              />

              <hr className="my-2" />

              {/* 下方按鈕 */}
              {/* TODO: 需在這判斷是否有開過課程決定submitName */}
              <FormButtons
                cancelName="上一頁"
                submitName="開始課程"
                nextMethod={(e) => this.launchCourseJob(e, courseDetail.data)}
                backMethod={this.backMethodCommon}
                showMode="submit_back"
              />
            </CommonPageContent>
          </Route>

          {/* [vm] 課程細項 */}
          <Route exact path="/user/ongoing-course/detail/:courseId/vm">
            <CommonPageContent
              className="course-detail-bg"
              pageTitle={_.get(courseDetail, 'data.name', '')}
            >
              <h5 className="course-detail__intro">
                {decodeHtml(_.get(courseDetail, 'data.introduction', ''))}
              </h5>

              <ListView
                templateData={courseVMDetailTpl}
                detailData={courseDetail.data}
                isLoading={courseDetail.isLoading}
              />

              <hr className="my-2" />

              {/* 下方按鈕 */}
              {/* TODO: 需在這判斷是否有開過課程決定submitName */}
              <FormButtons
                cancelName="上一頁"
                submitName="開始課程"
                nextMethod={(e) => this.launchCourseJob(e, courseDetail.data)}
                backMethod={this.backMethodCommon}
                showMode="submit_back"
              />
            </CommonPageContent>
          </Route>

          {/* [container] 新建 container 課程 */}
          <Route exact path="/user/ongoing-course/create/container">
            <CommonPageContent
              className="profile-page-bg"
              pageTitle="新建容器課程"
            >
              <div className="user-course-edit-bg">

                <Form
                  model={`forms.courseCon`}
                  className={`course-edit-comp`}
                  onSubmit={submitData => this.onCourseSubmit({ submitData, actionType: 'create', courseType: 'container' })}
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
                    submitName="建立課程"
                    backMethod={this.backMethodCommon}
                    showMode="submit_back"
                    isForm
                  />

                </Form>
              </div>
            </CommonPageContent>
          </Route>

          {/* [vm] 新建 vm 課程 */}
          <Route exact path="/user/ongoing-course/create/vm">
            <CommonPageContent
              className="ongoing-course-bg"
              pageTitle="新建 VM 課程"
            >

              <div className="user-course-edit-bg">

                <Form
                  model={`forms.courseVM`}
                  className={`course-edit-comp`}
                  onSubmit={submitData => this.onCourseSubmit({ submitData, actionType: 'create', courseType: 'vm' })}
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

                  {/* flavor */}

                  <FormGroups
                    targetForm={forms.courseVM}
                    formData={courseVMFormTwo}
                    changeVal={changeValue}
                    loadOptsMethod={this.loadFlavorsOptsCreateVM}
                  />

                  {/* ssh key */}

                  <FormGroups
                    targetForm={forms.courseVM}
                    formData={courseVMFormThree}
                    changeVal={changeValue}
                    loadOptsMethod={this.loadSshKeysOptsCreateVM}
                  />

                  {/* associate */}

                  <FormGroups
                    targetForm={forms.courseVM}
                    formData={courseVMFormFour}
                    changeVal={changeValue}
                  />

                  {/* extra port | mount | volume */}
                  <FormGroups
                    targetForm={forms.courseVM}
                    formData={courseVMFormFive}
                    changeVal={changeValue}
                  />

                  {/* 下方按鈕 */}
                  <FormButtons
                    cancelName="上一頁"
                    submitName="建立課程"
                    backMethod={this.backMethodCommon}
                    showMode="submit_back"
                    isForm
                  />

                </Form>

              </div>
            </CommonPageContent>
          </Route>

          {/* [container] 課程編輯 */}
          <Route exact path="/user/ongoing-course/edit/:courseId/container">
            <CommonPageContent
              className="profile-page-bg"
              pageTitle={`編輯 ${_.get(courseDetail, 'data.name', '')}`}
            >
              <div className="user-course-edit-bg">

                <Form
                  model={`forms.courseCon`}
                  className={`course-edit-comp`}
                  onSubmit={submitData => this.onCourseSubmit({ submitData, actionType: 'update', courseType: 'container' })}
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
                    submitName="儲存編輯"
                    backMethod={this.backMethodCommon}
                    showMode="submit_back"
                    isForm
                  />

                </Form>
              </div>
            </CommonPageContent>
          </Route>

          {/* [vm] 課程編輯 */}
          <Route exact path="/user/ongoing-course/edit/:courseId/vm">
            <CommonPageContent
              className="ongoing-course-bg"
              pageTitle={`編輯 ${_.get(courseDetail, 'data.name', '')}`}
            >

              <div className="user-course-edit-bg">

                <Form
                  model={`forms.courseVM`}
                  className={`course-edit-comp`}
                  onSubmit={submitData => this.onCourseSubmit({ submitData, actionType: 'update', courseType: 'vm' })}
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
                    submitName="儲存編輯"
                    backMethod={this.backMethodCommon}
                    showMode="submit_back"
                    isForm
                  />

                </Form>

              </div>
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

const mapStateToProps = ({ forms, Auth, Role, Course }) => ({
  forms,
  token: Auth.token,
  userInfo: Role.isSubstituating ? Role.userInfo : Auth.userInfo,
  isLoading: Course.courseCon.isLoading,
  courseList: Course.courseCon.data,
  courseDetail: {
    data: Course.courseDetail.data,
    isLoading: Course.courseDetail.isLoading,
  },
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
