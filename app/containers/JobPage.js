import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';;
import { actions as formActions, Form } from 'react-redux-form';
import { Row, Col } from 'reactstrap';
import Clipboard from 'react-clipboard.js';
import { State, Toggle } from 'react-powerplug'
import styled from 'styled-components';
import { FaCopy, FaCamera, FaRegClone, FaCube } from "react-icons/fa";
import { JOB_INTERVAL } from '../config/api';
import { TOAST_TIMING } from '../constants';
import bindProgressBarHOC from 'libraries/bindProgressBarHOC';
import bindActionCreatorHOC from 'libraries/bindActionCreatorHOC';
import { groupArray, formatStatus } from 'libraries/utils';
import bindDialogHOC from 'libraries/bindDialogHOC';
import CommonPageContent from 'components/CommonPageContent';
import FormGroups from 'components/common/FormGroups/index';
import FormButtons from 'components/common/FormButtons/index';
import DataFrame from 'components/common/DataFrame/index';
import { notify } from 'components/common/NotifyToast';
import { snapshotForm } from 'constants/formsData';
import * as dialogTypes from 'constants/dialogTypes';
import {ENABLE_RFSTACK} from "../config/api";

const SectionTitle = styled.h2`
  height: 50px;
  font-size: 20px;
  line-height: 50px;
  background-color: #f8f4f4;
`;

const IconContainer = styled.span`
  display: inline-block;
  margin-left: 15px;
  margin-right: 10px;
  color: ${props => props.type === 'container' ? '#6ec7cf' : '#f5d600'};
  font-weight: bolder;
  transform: translateY(3px);
`;


class JobPage extends Component {

  state = {
    optionType: 'snapshot',
    copiedValue: "",
    interval: ''
  }

  componentWillMount() {
    this.fetchData(this.props);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    const interval = setInterval(this.updateJobList, JOB_INTERVAL);
    this.setState({ interval });
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  updateJobList = () => {
    const { jobAction, token, userInfo } = this.props;
    jobAction.getConJobList({ user: userInfo.username, token, isRefetch: true });
    if (ENABLE_RFSTACK === true) {
        jobAction.getVMJobList({ user: userInfo.username, token, isRefetch: true });
    }
  }

  fetchData = (nextProps) => {
    const {
      token,
      userInfo,
      jobAction
    } = nextProps;

    jobAction.getConJobList({ user: userInfo.username, token });
    if (ENABLE_RFSTACK === true) {
      jobAction.getVMJobList({ user: userInfo.username, token });
    }
  }

  openCardMask = (e, dataObj, optionType, toggle) => {
    const {
      userInfo
    } = this.props;

    this.setState({ optionType });

    if (optionType === 'copy' && dataObj.value !== '') {
      toggle();
      this.setState({ copiedValue: dataObj.value });
    } else if (optionType === 'copy') {
      notify.show(`Oops... 此 Share Path 為空值`, 'error', TOAST_TIMING);
    } else if (optionType === 'snapshot' && userInfo.role === 'teacher') {
      toggle();
    } else {
      notify.show(`請確認您是否具快照權限`, 'error', TOAST_TIMING);
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

  leaveMask = () => {
    this.props.resetForm('snapshot');
  }

  submitSnapshot = (submitData, thumb) => {
    const {
      token,
      jobAction,
      uiAction
    } = this.props;

    this.props.startProgressBar();
    if (thumb.type === 'CONTAINER') {
      jobAction.snapshotContainerJob({
        token,
        id: thumb.id,
        name: submitData.name,
        next: this.onAfterSnapshot
      })
    } else if (thumb.type === 'VM') {
      jobAction.snapshotVMJob({
        token,
        id: thumb.id,
        name: submitData.name,
        next: this.onAfterSnapshot
      })
    }
  }

  onAfterSnapshot = ({ response }) => {
    this.props.endPorgressBar();

    if (!response.error) {
      notify.show(_.get(response, "payload.message", "成功快照此 VM 工作"), 'success', TOAST_TIMING);
    }
  }

  handlesubmitSnapshotFail = (submitData) => {
    notify.show(_.get(response, "payload.message", "快照此 VM 工作失敗"), 'success', TOAST_TIMING);
  }

  deleteJob(e, thumb) {
    const {
      token,
      jobAction,
      startProgressBar,
      endPorgressBar,
      openCustomDialog,
      toggleDialog,
      status
    } = this.props;

    if (status.isDeleteJobLoading) {
      notify.show(`尚有工作刪除中，請稍後再試`, 'error', TOAST_TIMING);
      return;
    }

    openCustomDialog({
      type: dialogTypes.DELETE,
      title: '刪除工作',
      info: '請問確定要刪除此工作嗎？',
      submitMethod: () => {
        toggleDialog();
        startProgressBar();
        jobAction.deleteJob({
          jobId: thumb.id,
          token,
          next: (isSuccess) => {

            endPorgressBar();

            if (isSuccess) {
              notify.show('工作刪除成功', 'success', TOAST_TIMING);
            } else {
              notify.show('工作刪除失敗', 'error', TOAST_TIMING);
            }

            this.fetchData(this.props);
          }
        });
      },
      cancelMethod: () => {
        toggleDialog();
      }
    });
  }

  render() {
    const {
      forms,
      changeValue,
      Job,
      userInfo,
      doubleList,
      container,
      vm
    } = this.props;
    return (
      <div className="job-bg">
        <CommonPageContent
          className="job-page-bg"
          pageTitle="工作清單"
        >

        {
          doubleList.map( (singleList, index) => (
            <div key={index}>
              { 
              singleList.type !== 'vm' || ENABLE_RFSTACK === true ?
               <div>
              <SectionTitle>
                <IconContainer type={singleList.type}>
                  {  singleList.type === 'container' ? <FaRegClone/> :  <FaCube/> }
                </IconContainer>
                {singleList.title}
              </SectionTitle>
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
                                          {/* copy */}
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
                                          {/* snapshot */}
                                          {
                                            this.state.optionType === 'snapshot'?
                                              <Form
                                                model={`forms.snapshot`}
                                                className="snapshot-form"
                                                onSubmit={submitData => this.submitSnapshot(submitData, thumb)}
                                                onSubmitFailed={submitData => this.handlesubmitSnapshotFail(submitData)}
                                              >

                                                <h4>建立 {thumb.type}  快照</h4>

                                                <FormGroups
                                                  targetForm={forms.snapshot}
                                                  formData={snapshotForm}
                                                  changeVal={changeValue}
                                                />

                                                {/* 下方按鈕 */}
                                                <FormButtons
                                                  size={4}
                                                  submitName='送出'
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
                                                      service.label === 'NFS' ?
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
                </div> : null
              }
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

const mapStateToProps = ({ forms, Auth, User, Role, Job }) => ({
  forms,
  token: Auth.token,
  userInfo: Role.isSubstituating ? Role.userInfo : Auth.userInfo,
  container: {
    loading: Job.container.loading,
    data: Job.container.data
  },
  vm: {
    loading: Job.vm.loading,
    data: Job.vm.data
  },
  doubleList: Job.doubleList,
  status: {
    isDeleteJobLoading: Job.status.isDeleteJobLoading
  }
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  bindActionCreatorHOC,
  bindProgressBarHOC,
  bindDialogHOC
)(JobPage);
