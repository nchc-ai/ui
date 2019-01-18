import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { FaCopy } from "react-icons/fa";
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';
import { notify } from 'react-notify-toast';
import bindActionCreatorHoc from '../libraries/bindActionCreatorHoc';
import DataFrame from '../components/common/DataFrame/index';
import { groupArray, formatStatus } from '../libraries/utils';
import CommonPageContent from '../components/CommonPageContent';

class JobPage extends Component {
  componentWillMount() {
    this.fetchData(this.props);
  }

  fetchData = (nextProps) => {

    const {
      token,
      userInfo,
      jobAction
    } = nextProps;

    jobAction.getConJobList({ user: userInfo.username, token })
    jobAction.getVMJobList({ user: userInfo.username, token })
    // TODO: 要 merge 成一起的 list

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
    } = this.props;

    const fakeJobs = [
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
            "label": "jupyter",
            "value": "http://140.110.5.22:30010"
          }
        ],
        "startAt": "2018-06-25T09:24:38Z",
        "status": "Ready"
      }
    ];
    const data = fakeJobs;
    // const data = Job.list;

    return (
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
                            <Col key={j} md={4} >
                              <div className="job-card__mask">
                                <button><FaCopy  /></button>
                                <p>複製網址</p>
                              </div>
                              <div className="job-card">
                                <button className="btn-cancel" onClick={e => this.deleteJob(e, thumb)}>X</button>
                                <p className="job-card-status">
                                  <span className={`light light-${thumb.status}`} />
                                  <span className="status-word">
                                    {formatStatus(thumb.status)}
                                  </span>
                                </p>
                                <p className="job-card-id">{thumb.id}</p>

                                <div className="job-card-link-li">
                                  {
                                    thumb.service ?
                                    thumb.service.map(
                                      (service, k) => (
                                        <span key={k} className="job-card-link">
                                          <a
                                            href={service.value}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            {service.label}
                                          </a>
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
