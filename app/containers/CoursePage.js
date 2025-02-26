import React, { Component } from 'react';
import { Switch, Route, withRouter, Link } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import { notify } from 'components/common/NotifyToast';
import { actions as formActions, Form } from 'react-redux-form';
import ReactMarkdown from 'react-markdown';
import { ListView, TableList, FormGroups, FormButtons, CommonPageContent } from 'components';
import * as types from '../actions/actionTypes';
import { ongoingCourseData } from '../constants/tableData';
import { courseConForm, courseConFormTwo, courseVMFormOne, courseVMFormTwo, courseVMFormThree, courseVMFormFour, courseVMFormFive } from '../constants/formsData';
import { courseCONTAINERDetailTpl, courseVMDetailTpl } from '../constants/listData'
import bindActionCreatorHOC from 'libraries/bindActionCreatorHOC';
import bindProgressBarHOC from 'libraries/bindProgressBarHOC';
import bindDialogHOC from 'libraries/bindDialogHOC';
import * as dialogTypes from 'constants/dialogTypes';
import { TOAST_TIMING } from '../constants';
import {ENABLE_RFSTACK} from "../config/api";

class CoursePage extends Component {

  componentWillMount() {
    window.scrollTo(0, 0);
    this.fetchData(this.props);

    // set additional validation to select input
    // const validConArr = ['image', 'gpu']
    // validConArr.forEach((item) => {
    //   this.props.setValidity(item, 'courseCon', {
    //     required: false
    //   });
    // })

    // const validVMArr = ['image', 'flavor', 'sshkey']
    // validVMArr.forEach((item) => {
    //   this.props.setValidity(item, 'courseVM', {
    //     required: false
    //   });
    // })
    // this.props.setValidity('ports', 'courseCon', {
    //   keyValRequired: false
    // });

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
      token,
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
    // TODO: courseVM to boolean

    const confObj = {
      CONTAINER: {
        formName: 'courseCon',
        edit: {
          ...course,
          level: { value: _.get(course, 'level') },
          accessType: { value: _.get(course,'accessType') },
          ports: _.get(course,'ports',[{ keyItem: '',  valueItem: '' }]).map(d => ({ keyItem: d.name, valueItem: d.port }))
        },
        detail: {
          ...course,
        }
      },
      VM: {
        formName: 'courseVM',
        edit: {
          ...course,
          level: { value: _.get(course, 'level') },
          associate: _.get(course, 'associate', false),
          extraports: _.get(course, 'extraports', [{ keyItem: '',  valueItem: '' }]).map(d => ({ keyItem: d.name, valueItem: d.port })),
          mount: _.get(course, 'mount', false),
        },
        detail: {
          ...course
        }
      }
    }

    // console.log(`[initialize${actionType}Form]confObj`, confObj);
    if (actionType === 'edit') {
      // console.log('a,b', confObj[courseType].formData, courseType === confObj[courseType].formName);
      this.props.changeForm(confObj[courseType][actionType], confObj[courseType].formName);
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
    // TODO: 如有 launch 過就不要再 launch
    const {
      token,
      history,
      jobAction,
      myUserInfo,
      startProgressBar,
      endPorgressBar,
      openCustomDialog,
      toggleDialog,
      status
    } = this.props;

    if (status.isLaunchJobLoading) {
      notify.show(`尚有課程啟動中，請稍後再試`, 'error', TOAST_TIMING);
      return;
    }

    openCustomDialog({
      type: dialogTypes.CREATE,
      title: '開始課程',
      info: '請問確定要開始課程嗎？',
      submitMethod: () => {
        toggleDialog();
        startProgressBar();
        jobAction.launchCourseJob({
          user: myUserInfo.username,
          classroomId: '',
          courseId: data.id,
          token,
          next: (isSuccess) => {
            endPorgressBar();
            if (isSuccess) {
              history.push('/user/job/list');
              notify.show('已發出啟動課程訊號', 'success', TOAST_TIMING);
            }
          }
        });
      },
      cancelMethod: () => {
        toggleDialog();
      }
    });
  }

  editCourse = (e, datum) => {
    this.props.history.push(`/user/ongoing-course/edit/${datum.id}/${datum.type.toLowerCase()}`)
  }

  deleteCourse = (e, datum) => {
    const {
      token,
      courseAction,
      startProgressBar,
      endPorgressBar,
      openCustomDialog,
      toggleDialog,
      status
    } = this.props;

    if (status.isDeleteContainerCourseLoading || status.isDeleteVMCourseLoading) {
      notify.show(`尚有課程刪除中，請稍後再試`, 'error', TOAST_TIMING);
      return;
    }

    openCustomDialog({
      type: dialogTypes.DELETE,
      title: '刪除課程',
      info: '請問確定要刪除課程嗎？',
      submitMethod: () => {
        toggleDialog();
        startProgressBar();

        if (datum.type === 'CONTAINER') {
          courseAction.deleteContainerCourse({
            courseId: datum.id,
            token,
            next: () => {
              endPorgressBar();
              this.fetchData(this.props);
              notify.show('容器課程刪除成功', 'success', TOAST_TIMING);
            }
          });
        } else if (datum.type === 'VM') {
          courseAction.deleteVMCourse({
            courseId: datum.id,
            token,
            next: () => {
              endPorgressBar();
              this.fetchData(this.props);
              notify.show('VM課程刪除成功', 'success', TOAST_TIMING);
            }
          });
        }
      },
      cancelMethod: () => {
        toggleDialog();
      }
    });
  }

  // 共用 cb
  handleSubmitFailedCommon = (formData) => {
    notify.show('請確認是否填妥表單資料', 'error', TOAST_TIMING);
  }

  /**
   * Back to previous page when clicking cancel button.
   */
  backMethodCommon = (event) => {
    event.preventDefault()
    this.props.history.goBack();
  }

  resetBothForm = (nextProps) => {
    nextProps.resetForm('courseCon');
    nextProps.resetForm('courseVM');
  }

  /**
   * Container Course
   * Called when clicking submit button to create container course.
   * @param {Object} formData - The submit object.
   */
  onCourseSubmit = ({ submitData, actionType, courseType }) => {
    const conditionObj = {
      container: {
        create: {
          courseText: '容器課程',
          actionText: '新建',
          apiAction: 'create',
          method: 'POST',
          types: types.CREATE_CONTAINER_COURSE
        },
        edit: {
          courseText: '容器課程',
          actionText: '更新',
          apiAction: 'update',
          method: 'PUT',
          types: types.UPDATE_CONTAINER_COURSE
        }
      },
      vm: {
        create: {
          courseText: 'VM課程',
          actionText: '新建',
          apiAction: 'create',
          method: 'POST',
          types: types.CREATE_VM_COURSE
        },
        edit: {
          courseText: 'VM課程',
          actionText: '更新',
          apiAction: 'update',
          method: 'PUT',
          types: types.UPDATE_VM_COURSE
        }
      }

    }
    const condition = conditionObj[courseType][actionType];

    const {
      token,
      history,
      courseAction,
      userInfo,
      startProgressBar,
      endPorgressBar,
      openCustomDialog,
      toggleDialog,
      status
    } = this.props;

    // console.log('submitData', submitData);
    if (courseType === 'vm') {
      if (submitData.mount && submitData.volume.value.toString() === "0") {
        notify.show(`請確認掛載 Volume 大小必須大於 0 GB`, 'error', TOAST_TIMING);
        return;
      } else if (submitData.associate && submitData.extraports.filter(datum => (datum.keyItem !== '' && datum.valueItem !== '')).length === 0) {
        notify.show(`請確認 "額外網路埠" 是否有空值`, 'error', TOAST_TIMING);
        return;
      }
    }

    if (status.isCreateContainerCourseLoading || status.isUpdateContainerCourseLoading || status.isCreateVMCourseLoading || status.isUpdateVMCourseLoading) {
      notify.show(`尚有課程動作進行中，請稍後再試`, 'error', TOAST_TIMING);
    }

    openCustomDialog({
      type: dialogTypes.CREATE,
      title: `${condition.actionText}${condition.courseText}`,
      info: `請問確定要${condition.actionText}此課程嗎？`,
      submitMethod: () => {
        toggleDialog();
        startProgressBar();

        if (courseType === 'container') {
          courseAction.submitContainerCourse({
            token,
            userInfo,
            submitData,
            condition,
            next: (isSuccess) => {
              endPorgressBar();
              this.resetBothForm(this.props);

              if (isSuccess) {
                this.fetchData(this.props);
                history.push('/user/ongoing-course/list');
                notify.show(`${condition.actionText}${condition.courseText}成功`, 'success', TOAST_TIMING);
              }
            }
          });
        } else if (courseType === 'vm') {
          courseAction.submitVMCourse({
            token,
            userInfo,
            submitData,
            condition,
            next: (isSuccess) => {
              endPorgressBar();
              this.resetBothForm(this.props);

              if (isSuccess) {
                this.fetchData(this.props);
                history.push('/user/ongoing-course/list');
                notify.show(`${condition.actionText}${condition.courseText}成功`, 'success', TOAST_TIMING);
              }
            }
          });
        }
      },
      cancelMethod: () => {
        toggleDialog();
      }
    });
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
      toggleDialog,
      status
    } = this.props;
    const courseType = _.get(match, 'params.type');
    return (
      <div className="course-bg">
        <Switch>

          {/* 課程搜尋 */}
          <Route exact path="/search/:courseName">
            <TableList
              data={courseList}
              tableData={ongoingCourseData}
              isLoading={isLoading}
              startMethod={this.launchCourseJob}
              editMethod={this.editCourse}
              deleteMethod={this.deleteCourse}
              actionMode="full"
            />
          </Route>

          {/* [common] 開課列表 */}
          <Route path="/user/ongoing-course/list">
            <CommonPageContent
              className="ongoing-course-bg"
              pageTitle="開課列表"
            >

              <Link to="/user/ongoing-course/create/container" className="fl add-btn-con">
                <button className="fl add-btn btn-pair" color="success">新增容器課程</button>
              </Link>

              {
                ENABLE_RFSTACK ?
                  <Link to="/user/ongoing-course/create/vm" className="fl add-btn-con" style={{marginLeft: '10px'}}>
                    <button className="fl add-btn btn-pair" color="success">新增 VM 課程</button>
                  </Link> :
                  null
              }


              <TableList
                data={courseList}
                tableData={ongoingCourseData}
                isLoading={isLoading}
                isDialogOpen={true}
                startMethod={this.launchCourseJob}
                editMethod={this.editCourse}
                deleteMethod={this.deleteCourse}
                toggleDialog={toggleDialog}
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

              <ReactMarkdown
                className="result"
                source={_.get(courseDetail, 'data.introduction', '')}
                skipHtml={true}
                escapeHtml={true}
              />

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
                // submitName="開始課程"
                // nextMethod={(e) => this.launchCourseJob(e, courseDetail.data)}
                backMethod={this.backMethodCommon}
                showMode="back_only"
                // isForm={false}
              />
            </CommonPageContent>
          </Route>

          {/* [vm] 課程細項 */}
          <Route exact path="/user/ongoing-course/detail/:courseId/vm">
            <CommonPageContent
              className="course-detail-bg"
              pageTitle={_.get(courseDetail, 'data.name', '')}
            >
              <ReactMarkdown
                className="result"
                source={_.get(courseDetail, 'data.introduction', '')}
                skipHtml={true}
                escapeHtml={true}
              />

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
                // submitName="開始課程"
                // nextMethod={(e) => this.launchCourseJob(e, courseDetail.data)}
                backMethod={this.backMethodCommon}
                showMode="back_only"
                // isLoading={status.isLaunchJobLoading}
                // isForm={false}
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

                  {/* accessType | ports | writablePath */}
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
                    isLoading={status.isCreateContainerCourseLoading}
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

                  {/* extraports | mount | volume */}
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
                    isLoading={status.isCreateVMCourseLoading}
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
                  onSubmit={submitData => this.onCourseSubmit({ submitData, actionType: 'edit', courseType: 'container' })}
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
                    isLoading={status.isUpdateContainerCourseLoading}
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
                  onSubmit={submitData => this.onCourseSubmit({ submitData, actionType: 'edit', courseType: 'vm' })}
                  onSubmitFailed={submitData => this.handleSubmitFailedCommon(submitData)}
                >
                  {/* name | intro | level | image */}
                  <FormGroups
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

                 {/* associate | extra port */}

                 <FormGroups
                    targetForm={forms.courseVM}
                    formData={courseVMFormFour}
                    changeVal={changeValue}
                  />

                  {/* mount | volume */}
                  <FormGroups
                    targetForm={forms.courseVM}
                    formData={courseVMFormFive}
                    changeVal={changeValue}
                  />

                  {/* 下方按鈕 */}
                  <FormButtons
                    cancelName="上一頁"
                    submitName="儲存編輯"
                    backMethod={this.backMethodCommon}
                    showMode="submit_back"
                    isLoading={status.isUpdateVMCourseLoading}
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
  setValidity: (key, formName, validity) => dispatch(formActions.setValidity(
    `forms.${formName}.${key}`, {
      required: false
    }
  )),
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

const mapStateToProps = ({ forms, Auth, Role, Course, Job }) => ({
  forms,
  token: Auth.token,
  myUserInfo: Auth.userInfo,
  userInfo: Role.isSubstituating ? Role.userInfo : Auth.userInfo,
  isLoading: Course.courseCon.isLoading,
  courseList: Course.courseCon.data,
  courseDetail: {
    data: Course.courseDetail.data,
    isLoading: Course.courseDetail.isLoading,
  },
  searchResult: Course.searchResult.data,
  status: {
    isCreateContainerCourseLoading: Course.status.isCreateContainerCourseLoading,
    isUpdateContainerCourseLoading: Course.status.isUpdateContainerCourseLoading,
    isDeleteContainerCourseLoading: Course.status.isDeleteContainerCourseLoading,
    isCreateVMCourseLoading: Course.status.isCreateVMCourseLoading,
    isUpdateVMCourseLoading: Course.status.isUpdateVMCourseLoading,
    isDeleteVMCourseLoading: Course.status.isDeleteVMCourseLoading,
    isLaunchJobLoading: Job.status.isLaunchJobLoading
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
)(CoursePage);
