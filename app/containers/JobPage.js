import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { FaCopy, FaCamera } from "react-icons/fa";
import { compose } from 'redux';
import { connect } from 'react-redux';;
import { actions as formActions, Form } from 'react-redux-form';
import { Row, Col } from 'reactstrap';
import { notify } from 'react-notify-toast';
import Clipboard from 'react-clipboard.js';
import { State, Toggle } from 'react-powerplug'
// import { doubleRawList } from '../mock/jobData';
import { TOAST_TIMING } from '../constants';
import bindActionCreatorHoc from '../libraries/bindActionCreatorHoc';
import FormGroups from '../components/common/FormGroups/index';
import FormButtons from '../components/common/FormButtons/index';
import DataFrame from '../components/common/DataFrame/index';
import { groupArray, formatStatus } from '../libraries/utils';
import CommonPageContent from '../components/CommonPageContent';
import { snapshotForm } from '../constants/formsData';

class JobPage extends Component {

  state = {
    optionType: 'snapshot',
    copiedValue: ""
  }

  componentWillMount() {
    this.fetchData(this.props);
  }

  fetchData = (nextProps) => {

    const {
      token,
      userInfo,
      jobAction
    } = nextProps;

    jobAction.getConJobList({ user: userInfo.username, token });
    jobAction.getVMJobList({ user: userInfo.username, token });

  }

  openCardMask = (e, dataObj, optionType, toggle) => {
    const {
      userInfo
    } = this.props;

    this.setState({ optionType });

    if (optionType === 'copy') {
      if (dataObj.value !== '') {
        toggle();
        this.setState({ copiedValue: dataObj.value });
      } else {
        notify.show(`Oops... 此 Share Path 為空值`, 'error', TOAST_TIMING);
      }
    } else if (optionType === 'snapshot') {
      toggle();
    }
  }

  leaveCardOptions = () => {
    this.setState({ isOptionsOpen: false });
  }
  getCopiedText = () => {
    return this.state.copiedValue;
  }

  onCopySuccess = () => {
    notify.show(`已成功複製 ${this.state.copiedValue}`, 'success', TOAST_TIMING);
  }

  addJob() {
    console.log('add');
    // const {
    //   token,
    //   userInfo,
    //   userAction
    // } = this.props;

    // Progress.show();

    // // console.log('userInfo.username, courseId, token', userInfo.username, courseId, token);
    // userAction.launchJob(userInfo.username, courseId, token, this.onAddJobSuccess);
  }

  onAddJobSuccess = () => {
    // this.fetchData();
    // Progress.hide();
    // notify.show('工作新增成功', 'success', 1800);
    // this.props.history.push('/user/job');
  }

  leaveMask = (e, job) => {
    this.props.resetForm('snapshot');
    // const {
    //   jobAction,
    //   token,
    // } = this.props;

    // jobAction.snapshotJob({
    //   token,
    //   job
    // })
  }

  deleteJob(e, thumb) {

    const {
      token,
      jobAction
    } = this.props;
    // Progress.show();

    jobAction.deleteJob({
      jobId: thumb.id,
      token,
      next: this.onDeleteJobSuccess
    });
  }

  onDeleteJobSuccess = () => {
    // this.fetchData();
    // Progress.hide();
    notify.show('工作刪除成功', 'success', 1800);
    this.fetchData(this.props);
  }

