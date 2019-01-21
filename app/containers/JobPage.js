import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { FaCopy, FaCamera } from "react-icons/fa";
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';
import { notify } from 'react-notify-toast';
import Clipboard from 'react-clipboard.js';
import { TOAST_TIMING } from '../constants';
import bindActionCreatorHoc from '../libraries/bindActionCreatorHoc';
import DataFrame from '../components/common/DataFrame/index';
import { groupArray, formatStatus } from '../libraries/utils';
import CommonPageContent from '../components/CommonPageContent';

class JobPage extends Component {

  state = {
    isOptionsOpen: false,
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
    // TODO: 要 merge 成一起的 list

  }

  openCardMask = (e, service) => {

    const {
      userInfo
    } = this.props;

    console.log('service', service);
    // 在這邊要判斷是老師 && type 為 vm 才可以開
    if (service) {
      this.setState({ isOptionsOpen: true, copiedValue: service.value });
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

  snapshotJob = (e, job) => {

    const {
      jobAction,
      token,
    } = this.props;

    jobAction.snapshotJob({
      token,
      job
    })
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
      Job,
      userInfo
    } = this.props;

    const mockJobs = [
      {
        "course_id": "b86b2893-b876-45c2-a3f6-5e099c15d638",
        "dataset": [
          "cifar-10",
          "mnist"
        ],
        "gpu": 1,
        "id": "49a31009-7d1b-4ff2-badd-e8c717e2256c",
        "image": "nvidia/caffe:latest",
        "introduction": "markdown text with escape",
        "level": "basic",
        "name": "mage process",
        "service": [
          {
            "label": "SSH",
            "value": "http://140.110.5.22:30010"
          }, {
            "label": "VNC",
            "value": "http://140.110.5.22:30010"
          }, {
            "label": "Share path",
            "value": "http://140.110.5.22:30010"
          }
        ],
        "startAt": "2018-06-25T09:24:38Z",
        "status": "Ready"
      }
    ];
    const data = mockJobs;
    // const data = Job.list;

    return (
      <div className="job-bg">
        <CommonPageContent
          className="job-page-bg"
          pageTitle="工作清單"
        >
          <DataFrame
            isLoading={Job.loading}
            data={groupArray(data, 'name')}
            cols={8}
          >
            {
              groupArray(data, 'name').map(
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
                                {/* options cover */}
                                <div
                                  className={`job-card__mask ${ this.state.isOptionsOpen ? 'job-card__mask--open' : '' }`}
                                  onMouseLeave={() => this.leaveCardOptions()}
                                >
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
                                </div>
                                {/* card */}
                                <div className="job-card">

                                  {/* delete button */}
                                  <button className="btn-cancel" onClick={e => this.deleteJob(e, thumb)}>X</button>

                                  {/* snapshot button */}
                                  <button className="btn-camera" onClick={e => this.snapshotJob(e, thumb)}>
                                    <FaCamera/>
                                  </button>
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
                                          <span key={k} className="job-card-link" onClick={this.openCardMask}>
                                            {
                                              service.label === 'Share path' ?
                                                <span onClick={e => this.openCardMask(e, service)} >{service.label}</span>
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
        </CommonPageContent>
      </div>
    )
  }
}

const mapStateToProps = ({ Auth, User, Job }) => ({
  token: Auth.token,
  userInfo: Auth.userInfo,
  Job: {
    loading: Job.List.loading,
    list: Job.List.data
  },
});

const mapDispatchToProps = dispatch => ({

});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  bindActionCreatorHoc,
)(JobPage);