  render() {
    const {
      forms,
      changeValue,
      Job,
      userInfo,
      container,
      vm
    } = this.props;

    const doubleList = [
      {
        title: '容器課程',
        loading: container.loading,
        data: container.data
      }, {
        title: 'VM課程',
        loading: vm.loading,
        data: vm.data
      }
    ];

    return (
      <div className="job-bg">
        <CommonPageContent
          className="job-page-bg"
          pageTitle="工作清單"
        >

        {
          doubleList.map( (singleList, index) => (
            <div key={index}>
              <h2>{singleList.title}</h2>
              <DataFrame
                isLoading={singleList.loading}
                data={groupArray(singleList.data, 'name')}
                cols={8}
              >
                {
                  groupArray(singleList.data, 'name').map(
                    (obj, i) => (
                      <div key={i} className="job-group">
                        <Row className="title-row">
                          <Col>
                            <h4 className="fl">{obj.group}</h4>
                            {/* <button className="fl btn-add" onClick={e => this.addJob(e, obj.data[0].courseId)}>+ 新增</button> */}
                          </Col>
                        </Row>
                        <div>
                          <DataFrame
                            data={obj.data}
                            cols={8}
                          >
                            <Row>
                              {
                                obj.data.map((thumb, j) => (
                                  <Col key={j} md={4}>

                                  <Toggle initial={true}>
                                    {({ on, toggle }) => (
                                      <div>
                                        {/* mask */}
                                        <div
                                          className={`job-card__mask ${ on ? '' : 'job-card__mask--open' }`}
                                          onMouseLeave={(event) => { this.leaveMask(); toggle();}}
                                        >
                                          {
                                            this.state.optionType === 'copy'?
                                            <ul className="job-card__mask-options">
                                              <li>
                                                <Clipboard
                                                  option-text={this.getCopiedText}
                                                  onSuccess={this.onCopySuccess}
                                                >
                                                  <FaCopy/>
                                                </Clipboard>
                                                <p>複製網址</p>
                                              </li>
                                            </ul>
                                            :
                                            null
                                          }
                                          {
                                            this.state.optionType === 'snapshot'?
                                              <Form
                                                model={`forms.snapshot`}
                                                className="snapshot-form"
                                                onSubmit={submitData => this.submitSnapshot(submitData)}
                                                onSubmitFailed={submitData => this.handlesubmitSnapshotFail(submitData)}
                                              >
                                                <h4>VM snapshot</h4>

                                                <FormGroups
                                                  targetForm={forms.snapshot}
                                                  formData={snapshotForm}
                                                  changeVal={changeValue}
                                                />

                                                {/* 下方按鈕 */}
                                                <FormButtons
                                                  size={4}
                                                  submitName="送出"
                                                  showMode="submit_only"
                                                  isForm
                                                />
                                              </Form>
                                            :
                                              null
                                          }
                                        </div>

                                        {/* card */}
                                        <div className="job-card">

                                          {/* delete button */}
                                          <button className="btn-cancel" onClick={e => this.deleteJob(e, thumb)}>X</button>

                                          {/* snapshot button */}
                                          {
                                            _.get(thumb,'canSnapshot') ?
                                              <button className="btn-camera" onClick={(event) => { this.openCardMask(event, thumb, 'snapshot', () => toggle())}}>
                                                <FaCamera/>
                                              </button>
                                            : null
                                          }

                                          {/* card - status */}
                                          <p className="job-card-status">
                                            <span className={`light light-${thumb.status}`} />
                                            <span className="status-word">
                                              {formatStatus(thumb.status)}
                                            </span>
                                          </p>

                                          <p className={`job-card-id ${ userInfo.role !== 'teacher' ? "job-card-id--disable" : null}`} >{thumb.id}</p>

                                          <div className="job-card-link-li">
                                            {
                                              thumb.service ?
                                              thumb.service.map(
                                                (service, k) => (
                                                  <span key={k} className="job-card-link">
                                                    {
                                                      service.label.toLowerCase() === 'share path' ?
                                                        <span onClick={(event) => { this.openCardMask(event, service, 'copy', () => toggle() )}}>
                                                          {service.label}
                                                        </span>
                                                      :
                                                        <a
                                                          href={service.value}
                                                          target="_blank"
                                                          rel="noopener noreferrer"
                                                        >
                                                          {service.label}
                                                        </a>
                                                    }
                                                    <span className="divide-line">|</span>
                                                  </span>
                                                )
                                              ) : null
                                            }
                                          </div>
                                          <div className="corner-triangle" />
                                        </div>
                                      </div>
                                    )}
                                  </Toggle>
                                  </Col>
                                ))
                              }
                            </Row>
                          </DataFrame>
                        </div>
                      </div>
                    )
                  )
                }
              </DataFrame>
            </div>
          ))
        }
          </CommonPageContent>
      </div>
    )
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

const mapStateToProps = ({ forms, Auth, User, Job }) => ({
  forms,
  token: Auth.token,
  userInfo: Auth.userInfo,
  container: {
    loading: Job.container.loading,
    data: Job.container.data
  },
  vm: {
    loading: Job.vm.loading,
    data: Job.vm.data
  },
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  bindActionCreatorHoc,
)(JobPage);
